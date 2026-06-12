// GENERATED FILE - DO NOT EDIT.
// Source of truth: superposition-manifestation-grid.csv + src/normalize.js + src/selector.js
// Regenerate: npm run build   (the drift test asserts this equals the deployed backend module)
"use strict";

const ROWS = [
  {
    "task_type": "code & debug",
    "map": "REFERENT\n| the unit named in the report ⟩ —?— | the behavior observed at runtime ⟩\nwhich one is my referent — and if they live in different code, which code am I about to edit?"
  },
  {
    "task_type": "code & debug",
    "map": "GOAL\n| the fix as stated ⟩ —?— | the intent behind the report ⟩\nwhich am I serving — and what in the report makes the other one wrong?"
  },
  {
    "task_type": "code & debug",
    "map": "SCOPE\n| the call site in question ⟩ —?— | every site the pattern repeats ⟩\nwhich extent did the task set — and who decided the other was in or out?"
  },
  {
    "task_type": "code & debug",
    "map": "CRITERIA\n| the check turning green ⟩ —?— | the failure not recurring ⟩\nwhich done am I building toward — and does reaching one reach the other here?"
  },
  {
    "task_type": "research & analysis",
    "map": "REFERENT\n| the named case ⟩ —?— | the class it stands for ⟩\nwhich is my object — and which one will the findings actually be about?"
  },
  {
    "task_type": "research & analysis",
    "map": "GOAL\n| the question as asked ⟩ —?— | the decision it feeds ⟩\nwhich am I answering — and what tells me the other isn't the real assignment?"
  },
  {
    "task_type": "research & analysis",
    "map": "SCOPE\n| the sources in hand ⟩ —?— | the field they sit in ⟩\nwhich boundary am I working — and was the other excluded or just unmentioned?"
  },
  {
    "task_type": "research & analysis",
    "map": "CRITERIA\n| a verdict delivered ⟩ —?— | the uncertainty mapped ⟩\nwhich counts as answered here — and does the asker want the other folded in or left out?"
  },
  {
    "task_type": "writing & creative",
    "map": "REFERENT\n| the topic named ⟩ —?— | the occasion prompting it ⟩\nwhich is the piece about — and which one is the reader meant to meet?"
  },
  {
    "task_type": "writing & creative",
    "map": "GOAL\n| the artifact specified ⟩ —?— | the effect sought ⟩\nwhich am I shaping — and where do the two stop producing each other?"
  },
  {
    "task_type": "writing & creative",
    "map": "SCOPE\n| the section requested ⟩ —?— | the whole it sits in ⟩\nwhich extent owns my changes — and what happens at the seam with the other?"
  },
  {
    "task_type": "writing & creative",
    "map": "CRITERIA\n| the brief satisfied ⟩ —?— | the reader moved ⟩\nwhich finish line is mine — and who says crossing one crosses the other?"
  },
  {
    "task_type": "communication & drafting",
    "map": "REFERENT\n| the matter discussed ⟩ —?— | the standing it touches ⟩\nwhich is this message handling — and what does it do to the other on the way?"
  },
  {
    "task_type": "communication & drafting",
    "map": "GOAL\n| the words I need sent ⟩ —?— | the reading they'll make ⟩\nwhich am I optimizing — and what does ignoring the other one cost?"
  },
  {
    "task_type": "communication & drafting",
    "map": "SCOPE\n| this message ⟩ —?— | the thread it settles or stirs ⟩\nwhich am I writing — and does closing one open the other?"
  },
  {
    "task_type": "communication & drafting",
    "map": "CRITERIA\n| sent and unambiguous ⟩ —?— | received and acted on ⟩\nwhich counts as delivered — and what would show the other didn't happen?"
  },
  {
    "task_type": "planning & strategy",
    "map": "REFERENT\n| the document requested ⟩ —?— | the situation it serves ⟩\nwhich am I producing — and which one is the requester going to use?"
  },
  {
    "task_type": "planning & strategy",
    "map": "GOAL\n| the plan asked for ⟩ —?— | the outcome behind it ⟩\nwhich am I building toward — and what makes the other out of bounds?"
  },
  {
    "task_type": "planning & strategy",
    "map": "SCOPE\n| the horizon stated ⟩ —?— | the constraints binding past it ⟩\nwhich window am I planning in — and what from the other reaches into it?"
  },
  {
    "task_type": "planning & strategy",
    "map": "CRITERIA\n| every step covered ⟩ —?— | first contact survived ⟩\nwhich complete is required — and which one will the plan be judged by?"
  },
  {
    "task_type": "data transformation",
    "map": "REFERENT\n| the format requested ⟩ —?— | the semantics carried ⟩\nwhich am I preserving — and what in the other gets silently rewritten to comply?"
  },
  {
    "task_type": "data transformation",
    "map": "GOAL\n| the conversion specified ⟩ —?— | the use awaiting it ⟩\nwhich am I serving — and would the other accept this output as is?"
  },
  {
    "task_type": "data transformation",
    "map": "SCOPE\n| the records in this file ⟩ —?— | the feed they arrive on ⟩\nwhich am I handling — and is the other someone else's problem or mine?"
  },
  {
    "task_type": "data transformation",
    "map": "CRITERIA\n| the contract met ⟩ —?— | the content kept ⟩\nwhich is my pass condition — and where do the two diverge in this data?"
  },
  {
    "task_type": "evaluation & review",
    "map": "REFERENT\n| the artifact submitted ⟩ —?— | the work it represents ⟩\nwhich am I reviewing — and which one do my findings attach to?"
  },
  {
    "task_type": "evaluation & review",
    "map": "GOAL\n| the review requested ⟩ —?— | the decision it gates ⟩\nwhich am I performing — and what makes the other someone else's call?"
  },
  {
    "task_type": "evaluation & review",
    "map": "SCOPE\n| the lines changed ⟩ —?— | the system they touch ⟩\nwhich surface am I judging — and who covers what the other exposes?"
  },
  {
    "task_type": "evaluation & review",
    "map": "CRITERIA\n| every issue noted ⟩ —?— | each issue actionable ⟩\nwhich makes this review done — and which one will the author actually use?"
  },
  {
    "task_type": "long-horizon execution",
    "map": "REFERENT\n| the current subtask ⟩ —?— | the assignment that spawned it ⟩\nwhich is my object right now — and does finishing one still serve the other?"
  },
  {
    "task_type": "long-horizon execution",
    "map": "GOAL\n| this step closed ⟩ —?— | the mission advanced ⟩\nwhich am I serving this turn — and what evidence says the other is still on course?"
  },
  {
    "task_type": "long-horizon execution",
    "map": "SCOPE\n| what this step owns ⟩ —?— | what earlier steps deferred ⟩\nwhich load am I carrying — and where is the other accumulating?"
  },
  {
    "task_type": "long-horizon execution",
    "map": "CRITERIA\n| motion made ⟩ —?— | distance closed ⟩\nwhich is my progress measure — and would the other agree with it right now?"
  },
  {
    "task_type": "code & debug",
    "map": "DIAGNOSIS\n| the reported failure ⟩ —?— | the underlying fault ⟩\nwhich am I fixing — and would fixing the other change what I'm about to touch?"
  },
  {
    "task_type": "planning & strategy",
    "map": "METHOD\n| the committed path ⟩ —?— | the live option set ⟩\nwhich am I producing — and when does holding the other become its own mistake?"
  },
  {
    "task_type": "long-horizon execution",
    "map": "STATE\n| the next action ⟩ —?— | the remaining distance ⟩\nwhich am I steering by — and when did I last check one against the other?"
  },
  {
    "task_type": "evaluation & review",
    "map": "PRIORITY\n| the defects present ⟩ —?— | the verdict overall ⟩\nwhich am I delivering — and does the other survive what I found?"
  }
];

