/**
 * aiMatcher.ts
 *
 * OpenRouter-powered resource matching for PolyCare.
 *
 * Flow:
 *   1. Send student's problem + full resource list to the LLM
 *   2. LLM returns top 3 resource IDs + a warm reason for each
 *   3. We look up the full resource objects locally and return MatchedResource[]
 *   4. On any failure (network, bad JSON, timeout), returns null so the
 *      caller can fall back to the keyword matcher silently
 *
 * The keyword matcher in matcher.ts is always the fallback — this layer
 * only runs when the API key is present and the call succeeds.
 */

import { resources } from "../data/resources";
import type { MatchedResource } from "../types/resource";

// ── Types ────────────────────────────────────────────────────────────────────

interface AIMatch {
  id: string;
  reason: string;
}

interface AIResponse {
  matches: AIMatch[];
}

// ── Resource summary for the prompt ─────────────────────────────────────────

/**
 * Strips tags and backup_options from each resource before sending to the LLM.
 * Keeps the prompt focused on human-readable fields only.
 */
function buildResourceSummary() {
  return resources.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    best_for: r.best_for,
    urgency: r.urgency,
    what_to_do_first: r.what_to_do_first,
    hours: r.hours,
    location: r.location,
    appointment_required: r.appointment_required,
  }));
}

// ── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Cal Poly SLO student support assistant.

Your job is to read a student's problem and select the top 3 most relevant campus support resources from the list provided.

Rules:
- Always return exactly 3 matches (or fewer only if fewer than 3 resources exist)
- Pick the resources that most directly address the student's actual situation
- For each match, write a warm, plain, 1-sentence reason why it fits — speak directly to the student
- Never use bureaucratic or clinical language
- If the student sounds like they are in crisis, always include the crisis hotline
- Return ONLY valid JSON in this exact format, no other text:

{
  "matches": [
    { "id": "resource-id-here", "reason": "One warm sentence explaining why this helps." },
    { "id": "resource-id-here", "reason": "One warm sentence explaining why this helps." },
    { "id": "resource-id-here", "reason": "One warm sentence explaining why this helps." }
  ]
}`;

// ── Main function ────────────────────────────────────────────────────────────

/**
 * Calls OpenRouter to get AI-powered resource matches for the student's input.
 *
 * Returns null on any error so the caller can fall back to keyword matching.
 *
 * @param userInput - The student's free-text problem description
 * @param timeoutMs - Max time to wait for the API (default 8 seconds)
 */
export async function findResourcesWithAI(
  userInput: string,
  timeoutMs = 8000
): Promise<MatchedResource[] | null> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

  if (!apiKey) {
    console.warn("[aiMatcher] No VITE_OPENROUTER_API_KEY found — skipping AI match");
    return null;
  }

  const resourceSummary = buildResourceSummary();

  const userMessage = `Here are the available Cal Poly support resources:

${JSON.stringify(resourceSummary, null, 2)}

A student said:
"${userInput}"

Return the top 3 matching resource IDs and a warm reason for each.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://polycare.app",
        "X-Title": "PolyCare",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userMessage },
        ],
        temperature: 0.3,       // low temp = more consistent, structured output
        max_tokens: 512,
        response_format: { type: "json_object" },
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[aiMatcher] API error ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";

    if (!content) {
      console.warn("[aiMatcher] Empty response from API");
      return null;
    }

    // Parse the JSON the model returned
    let parsed: AIResponse;
    try {
      parsed = JSON.parse(content) as AIResponse;
    } catch {
      console.warn("[aiMatcher] Failed to parse JSON from model response:", content);
      return null;
    }

    if (!Array.isArray(parsed.matches) || parsed.matches.length === 0) {
      console.warn("[aiMatcher] No matches in parsed response");
      return null;
    }

    // Map AI match IDs back to full resource objects
    const matched: MatchedResource[] = [];

    for (const match of parsed.matches.slice(0, 3)) {
      const resource = resources.find((r) => r.id === match.id);
      if (!resource) {
        console.warn(`[aiMatcher] Unknown resource ID from model: "${match.id}"`);
        continue;
      }
      matched.push({
        ...resource,
        score: 10,                  // AI matches always score above keyword matches
        matchedTerms: [],           // AI doesn't produce matched terms
        matchReason: match.reason,  // Use the AI-generated warm reason
      });
    }

    if (matched.length === 0) {
      console.warn("[aiMatcher] No valid resource IDs in model response");
      return null;
    }

    return matched;

  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      console.warn("[aiMatcher] Request timed out after", timeoutMs, "ms");
    } else {
      console.warn("[aiMatcher] Unexpected error:", err);
    }
    return null;
  }
}
