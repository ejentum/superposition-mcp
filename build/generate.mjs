// Generates the self-contained CommonJS backend module from the canonical sources:
//   superposition-manifestation-grid.csv  +  src/normalize.js  +  src/selector.js
//
// The deployed backend MUST be exactly this output (the drift test enforces it).
// Because we read the real src files and inline them (module syntax stripped) plus
// the CSV rows as a JSON literal, the deployed logic IS the published logic,
// mechanically. There is no second copy to drift. The authored map blocks (with
// their U+27E8/U+27E9 kets and —?— connectives) ride through verbatim inside the
// ROWS literal, so the byte-identity guarantee covers the product's core artifact.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseCSV } from "../src/csv.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const GRID = "superposition-manifestation-grid.csv";

function stripModuleSyntax(src) {
  return src
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line))
    .join("\n")
    .replace(/^\s*export\s+/gm, "")
    .trim();
}

// CommonJS build of the engine, for the Ejentum Express backend (which require()s
// rather than imports). Inlines the CSV rows + the literal normalize + selector
// source and exports superposition(task, description, wants). Drift-tested against
// the committed dist/backend.cjs, so the backend runs the published logic with no
// hand-maintained second copy.
export function generateBackendCjs() {
  const normalizeSrc = stripModuleSyntax(
    readFileSync(join(root, "src", "normalize.js"), "utf8"),
  );
  const selectorSrc = stripModuleSyntax(
    readFileSync(join(root, "src", "selector.js"), "utf8"),
  );
  const rows = parseCSV(readFileSync(join(root, GRID), "utf8"));
  const rowsJson = JSON.stringify(rows, null, 2);

  return [
    "// GENERATED FILE - DO NOT EDIT.",
    "// Source of truth: superposition-manifestation-grid.csv + src/normalize.js + src/selector.js",
    "// Regenerate: npm run build   (the drift test asserts this equals the deployed backend module)",
    '"use strict";',
    "",
    "const ROWS = " + rowsJson + ";",
    "",
    normalizeSrc,
    "",
    selectorSrc,
    "",
    "// The three POVs are a forcing function, not a diff target. The server keys on",
    "// their concatenation only; the agent reasons its framings against the returned",
    "// axis. Always-on: a map is always returned.",
    "function superposition(task, description, wants) {",
    "  const text = [task, description, wants].filter(Boolean).join(' ');",
    "  const picked = select(text, ROWS);",
    "  return picked",
    "    ? { label: picked.label, map: picked.map, task_type: picked.task_type, matched: picked.matched }",
    "    : { label: null, map: null, task_type: null, matched: false };",
    "}",
    "",
    "module.exports = { superposition, select, ROWS };",
    "",
  ].join("\n");
}
