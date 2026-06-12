// Keyless HTTP client for the public Superposition endpoint. No Authorization
// header by design: the tool is free, public, and rate-limited per IP. The only
// configuration is the URL (overridable for self-hosting or testing).

const DEFAULT_API_URL = "https://api.ejentum.com/superposition";

export interface SuperpositionResult {
  map: string | null;
  label: string | null;
  matched: boolean;
  task_type?: string | null;
}

export async function callSuperposition(
  task: string,
  description: string,
  wants: string,
): Promise<SuperpositionResult> {
  const apiUrl = process.env.SUPERPOSITION_API_URL || DEFAULT_API_URL;

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, description, wants }),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error calling Superposition at ${apiUrl}: ${detail}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    if (response.status === 429) {
      throw new Error(
        "Rate limit exceeded (429): Superposition is keyless and rate-limited per IP. Retry shortly, or run fully offline with SUPERPOSITION_LOCAL=1.",
      );
    }
    throw new Error(
      `Superposition endpoint returned ${response.status}: ${body.slice(0, 200)}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    throw new Error("Superposition returned invalid JSON");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      `Superposition returned unexpected shape (expected non-empty array): ${JSON.stringify(parsed).slice(0, 200)}`,
    );
  }

  const item = parsed[0] as Partial<SuperpositionResult>;
  return {
    map: item.map ?? null,
    label: item.label ?? null,
    matched: Boolean(item.matched),
    task_type: item.task_type ?? null,
  };
}
