#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { callSuperposition } from "./client.js";

// Always-on fallback: a domain-neutral axis, only used if a network surface
// returns nothing unexpectedly. The tool never legitimately returns no map.
const FALLBACK =
  "GOAL\n| this step closed ⟩ —?— | the mission advanced ⟩\nwhich am I serving this turn — and what evidence says the other is still on course?";

const useLocal =
  process.env.SUPERPOSITION_LOCAL === "1" ||
  process.env.SUPERPOSITION_LOCAL === "true";

const DESCRIPTION =
  "Superposition. Call when your current task could be read more than one way and you notice you have committed to a single reading. State three points of view on the task and you get back ONE small two-pole map: an axis with two legitimate poles and a question that makes you locate which pole you are serving and what makes the other one a real mistake here. It is a forcing function plus a mirror: stating the three POVs is what surfaces your own framings; the map is the external axis you reason them against. Good moments to call: before committing to an approach, when a request is ambiguous about object/goal/scope/criteria, when a long task may have drifted from the original assignment, when 'done' might mean two different things. There is no failure case and no key: it always returns a map, selected by a transparent heuristic over an open CSV (no LLM, no embeddings). The map is not a verdict or an instruction; do not echo it verbatim. Answer its question to yourself, then continue. DO NOT call for one-hop lookups or unambiguous tasks.";

const server = new McpServer({ name: "superposition", version: "0.1.0" });

server.tool(
  "superposition",
  DESCRIPTION,
  {
    task: z
      .string()
      .min(1, "task must be a non-empty string")
      .describe(
        "The task as given, in the words you were handed it. Example: 'fix the bug where the report shows a stale total'.",
      ),
    description: z
      .string()
      .min(1, "description must be a non-empty string")
      .describe(
        "The task as YOU currently understand it. Restate it in your own words, including any reading you have already committed to. Example: 'patch the totals query so the cached value refreshes'.",
      ),
    wants: z
      .string()
      .min(1, "wants must be a non-empty string")
      .describe(
        "What you infer the user actually WANTS underneath the literal task. Example: 'they want the number on screen to be trustworthy, by whatever cause'.",
      ),
  },
  async ({
    task,
    description,
    wants,
  }: {
    task: string;
    description: string;
    wants: string;
  }) => {
    try {
      const result = useLocal
        ? await (await import("./local.js")).selectLocal(task, description, wants)
        : await callSuperposition(task, description, wants);
      const text = result.map ? result.map : FALLBACK;
      return { content: [{ type: "text" as const, text }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [
          { type: "text" as const, text: `Superposition error: ${message}` },
        ],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stdio is the JSON-RPC channel; never write logs to stdout. Diagnostics -> stderr.
}

main().catch((err) => {
  const detail = err instanceof Error ? err.stack || err.message : String(err);
  process.stderr.write(`Fatal error starting superposition-mcp: ${detail}\n`);
  process.exit(1);
});
