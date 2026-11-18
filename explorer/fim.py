"""Shared helpers for Frontier In Motion: polite cached HTTP, field rules,
paper features, author track record and beta-binomial statistics.

Standard library only. Every response is cached on disk under explorer/cache/
(never committed), so re-running a build re-uses what it already fetched.
"""
import hashlib
import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "cache")
DATA = os.path.join(HERE, "data")

# A descriptive User-Agent with no personal email (see docs/EXPLORER-BRIEF.md).
UA = "FrontierInMotion/1.0 (weekly preprint snapshot for an educational explorer; https://in-motion.puter.site)"

# About one request per second; arXiv asks for one every three seconds.
GAP = {"export.arxiv.org": 3.1, "oaipmh.arxiv.org": 3.1}
DEFAULT_GAP = 1.05
_last = {}
STATS = {"requests": 0, "cache_hits": 0, "errors": 0}


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def _cache_path(url):
    host = urllib.parse.urlparse(url).netloc
    h = hashlib.sha1(url.encode()).hexdigest()
    return os.path.join(CACHE, host, h[:2], h)


def get(url, kind="json", ttl=None, retries=5):
    """GET url politely; return parsed JSON (kind='json') or text. Cached.

    ttl: seconds a cached copy stays fresh (None = forever). Returns None on
    a permanent failure (404 etc.)."""
    path = _cache_path(url)
    if os.path.exists(path) and (ttl is None or time.time() - os.path.getmtime(path) < ttl):
        STATS["cache_hits"] += 1
        with open(path, encoding="utf-8") as f:
            body = f.read()
        if body == "\0missing":
            return None
        return json.loads(body) if kind == "json" else body
    host = urllib.parse.urlparse(url).netloc
    gap = GAP.get(host, DEFAULT_GAP)
    for attempt in range(retries):
        wait = _last.get(host, 0) + gap - time.time()
        if wait > 0:
            time.sleep(wait)
        _last[host] = time.time()
        STATS["requests"] += 1
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                body = r.read().decode("utf-8", "replace")
            break
        except urllib.error.HTTPError as e:
            if e.code in (400, 404, 410):
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w", encoding="utf-8") as f:
                    f.write("\0missing")
                return None
            ra = e.headers.get("Retry-After") if e.headers else None
            delay = min(float(ra), 120) if ra and ra.isdigit() else 5 * 2 ** attempt
            if e.code == 429 and ra and ra.isdigit() and float(ra) > 600:
                log(f"  rate budget exhausted for {host} (Retry-After {ra}s)")
                STATS["errors"] += 1
                raise RuntimeError(f"rate budget exhausted for {host}")
            log(f"  HTTP {e.code} on {host}; retry in {delay:.0f}s")
            time.sleep(delay)
        except Exception as e:  # timeouts, resets
            delay = 5 * 2 ** attempt
            log(f"  {type(e).__name__} on {host}; retry in {delay:.0f}s")
            time.sleep(delay)
    else:
        STATS["errors"] += 1
        return None
    if kind == "json":
        try:
            parsed = json.loads(body)
        except ValueError:
            # arXiv sometimes answers "Rate exceeded." as plain text.
            STATS["errors"] += 1
            return None
    if kind == "text" and body.strip() == "Rate exceeded.":
        time.sleep(30)
        return get(url, kind, ttl, retries - 1) if retries > 1 else None
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(body)
    return parsed if kind == "json" else body


# ---------------------------------------------------------------- fields
FIELDS = [
    ("physics", "Physics"),
    ("chemistry", "Chemistry"),
    ("biology", "Biology"),
    ("mathematics", "Mathematics"),
    ("cs", "Computer science"),
    ("medicine", "Medicine"),
    ("earthspace", "Earth and space"),
]
FIELD_IDS = [f for f, _ in FIELDS]

CHEM_ARXIV = {"physics.chem-ph", "cond-mat.mtrl-sci", "cond-mat.soft"}
EARTH_ARXIV_PREFIX = ("astro-ph",)
EARTH_ARXIV = {"physics.ao-ph", "physics.geo-ph", "physics.space-ph"}
BIO_CHEM = {"biochemistry", "synthetic biology"}  # stay in biology; listed for clarity


