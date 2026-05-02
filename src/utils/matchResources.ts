/**
 * matchResources.ts
 *
 * Public entry point for the recommendation engine.
 * Orchestrates: normalize → detect categories → score → format → sort → slice.
 */

import resources from "../data/resources.json";
import { normalizeText } from "./normalizeText";
import { extractMatchedCategories } from "./extractMatchedCategories";
import { scoreResource } from "./scoreResource";
import { formatMatchedResult } from "./formatMatchedResult";
import type { Resource, MatchedResult } from "./types";

/**
 * Returns the top N campus resources most relevant to the student's input.
 *
 * @param userInput - Free-text problem description from the student
 * @param topN      - Maximum number of results to return (default 3)
 * @returns Array of MatchedResult objects sorted by score descending
 */
export function matchResources(userInput: string, topN: number = 3): MatchedResult[] {
  if (!userInput || userInput.trim() === "") return [];

  const normalized = normalizeText(userInput);
  const matchedCategories = extractMatchedCategories(normalized);

  return (resources as Resource[])
    .map((resource) => {
      const score = scoreResource(resource, normalized, matchedCategories);
      return formatMatchedResult(resource, score, normalized);
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
