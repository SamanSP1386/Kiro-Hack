/**
 * scoreResource.ts
 *
 * Scores a single resource object against the normalized user input and the
 * list of matched categories produced by extractMatchedCategories().
 *
 * Scoring weights:
 *   +2  per direct tag match found in the input
 *   +3  per matched keyword category that maps to this resource's category
 *   +2  urgency boost when input sounds urgent AND resource.urgency === "high"
 */

import { categoryToResourceCategories } from "./keywordMap";
import type { Resource } from "./types";

/** Words that signal the student needs help right now. */
const URGENT_WORDS: string[] = [
  "urgent", "emergency", "now", "today", "immediately", "asap",
  "crisis", "desperate", "can't", "cannot",
];

/**
 * @param resource          - A resource entry from resources.json
 * @param normalizedInput   - Output of normalizeText()
 * @param matchedCategories - Output of extractMatchedCategories()
 * @returns Relevance score (0 = no match)
 */
export function scoreResource(
  resource: Resource,
  normalizedInput: string,
  matchedCategories: string[]
): number {
  let score = 0;

  // Direct tag hits
  for (const tag of resource.tags ?? []) {
    if (normalizedInput.includes(tag.toLowerCase())) {
      score += 2;
    }
  }

  // Category alignment
  for (const cat of matchedCategories) {
    const resourceCats = categoryToResourceCategories[cat] ?? [];
    if (resourceCats.includes(resource.category)) {
      score += 3;
    }
  }

  // Urgency boost
  const isUrgent = URGENT_WORDS.some((w) => normalizedInput.includes(w));
  if (resource.urgency === "high" && isUrgent) {
    score += 2;
  }

  return score;
}
