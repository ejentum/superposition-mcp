// Superposition selector: pure, deterministic, heuristic. No LLM, no embeddings,
// no semantic similarity, no network, no randomness, no clock. Same input always
// yields the same output. This is the whole engine; everything else is plumbing.
//
// Philosophy: Superposition is ALWAYS-ON. It always returns a two-pole terrain
// map, never null. The agent has stated three points of view on its task (the
// task as given, the task as it understands it, what it infers the user wants);
// those three POVs are a forcing function that makes the agent generate its own
// framings. The map comes back as an external axis to reason those framings
// against. The map's only job is self-location: which pole am I serving, and what
// makes the other one a real mistake here. It is never a verdict.
//
// The three POVs are NOT diffed against each other (no deterministic, model-free
// rule exists for that, and it would reintroduce a model in the loop). They are
// concatenated by the caller into one match string; this selector keys on that
// text to pick a roughly-relevant axis. Approximate retrieval is adequate by
// design: a roughly-right axis still makes the agent ask which pole it is on,
// which is the mechanism working. Do NOT add a similarity float to raise the
// match rate; that reintroduces the one model-in-the-loop decision the
// architecture exists to avoid (spec section 10).
//
// Data (superposition-manifestation-grid.csv): task_type, map.
//   - task_type is the LENS (a projection family: code & debug, research &
//     analysis, ...). It is an internal grouping column ONLY; the agent never
//     submits it and it is never sent over the wire. Only the map block returns.
//   - map is the whole AUTHORED block, shipped byte-identical: a LABEL line
//     (the meaning-space family GOAL / CRITERIA / REFERENT / SCOPE, or a staged
//     solution-space family), a ket-wrapped two-pole line with the —?— connective,
//     and a self-locating question. The unit of storage equals the unit of
//     retrieval.
//
// select(text, rows) -> { id, map, label, task_type, matched }
//
// Two-level routing (mirrors the Ejentum line's dynamic retrieval, model-free):
//   1. Score each task_type lens: 3 * (lens-name tokens present) + 1 * (distinct
//      content tokens from that lens's map blocks present). Evidence aggregates
//      across all of a lens's maps.
//   2. If any lens has signal, pick the highest (ties prefer canonical family
//      coverage via lexicographic lens) and, within it, the map with the most
//      local content hits (tiebreak: canonical family order, GOAL first).
//      matched: true.
//   3. If no lens has any signal, return a universal default map chosen
//      deterministically from DEFAULT_IDS by a stable hash of the text, so
//      different inputs get different axes. matched: false. Still always-on.

import { normalize } from "./normalize.js";

const W_TYPE = 3;
const W_CONTENT = 1;

// Canonical family order: v1 meaning-space (shipped) before staged solution-space.
// Used only as a deterministic within-lens tiebreak. Unknown labels sort last.
const FAMILY_ORDER = [
  "GOAL",
  "CRITERIA",
  "REFERENT",
  "SCOPE",
  "DIAGNOSIS",
  "METHOD",
  "STATE",
  "PRIORITY",
];

// Universal axes used when the POV text routes to no specific lens. Drawn from the
// domain-neutral "long-horizon execution" family, because any agent task sits on
// some horizon. Every id must exist in the CSV (asserted by the selector tests).
const DEFAULT_IDS = [
  "long-horizon execution::GOAL",
  "long-horizon execution::CRITERIA",
  "long-horizon execution::REFERENT",
  "long-horizon execution::SCOPE",
];

// Pure function words stripped so routing keys on content, not the question
// scaffolding ("which am I serving", "what makes the other one wrong"). Kept
// deliberately small and visible.
const STOPWORDS = new Set([
  "what", "is", "the", "a", "an", "this", "that", "of", "to", "be", "being",
  "does", "do", "did", "are", "was", "were", "why", "how", "when", "where",
  "which", "it", "its", "in", "on", "for", "and", "or", "with", "as", "by",
  "has", "have", "had", "would", "should", "could", "will", "despite", "but",
  "from", "into", "too", "soon", "here", "there", "not", "no", "yet", "still",
  "than", "then", "so", "if", "about", "at", "now", "am", "i", "my", "me",
  "one", "other", "wrong", "right",
]);

function words(str) {
  return normalize(str).trim().split(" ").filter(Boolean);
}

// Lens-name tokens, normalized the same way as the haystack so "code & debug"
// yields ["code", "debug"] (the & folds away) and matches cleanly.
function typeTokens(taskType) {
  return words(taskType);
}

function contentTokens(mapBlock) {
  return words(mapBlock).filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

// The family label is the first non-empty line of the authored map block.
function mapLabel(mapBlock) {
  const lines = String(mapBlock).split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (t) return t;
  }
  return "";
}

function familyRank(label) {
  const idx = FAMILY_ORDER.indexOf(label);
  return idx === -1 ? 99 : idx;
}

function idOf(row) {
  return String(row.task_type) + "::" + mapLabel(row.map);
}

// Stable, deterministic, dependency-free string hash (no Math.random, no clock).
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function rowToResult(row, matched) {
  return {
    id: idOf(row),
    map: row.map,
    label: mapLabel(row.map),
    task_type: row.task_type,
    matched,
  };
}

function defaultResult(text, rows) {
  const idx = hashCode(normalize(text)) % DEFAULT_IDS.length;
  const id = DEFAULT_IDS[idx];
  const row = rows.find((r) => idOf(r) === id) || rows[0];
  return rowToResult(row, false);
}

export function select(text, rows) {
  if (!rows || rows.length === 0) return null;
  const hay = new Set(words(text));

  // Group rows by lens (task_type), preserving CSV order for determinism.
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.task_type)) groups.set(row.task_type, []);
    groups.get(row.task_type).push(row);
  }

  // Level 1: score each lens. Keep any lens with positive signal.
  const scored = [];
  for (const [type, group] of groups) {
    const nameHits = typeTokens(type).filter((t) => hay.has(t)).length;
    const content = new Set();
    for (const row of group) {
      for (const t of contentTokens(row.map)) {
        if (hay.has(t)) content.add(t);
      }
    }
    const score = nameHits * W_TYPE + content.size * W_CONTENT;
    if (score <= 0) continue;
    scored.push({ type, group, score });
  }

  // No signal at all: always offer a universal axis. Silence is never an option;
  // the framing rule is that no map would mean "no axis offered", never "task
  // certified unambiguous" — so we always offer one.
  if (scored.length === 0) return defaultResult(text, rows);

  // Level 2: pick the best lens (score desc, then lexicographic lens).
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      (a.type < b.type ? -1 : a.type > b.type ? 1 : 0),
  );
  const chosen = scored[0];

  // Within the lens, pick the map with the most local content matches, tiebreak
  // by canonical family order (GOAL first), then lexicographic label.
  let best = null;
  for (const row of chosen.group) {
    const local = contentTokens(row.map).filter((t) => hay.has(t)).length;
    const label = mapLabel(row.map);
    const candidate = { row, local, rank: familyRank(label), label };
    if (
      best === null ||
      candidate.local > best.local ||
      (candidate.local === best.local && candidate.rank < best.rank) ||
      (candidate.local === best.local &&
        candidate.rank === best.rank &&
        candidate.label < best.label)
    ) {
      best = candidate;
    }
  }

  return rowToResult(best.row, true);
}