def arxiv_field(cat):
    """Map an arXiv primary category to one of the seven regions (or None)."""
    if cat in CHEM_ARXIV:
        return "chemistry"
    if cat.startswith(EARTH_ARXIV_PREFIX) or cat in EARTH_ARXIV:
        return "earthspace"
    if cat == "physics.med-ph":
        return "medicine"
    if cat == "physics.bio-ph" or cat.startswith("q-bio"):
        return "biology"
    if cat.startswith(("cs.", "eess.")):
        return "cs"
    if cat.startswith(("math.", "stat.")) or cat == "math-ph":
        return "mathematics"
    if cat.startswith(("physics.", "cond-mat", "hep-", "nucl-", "quant-ph", "gr-qc", "nlin.")):
        return "physics"
    return None  # econ, q-fin: outside the seven regions (said on the page)


def biorxiv_field(server, category):
    if server == "medrxiv":
        return "medicine"
    c = (category or "").lower()
    if c in ("epidemiology", "clinical trials"):
        return "medicine"
    if c in ("ecology",):
        return "biology"
    return "biology"


# ---------------------------------------------------------------- features
CODE_RE = re.compile(r"(github\.com|gitlab\.com|zenodo\.org|zenodo|osf\.io|figshare)", re.I)
PREREG_RE = re.compile(r"(pre-?regist\w*|registered report)", re.I)
TRIAL_RE = re.compile(r"\b(NCT\d{8}|ISRCTN\d{6,}|PROSPERO|CRD4\d{9,})\b")
BOLD = ["first observation", "first ever", "for the first time", "proof of", "we prove that",
        "room-temperature", "room temperature superconduct", "breakthrough", "conclusively",
        "paradigm shift", "revolutionary", "unprecedented", "definitive proof", "resolves the",
        "solves the", "first room"]
BOLD_RE = re.compile("|".join(re.escape(b) for b in BOLD), re.I)
NUM = r"(\d{1,3}(?:,\d{3})+|\d+)"
SAMPLE_RE = re.compile(
    r"(?:\bn\s*=\s*" + NUM + r")|(?:" + NUM +
    r"\s+(?:participants|patients|subjects|individuals|adults|children|women|men|people|respondents|cases|volunteers|infants|mice|samples|donors))",
    re.I)


def features(title, abstract, comment="", field=None):
    text = " ".join([title or "", abstract or "", comment or ""])
    f = {}
    m = CODE_RE.findall(text)
    f["code_data"] = sorted({x.lower().replace(".com", "").replace(".org", "").replace(".io", "") for x in m})
    pr = PREREG_RE.search(text)
    tr = TRIAL_RE.search(text)
    f["prereg"] = (pr.group(0) if pr else None) or (("trial registration " + tr.group(0)) if tr else None)
    bold = sorted({b.group(0).lower() for b in BOLD_RE.finditer(" ".join([title or "", abstract or ""]))})
    # "we prove that" is ordinary in mathematics; do not flag it there.
    if field == "mathematics":
        bold = [b for b in bold if b not in ("we prove that", "proof of")]
    f["bold"] = bold
    f["sample_n"] = None
    if field in ("medicine", "biology"):
        ns = []
        for g in SAMPLE_RE.finditer(abstract or ""):
            v = g.group(1) or g.group(2)
            try:
                n = int(v.replace(",", ""))
            except (TypeError, ValueError):
                continue
            if 3 <= n <= 50_000_000 and not (1900 <= n <= 2030):
                ns.append(n)
        f["sample_n"] = max(ns) if ns else None
    return f


# ---------------------------------------------------------------- problems
def load_problems():
    with open(os.path.join(HERE, "problems.json"), encoding="utf-8") as f:
        return json.load(f)


