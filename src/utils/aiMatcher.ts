/**
 * aiMatcher.ts
 *
 * AI-powered resource matching using Groq API.
 *
 * Why Groq:
 *   - Free tier: 14,400 requests/day, no credit card required
 *   - No user login popup
 *   - ~200-400ms response time (very fast)
 *   - OpenAI-compatible API format
 *   - Model: llama-3.3-70b-versatile (free, excellent instruction following)
 *
 * Falls back to keyword matcher on any failure.
 */

import { resources } from "../data/resources";
import type { MatchedResource } from "../types/resource";

interface AIMatch {
  id: string;
  reason: string;
}

interface AIResponse {
  matches: AIMatch[];
}

const VALID_IDS = new Set(resources.map((r) => r.id));

function buildCatalogue(): string {
  return resources
    .map(
      (r) =>
        `ID: ${r.id} | Name: ${r.name} | Category: ${r.category} | Best for: ${r.best_for}`
    )
    .join("\n");
}

const SYSTEM_PROMPT = `You are a Cal Poly SLO student support assistant. Your job is to match a student's campus-related problem to the right support resources.

RESOURCES:
${buildCatalogue()}

MATCHING RULES (follow strictly):
- Math, studying, homework, failing, grades, exams → tutoring-center or academic-advising
- Stress, anxiety, overwhelmed, mental health, burnout → counseling-services
- Food, groceries, hungry, can't afford food → food-pantry
- Rent, bills, financial emergency, can't pay → emergency-grant
- Housing, homeless, eviction, nowhere to stay → housing-support
- Laptop broken, no computer, tech issues → laptop-loan or it-help-desk
- Accommodations, disability, ADHD → disability-services
- Interview, career fair, job, resume → career-closet
- Multiple problems, don't know where to start → basic-needs-office
- Crisis, self-harm, suicidal → ALWAYS include crisis-hotline

IMPORTANT:
- Only match resources that genuinely apply to the student's situation.
- If the message is not related to any campus support need (e.g. jokes, random words, nonsense, non-student topics), return an empty matches array: {"matches":[]}
- Never stretch or invent a connection just to return results.
- Do not return more than 3 matches.

Return ONLY this JSON, no other text:
{"matches":[{"id":"ID_HERE","reason":"One warm sentence."},{"id":"ID_HERE","reason":"One warm sentence."},{"id":"ID_HERE","reason":"One warm sentence."}]}`;

function extractJSON(raw: string): AIResponse | null {
  try {
    return JSON.parse(raw) as AIResponse;
  } catch {
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

export async function findResourcesWithAI(
  userInput: string,
  timeoutMs = 10000
): Promise<MatchedResource[] | null> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

  if (!apiKey) {
    console.warn("[aiMatcher] No VITE_GROQ_API_KEY found, falling back to keyword matcher");
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",  // free on Groq, 14,400 req/day
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: userInput },
        ],
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(`[aiMatcher] Groq API error ${response.status}:`, body);
      return null;
    }

    const data = await response.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";

    console.log("[aiMatcher] Raw response:", raw);

    if (!raw) {
      console.warn("[aiMatcher] Empty response from Groq");
      return null;
    }

    const parsed = extractJSON(raw);

    if (!parsed || !Array.isArray(parsed.matches)) {
      console.warn("[aiMatcher] Could not parse matches from:", raw);
      return null;
    }

    // Empty matches = AI decided input isn't campus-related → fall back to keyword matcher
    if (parsed.matches.length === 0) {
      console.log("[aiMatcher] AI returned no matches, input not campus-related");
      return null;
    }

    const matched: MatchedResource[] = [];

    for (const match of parsed.matches.slice(0, 3)) {
      if (!match.id || !VALID_IDS.has(match.id)) {
        console.warn(`[aiMatcher] Unknown ID: "${match.id}"`);
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
      console.warn("[aiMatcher] No valid IDs in response");
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
