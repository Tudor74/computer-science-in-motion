#!/usr/bin/env python3
"""Backtest the evidence signals on preprints from 2018-2021.

    python3 explorer/backtest.py [--per-field 70]

For a stratified sample of arXiv / bioRxiv / medRxiv preprints posted in
2018-2021 it computes the signals using only what was knowable when each was
posted (lead authors' preprints older than 2 years at that date; their
citations counted up to the year before posting), then compares with what
had happened by the end of 2025: published in a journal or proceedings,
retracted, still cited (cited in 2024 or 2025), cited at least 10 times.

Known leak, stated on the page: whether an author's *earlier* preprints were
published is read from today's records, not from the record as it stood then.

Writes explorer/data/backtest.json, including the four case studies.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
import random
import re
import urllib.parse
import xml.etree.ElementTree as ET

import fim
from fim import log

ATOM = "{http://www.w3.org/2005/Atom}"
ARX = "{http://arxiv.org/schemas/atom}"

YEARS = [2018, 2019, 2020, 2021]
OUTCOME_YEAR = 2025


def rnd_day(rng, year):
    d = dt.date(year, 1, 1) + dt.timedelta(days=rng.randrange(365))
    while d.weekday() >= 5:
        d += dt.timedelta(days=1)
    return d


def arxiv_pool(n_ids, rng):
    """Random arXiv identifiers spread evenly over 2018-2021 (YYMM.NNNNN),
    looked up 100 at a time with id_list. arXiv numbers papers sequentially
    within a month, so a random number below 10000 is a random paper of that
    month (every month in 2018-21 had more than 10,000 submissions)."""
    months = [f"{y % 100:02d}{m:02d}" for y in YEARS for m in range(1, 13)]
    ids = sorted({f"{months[i % len(months)]}.{rng.randrange(1, 10000):05d}" for i in range(n_ids)})
    rng.shuffle(ids)
    out = []
    for i in range(0, len(ids), 100):
        url = "https://export.arxiv.org/api/query?id_list=" + ",".join(ids[i:i + 100]) + "&max_results=100"
        body = fim.get(url, kind="text")
        if not body:
            continue
        for e in ET.fromstring(body).findall(ATOM + "entry"):
            m = re.search(r"abs/(.+?)(v\d+)?$", e.findtext(ATOM + "id") or "")
            prim = e.find(ARX + "primary_category")
            if not m or prim is None:
                continue
            f = fim.arxiv_field(prim.get("term"))
            if not f:
                continue
            aid = m.group(1)
            out.append({
                "source": "arXiv", "id": aid, "field": f, "category": prim.get("term"),
                "title": " ".join((e.findtext(ATOM + "title") or "").split()),
                "abstract": " ".join((e.findtext(ATOM + "summary") or "").split()),
                "comment": e.findtext(ARX + "comment") or "",
                "posted": (e.findtext(ATOM + "published") or "")[:10],
                "doi": f"10.48550/arxiv.{aid}".lower(),
                "later_doi": (e.findtext(ARX + "doi") or "").lower(),
                "journal_ref": e.findtext(ARX + "journal_ref") or "",
            })
    return out


def arxiv_sample(pool, field, n, rng):
    ps = [p for p in pool if p["field"] == field]
    rng.shuffle(ps)
    return ps[:n]


def biorxiv_sample(server, field, n_target, years, rng):
    out = []
    per_day = max(2, n_target // (len(years) * 3))
    for y in years:
        for _ in range(3):
            d = rnd_day(rng, y)
            url = f"https://api.biorxiv.org/details/{server}/{d:%Y-%m-%d}/{d:%Y-%m-%d}/0"
            r = fim.get(url)
            coll = [c for c in (r or {}).get("collection", []) if str(c.get("version")) == "1"]
            rng.shuffle(coll)
            for c in coll[:per_day]:
                out.append({
                    "source": "bioRxiv" if server == "biorxiv" else "medRxiv", "id": c["doi"].lower(), "field": field,
                    "category": (c.get("category") or "").lower(),
                    "title": " ".join((c.get("title") or "").split()),
                    "abstract": " ".join((c.get("abstract") or "").split()), "comment": "",
                    "posted": c["date"], "doi": c["doi"].lower(), "journal_ref": "",
                    "later_doi": "" if (c.get("published") or "NA") == "NA" else c["published"].lower(),
                })
    return out


def cites_through(w, year):
    if not w:
        return 0
    later = sum(c["cited_by_count"] for c in w.get("counts_by_year") or [] if c["year"] > year)
    return max(0, (w.get("cited_by_count") or 0) - later)


def cites_in(w, years):
    return sum(c["cited_by_count"] for c in (w or {}).get("counts_by_year") or [] if c["year"] in years)


def crossref_retracted(doi):
    """Crossref: is there a retraction notice that updates this DOI?"""
    r = fim.get(f"https://api.crossref.org/works?filter=updates:{urllib.parse.quote(doi, safe='/.()')}&rows=5")
    for it in (r or {}).get("message", {}).get("items", []):
        for u in it.get("update-to") or []:
            if u.get("DOI", "").lower() == doi.lower() and "retract" in (u.get("type") or "").lower():
                return True
    return False


def auc(pairs):
    """Probability a random positive scores above a random negative."""
    pos = [s for s, y in pairs if y]
    neg = [s for s, y in pairs if not y]
    if not pos or not neg:
        return None
    wins = 0.0
    for p in pos:
        for q in neg:
            wins += 1 if p > q else 0.5 if p == q else 0
    return round(wins / (len(pos) * len(neg)), 3)


# ------------------------------------------------------------ case studies
CASES = [
    {"id": "opera", "name": "OPERA's faster-than-light neutrinos", "year": 2011, "kind": "preprint",
     "doi": "10.48550/arxiv.1109.4897", "arxiv": "1109.4897",
     "summary": "In September 2011 the OPERA collaboration posted a measurement of neutrinos from CERN arriving at Gran Sasso about 60 ns earlier than light would. The collaboration itself asked for scrutiny. The anomaly was traced to equipment faults, including a badly connected fibre-optic cable in the timing chain; the revised analysis, published in JHEP in 2012, found neutrino speeds consistent with the speed of light, as did ICARUS.",
     "related": [{"label": "Revised OPERA result, JHEP 2012", "doi": "10.1007/jhep10(2012)093"},
                 {"label": "ICARUS measurement, Physics Letters B 2012", "doi": "10.1016/j.physletb.2012.07.014"}],
     "lesson": "A large, established collaboration with an excellent track record: the signals here would have been high. The claim was bold and wrong; the method (open scrutiny, independent replication) caught it, not the track record."},
    {"id": "bicep2", "name": "BICEP2", "year": 2014, "kind": "preprint",
     "doi": "10.48550/arxiv.1403.3985", "arxiv": "1403.3985",
     "summary": "In March 2014 BICEP2 reported B-mode polarisation in the cosmic microwave background and interpreted it as evidence of primordial gravitational waves from inflation. It was published in Physical Review Letters in June 2014 with added caveats about dust. A joint BICEP2/Keck/Planck analysis in 2015 found the signal was consistent with polarised Galactic dust; the paper was not retracted.",
     "related": [{"label": "BICEP2, Physical Review Letters 2014", "doi": "10.1103/physrevlett.112.241101"},
                 {"label": "Joint BICEP2/Keck/Planck analysis, PRL 2015", "doi": "10.1103/physrevlett.114.101301"}],
     "lesson": "Published, highly cited and never retracted, yet the headline interpretation did not hold. 'Published' and 'cited' are outcomes this explorer can measure; 'true' is not."},
    {"id": "arsenic", "name": "Arsenic-based life", "year": 2010, "kind": "journal paper",
     "doi": "10.1126/science.1197258",
     "summary": "This was a journal paper, not a preprint: Science published it online in December 2010 (print 2011), claiming a bacterium (GFAJ-1) could substitute arsenic for phosphorus in its DNA. Critics responded quickly, much of it on blogs and in comments. In 2012 Science published two studies (Erb et al.; Reaves et al.) finding GFAJ-1 does not incorporate arsenate into its DNA. Science did not retract the paper.",
     "related": [{"label": "Erb et al., Science 2012", "doi": "10.1126/science.1218455"},
                 {"label": "Reaves et al., Science 2012", "doi": "10.1126/science.1219861"}],
     "lesson": "Peer review and a top journal did not stop a bold claim. Our 'published' outcome would count this as a success, which is exactly why the page says signals are not truth."},
    {"id": "lk99", "name": "LK-99", "year": 2023, "kind": "preprint",
     "doi": "10.48550/arxiv.2307.12008", "arxiv": "2307.12008",
     "summary": "In July 2023 two arXiv preprints claimed LK-99, a copper-doped lead apatite, was a room-temperature, ambient-pressure superconductor. Replication attempts worldwide within weeks found no superconductivity; the sharp resistivity drop and partial levitation were explained by copper sulfide (Cu2S) impurities and ferromagnetism.",
     "related": [{"label": "Second LK-99 preprint (arXiv:2307.12037)", "doi": "10.48550/arxiv.2307.12037"},
                 {"label": "Cu2S explanation (arXiv:2308.05222)", "doi": "10.48550/arxiv.2308.05222"},
                 {"label": "Nature news: 'LK-99 isn't a superconductor', 2023", "doi": "10.1038/d41586-023-02585-7"}],
     "lesson": "Small team, bold title ('first room-temperature'), no shared data: the bold-claims flag fires, and the claim failed fast in public. One case does not validate the flag."},
]


def verify_doi(doi):
    if doi.startswith("10.48550/"):
        w = fim.get(f"{fim.OA}/works/doi:{doi}?select={fim.WORK_SELECT}")
        if w:
            return {"ok": True, "title": w.get("title"), "date": w.get("publication_date"),
                    "cited_by": w.get("cited_by_count"), "retracted": w.get("is_retracted"), "openalex": w.get("id")}
        return {"ok": False}
    r = fim.get(f"https://api.crossref.org/works/{urllib.parse.quote(doi, safe='/.()')}")
    m = (r or {}).get("message")
    if not m:
        return {"ok": False}
    date = (m.get("published") or m.get("issued") or {}).get("date-parts", [[None]])[0]
    return {"ok": True, "title": (m.get("title") or [""])[0], "date": "-".join(str(x) for x in date if x),
            "container": (m.get("container-title") or [""])[0], "cited_by": m.get("is-referenced-by-count"),
            "retracted": crossref_retracted(doi)}


def case_signals(case):
    """Point-in-time signals for a case study's lead authors."""
    w = fim.get(f"{fim.OA}/works/doi:{case['doi']}?select={fim.WORK_SELECT}")
    if not w:
        return None
    au = [a["author"]["id"] for a in w.get("authorships") or [] if (a.get("author") or {}).get("id")]
    leads = [au[0]] + ([au[-1]] if len(au) > 1 else []) if au else []
    posted = dt.date.fromisoformat(w["publication_date"])
    cutoff = dt.date(posted.year - 2, posted.month, min(posted.day, 28)).isoformat()
    wba = {a: fim.author_works(a, cutoff) for a in leads}
    rec = fim.team_record(leads, wba, as_of_year=posted.year - 1)
    feats = fim.features(w.get("title"), "", "", "physics")
    return {"n_authors": len(au), "eligible": rec["n"], "record": rec, "title_bold": feats["bold"]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--per-field", type=int, default=70)
    ap.add_argument("--seed", type=int, default=2026)
    ap.add_argument("--arxiv-ids", type=int, default=3000)
    a = ap.parse_args()
    rng = random.Random(a.seed)

    log("Sampling 2018-2021 preprints")
    papers = []
    pool = arxiv_pool(a.arxiv_ids, rng)
    log(f"  arXiv pool: {len(pool)} papers")
    for f in ["physics", "chemistry", "mathematics", "cs", "earthspace"]:
        papers += arxiv_sample(pool, f, a.per_field, rng)
    papers += biorxiv_sample("biorxiv", "biology", a.per_field - 14, YEARS, rng)
    papers += arxiv_sample(pool, "biology", 14, rng)
    papers += arxiv_sample(pool, "medicine", 6, rng)
    papers += biorxiv_sample("medrxiv", "medicine", a.per_field, [2019, 2020, 2021], rng)
    seen, uniq = set(), []
    for p in papers:
        if p["id"] not in seen and p["posted"][:4] in {str(y) for y in YEARS}:
            seen.add(p["id"])
            uniq.append(p)
    papers = uniq
    log(f"  {len(papers)} papers")

    log("OpenAlex: resolve")
    found = fim.oa_works_by_doi([p["doi"] for p in papers])
    for p in papers:
        p["_w"] = found.get(p["doi"]) or fim.oa_title_search(p["title"])
    later = fim.oa_works_by_doi([p["later_doi"] for p in papers if p["later_doi"]])

    log("OpenAlex: lead authors' records at posting time")
    for i, p in enumerate(papers):
        w = p["_w"]
        au = [x["author"]["id"] for x in (w or {}).get("authorships") or [] if (x.get("author") or {}).get("id")]
        p["_leads"] = ([au[0]] + ([au[-1]] if len(au) > 1 and au[-1] != au[0] else [])) if au else []
        posted = dt.date.fromisoformat(p["posted"])
        cutoff = dt.date(posted.year - 2, posted.month, min(posted.day, 28)).isoformat()
        wba = {x: fim.author_works(x, cutoff) for x in p["_leads"]}
        p["_wba"] = wba
        p["_rec"] = fim.team_record(p["_leads"], wba, as_of_year=posted.year - 1)
        if i % 50 == 0:
            log(f"  {i}/{len(papers)} http={fim.STATS}")

    # Field priors from these authors' records at the time.
    pairs = {f: {"published": [], "cited": [], "not_retracted": []} for f in fim.FIELD_IDS}
    for p in papers:
        posted_y = int(p["posted"][:4])
        for x, ws in p["_wba"].items():
            recs = fim.eligible_record(ws, as_of_year=posted_y - 1)
            if len(recs) >= 3:
                pairs[p["field"]]["published"].append((sum(r["published"] for r in recs), len(recs)))
                pairs[p["field"]]["cited"].append((sum(r["cited"] for r in recs), len(recs)))
                pairs[p["field"]]["not_retracted"].append((sum(not r["retracted"] for r in recs), len(recs)))
    priors = {f: {c: fim.prior_from_rates(v) for c, v in comp.items()} for f, comp in pairs.items()}

    log("Outcomes by 2025")
    rows = []
    for p in papers:
        w = p["_w"]
        lw = later.get(p["later_doi"]) if p["later_doi"] else None
        published = bool(p["later_doi"] or p["journal_ref"]) or bool(w and any(fim.is_published_loc(l) for l in w.get("locations") or []))
        if not published and w is not None:
            # An unmerged journal record with the same title also counts.
            q = urllib.parse.quote(re.sub(r"[^\w\s-]", " ", p["title"])[:200])
            alt = fim.get(f"{fim.OA}/works?search={q}&filter=to_publication_date:{OUTCOME_YEAR}-12-31"
                          f"&per_page=5&select={fim.WORK_SELECT}")
            for x in (alt or {}).get("results", []):
                if fim.norm_title(x.get("title")) == fim.norm_title(p["title"]) and any(fim.is_published_loc(l) for l in x.get("locations") or []):
                    published, lw = True, lw or x
                    break
        retracted = bool((w or {}).get("is_retracted") or (lw or {}).get("is_retracted"))
        pub_doi = p["later_doi"] or ((lw or {}).get("doi") or "").replace("https://doi.org/", "")
        if pub_doi and not retracted and not pub_doi.startswith("10.48550"):
            retracted = crossref_retracted(pub_doi)
        both = [x for x in (w, lw) if x]
        recent = sum(cites_in(x, {2024, 2025}) for x in both)
        total = sum(cites_through(x, OUTCOME_YEAR) for x in both)
        feats = fim.features(p["title"], p["abstract"], p["comment"], p["field"])
        sig = fim.record_signals(p["_rec"], priors[p["field"]]) if p["_leads"] else None
        rows.append({
            "id": p["id"], "source": p["source"], "field": p["field"], "posted": p["posted"],
            "resolved": w is not None, "eligible": p["_rec"]["n"], "newcomer": bool(p["_leads"]) and p["_rec"]["n"] < 3,
            "pred_published": sig["published"]["est"] if sig else None,
            "pred_cited": sig["cited"]["est"] if sig else None,
            "rank": fim.signal_rank(sig, feats), "bold": bool(feats["bold"]),
            "open": bool(feats["code_data"] or feats["prereg"]),
            "published": published, "retracted": retracted, "still_cited": recent >= 1, "cited10": total >= 10,
        })

    scored = [r for r in rows if r["rank"] is not None]

    def bins(key, target, edges):
        out = []
        for lo, hi in zip(edges, edges[1:]):
            b = [r for r in scored if lo <= r[key] < hi or (hi == edges[-1] and r[key] == hi)]
            if not b:
                out.append({"lo": lo, "hi": hi, "n": 0})
                continue
            obs = sum(r[target] for r in b) / len(b)
            out.append({"lo": lo, "hi": hi, "n": len(b), "mean_pred": round(sum(r[key] for r in b) / len(b), 3),
                        "observed": round(obs, 3)})
        return out

    def rates(group):
        n = len(group)
        if not n:
            return {"n": 0}
        return {"n": n, **{k: round(sum(r[k] for r in group) / n, 3) for k in ("published", "retracted", "still_cited", "cited10")}}

    edges = [0, .2, .4, .6, .8, 1.0001]
    rank_edges = [0, .3, .4, .5, .6, .7, .8, 1.0001]
    field_base = {f: rates([r for r in scored if r["field"] == f]) for f in fim.FIELD_IDS}
    brier_sig = brier_base = None
    if scored:
        brier_sig = round(sum((r["pred_published"] - r["published"]) ** 2 for r in scored) / len(scored), 4)
        brier_base = round(sum((field_base[r["field"]]["published"] - r["published"]) ** 2 for r in scored) / len(scored), 4)
    band = []
    for lo, hi in zip(rank_edges, rank_edges[1:]):
        b = [r for r in scored if lo <= r["rank"] < hi]
        band.append({"lo": lo, "hi": min(hi, 1), **rates(b)})

    res = {
        "built_at": dt.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "years": YEARS, "outcome_year": OUTCOME_YEAR, "seed": a.seed,
        "n_papers": len(rows), "n_resolved": sum(r["resolved"] for r in rows), "n_scored": len(scored),
        "n_newcomers": sum(r["newcomer"] for r in rows),
        "by_field": {f: {"n": sum(r["field"] == f for r in rows), "scored": sum(r["field"] == f for r in scored)} for f in fim.FIELD_IDS},
        "calibration_published": bins("pred_published", "published", edges),
        "calibration_cited": bins("pred_cited", "cited10", edges),
        "rank_band": band,
        "overall": rates(scored), "newcomers": rates([r for r in rows if r["newcomer"]]),
        "unscored": rates([r for r in rows if r["rank"] is None]),
        "bold": rates([r for r in scored if r["bold"]]), "not_bold": rates([r for r in scored if not r["bold"]]),
        "open": rates([r for r in scored if r["open"]]), "not_open": rates([r for r in scored if not r["open"]]),
        "field_base": field_base,
        "auc_published": auc([(r["pred_published"], r["published"]) for r in scored]),
        "auc_rank_published": auc([(r["rank"], r["published"]) for r in scored]),
        "auc_rank_still_cited": auc([(r["rank"], r["still_cited"]) for r in scored]),
        "auc_cited10": auc([(r["pred_cited"], r["cited10"]) for r in scored]),
        "brier_signal": brier_sig, "brier_field_base": brier_base,
        "priors": {f: {c: {"mean": round(v[0], 3), "strength": round(v[1], 1)} for c, v in comp.items()} for f, comp in priors.items()},
        "rows": rows,
    }

    log("Case studies")
    cases = []
    for c in CASES:
        cc = dict(c)
        cc["record"] = verify_doi(c["doi"])
        cc["related"] = [dict(r, record=verify_doi(r["doi"])) for r in c["related"]]
        cc["signals_then"] = case_signals(c) if c["kind"] == "preprint" else None
        cases.append(cc)
    res["cases"] = cases

    os.makedirs(fim.DATA, exist_ok=True)
    with open(os.path.join(fim.DATA, "backtest.json"), "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, separators=(",", ":"))
    log(f"Wrote backtest.json: {len(rows)} papers, {len(scored)} scored; AUC(published)={res['auc_published']} "
        f"Brier {brier_sig} vs base {brier_base}; http {fim.STATS}")


if __name__ == "__main__":
    main()
