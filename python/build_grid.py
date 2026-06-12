"""Generates the single self-contained superposition.py from the canonical sources:
   superposition-manifestation-grid.csv  +  python/_engine.py

The shipped superposition.py MUST be exactly render() (the drift test enforces it).
The grid rows are embedded as a Python literal (via repr, so the kets and newlines
survive verbatim) and the engine source is inlined below them. There is no second
copy to drift, and the authored map blocks ride through byte-identically.

Regenerate:  python python/build_grid.py
"""

import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))
GRID = os.path.join(HERE, "..", "superposition-manifestation-grid.csv")
ENGINE = os.path.join(HERE, "_engine.py")
OUT = os.path.join(HERE, "superposition.py")


def read_rows():
    with open(GRID, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        return [{"task_type": r["task_type"], "map": r["map"]} for r in reader]


def engine_source():
    with open(ENGINE, "r", encoding="utf-8") as f:
        src = f.read()
    # Drop the top-level unicodedata import (re-declared in the generated header) and
    # the module docstring's leading import; keep everything else verbatim.
    lines = src.split("\n")
    kept = [ln for ln in lines if ln.strip() != "import unicodedata"]
    return "\n".join(kept).strip("\n")


def render():
    rows = read_rows()
    out = []
    out.append('"""superposition: single-file, zero-dependency two-pole terrain maps.')
    out.append("")
    out.append("GENERATED FILE - DO NOT EDIT BY HAND.")
    out.append("Source of truth: superposition-manifestation-grid.csv + python/_engine.py")
    out.append("Regenerate: python python/build_grid.py  (the drift test asserts this matches).")
    out.append("")
    out.append("Stdlib only (unicodedata; json+sys for the optional CLI). No third-party deps.")
    out.append('Usage:  from superposition import superposition')
    out.append('        superposition(task, description, wants) -> {"label","map","task_type","matched"}')
    out.append('CLI:    python superposition.py \'{"task":"...","description":"...","wants":"..."}\'')
    out.append('"""')
    out.append("")
    out.append("import unicodedata")
    out.append("")
    out.append("ROWS = [")
    for r in rows:
        out.append("    {\"task_type\": %s, \"map\": %s}," % (repr(r["task_type"]), repr(r["map"])))
    out.append("]")
    out.append("")
    out.append(engine_source())
    return "\n".join(out) + "\n"


def main():
    text = render()
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("Wrote %s (%d rows embedded)" % (OUT, text.count('"task_type":')))


if __name__ == "__main__":
    main()
