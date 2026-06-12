# superposition-mcp

MCP server for [Superposition](https://ejentum.com): one keyless tool that returns
a **two-pole terrain map** so your agent can locate which reading of an ambiguous
task it has collapsed onto, and what makes the other reading a real mistake.

Deterministic, no LLM, no embeddings, no API key. Part of the Ejentum line.

## Install

```jsonc
// Claude Desktop / Cursor / Windsurf — mcpServers config
{
  "mcpServers": {
    "superposition": {
      "command": "npx",
      "args": ["-y", "superposition-mcp"]
    }
  }
}
```

Claude Code:

```bash
claude mcp add superposition -- npx -y superposition-mcp
```

## The tool

`superposition(task, description, wants)` — state three points of view on your
current task:

- **task** — the task as given.
- **description** — the task as you currently understand it.
- **wants** — what you infer the user actually wants underneath it.

Stating them is a forcing function: it surfaces your own framings. You get back one
small map to reason them against:

```
GOAL
| the fix as stated ⟩ —?— | the intent behind the report ⟩
which am I serving — and what in the report makes the other one wrong?
```

Answer the question to yourself, then continue. The map is not a verdict or an
instruction; do not echo it verbatim to the user. It always returns a map; there
is no failure case.

> The poles use Dirac ket glyphs (U+27E8/U+27E9 `⟨ ⟩`). Most monospace fonts
> render them; if your terminal shows tofu boxes, the content is still correct.

## Configuration

| Env var | Default | Effect |
|---|---|---|
| `SUPERPOSITION_LOCAL` | unset | `1` or `true` runs the published heuristic fully offline against the vendored selector + grid (zero network). |
| `SUPERPOSITION_API_URL` | `https://api.ejentum.com/superposition` | Override the endpoint (self-hosting / testing). |

## Auditability

`vendor/` holds unmodified copies of the canonical selector (`selector.js`,
`normalize.js`, `csv.js`) and the map grid
(`superposition-manifestation-grid.csv`), mechanically copied from the
[superposition-mcp](https://github.com/ejentum/superposition-mcp) repo. Offline mode runs
exactly that code and data; the hosted endpoint runs a byte-identical,
drift-tested build of the same sources. There is no hidden second engine.

## License

MIT. Author: Ejentum (info@ejentum.com).