// Superposition text normalization.
//
// THE drift hazard: the local module, the generator, and the deployed backend
// MUST normalize identically, or "published == deployed" silently breaks.
// This file is the single copy. The generator inlines it verbatim; the MCP and
// tests import it. Do not fork this logic anywhere.
//
// Contract: returns a lowercase, NFKC-folded, single-space-tokenized string that
// BOTH starts and ends with a space, so substring matching with space-padded
// keywords gives whole-token boundaries (" foo " matches the word, not "foobar").
// Note: the ket glyphs ⟨ ⟩, the —?— connective, and | are not letters or digits,
// so they fold to whitespace here. They are load-bearing in the AUTHORED map text
// (which ships verbatim), never in the MATCHING text. Matching keys on words only.
function normalize(input) {
  if (input === null || input === undefined) return "  ";
  const folded = String(input).normalize("NFKC").toLowerCase();
  const tokens = folded.replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
  return " " + tokens + " ";
}

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
function select(text, rows) {
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

// The three POVs are a forcing function, not a diff target. The server keys on
// their concatenation only; the agent reasons its framings against the returned
// axis. Always-on: a map is always returned.
function superposition(task, description, wants) {
  const text = [task, description, wants].filter(Boolean).join(' ');
  const picked = select(text, ROWS);
  return picked
    ? { label: picked.label, map: picked.map, task_type: picked.task_type, matched: picked.matched }
    : { label: null, map: null, task_type: null, matched: false };
}

module.exports = { superposition, select, ROWS };
