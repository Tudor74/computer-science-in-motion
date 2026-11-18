#!/usr/bin/env python3
"""Build the weekly Frontier In Motion snapshot.

    python3 explorer/build_snapshot.py            # the 7 days before today
    python3 explorer/build_snapshot.py --end 2026-11-17 --cap 1500

Writes explorer/data/snapshot-YYYY-MM-DD.json (YYYY-MM-DD = the snapshot date).
Steps (see docs/EXPLORER-BRIEF.md):
 1. new preprints of the past 7 days from arXiv (all categories) and
    bioRxiv/medRxiv; sampled evenly per field if over the cap;
 2. authors resolved in OpenAlex (DOI, else exact-title search);
 3. first- and last-author track record from preprints older than 2 years,
    shrunk towards the field average (beta-binomial, 80% interval);
 4. honest metadata/abstract features (code/data links, preregistration,
    stated sample size, bold-claim phrases).
It also re-checks last snapshot's papers so the page can show status changes.
Responses are cached under explorer/cache/ (not committed).
"""
import argparse
import datetime as dt
import glob
import hashlib
import json
import os
import re
import urllib.parse
import xml.etree.ElementTree as ET

import fim
from fim import log

ATOM = "{http://www.w3.org/2005/Atom}"
ARX = "{http://arxiv.org/schemas/atom}"


def h(s):
    return int(hashlib.sha1(s.encode()).hexdigest()[:12], 16)


# ------------------------------------------------------------ 1. preprints
OAI = "{http://www.openarchives.org/OAI/2.0/}"
ARXIV_OAI = "{http://arxiv.org/OAI/arXiv/}"


def fetch_arxiv(start, end):
    """New arXiv submissions via OAI-PMH (arXiv's bulk interface).

    OAI returns every record modified in the window; new papers are those whose
    identifier is from this month or last (YYMM) and whose created date is in
    the window."""
    months = {f"{start:%y%m}", f"{end:%y%m}"}
    url = (f"https://oaipmh.arxiv.org/oai?verb=ListRecords&metadataPrefix=arXiv"
           f"&from={start:%Y-%m-%d}&until={end:%Y-%m-%d}")
    out, seen_records = [], 0
    while url:
        body = fim.get(url, kind="text")
        if not body:
            log("  arXiv OAI page failed")
            break
        root = ET.fromstring(body)
        lr = root.find(OAI + "ListRecords")
        if lr is None:
            break
        for rec in lr.findall(OAI + "record"):
            seen_records += 1
            m = rec.find(OAI + "metadata/" + ARXIV_OAI + "arXiv")
            if m is None:
                continue
            aid = m.findtext(ARXIV_OAI + "id") or ""
            created = m.findtext(ARXIV_OAI + "created") or ""
            if aid[:4] not in months or not (start.isoformat() <= created <= end.isoformat()):
                continue
            cats = (m.findtext(ARXIV_OAI + "categories") or "").split()
            authors = []
            for au in m.findall(ARXIV_OAI + "authors/" + ARXIV_OAI + "author"):
                nm = " ".join(x for x in [au.findtext(ARXIV_OAI + "forenames"), au.findtext(ARXIV_OAI + "keyname")] if x)
                authors.append(nm)
            updated = m.findtext(ARXIV_OAI + "updated") or ""
            out.append({
                "source": "arXiv", "id": aid, "version": 2 if updated and updated != created else 1,
                "title": " ".join((m.findtext(ARXIV_OAI + "title") or "").split()),
                "abstract": " ".join((m.findtext(ARXIV_OAI + "abstract") or "").split()),
                "posted": created, "updated": updated or created,
                "authors": authors, "category": cats[0] if cats else "", "categories": cats,
                "comment": m.findtext(ARXIV_OAI + "comments") or "",
                "journal_ref": m.findtext(ARXIV_OAI + "journal-ref") or "",
                "published_doi": (m.findtext(ARXIV_OAI + "doi") or "").lower(),
                "doi": f"10.48550/arxiv.{aid}".lower(),
                "url": f"https://arxiv.org/abs/{aid}",
            })
        tok = lr.find(OAI + "resumptionToken")
        url = None
        if tok is not None and (tok.text or "").strip():
            url = "https://oaipmh.arxiv.org/oai?verb=ListRecords&resumptionToken=" + urllib.parse.quote(tok.text.strip())
            log(f"  OAI: {seen_records} records read, {len(out)} new so far (of {tok.get('completeListSize')})")
    return out, len(out)


