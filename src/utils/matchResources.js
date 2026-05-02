/**
 * matchResources.js
 *
 * Public entry point for the recommendation engine.
 * Orchestrates: normalize → detect categories → score → format → sort → slice.
 */

import resources from "../data/resources.json";
import { normalizeText } from "./normalizeText.js";
import { extractMatchedCategories } from "./extractMatchedCategories.js";
import { scoreResource } from "./scoreResource.js";
import { formatMatchedResult } from "./formatMatchedResult.js";

/**
 * Returns the top N campus resources most relevant to the student's input.
 *
 * @param {string} userInput - Free-text problem description from the student
 * @param {number} [topN=3]  - Maximum number of results to return
 * @returns {object[]} Array of MatchedResult objects sorted by score descending
 */
export function matchResources(userInput, topN = 3) {
  if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
    return [];
  }

  const normalized = normalizeText(userInput);
  const matchedCategories = extractMatchedCategories(normalized);

  return resources
    .map((resource) => {
      const score = scoreResource(resource, normalized, matchedCategories);
      return formatMatchedResult(resource, score, normalized);
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
