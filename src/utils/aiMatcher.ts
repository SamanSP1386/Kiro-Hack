/**
 * aiMatcher.ts
 *
 * OpenRouter-powered resource matching for PolyCare.
 *
 * Improvements over v1:
 *  - Uses google/gemini-flash-1.5 (free, much better instruction following)
 *  - Resource list is embedded in the system prompt, not the user message
 *  - JSON is extracted via regex fallback in case the model adds prose around it
 *  - Prompt is tighter and more directive
 *  - Falls back to keyword matcher on any failure
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

// ── Valid resource IDs (used to validate model output) ───────────────────────

const VALID_IDS = new Set(resources.map((r) => r.id));

// ── Build the resource catalogue string for the system prompt ────────────────

function buildCatalogue(): string {
  return resources
    .map(
      (r) =>
        `ID: ${r.id}
Name: ${r.name}
Category: ${r.category}
Best for: ${r.best_for}
What to do first: ${r.what_to_do_first}
Hours: ${r.hours} | Location: ${r.location}`
    )
    .join("\n\n");
}

// ── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are a Cal Poly SLO student support assistant. Match the student's problem to the most relevant resources from this exact list. Do not invent resources.

AVAILABLE RESOURCES:
${buildCatalogue()}

MATCHING RULES:
- Academic problems (failing, homework, math, studying, grades, exams) → use "tutoring-center" or "academic-advising"
- Mental health (stress, anxiety, overwhelmed, depression, burnout) → use "counseling-services"
- Food/money for food → use "food-pantry"
- Financial emergency (rent, bills, can't afford) → use "emergency-grant"
- Housing problems → use "housing-support"
- Laptop/computer/tech issues → use "laptop-loan" or "it-help-desk"
- Disability/accommodations → use "disability-services"
- Career/interview/job → use "career-closet"
- Multiple urgent needs / don't know where to start → use "basic-needs-office"
- Crisis / self-harm / suicidal → ALWAYS include "crisis-hotline"

INSTRUCTIONS:
1. Pick the 3 resources whose category best matches the student's actual problem.
2. For each, write one warm sentence (under 20 words) explaining why it helps THIS student.
3. Output ONLY valid JSON. No markdown, no explanation, no extra text before or after.

OUTPUT FORMAT:
{"matches":[{"id":"RESOURCE_ID","reason":"Warm sentence."},{"id":"RESOURCE_ID","reason":"Warm sentence."},{"id":"RESOURCE_ID","reason":"Warm sentence."}]}`;
}

// ── Extract JSON from model output (handles prose wrapping) ──────────────────

function extractJSON(raw: string): AIResponse | null {
  // Try direct parse first
  try {
    return JSON.parse(raw) as AIResponse;
  } catch {
    // Try to find a JSON object anywhere in the string
    const match = raw.match(/\{[\s\S]*"matches"[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]) as AIResponse;
      } catch {
        return null;
      }
    }
    return null;
  }
}

// ── Main function ────────────────────────────────────────────────────────────

/**
 * Calls OpenRouter to get AI-powered resource matches for the student's input.
 * Returns null on any error so the caller falls back to keyword matching silently.
 *
 * @param userInput - The student's free-text problem description
 * @param timeoutMs - Max ms to wait for the API response (default 10s)
 */
export async function findResourcesWithAI(
  userInput: string,
  timeoutMs = 10000
): Promise<MatchedResource[] | null> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

  if (!apiKey) {
    console.warn("[aiMatcher] No VITE_OPENROUTER_API_KEY — skipping AI match");
    return null;
  }

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
        // meta-llama/llama-3.1-8b-instruct:free is confirmed free and available on OpenRouter
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user",   content: userInput },
        ],
        temperature: 0.2,  // low = consistent, structured output
        max_tokens: 400,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(`[aiMatcher] API error ${response.status}:`, body);
      return null;
    }

    const data = await response.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";

    if (!raw) {
      console.warn("[aiMatcher] Empty response from model");
      return null;
    }

    const parsed = extractJSON(raw);

    if (!parsed || !Array.isArray(parsed.matches) || parsed.matches.length === 0) {
      console.warn("[aiMatcher] Could not parse matches from:", raw);
      return null;
    }

    // Map IDs → full resource objects, filtering out any hallucinated IDs
    const matched: MatchedResource[] = [];

    for (const match of parsed.matches.slice(0, 3)) {
      if (!match.id || !VALID_IDS.has(match.id)) {
        console.warn(`[aiMatcher] Ignoring unknown ID: "${match.id}"`);
        continue;
      }
      const resource = resources.find((r) => r.id === match.id)!;
      matched.push({
        ...resource,
        score: 10,
        matchedTerms: [],
        matchReason: match.reason?.trim() || resource.best_for,
      });
    }

    if (matched.length === 0) {
      console.warn("[aiMatcher] No valid IDs in model response");
      return null;
    }

    return matched;

  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      console.warn(`[aiMatcher] Timed out after ${timeoutMs}ms`);
    } else {
      console.warn("[aiMatcher] Error:", err);
    }
    return null;
  }
}
