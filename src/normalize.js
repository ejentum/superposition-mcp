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

export function normalize(input) {
  if (input === null || input === undefined) return "  ";
  const folded = String(input).normalize("NFKC").toLowerCase();
  const tokens = folded.replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
  return " " + tokens + " ";
}
