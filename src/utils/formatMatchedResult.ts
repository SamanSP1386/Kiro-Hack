/**
 * formatMatchedResult.ts
 *
 * Takes a resource object + its score and returns a MatchedResult — the shape
 * the UI expects, with a human-readable matchReason appended.
 */

import type { Resource, MatchedResult } from "./types";

/**
 * Builds a short explanation of why this resource was returned.
 */
function buildMatchReason(resource: Resource, normalizedInput: string): string {
  const matchedTags = (resource.tags ?? []).filter((tag) =>
    normalizedInput.includes(tag.toLowerCase())
  );

  if (matchedTags.length > 0) {
    const preview = matchedTags.slice(0, 3).join(", ");
    return `Matched because you mentioned: ${preview}.`;
  }

  return "This resource may help based on your situation.";
}

/**
 * @param resource        - A resource entry from resources.json
 * @param score           - Score from scoreResource()
 * @param normalizedInput - Output of normalizeText()
 * @returns MatchedResult with all resource fields + score + matchReason
 */
export function formatMatchedResult(
  resource: Resource,
  score: number,
  normalizedInput: string
): MatchedResult {
  return {
    ...resource,
    score,
    matchReason: buildMatchReason(resource, normalizedInput),
  };
}
