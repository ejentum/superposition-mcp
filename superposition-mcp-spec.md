# superposition-mcp — Specification

**Org:** Ejentum
**Status:** architecture settled; one open decision (map gating)
**Launch:** second Hacker News launch of the Ejentum line (alongside self-inspect-mcp)

---

## 1. Purpose

An MCP server that counters **premature collapse** in agent reasoning. When an
agent locks onto a single reading of a task that legitimately admits more than
one, the tool puts a two-pole **terrain map** into the agent's context so it can
locate itself on the axis it had collapsed.

The map's only job is self-location: *which pole am I serving, and what makes the
other one a real mistake here.* It is not a verdict, not a procedure, not an
instruction. The reasoning happens in the agent's own head at generation time —
the map is the thing it reasons against.

---

## 2. The mechanism, stated plainly

The agent states three points of view on its current task:

1. **The task** — as given.
2. **The description** — the task as the agent understands it.
3. **The wants** — what the agent infers the user actually wants.

These three POVs enter the tool. A map comes back. The three POVs and the map
now sit in the agent's context together, before the next generation. That
combination — the agent's own three framings beside an external axis — is the
entire intervention. Nothing is composed, nothing is imposed, nothing constrains
the agent's path.

That is the whole design. It is deliberately light. The reliability comes from
the simplicity, not from precision in matching.

---

## 3. What changed, and why (decision record)

This section records what was tried and rejected, so the simplicity below reads
as a choice rather than an omission.

**Rejected: slot schema.** An earlier design had the agent decompose each POV
into fixed slots (object, extent, goal, success), with task slots enforced as
verbatim quotes, and the server comparing slot against slot by content-token
containment. It was deterministic and float-free. It was dropped because it
makes the agent **comply with a structure** — which is the procedural-drift
failure the whole architecture exists to avoid — and because it optimized a
precision question (is the *correct* map firing) that the tool doesn't need to
answer. Forcing slots is rigidity through the back door.

**Rejected: diffing the three POVs against each other.** No deterministic,
model-free rule exists to compare two free-text paragraphs for semantic
divergence. The only paths are brittle keyword matching (the ELIZA failure) or
embeddings (a model in the selection loop). Both violate a core invariant. So
the POVs are **not** diffed against each other.

**Kept: light matching only.** Whatever selects the map does so by a light,
deterministic touch — enough to pick a roughly relevant axis. Approximate
retrieval is adequate because the map's value is self-location, not
certification. A roughly-right axis still makes the agent ask which pole it's on,
which is the mechanism working.

---

## 4. Invariants (shared with the Ejentum line)

- **Deterministic selection only** — zero LLM in the selection loop.
- **Retrieve, don't generate** — maps authored once, retrieved whole.
- **Exact authored text** — shipped byte-identical, never paraphrased,
  CI-enforced (the self-inspect drift-test discipline).
- **No structure imposed on the agent** — POVs are free text in the agent's own
  words; the agent is never made to fit a schema.
- **The map never constrains** — positions, not steps; no objects or procedures
  that could drift the agent's trajectory.

---

## 5. Open decision: gated or always-on

This is the one thing not yet settled. Both branches are consistent with the
architecture above; they are different products.

**Always-on.** Every call returns the best light-matched map. The tool is a
constant self-location nudge. It never pretends to detect or certify anything —
it simply always offers an axis. Arguably the simpler and more honest version:
if a map costs near-nothing in context and its value is self-location, gating it
needs a justification, and "we detected divergence" is a claim the model-free
design can't strongly back anyway.

**Gated.** A map returns only past some light divergence signal between the
task POV and the description/wants POVs; otherwise nothing. Keeps the tool quiet
on tasks that read as coherent. Cost: "light divergence signal" still needs a
deterministic rule, and silence becomes ambiguous between "coherent task" and
"signal too light to fire" — which must be stated, never sold as certification.

**Framing rule that holds either way:** silence (if any) means *no axis
offered*, never *task certified unambiguous*.

---

## 6. Map format (authored, frozen)

Each map is one block, shipped whole:

```
LABEL
| pole a ⟩ —?— | pole b ⟩
self-locating question naming both poles relationally
```

**Ket notation.** Each pole is wrapped in a Dirac ket — `| pole ⟩` — using the
mathematical angle brackets U+27E8 `⟨` … U+27E9 `⟩` (not ASCII `<` `>`). This is
load-bearing, not decoration:

- Any model reads `| … ⟩` as a quantum *state* and loads superposition context at
  zero cost — pretrained signal the connective alone can't carry.
- Ket notation is valence-free by physics convention (no good states, no bad
  states, just states). Wrapping both poles identically strips residual tonal
  lean — the format itself reinforces neutrality-law clause 1.
