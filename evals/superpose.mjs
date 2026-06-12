// Tiny CLI around the published superposition engine, for the eval harness.
// Usage:
//   node superpose.mjs '{"task":"...","description":"...","wants":"..."}'
//   echo '{"task":"...","description":"...","wants":"..."}' | node superpose.mjs
// Prints ONLY the authored two-pole map block (what the agent reasons against).

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const { superposition } = require(join(here, "..", "dist", "backend.cjs"));

function readInput() {
  const arg = process.argv[2];
  if (arg && arg.trim()) return arg;
  try {
    return readFileSync(0, "utf8"); // stdin
  } catch {
    return "";
  }
}

let povs;
try {
  povs = JSON.parse(readInput());
} catch {
  process.stderr.write('Provide JSON: {"task","description","wants"}\n');
  process.exit(1);
}

const r = superposition(povs.task || "", povs.description || "", povs.wants || "");
process.stdout.write(r.map ? r.map + "\n" : "");
