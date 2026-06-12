import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCSV } from "../src/csv.js";
import { select } from "../src/selector.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const rows = parseCSV(
  readFileSync(join(root, "superposition-manifestation-grid.csv"), "utf8"),
);
const cases = JSON.parse(
  readFileSync(join(root, "fixtures", "cases.json"), "utf8"),
);

// A Dirac ket is `|ψ⟩`: an ASCII pipe on the left, U+27E9 on the right. The
// canonical pole format is `| pole ⟩`. There is no U+27E8 (that is a bra).
const KET_R = "⟩"; // U+27E9 RIGHT ANGLE BRACKET

test("grid parses into rows with the expected columns", () => {
  assert.ok(rows.length >= 1, "expected at least one row");
  for (const r of rows) {
    assert.ok(r.task_type, "row missing task_type");
    assert.ok(typeof r.map === "string" && r.map.length > 0, "row missing map");
  }
});

test("every authored map carries both ket glyphs and the connective (rendering invariant)", () => {
  for (const r of rows) {
    assert.ok(r.map.includes("| "), `map missing left ket pipe for ${r.task_type}`);
    assert.ok(r.map.includes(KET_R), `map missing U+27E9 for ${r.task_type}`);
    assert.ok(r.map.includes("—?—"), `map missing —?— connective for ${r.task_type}`);
  }
});

test("Superposition is ALWAYS-ON: it always returns a non-empty map (never null)", () => {
  const inputs = [
    ...cases.map((c) => c.text),
    "",
    "asdfghjkl qwerty zxcvbnm",
    "x",
    "deploy the service and update the changelog",
  ];
  for (const s of inputs) {
    const res = select(s, rows);
    assert.ok(res, `null returned for: "${s}"`);
    assert.ok(
      typeof res.map === "string" && res.map.length > 0,
      `empty map for: "${s}"`,
    );
    assert.ok(res.map.includes("| ") && res.map.includes(KET_R), "map lost its kets");
  }
});

test("routed fixtures hit their expected lens (matched: true)", () => {
  for (const c of cases) {
    if (!c.expect_task_type) continue;
    const res = select(c.text, rows);
    assert.equal(res.matched, true, `text: ${c.text}`);
    assert.equal(res.task_type, c.expect_task_type, `text: ${c.text}`);
  }
});

test("unroutable input falls back to a universal default (matched: false, still a map)", () => {
  for (const c of cases) {
    if (c.expect_matched !== false) continue;
    const res = select(c.text, rows);
    assert.equal(res.matched, false, `text: ${c.text}`);
    assert.ok(res.map.length > 0);
  }
});

test("every DEFAULT_ID resolves to a real grid row", () => {
  // Defaults are drawn from "long-horizon execution"; assert those four exist.
  const ids = new Set(
    rows.map((r) => `${r.task_type}::${r.map.split("\n")[0].trim()}`),
  );
  for (const label of ["GOAL", "CRITERIA", "REFERENT", "SCOPE"]) {
    assert.ok(
      ids.has(`long-horizon execution::${label}`),
      `default id missing: long-horizon execution::${label}`,
    );
  }
});

test("every row has a unique id (task_type::label), so ids never collide", () => {
  const seen = new Set();
  for (const r of rows) {
    const id = `${r.task_type}::${r.map.split("\n")[0].trim()}`;
    assert.ok(!seen.has(id), `duplicate id: ${id}`);
    seen.add(id);
  }
});

test("routing is deterministic across repeated calls", () => {
  for (const c of cases) {
    assert.deepEqual(select(c.text, rows), select(c.text, rows));
  }
});

test("a matched result returns the verbatim map block from its row", () => {
  const res = select(
    "I need to debug this code and fix the failing test",
    rows,
  );
  assert.ok(res && res.matched);
  const row = rows.find(
    (r) => `${r.task_type}::${r.map.split("\n")[0].trim()}` === res.id,
  );
  assert.ok(row, "result id should map back to a grid row");
  assert.equal(res.map, row.map);
});
