/**
 * formatMatchedResult.js
 *
 * Takes a resource object + its score and returns a MatchedResult — the shape
 * the UI expects, with a human-readable matchReason appended.
 */

/**
 * Builds a short explanation of why this resource was returned.
 *
 * @param {object} resource        - A resource entry from resources.json
 * @param {string} normalizedInput - Output of normalizeText()
 * @returns {string}
 */
function buildMatchReason(resource, normalizedInput) {
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
 * @param {object} resource        - A resource entry from resources.json
 * @param {number} score           - Score from scoreResource()
 * @param {string} normalizedInput - Output of normalizeText()
 * @returns {object} MatchedResult with all resource fields + score + matchReason
 */
export function formatMatchedResult(resource, score, normalizedInput) {
  return {
    ...resource,
    score,
    matchReason: buildMatchReason(resource, normalizedInput),
  };
}