def fetch_biorxiv(server, start, end):
    out, cursor, total = {}, 0, None
    while True:
        url = f"https://api.biorxiv.org/details/{server}/{start:%Y-%m-%d}/{end:%Y-%m-%d}/{cursor}"
        r = fim.get(url)
        if not r or not r.get("collection"):
            break
        msg = r["messages"][0]
        total = int(msg.get("total") or 0)
        for c in r["collection"]:
            d = c["doi"].lower()
            prev = out.get(d)
            v = int(c.get("version") or 1)
            if prev and prev["version"] >= v:
                continue
            out[d] = {
                "source": "bioRxiv" if server == "biorxiv" else "medRxiv", "id": d, "version": v,
                "title": " ".join((c.get("title") or "").split()),
                "abstract": " ".join((c.get("abstract") or "").split()),
                "posted": c.get("date"), "updated": c.get("date"),
                "authors": [a.strip() for a in (c.get("authors") or "").split(";") if a.strip()],
                "category": (c.get("category") or "").strip().lower(),
                "categories": [(c.get("category") or "").strip().lower()],
                "comment": "", "journal_ref": "",
                "published_doi": "" if (c.get("published") or "NA") == "NA" else c["published"].lower(),
                "doi": d, "url": f"https://www.{server}.org/content/{c['doi']}v{v}",
                "type": c.get("type"),
            }
        cursor += int(msg.get("count") or 0)
        if cursor >= total or int(msg.get("count") or 0) == 0:
            break
    # New papers only: first version posted inside the window.
    return [p for p in out.values() if p["version"] == 1], total or 0, len(out)


