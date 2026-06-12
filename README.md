# Superposition

Open, keyless, deterministic **two-pole terrain maps** that counter *premature
collapse* in agent reasoning.

When an agent locks onto a single reading of a task that legitimately admits more
than one, it has collapsed an axis it never measured. Superposition puts that axis
back into the agent's context as a small, frozen map, so the agent can locate
itself: *which pole am I serving, and what makes the other one a real mistake
here.* The map is not a verdict, not a procedure, not an instruction. The
reasoning happens in the agent's own head; the map is the thing it reasons
against.

Part of the [Ejentum](https://ejentum.com) line. No LLM in the loop, no
embeddings, no API key.

## The mechanism

The agent states three points of view on its current task:

1. **task** — the task as given.
2. **description** — the task as the agent understands it.
3. **wants** — what the agent infers the user actually wants.

Those three POVs are a **forcing function**: stating them is what makes the agent
generate its own framings in the first place. They are *not* diffed against each
other (no model-free rule exists for that, and it would put a model back in the
selection loop). A map comes back, always. The three framings now sit beside an
external axis, before the next generation. That combination is the entire
intervention.

```
GOAL
| the fix as stated ⟩ —?— | the intent behind the report ⟩
which am I serving — and what in the report makes the other one wrong?
```

The poles are wrapped in Dirac kets (`| pole ⟩`, U+27E8/U+27E9) so any model loads
superposition context for free, and because ket notation is valence-free by
physics convention it strips tonal lean from both poles equally. The question at
the base is the *measurement*: answering it is the agent performing a deliberate,
observed collapse instead of a silent premature one.

## How selection works

The selector is a pure, deterministic heuristic over the open CSV
(`superposition-manifestation-grid.csv`). No LLM, no embeddings, no similarity
float, no network, no clock, no randomness. Same input always yields the same
output.

1. The three POVs are concatenated into one match string.
2. Each `task_type` lens (`code & debug`, `research & analysis`, ...) is scored:
   `3 * (lens-name tokens present) + 1 * (distinct content tokens from that lens's
   maps present)`.
3. The highest-scoring lens wins; within it, the map with the most local content
   matches wins (tiebreak: canonical family order, GOAL first). `matched: true`.
4. If nothing scores, a universal axis is returned anyway (`matched: false`),
   chosen deterministically by a stable hash of the text.

It is **always-on**. Approximate retrieval is adequate by design: a roughly-right
axis still makes the agent ask which pole it is on, which is the mechanism
working. The selection never certifies anything. Silence is never an option, and
would mean *no axis offered*, never *task certified unambiguous*.

`task_type` is an **internal grouping column only.** The agent never submits it; it
never goes over the wire. Only the map block returns.

## The map library

- **v1 meaning space (shipped):** `GOAL`, `CRITERIA`, `REFERENT`, `SCOPE`.
- **Staged solution space:** `METHOD`, `DIAGNOSIS`, `STATE`, `PRIORITY` (on their
  home task types), gated behind a future fourth POV.

Each authored map passes a three-clause neutrality law: no virtuous pole, symmetric
failure (erring toward either pole is a real, nameable mistake), and a relational
question (names the poles by relation, never by position). See
`superposition-mcp-spec.md` for the full architecture and decision record.

## Published == deployed

The hosted endpoint runs `dist/backend.cjs`, which is **generated** from the
canonical sources and nothing else:

```
superposition-manifestation-grid.csv  +  src/normalize.js  +  src/selector.js
        │  npm run build  (inlines the grid rows + the literal engine)
        ▼
dist/backend.cjs   ← the deployed module; require()d by the Ejentum backend
```

A drift test (`test/drift.test.mjs`) asserts the committed `dist/backend.cjs` is
byte-identical to what the generator produces from the current sources. If the
grid or the selector changes and the artifact is not rebuilt, CI fails. There is
no hand-maintained second copy to drift, and the authored map blocks (kets and
all) ride through verbatim inside the inlined rows.

```bash
npm run build   # regenerate dist/backend.cjs from the sources
npm test        # drift test + selector tests (node --test, zero deps)
```

## MCP

The `mcp/` subdirectory packages this as an MCP server (`superposition-mcp`). It
calls the public `api.ejentum.com/superposition` endpoint, or runs the published
heuristic fully offline with `SUPERPOSITION_LOCAL=1` against a vendored,
byte-identical copy of the selector and grid. See `mcp/README.md`.

## Python

For Python environments, [`python/superposition.py`](python/superposition.py) is a
single, zero-dependency, drop-in file (logic + the full grid embedded). No install,
no network, no Node: `from superposition import superposition`. It is generated from
the same grid, and a cross-language parity test asserts it picks the byte-identical
map the JS engine does. In-process and instant, which is the point for a Python agent
calling it each turn. See [`python/README.md`](python/README.md).

## Evidence

[`evals/`](evals/) holds a reproducible eval, not a curated demo: a realistic
operations task with a built-in metric trap, run with and without superposition on
the same model. Both agents reach a sound technical plan; the agent with
superposition additionally surfaces the consequence-to-stakeholders fork the control
leaves implicit (it reset a founder's misaligned expectation instead of silently
shipping a plan he'd be blindsided by). The scenario, the engine, and the prompts
are all included so you can run it yourself and read the transcripts.

## Not for

Single-step classifiers, simple lookups, and tasks with one unambiguous reading
do not benefit; the map is overhead there. Superposition is for multi-step or
genuinely ambiguous tasks where an agent can collapse the wrong way early and
carry it. If the API is unreachable, the agent proceeds on its own reasoning: this
is an enhancement, never a critical-path dependency.

## License

MIT. Author: Ejentum (info@ejentum.com).
