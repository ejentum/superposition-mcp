import unicodedata

# Superposition selector, Python port. Pure, deterministic, heuristic. No LLM, no
# embeddings, no network, no randomness, no clock. Same input always yields the same
# output. This is the maintained logic source; python/build_grid.py inlines it under
# the embedded grid to produce the single-file superposition.py. It is kept
# byte-for-byte equivalent in behaviour to src/selector.js (the JS engine), and a
# cross-language parity test asserts that. The load-bearing artifact is the authored
# map TEXT, which is identical because both engines read the same grid; this selector
# only chooses which whole map block to return.

W_TYPE = 3
W_CONTENT = 1

# Canonical family order: v1 meaning-space before staged solution-space. Only used as
# a deterministic within-lens tiebreak. Unknown labels sort last.
FAMILY_ORDER = ["GOAL", "CRITERIA", "REFERENT", "SCOPE", "DIAGNOSIS", "METHOD", "STATE", "PRIORITY"]

# Universal axes for when the POV text routes to no lens. Drawn from the domain-neutral
# "long-horizon execution" family. Every id must exist in the grid (asserted by tests).
DEFAULT_IDS = [
    "long-horizon execution::GOAL",
    "long-horizon execution::CRITERIA",
    "long-horizon execution::REFERENT",
    "long-horizon execution::SCOPE",
]

# Pure function words stripped so routing keys on content, not question scaffolding.
STOPWORDS = frozenset({
    "what", "is", "the", "a", "an", "this", "that", "of", "to", "be", "being",
    "does", "do", "did", "are", "was", "were", "why", "how", "when", "where",
    "which", "it", "its", "in", "on", "for", "and", "or", "with", "as", "by",
    "has", "have", "had", "would", "should", "could", "will", "despite", "but",
    "from", "into", "too", "soon", "here", "there", "not", "no", "yet", "still",
    "than", "then", "so", "if", "about", "at", "now", "am", "i", "my", "me",
    "one", "other", "wrong", "right",
})


def _normalize(s):
    # NFKC-fold, lowercase, replace every non-(letter|number) run with a single space,
    # trim, and wrap in spaces so token matching is whole-word. Mirrors normalize.js:
    # the \p{L}\p{N} class is matched here with unicodedata category (L*/N*), the exact
    # Unicode classes, not str.isalnum (which is broader).
    if s is None:
        return "  "
    folded = unicodedata.normalize("NFKC", str(s)).lower()
    kept = [ch if unicodedata.category(ch)[0] in ("L", "N") else " " for ch in folded]
    return " " + " ".join("".join(kept).split()) + " "


def _words(s):
    return _normalize(s).split()


def _type_tokens(task_type):
    return _words(task_type)


def _content_tokens(map_block):
    return [w for w in _words(map_block) if len(w) > 2 and w not in STOPWORDS]


def _map_label(map_block):
    for line in str(map_block).split("\n"):
        t = line.strip()
        if t:
            return t
    return ""


def _family_rank(label):
    try:
        return FAMILY_ORDER.index(label)
    except ValueError:
        return 99


def _id_of(row):
    return str(row["task_type"]) + "::" + _map_label(row["map"])


def _utf16_units(s):
    # JS hashCode keys on UTF-16 code units (charCodeAt). Replicate exactly so the
    # default-fallback pick matches the JS engine even for astral-plane input.
    for ch in s:
        cp = ord(ch)
        if cp > 0xFFFF:
            cp -= 0x10000
            yield 0xD800 + (cp >> 10)
            yield 0xDC00 + (cp & 0x3FF)
        else:
            yield cp


def _hash_code(s):
    h = 0
    for u in _utf16_units(s):
        h = (h * 31 + u) & 0xFFFFFFFF  # 32-bit unsigned, matching JS `>>> 0`
    return h


def _row_to_result(row, matched):
    return {
        "id": _id_of(row),
        "map": row["map"],
        "label": _map_label(row["map"]),
        "task_type": row["task_type"],
        "matched": matched,
    }


def _default_result(text, rows):
    idx = _hash_code(_normalize(text)) % len(DEFAULT_IDS)
    wanted = DEFAULT_IDS[idx]
    row = next((r for r in rows if _id_of(r) == wanted), rows[0])
    return _row_to_result(row, False)


def select(text, rows):
    """Pick one map block for the given text. Deterministic, model-free. Returns a dict
    {id, map, label, task_type, matched}, or None only when rows is empty. Always-on:
    when nothing scores, a universal axis is still returned (matched=False)."""
    if not rows:
        return None
    hay = set(_words(text))

    # Group rows by lens (task_type), preserving grid order.
    groups = {}
    for row in rows:
        groups.setdefault(row["task_type"], []).append(row)

    # Level 1: score each lens; keep any with positive signal.
    scored = []
    for task_type, group in groups.items():
        name_hits = sum(1 for t in _type_tokens(task_type) if t in hay)
        content = set()
        for row in group:
            for t in _content_tokens(row["map"]):
                if t in hay:
                    content.add(t)
        score = name_hits * W_TYPE + len(content) * W_CONTENT
        if score > 0:
            scored.append((task_type, group, score))

    if not scored:
        return _default_result(text, rows)

    # Level 2: best lens (score desc, then lexicographic lens).
    scored.sort(key=lambda g: (-g[2], g[0]))
    _, chosen, _ = scored[0]

    # Within the lens: most local content hits, tiebreak canonical family order then label.
    best = None
    for row in chosen:
        local = sum(1 for t in _content_tokens(row["map"]) if t in hay)
        label = _map_label(row["map"])
        rank = _family_rank(label)
        if (
            best is None
            or local > best[0]
            or (local == best[0] and rank < best[1])
            or (local == best[0] and rank == best[1] and label < best[2])
        ):
            best = (local, rank, label, row)
    return _row_to_result(best[3], True)


def superposition(task, description, wants):
    """Three POVs in, one two-pole map out. The POVs are a forcing function, not a diff
    target: they are concatenated into one match string. Always returns a map."""
    text = " ".join(p for p in (task, description, wants) if p)
    picked = select(text, ROWS)  # noqa: F821 -- ROWS is defined above in superposition.py
    if picked:
        return {
            "label": picked["label"],
            "map": picked["map"],
            "task_type": picked["task_type"],
            "matched": picked["matched"],
        }
    return {"label": None, "map": None, "task_type": None, "matched": False}


if __name__ == "__main__":
    import sys
    import json

    _raw = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
    try:
        _povs = json.loads(_raw) if _raw.strip() else {}
    except Exception:
        sys.stderr.write('Provide JSON: {"task","description","wants"}\n')
        sys.exit(1)
    _r = superposition(_povs.get("task", ""), _povs.get("description", ""), _povs.get("wants", ""))
    # Write UTF-8 bytes directly so the kets survive any console codepage (Windows
    # consoles default to cp1252, which cannot encode U+27E9).
    sys.stdout.buffer.write(((_r["map"] + "\n") if _r["map"] else "").encode("utf-8"))
