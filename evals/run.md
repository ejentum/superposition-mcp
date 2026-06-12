# Reproducing the eval

No special harness required. Any agent runtime with shell + file access works
(Claude Code, Cursor, an SDK agent, etc.). Two runs, same model, same scenario.

## 1. Build the engine

From the repo root:

```bash
npm run build   # generates dist/backend.cjs from the grid + selector
```

The eval CLI ([`superpose.mjs`](superpose.mjs)) wraps it:

```bash
node evals/superpose.mjs '{"task":"...","description":"...","wants":"..."}'
```

It prints one map block. Same input always returns the same map (deterministic, no
LLM, no network).

## 2. Point both agents at the scenario

Give each agent access to [`scenario/`](scenario/) and this instruction (identical
for both):

> You are starting today as Head of Operations. The assignment is in `scenario/`.
> Read `00_FOUNDER_ASK.md`, then investigate the folder however you see fit. Work
> like a real operator under pressure: follow the threads, weigh what you find, and
> decide the single concrete plan you will execute this month. Deliver: an
> INVESTIGATION LOG (what you opened and the key fact from each), KEY FORKS (the
> decision points and which way you went), and a PLAN.

## 3. The only difference

The **control** gets nothing more.

The **treatment** also gets this:

> You have a tool, `superposition`. It takes three POVs on your task — task (as
> given), description (as you understand it), wants (what you infer is really
> wanted) — and returns a two-pole map: an axis with two legitimate poles and a
> self-locating question. It is not a verdict. Call it at every genuine fork where
> you are choosing between two readings of the task, and once before you commit to
> your plan, via:
> `node evals/superpose.mjs '{"task":"...","description":"...","wants":"..."}'`
> Read the map, locate which pole you are serving and why erring toward the other
> would be a real mistake here, then decide. Record each call.

## 4. Read the transcripts

Compare the two PLANs and, more importantly, the KEY FORKS. The question is not
whether the technical plan differs (on a capable model it usually won't) but
whether the treatment agent surfaces the consequence-to-stakeholders fork that the
control leaves implicit. Our run: [`transcripts/`](transcripts/).

It will not reproduce verbatim (the agent writes its own POVs and prose), but the
shape should: the control ships a sound plan and assumes authority; the treatment
agent additionally locates the fork between *the plan asked for* and *the outcome
behind it*, and plans for it.
