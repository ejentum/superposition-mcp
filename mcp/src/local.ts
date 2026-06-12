// Offline mode: run the published heuristic on the user's machine with zero
// network. Imports the vendored core (copied from the canonical repo by
// scripts/vendor.mjs) so it is byte-for-byte the same selector and grid the
// hosted endpoint runs. Enabled with SUPERPOSITION_LOCAL=1.
//
// The three POVs are concatenated into one match string here, exactly as the
// hosted backend's superposition() wrapper does, so online and offline route
// identically.

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import type { SuperpositionResult } from "./client.js";

let rows: unknown[] | null = null;
let selectFn: ((text: string, rows: unknown[]) => unknown) | null = null;

async function ensureLoaded(): Promise<void> {
  if (rows && selectFn) return;
  const here = dirname(fileURLToPath(import.meta.url));
  const vendor = join(here, "..", "vendor");
  // Runtime dynamic import of the vendored plain-JS core (untyped on purpose).
  const selectorUrl = pathToFileURL(join(vendor, "selector.js")).href;
  const csvUrl = pathToFileURL(join(vendor, "csv.js")).href;
  const selectorMod: { select: (s: string, r: unknown[]) => unknown } =
    await import(selectorUrl);
  const csvMod: { parseCSV: (t: string) => unknown[] } = await import(csvUrl);
  selectFn = selectorMod.select;
  rows = csvMod.parseCSV(
    readFileSync(join(vendor, "superposition-manifestation-grid.csv"), "utf8"),
  );
}

export async function selectLocal(
  task: string,
  description: string,
  wants: string,
): Promise<SuperpositionResult> {
  await ensureLoaded();
  const text = [task, description, wants].filter(Boolean).join(" ");
  const picked = selectFn!(text, rows!) as {
    id: string;
    map: string;
    label: string;
    task_type: string;
    matched: boolean;
  } | null;
  return picked
    ? {
        map: picked.map,
        label: picked.label,
        matched: picked.matched,
        task_type: picked.task_type,
      }
    : { map: null, label: null, matched: false, task_type: null };
}