def match_problems(problems, title, abstract, cats, field):
    text = (title + " " + abstract).lower()
    out = []
    for p in problems["problems"]:
        if p.get("fields") and field not in p["fields"]:
            continue
        if p.get("categories") and not (set(cats) & set(p["categories"])):
            # categories narrow a match; keywords marked "strong" match anywhere
            if not any(k in text for k in p.get("strong", [])):
                continue
        if any(k in text for k in p["keywords"]) or any(k in text for k in p.get("strong", [])):
            if any(x in text for x in p.get("exclude", [])):
                continue
            out.append(p["id"])
    return out


# ---------------------------------------------------------------- OpenAlex
OA = "https://api.openalex.org"
WORK_SELECT = "id,doi,title,type,publication_date,authorships,locations,primary_location,is_retracted,cited_by_count,counts_by_year,ids"
AUTHOR_WORK_SELECT = "id,title,type,publication_date,locations,is_retracted,cited_by_count,counts_by_year"
PUBLISHED_SOURCE_TYPES = {"journal", "conference", "book series", "ebook platform"}


def oa_works_by_doi(dois):
    """Batch DOI lookup (50 per request). Returns {lower doi: work}."""
    out = {}
    dois = [d.lower() for d in dois if d]
    for i in range(0, len(dois), 50):
        chunk = dois[i:i + 50]
        url = f"{OA}/works?filter=doi:{'|'.join(urllib.parse.quote(d, safe='/.') for d in chunk)}&per_page=50&select={WORK_SELECT}"
        r = get(url)
        for w in (r or {}).get("results", []):
            if w.get("doi"):
                out[w["doi"].lower().replace("https://doi.org/", "")] = w
    return out


def oa_title_search(title):
    t = re.sub(r"[^\w\s-]", " ", title)[:200]
    url = f"{OA}/works?search={urllib.parse.quote(t)}&per_page=3&select={WORK_SELECT}"
    r = get(url)
    best = None
    for w in (r or {}).get("results", []):
        if norm_title(w.get("title") or "") == norm_title(title):
            best = w
            break
    return best


def norm_title(t):
    return re.sub(r"[^a-z0-9]+", "", (t or "").lower())[:120]


def is_repository_loc(l):
    s = l.get("source") or {}
    return s.get("type") == "repository"


def is_published_loc(l):
    s = l.get("source") or {}
    return s.get("type") in PUBLISHED_SOURCE_TYPES


def author_works(author_id, cutoff):
    """An author's works published on or before cutoff (newest 200)."""
    aid = author_id.rsplit("/", 1)[-1]
    url = (f"{OA}/works?filter=author.id:{aid},to_publication_date:{cutoff}"
           f"&sort=publication_date:desc&per_page=200&select={AUTHOR_WORK_SELECT}")
    r = get(url)
    return (r or {}).get("results", [])


CITE_N = 10  # "cited at least N times"


def eligible_record(works, as_of_year=None):
    """From an author's works (already limited to older than 2 years), return
    the eligible preprints as dicts {id, published, retracted, cited}.

    A preprint is a work with a repository location (arXiv, bioRxiv, ...).
    It counts as published if it has a journal/proceedings location, or if
    the same title appears among the author's works as a published record
    (OpenAlex does not always merge the two versions).
    as_of_year: count citations only up to that year (backtest)."""
    published_titles = set()
    for w in works:
        if any(is_published_loc(l) for l in w.get("locations") or []):
            published_titles.add(norm_title(w.get("title")))
    out = []
    for w in works:
        locs = w.get("locations") or []
        if not (w.get("type") == "preprint" or any(is_repository_loc(l) for l in locs)):
            continue
        pub = any(is_published_loc(l) for l in locs) or norm_title(w.get("title")) in published_titles
        cites = w.get("cited_by_count") or 0
        if as_of_year:
            later = sum(c["cited_by_count"] for c in w.get("counts_by_year") or [] if c["year"] > as_of_year)
            cites = max(0, cites - later)
        out.append({"id": w["id"], "published": pub, "retracted": bool(w.get("is_retracted")), "cited": cites >= CITE_N})
    return out


