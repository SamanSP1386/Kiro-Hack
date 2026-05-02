/**
 * scoreResource.ts
 *
 * Scores a single resource object against the normalized user input and the
 * list of matched categories produced by extractMatchedCategories().
 *
 * Scoring rules:
 *   +2  per resource tag found in the query
 *   +3  if the resource's category is in matchedCategories
 *   +1  per word from description or best_for found in the query (max 3 pts)
 */

import { categoryToResourceCategories } from "./keywordMap";
import type { Resource } from "./types";

/** Shape returned by scoreResource. */
export interface ScoreResult {
  score: number;
  matchedTerms: string[];
  matchReason: string;
}

/**
 * Builds a human-readable reason string from the matched terms.
 * e.g. ["groceries", "money"] → "Matched because you mentioned groceries and money."
 */
function buildMatchReason(matchedTerms: string[]): string {
  if (matchedTerms.length === 0) {
    return "This resource may help based on your situation.";
  }
  if (matchedTerms.length === 1) {
    return `Matched because you mentioned ${matchedTerms[0]}.`;
  }
  const allButLast = matchedTerms.slice(0, -1).join(", ");
  const last = matchedTerms[matchedTerms.length - 1];
  return `Matched because you mentioned ${allButLast} and ${last}.`;
}

/**
 * @param resource          - A resource entry from resources.json
 * @param normalizedQuery   - Output of normalizeText()
 * @param matchedCategories - Output of extractMatchedCategories()
 * @returns ScoreResult with score, matchedTerms, and matchReason
 */
export function scoreResource(
  resource: Resource,
  normalizedQuery: string,
  matchedCategories: string[]
): ScoreResult {
  let score = 0;
  const seen = new Set<string>();
  const matchedTerms: string[] = [];

  // Rule 1: +2 per resource tag found in the query
  for (const tag of resource.tags ?? []) {
    const normalizedTag = tag.toLowerCase();
    if (normalizedQuery.includes(normalizedTag) && !seen.has(normalizedTag)) {
      score += 2;
      seen.add(normalizedTag);
      matchedTerms.push(tag);
    }
  }

  // Rule 2: +3 if the resource's category is in matchedCategories
  const resourceCats = categoryToResourceCategories[resource.category] ?? [];
  for (const cat of matchedCategories) {
    if (cat === resource.category || resourceCats.includes(cat)) {
      score += 3;
      break; // only award this bonus once per resource
    }
  }

  // Rule 3: +1 per word from description or best_for found in the query (max 3)
  const extraFields = [resource.description ?? "", resource.best_for ?? ""].join(" ");
  const extraWords = extraFields
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4);

  let overlapPoints = 0;
  for (const word of extraWords) {
    if (overlapPoints >= 3) break;
    if (normalizedQuery.includes(word) && !seen.has(word)) {
      score += 1;
      overlapPoints += 1;
      seen.add(word);
      matchedTerms.push(word);
    }
  }

  return {
    score,
    matchedTerms,
    matchReason: buildMatchReason(matchedTerms),
  };
}