def sample_evenly(papers, cap):
    by = {f: [] for f in fim.FIELD_IDS}
    for p in papers:
        by[p["field"]].append(p)
    for f in by:
        by[f].sort(key=lambda p: h(p["id"]))  # deterministic, unbiased order
    quota = {f: 0 for f in by}
    left = cap
    open_f = [f for f in by if by[f]]
    while left > 0 and open_f:
        share = max(1, left // len(open_f))
        nxt = []
        for f in open_f:
            take = min(share, len(by[f]) - quota[f], left)
            quota[f] += take
            left -= take
            if quota[f] < len(by[f]):
                nxt.append(f)
            if left <= 0:
                break
        open_f = nxt
    return [p for f in by for p in by[f][:quota[f]]], quota


# ------------------------------------------------------------ status
def status_of(p, w):
    """Status now, from arXiv/bioRxiv metadata and the OpenAlex record."""
    if w and w.get("is_retracted"):
        return "retracted"
    if re.search(r"\bwithdrawn\b", p.get("comment", ""), re.I) or (p.get("type") or "").upper() == "WITHDRAWN":
        return "withdrawn"
    if p.get("published_doi") or p.get("journal_ref"):
        return "published"
    if w and any(fim.is_published_loc(l) for l in w.get("locations") or []):
        return "published"
    if p.get("version", 1) > 1:
        return "revised"
    return "posted"


def resolve(papers, title_cap):
    dois = [p["doi"] for p in papers]
    found = fim.oa_works_by_doi(dois)
    searches = 0
    for p in papers:
        w = found.get(p["doi"])
        if not w and searches < title_cap:
            searches += 1
            w = fim.oa_title_search(p["title"])
            if w:
                p["resolved_by"] = "title"
        elif w:
            p["resolved_by"] = "doi"
        p["_w"] = w
    return searches


def lead_authors(w):
    """OpenAlex ids of the first and last authors."""
    if not w:
        return []
    au = [a for a in w.get("authorships") or [] if (a.get("author") or {}).get("id")]
    if not au:
        return []
    ids = [au[0]["author"]["id"]]
    if len(au) > 1 and au[-1]["author"]["id"] not in ids:
        ids.append(au[-1]["author"]["id"])
    return ids


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--end", help="last day of the 7-day window (default: yesterday)")
    ap.add_argument("--cap", type=int, default=1500)
    ap.add_argument("--title-searches", type=int, default=400)
    a = ap.parse_args()
    today = dt.date.today()
    end = dt.date.fromisoformat(a.end) if a.end else today - dt.timedelta(days=1)
    start = end - dt.timedelta(days=6)
    snap_date = end + dt.timedelta(days=1)
    cutoff = dt.date(start.year - 2, start.month, min(start.day, 28))
    log(f"Window {start}..{end}; track-record cutoff {cutoff}")

    log("1. arXiv")
    arx, arx_total = fetch_arxiv(start, end)
    log("1. bioRxiv / medRxiv")
    bio, bio_total, bio_dois = fetch_biorxiv("biorxiv", start, end)
    med, med_total, med_dois = fetch_biorxiv("medrxiv", start, end)

    excluded = 0
    allp = []
    for p in arx:
        f = fim.arxiv_field(p["category"])
        if not f:
            excluded += 1
            continue
        p["field"] = f
        allp.append(p)
    for p in bio + med:
        p["field"] = fim.biorxiv_field("medrxiv" if p["source"] == "medRxiv" else "biorxiv", p["category"])
        allp.append(p)
    week_counts = {f: 0 for f in fim.FIELD_IDS}
    for p in allp:
        week_counts[p["field"]] += 1
    log("   week counts", week_counts, "excluded (econ/q-fin):", excluded)

    problems = fim.load_problems()
    week_problem_counts = {pr["id"]: 0 for pr in problems["problems"]}
    for p in allp:
        for pid in fim.match_problems(problems, p["title"], p["abstract"], p["categories"], p["field"]):
            week_problem_counts[pid] += 1

    sample, quota = sample_evenly(allp, a.cap)
    # Papers that match a landmark are always kept, so every lane is complete.
    keep = {p["id"] for p in sample}
    extra = [p for p in allp if p["id"] not in keep
             and fim.match_problems(problems, p["title"], p["abstract"], p["categories"], p["field"])]
    sample += extra
    log(f"   sampled {len(sample)} ({len(extra)} landmark papers added beyond the even sample)")

    log("2. OpenAlex: resolve papers")
    searches = resolve(sample, a.title_searches)
    resolved = sum(1 for p in sample if p["_w"])
    log(f"   resolved {resolved}/{len(sample)} ({searches} title searches)")

    log("2-3. OpenAlex: lead authors' past works (older than 2 years)")
    works_by_author = {}
    authors = sorted({x for p in sample for x in lead_authors(p["_w"])})
    log(f"   {len(authors)} distinct first/last authors")
    for i, aid in enumerate(authors):
        works_by_author[aid] = fim.author_works(aid, cutoff.isoformat())
        if i % 200 == 0:
            log(f"   {i}/{len(authors)}  requests={fim.STATS['requests']} cache={fim.STATS['cache_hits']}")

    # Field priors from individual authors' records (method of moments).
    pairs = {f: {"published": [], "cited": [], "not_retracted": []} for f in fim.FIELD_IDS}
    author_field = {}
    for p in sample:
        for aid in lead_authors(p["_w"]):
            author_field.setdefault(aid, p["field"])
    for aid, f in author_field.items():
        recs = fim.eligible_record(works_by_author.get(aid, []))
        n = len(recs)
        if n < 3:
            continue
        pairs[f]["published"].append((sum(r["published"] for r in recs), n))
        pairs[f]["cited"].append((sum(r["cited"] for r in recs), n))
        pairs[f]["not_retracted"].append((sum(not r["retracted"] for r in recs), n))
    priors = {f: {c: fim.prior_from_rates(v) for c, v in comp.items()} for f, comp in pairs.items()}

    log("4. features and signals")
    out = []
    for p in sample:
        w = p.pop("_w")
        leads = lead_authors(w)
        rec = fim.team_record(leads, works_by_author)
        sig = fim.record_signals(rec, priors[p["field"]]) if leads else None
        feats = fim.features(p["title"], p["abstract"], p.get("comment"), p["field"])
        st = status_of(p, w)
        pub_venue = None
        if w:
            for l in w.get("locations") or []:
                if fim.is_published_loc(l):
                    pub_venue = (l.get("source") or {}).get("display_name")
                    break
        timeline = [{"date": p["posted"], "event": "posted (v1)"}]
        if p["version"] > 1 and p["updated"] != p["posted"]:
            timeline.append({"date": p["updated"], "event": f"revised (v{p['version']})"})
        if st == "published":
            timeline.append({"date": None, "event": "published: " + (p.get("journal_ref") or pub_venue or p.get("published_doi") or "journal record")})
        out.append({
            "id": p["id"], "source": p["source"], "url": p["url"], "doi": p["doi"],
            "openalex": w["id"] if w else None, "resolved_by": p.get("resolved_by"),
            "title": p["title"], "abstract": p["abstract"][:700] + ("…" if len(p["abstract"]) > 700 else ""),
            "authors": p["authors"][:3] + ([f"+{len(p['authors']) - 3} more"] if len(p["authors"]) > 3 else []),
            "n_authors": len(p["authors"]),
            "posted": p["posted"], "version": p["version"], "field": p["field"], "category": p["category"],
            "problems": fim.match_problems(problems, p["title"], p["abstract"], p["categories"], p["field"]),
            "status": st, "published_doi": p.get("published_doi") or None, "journal_ref": p.get("journal_ref") or None,
            "timeline": timeline, "features": feats,
            "team": {"leads_resolved": len(leads), "eligible": rec["n"]},
            "signals": sig, "newcomer": bool(leads) and rec["n"] < 3,
            "rank": fim.signal_rank(sig, feats),
        })

    # Status changes since last snapshot: re-check its papers now.
    prev_files = sorted(f for f in glob.glob(os.path.join(fim.DATA, "snapshot-*.json"))
                        if os.path.basename(f) < f"snapshot-{snap_date}.json")
    changes, prev_name = [], None
    if prev_files:
        prev_name = os.path.basename(prev_files[-1])
        log("   comparing with", prev_name)
        with open(prev_files[-1], encoding="utf-8") as f:
            prev = json.load(f)
        old = {p["doi"]: p for p in prev["papers"]}
        now = {p["doi"]: p for p in out}
        recheck = [d for d in old if d not in now]
        fresh = {}
        for i in range(0, len(recheck), 50):
            chunk = recheck[i:i + 50]
            url = f"{fim.OA}/works?filter=doi:{'|'.join(chunk)}&per_page=50&select={fim.WORK_SELECT}"
            for w in (fim.get(url, ttl=0) or {}).get("results", []):
                fresh[(w.get("doi") or "").lower().replace("https://doi.org/", "")] = w
        for d, op in old.items():
            if d in now:
                newst = now[d]["status"]
            elif d in fresh:
                newst = status_of({"version": op["version"], "comment": "", "published_doi": op.get("published_doi"),
                                   "journal_ref": op.get("journal_ref")}, fresh[d])
            else:
                continue
            if newst != op["status"]:
                changes.append({"doi": d, "from": op["status"], "to": newst})
                if d in now:
                    now[d]["status_changed"] = {"from": op["status"], "to": newst}
                else:
                    op = dict(op, status=newst, status_changed={"from": op["status"], "to": newst}, carried=True)
                    out.append(op)

    snap = {
        "snapshot_date": snap_date.isoformat(), "window": [start.isoformat(), end.isoformat()],
        "built_at": dt.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "previous_snapshot": prev_name, "status_changes": len(changes),
        "fields": [{"id": f, "name": n, "week_count": week_counts[f], "sampled": quota.get(f, 0)} for f, n in fim.FIELDS],
        "week_totals": {"arxiv_reported": arx_total, "arxiv_new": len(arx), "arxiv_outside_regions": excluded,
                        "biorxiv_new": len(bio), "medrxiv_new": len(med),
                        "biorxiv_records": bio_total, "medrxiv_records": med_total},
        "cap": a.cap, "sampled": len(out), "landmark_extra": len(extra),
        "problems": [dict(pr, week_count=week_problem_counts[pr["id"]]) for pr in problems["problems"]],
        "priors": {f: {c: {"mean": round(v[0], 3), "strength": round(v[1], 1)} for c, v in comp.items()} for f, comp in priors.items()},
        "weights": fim.WEIGHTS, "cite_n": fim.CITE_N, "cutoff": cutoff.isoformat(),
        "coverage": {"resolved": resolved, "title_searches": searches, "lead_authors": len(authors),
                     "with_signals": sum(1 for p in out if p["signals"]),
                     "newcomers": sum(1 for p in out if p["newcomer"]),
                     "unresolved": sum(1 for p in out if not p["openalex"])},
        "papers": out,
    }
    os.makedirs(fim.DATA, exist_ok=True)
    path = os.path.join(fim.DATA, f"snapshot-{snap_date}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(snap, f, ensure_ascii=False, separators=(",", ":"))
    log(f"Wrote {path}: {len(out)} papers; http {fim.STATS}")


if __name__ == "__main__":
    main()
