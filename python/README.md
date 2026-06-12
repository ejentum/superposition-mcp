# superposition.py

A single, self-contained, **zero-dependency** Python build of the superposition
engine. Logic and the full map grid are embedded in one file. Drop it into any
Python project and import it; no install, no network, no API key, no Node.

```python
from superposition import superposition

r = superposition(
    task="add a retry to the failing API call",
    description="wrap the payment call in a retry loop so it stops erroring",
    wants="they want checkout to stop failing, by whatever cause",
)
print(r["map"])
# REFERENT
# | the unit named in the report ⟩ —?— | the behavior observed at runtime ⟩
# which one is my referent — and if they live in different code, which code am I about to edit?
```

`superposition(task, description, wants)` always returns a dict
`{"label", "map", "task_type", "matched"}`. The agent reads `map`. The three POVs
are a forcing function (stating them surfaces your own framings); they are
concatenated into one match string and a roughly-relevant two-pole axis comes back.

### CLI

```bash
python superposition.py '{"task":"...","description":"...","wants":"..."}'
# prints the map block (UTF-8, so the kets render on any console)
```

### Why a Python file at all

The MCP server and the HTTP endpoint exist for protocol clients. For a Python agent,
an in-process function call is a microsecond with no network and no subprocess. This
file is for exactly that: instant, local, embeddable execution where Python runs.

### How it stays honest

Only `superposition.py` ships; the rest of this folder is how it is maintained,
mirroring the JS engine's discipline:

- **`_engine.py`** — the selector logic (the maintained source).
- **`build_grid.py`** — regenerates `superposition.py` by embedding the grid
  (`../superposition-manifestation-grid.csv`) under the engine source. Run it after
  any grid change: `python python/build_grid.py`.
- **`test_superposition.py`** — asserts `superposition.py` has not drifted from the
  grid, plus routing/determinism, and **cross-language parity**: the same corpus
  through this engine and the JS engine (`../dist/backend.cjs`) returns identical
  maps. Same maps, same selection, two languages.

```bash
python -m unittest python/test_superposition.py   # from the repo root
```

The map text is identical to every other surface because all of them read the one
grid. This file just runs the selection in Python instead of JavaScript.
