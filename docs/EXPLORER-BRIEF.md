# Frontier In Motion: the preprint explorer — brief

Build a single-file, offline-capable HTML page that surfaces new preprints across the sciences and shows **evidence signals** for how likely each claim is to hold up. It is built from a **weekly snapshot** of public data, and it uses the In Motion visual language. It is part of the In Motion family; see the hub at https://in-motion.puter.site.

**Working name:** *Frontier In Motion*. It must never be called a "truth score". Use "evidence signals" throughout.

## Data (weekly snapshot, built by a script in this repo)

**Network.** This session's environment allows `export.arxiv.org`, `api.biorxiv.org`, `api.openalex.org` and `api.crossref.org`.

**Courtesy.** Be polite to every API:
- Send a descriptive User-Agent with no personal email.
- Throttle to about 1 request per second.
- Cache all responses on disk under `explorer/cache/`, and do not commit the cache.

**Script.** Write `explorer/build_snapshot.py` (Python, standard library only, or `requests` if available). It produces `explorer/data/snapshot-YYYY-MM-DD.json` in four steps:
1. **New preprints:** fetch the past 7 days from arXiv (all categories) and from bioRxiv/medRxiv (`api.biorxiv.org/details/{server}/{from}/{to}`). If the full week is too large, sample evenly per field, cap at about 1,500 papers, and say so on the page.
2. **Authors:** for each paper, resolve its authors in OpenAlex (by DOI or arXiv id, else a title search) and fetch each author's past works.
3. **Author track record:** among an author's past preprints older than 2 years, compute the share that were:
   - later published in a journal or proceedings (OpenAlex `primary_location` or `locations` showing a journal; Crossref relations)
   - not retracted (OpenAlex `is_retracted`; Crossref `update-to` with type retraction)
   - cited at least N times

   Pull estimates towards the field average using a beta–binomial prior, and report an 80% interval. Authors with fewer than 3 eligible preprints are **newcomers**: show them in a separate lane and do not rank them.
4. **Paper features:** take only what can be detected honestly from metadata and abstract text:
   - code or data links (GitHub, Zenodo, OSF, Figshare)
   - "preregistered" or "registered report"
   - sample size where stated in the abstract (biomedical and social fields)
   - claim boldness phrases ("first observation", "proof of", "room-temperature", "breakthrough", "conclusively"), flagged as **bold claims**, not penalised automatically

**Output.** Combine the signals into a few transparent components. Show each component and its reason, with no hidden composite. If a single sort order is needed, use a documented, simple weighted rank.

## Backtest (required, and shown honestly)

- **Method:** score preprints from 2018–2021 using only information available at the time, then compare with what happened (published, retracted, still cited) by 2025. Report calibration: bins of predicted against observed.
- **If the signals are weak**, say so plainly on the page.
- **Case studies:** include these, with the facts sourced from the record:
  - OPERA's faster-than-light neutrinos (2011)
  - BICEP2 (2014)
  - arsenic-based life (2010; this is a journal paper, so describe that)
  - LK-99 (2023)

## Page and navigation (all fields, manageable)

**1. Frontier map.** Fields drawn as regions sized by this week's preprint count:
- physics, chemistry, biology, mathematics, computer science, medicine, earth and space

Landmarks inside each region mark the hard open problems. Map preprints to problems by keyword and category rules kept in a JSON file you can edit. Example problems:
- room-temperature superconductivity
- dark matter
- quantum error correction
- the Riemann hypothesis
- P vs NP
- protein design
- the origin of life
- consciousness
- fusion confinement
- antibiotic resistance
- climate sensitivity

Activity glows.

**2. Problem lane.** Click a landmark to see its preprints:
- **x:** age, from posted through to its status now
- **y:** evidence signal
- **dot size:** claim boldness

A band shows the outcome rates from the backtest for similar signals.

**3. Claim card.** Shows the paper's timeline and each signal with a plain reason, uncertainty ranges, and links to the arXiv/bioRxiv page and to OpenAlex.

**Filters:**
- Newcomers (a separate lane)
- Bold claims
- "Status changed since last snapshot" (requires keeping last week's snapshot)

**Ethics and limits panel.** This panel is required and must state:
- **Matthew effect:** track record favours established labs.
- **Bias:** possible bias by field, gender and geography.
- **Correlation:** signals correlate with later outcomes; they are not truth.
- **Missing records:** many good papers are never formally published.
- **Data gaps:** gaps in the OpenAlex and Crossref data.
- **No naming and shaming:** never rank individuals publicly. Author track records appear only as aggregate signals on a paper card, never as an author leaderboard.

**Snapshot date.** Show the snapshot date prominently, and the instructions for re-running the script weekly.

## Engineering

**Branch and files.** Work on branch `explorer` of Tudor74/computer-science-in-motion. Put the code in `explorer/`, with the page at `explorer/index.html`. Embed the snapshot JSON in the page at build time with a small `explorer/build_page.py`, so the page works offline.

**Design.** Match the In Motion family:
- the visual language of `src/shell.html` on the other branches, with the header brand linking to https://in-motion.puter.site
- a footer listing the courses
- large touch targets, keyboard support, reduced-motion respect, en-GB spelling
- no horizontal overflow at 320–1024 px

**Testing.** Test with Playwright, which is pre-installed: no console errors, no overflow, map, lane and card interactions, and screenshots that you look at.

**Commits.** Commit and push often to `explorer`. Do not commit API caches.

**Publishing.** If the Puter tools are available in your session, publish to subdomain `frontier-in-motion`:
1. `fs_mkdir /tudor/Sites/frontier-in-motion`
2. `fs_start_upload` with the exact byte size, then the curl PUT, then `fs_complete_upload`
3. `hosting_create`

Also add a card to the hub, branch `hub`, file `index.html`, keeping the grid even and updating `check.js`. If Puter isn't available, leave the built page committed and say so.

## Report when done

- **Size:** the snapshot (papers, fields, problems).
- **Backtest:** the calibration results, honestly stated.
- **Screenshots:** of the map, a lane and a card.
- **Limits:** what was capped or sampled.
- **Gaps:** any data you could not get.
