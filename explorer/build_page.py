#!/usr/bin/env python3
"""Embed the newest snapshot and the backtest into explorer/index.html.

    python3 explorer/build_page.py [--snapshot explorer/data/snapshot-YYYY-MM-DD.json]

The page template is explorer/src/page.html; the result works offline.
"""
import argparse
import glob
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--snapshot")
    a = ap.parse_args()
    snaps = sorted(glob.glob(os.path.join(HERE, "data", "snapshot-*.json")))
    path = a.snapshot or (snaps[-1] if snaps else None)
    if not path:
        raise SystemExit("No snapshot in explorer/data/: run build_snapshot.py first")
    with open(path, encoding="utf-8") as f:
        snap = json.load(f)
    # Display-only fields (short names) come from the current problems.json.
    with open(os.path.join(HERE, "problems.json"), encoding="utf-8") as f:
        cur = {p["id"]: p for p in json.load(f)["problems"]}
    for p in snap["problems"]:
        if p["id"] in cur and cur[p["id"]].get("short"):
            p["short"] = cur[p["id"]]["short"]
    bt = None
    bpath = os.path.join(HERE, "data", "backtest.json")
    if os.path.exists(bpath):
        with open(bpath, encoding="utf-8") as f:
            bt = json.load(f)
        bt.pop("rows", None)  # per-paper backtest rows stay in the data file
    # Keep the page light: abstracts are trimmed further for the embedded copy.
    for p in snap["papers"]:
        if len(p["abstract"]) > 520:
            p["abstract"] = p["abstract"][:520].rsplit(" ", 1)[0] + "…"
    data = json.dumps({"snapshot": snap, "backtest": bt}, ensure_ascii=False, separators=(",", ":"))
    data = data.replace("</", "<\\/").replace("<!--", "<\\!--")
    with open(os.path.join(HERE, "src", "page.html"), encoding="utf-8") as f:
        tpl = f.read()
    marker = "/*__DATA__*/null"
    assert tpl.count(marker) == 1
    html = tpl.replace(marker, data)
    out = os.path.join(HERE, "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Wrote {out} ({len(html.encode()):,} bytes) from {os.path.basename(path)}"
          f"{' + backtest' if bt else ' (no backtest yet)'}")


if __name__ == "__main__":
    main()