- The metaphor completes: the question at the base is the *measurement*. The
  agent answering it performs the observation that collapses the superposition —
  deliberate, observed collapse instead of silent premature collapse. That is the
  product claim, stated in notation.

The `—?—` connective sits where the `+` operator sits in real superposition
notation, but reads as an *undetermined* operator: not "both held" but "both
held, and how they relate is the open question." A model won't name this
"superposition" cold, but parses the structure correctly; inside a map the tool
binds the connective's meaning on first read.

**Canonical spacing (frozen — byte-identical drift test asserts against it):**

- Padded kets: one space inside each bracket — `| the next action ⟩`.
- Symmetric single-space connective — `⟩ —?— |`.
- Example: `| the next action ⟩ —?— | the remaining distance ⟩`

**Rendering requirement (was cosmetic, now required).** Every map block carries
U+27E8/U+27E9. These are present in most monospace fonts but fall back
inconsistently in some terminals — a bad fallback renders the product's core
artifact as tofu boxes. Screenshot-test the kets in the actual target stacks
(Claude Desktop, Cursor, raw terminal) before any release. Provide an ASCII
degradation path (`|…>`) only if a target stack fails; do not mix forms within a
release.

**Three-clause neutrality law** (every map passes all three):

1. **No virtuous pole.** Neither side is the obviously-right one. Pole names are
   noun phrases naming what each pole privileges, never quality adjectives.
2. **Symmetric failure.** Erring toward either pole is a real, nameable mistake.
   Failure lives in the question, never in a pole.
3. **Relational question.** The question names the poles by relation ("the other
   one"), never by position ("the first"), to avoid order/primacy bias.

---

## 7. Map library

**v1 — meaning space (shipped):** GOAL, CRITERIA, REFERENT, SCOPE.
**Staged — solution space:** METHOD, DIAGNOSIS, STATE, PRIORITY. Gated behind a
future fourth POV ("how am I solving it"), added only when a real edge earns it —
named POV, named purpose, not a generic dial.

The authored map texts are the load-bearing artifacts. They are stored and
retrieved as whole blocks; the unit of storage equals the unit of retrieval.

---

## 8. Manifestation grid (documentation layer, not wire payload)

A companion CSV (`superposition-manifestation-grid.csv`) holds two fields:
`task_type` and `map`. The `map` field carries the whole authored block in
canonical ket format (label, ket-wrapped poles with the `—?—` connective,
self-locating question). It crosses each v1 family with eight task types (code &
debug, research & analysis, writing & creative, communication & drafting,
planning & strategy, data transformation, evaluation & review, long-horizon
execution), plus the four staged families on their home types — 36 rows.

This grid is **documentation, demo material, and eval-scenario seeds**. It is the
answer to "what does an abstract two-pole map mean for *my* agent." It is **not**
sent over the wire and `task_type` is **not** a field the agent submits — only
the map block goes to the agent. The grid existed first as an exercise that
produced a useful completeness finding: every per-task-type reading projects back
onto one of the eight existing families. No ninth axis survived the
symmetric-failure clause. The per-type lens is a projection of the family space,
not a new dimension.

---

## 9. Candidate future spaces (brainstorm, unbuilt)

Each would cost exactly one new named POV and one designated edge.

- **CHANNEL** — `content to process —?— instruction to follow`. Prompt injection
  reframed as collapse; symmetric failure holds natively. Strongest launch
  gravity; slots into the anti-adversarial layer.
- **PRINCIPAL** — `the requester speaking —?— the party served`. Malicious
  compliance vs paternalism. Clean edge, large surface.
- **MANDATE** — `the license granted —?— the capability available`. Weaker gate
  (license often implicit → mostly silent). Stage, don't ship.
- **WARRANT** — rejected: clause 2 strains ("verified" wants to be virtuous);
  half-reduces to CRITERIA.
- **WORLD** — rejected: reduces to STATE viewed from the environment side.

The two rejections are themselves launch material — evidence the neutrality law
has teeth.

---

## 10. Reliability posture

The design bets that **simplicity beats precision** for this job. Concretely:

- The maps were never the risk — authored, frozen, neutrality-checked.
- With slots gone, there is no agent-side compliance burden and no
  wrong-span failure mode to instrument.
- The remaining honest unknown is whether light matching picks usefully relevant
  axes often enough to feel alive in a demo. Decide that from logged traffic, not
  from a tuning constant.
- **Telemetry over assertion:** log which map (if any) is returned per call across
  real traffic. Don't assert the tool is useful — observe it, same posture as the
  self-inspect drift test.
- **Do not** add a similarity float to raise match rate. That reintroduces the one
  model-in-the-loop decision the architecture exists to avoid.