# ---------------------------------------------------------------- statistics
def _betacf(a, b, x):
    MAXIT, EPS, FPMIN = 300, 3e-12, 1e-300
    qab, qap, qam = a + b, a + 1, a - 1
    c, d = 1.0, 1 - qab * x / qap
    d = 1 / (d if abs(d) > FPMIN else FPMIN)
    h = d
    for m in range(1, MAXIT + 1):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1 + aa * d
        d = 1 / (d if abs(d) > FPMIN else FPMIN)
        c = 1 + aa / c
        c = c if abs(c) > FPMIN else FPMIN
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1 + aa * d
        d = 1 / (d if abs(d) > FPMIN else FPMIN)
        c = 1 + aa / c
        c = c if abs(c) > FPMIN else FPMIN
        de = d * c
        h *= de
        if abs(de - 1) < EPS:
            break
    return h


def betainc(a, b, x):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    lbt = math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b) + a * math.log(x) + b * math.log(1 - x)
    if x < (a + 1) / (a + b + 2):
        return math.exp(lbt) * _betacf(a, b, x) / a
    return 1 - math.exp(lbt) * _betacf(b, a, 1 - x) / b


def beta_ppf(q, a, b):
    lo, hi = 0.0, 1.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if betainc(a, b, mid) < q:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def prior_from_rates(pairs, lo=4.0, hi=40.0):
    """Method-of-moments beta prior from (k, n) pairs (authors' records).
    Returns (mean, strength m). Strength is clamped to [lo, hi]."""
    pairs = [(k, n) for k, n in pairs if n >= 3]
    K = sum(k for k, _ in pairs)
    N = sum(n for _, n in pairs)
    if N == 0:
        return 0.5, lo
    p = K / N
    if len(pairs) < 5 or p <= 0 or p >= 1:
        return min(max(p, 0.02), 0.98), 10.0
    rates = [k / n for k, n in pairs]
    mean_n = sum(n for _, n in pairs) / len(pairs)
    var = sum((r - p) ** 2 for r in rates) / (len(rates) - 1)
    binom = p * (1 - p) / mean_n
    excess = var - binom
    if excess <= 1e-6:
        m = hi
    else:
        m = p * (1 - p) / excess - 1
    return min(max(p, 0.02), 0.98), min(max(m, lo), hi)


def shrink(k, n, prior):
    p, m = prior
    a, b = m * p + k, m * (1 - p) + (n - k)
    return {"est": round(a / (a + b), 3), "lo": round(beta_ppf(0.10, a, b), 3),
            "hi": round(beta_ppf(0.90, a, b), 3), "k": k, "n": n}


# Documented, simple weighted rank (shown on the page).
WEIGHTS = {"published": 0.45, "cited": 0.35, "not_retracted": 0.10, "openness": 0.10}


def signal_rank(tr, feats):
    if not tr:
        return None
    openness = 1.0 if (feats.get("code_data") or feats.get("prereg")) else 0.0
    s = (WEIGHTS["published"] * tr["published"]["est"] + WEIGHTS["cited"] * tr["cited"]["est"]
         + WEIGHTS["not_retracted"] * tr["not_retracted"]["est"] + WEIGHTS["openness"] * openness)
    return round(s, 3)


def team_record(author_ids, works_by_author, as_of_year=None):
    """Pool the eligible preprints of a paper's first and last authors."""
    seen = {}
    for a in author_ids:
        for r in eligible_record(works_by_author.get(a, []), as_of_year):
            seen[r["id"]] = r
    recs = list(seen.values())
    n = len(recs)
    return {"n": n, "published": sum(r["published"] for r in recs),
            "not_retracted": sum(not r["retracted"] for r in recs),
            "cited": sum(r["cited"] for r in recs)}


def record_signals(rec, priors):
    """Turn a pooled (k, n) record into three shrunk components."""
    if rec["n"] < 3:
        return None
    return {c: shrink(rec[c], rec["n"], priors[c]) for c in ("published", "cited", "not_retracted")}
