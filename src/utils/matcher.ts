/**
 * matcher.ts
 *
 * Single stable entry point for the PolyCare resource matching engine.
 *
 * Pipeline for every query:
 *   1. Normalize input (lowercase, strip punctuation, collapse spaces)
 *   2. Detect matched categories from keywordMap
 *   3. Score each resource (tag hits + category alignment + description overlap)
 *   4. Format each result into a MatchedResource
 *   5. Sort by score descending, with name as a stable alphabetical tiebreaker
 *   6. Return top 3 — or fallback resources if nothing scored above zero
 *
 * Types come from src/types/resource.ts — do not redefine them here.
 * Fallback IDs come from src/data/expectedResults.ts — do not hardcode them here.
 */

import { resources } from "../data/resources";
import keywordMap from "../data/keywordMap.json";
import { FALLBACK_RESOURCE_IDS } from "../data/expectedResults";
import { normalizeText } from "./normalizeText";
import type { Resource, MatchedResource, ResourceCategory } from "../types/resource";

// ── Constants ────────────────────────────────────────────────────────────────

const TOP_N = 3;

const FALLBACK_REASON =
  "This is a good place to start. They can help point you in the right direction.";

/**
 * Maps a detected keyword category to the resource categories it should
 * surface. Defined here so scoring stays self-contained in this file.
 */
const categoryToResourceCategories: Record<string, ResourceCategory[]> = {
  food:            ["food", "basic-needs"],
  financial:       ["financial", "basic-needs"],
  "mental-health": ["mental-health"],
  crisis:          ["mental-health"],
  academic:        ["academic"],
  advising:        ["academic"],
  technology:      ["technology"],
  housing:         ["housing", "basic-needs"],
  accessibility:   ["accessibility"],
  career:          ["career"],
  "basic-needs":   ["basic-needs", "food", "financial", "housing"],
};

// ── Step 2: Detect categories ────────────────────────────────────────────────

/**
 * Scans every keyword in keywordMap against the normalized input.
 * Returns each category that had at least one keyword hit.
 */
function detectCategories(normalized: string): string[] {
  const matched = new Set<string>();

  for (const [category, keywords] of Object.entries(
    keywordMap as Record<string, string[]>
  )) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        matched.add(category);
        break; // one hit per category is enough
      }
    }
  }

  return Array.from(matched);
}

// ── Step 3: Score ────────────────────────────────────────────────────────────

interface ScoreOutput {
  score: number;
  matchedTerms: string[];
}

/**
 * Scoring rules:
 *   +2  per resource tag found in the normalized input
 *   +3  if the resource's category aligns with a detected keyword category
 *   +1  per meaningful word from description or best_for found in input (max 3)
 *
 * A Set tracks already-counted terms to prevent double-scoring.
 * Returns both the numeric score and the list of matched terms.
 */
function scoreResource(
  resource: Resource,
  normalized: string,
  matchedCategories: string[]
): ScoreOutput {
  let score = 0;
  const seen = new Set<string>();
  const matchedTerms: string[] = [];

  // Rule 1: tag hits
  for (const tag of resource.tags) {
    const t = tag.toLowerCase();
    if (normalized.includes(t) && !seen.has(t)) {
      score += 2;
      seen.add(t);
      matchedTerms.push(tag);
    }
  }

  // Rule 2: category alignment — awarded once per resource
  const resourceCats = categoryToResourceCategories[resource.category] ?? [];
  for (const cat of matchedCategories) {
    if (cat === resource.category || resourceCats.includes(cat as ResourceCategory)) {
      score += 3;
      break;
    }
  }

  // Rule 3: description / best_for overlap (max +3)
  const extraText = [resource.description, resource.best_for].join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4); // skip short filler words

  let overlapPoints = 0;
  for (const word of extraText) {
    if (overlapPoints >= 3) break;
    if (normalized.includes(word) && !seen.has(word)) {
      score += 1;
      overlapPoints++;
      seen.add(word);
      matchedTerms.push(word);
    }
  }

  return { score, matchedTerms };
}

// ── Step 4: Format ───────────────────────────────────────────────────────────

/**
 * Builds a warm, plain-language match reason using the resource's own
 * best_for text — already written in calm, student-friendly language.
 * Falls back to a generic message when no tags matched directly.
 */
function buildMatchReason(resource: Resource, normalized: string): string {
  const hasTagMatch = resource.tags.some((tag) =>
    normalized.includes(tag.toLowerCase())
  );

  return hasTagMatch
    ? resource.best_for
    : "This might be a helpful place to start given what you're going through.";
}

// ── Step 5: Sort ─────────────────────────────────────────────────────────────

/**
 * Primary sort: score descending (higher is better).
 * Tiebreaker: resource name ascending (alphabetical, stable across runs).
 */
function sortResults(a: MatchedResource, b: MatchedResource): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.name.localeCompare(b.name);
}

// ── Fallback ─────────────────────────────────────────────────────────────────

/**
 * Returns the three default fallback resources with a generic match reason.
 * Triggered when input is empty or no resource scores above zero.
 * IDs are sourced from expectedResults.ts — not hardcoded here.
 */
export function getFallbackResources(): MatchedResource[] {
  return FALLBACK_RESOURCE_IDS.reduce<MatchedResource[]>((acc, id) => {
    const resource = resources.find((r) => r.id === id);
    if (resource) {
      acc.push({ ...resource, score: 0, matchedTerms: [], matchReason: FALLBACK_REASON });
    }
    return acc;
  }, []);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Takes a plain-text student problem description and returns the top 3
 * matching campus resources, sorted by relevance score.
 *
 * Returns fallback resources when input is empty or nothing scores above zero.
 *
 * @param userInput - The student's free-text problem description
 * @returns Array of up to 3 MatchedResource objects
 */
export function findResources(userInput: string): MatchedResource[] {
  if (!userInput || userInput.trim().length === 0) {
    return getFallbackResources();
  }

  const normalized = normalizeText(userInput);
  const matchedCategories = detectCategories(normalized);

  const scored = resources
    .map((resource) => {
      const { score, matchedTerms } = scoreResource(resource, normalized, matchedCategories);
      return {
        ...resource,
        score,
        matchedTerms,
        matchReason: buildMatchReason(resource, normalized),
      };
    })
    .filter((r) => r.score > 0)
    .sort(sortResults)
    .slice(0, TOP_N);

  return scored.length > 0 ? scored : getFallbackResources();
}
