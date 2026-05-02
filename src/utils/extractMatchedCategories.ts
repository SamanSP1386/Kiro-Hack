/**
 * extractMatchedCategories.ts
 *
 * Detects which problem categories are present in a user query by checking
 * every keyword in keywordMap against the normalized input string.
 */

import { normalizeText } from "./normalizeText";
import keywordMap from "../data/keywordMap.json";

/**
 * Takes a raw user query, normalizes it, then scans each category's keyword
 * list for a match. Returns every category that had at least one hit.
 * Duplicates are prevented naturally because each category is only added once.
 *
 * @param query - Raw user input string
 * @returns Array of matched category names, e.g. ["food", "financial"]
 */
export function extractMatchedCategories(query: string): string[] {
  // Step 1: normalize the raw input so it matches the keyword format
  const normalized = normalizeText(query);

  // Step 2: collect matched categories — a Set prevents duplicates
  const matched: string[] = [];

  // Step 3: loop over every category and its keyword list
  for (const [category, keywords] of Object.entries(
    keywordMap as Record<string, string[]>
  )) {
    // Step 4: check if any keyword appears in the normalized input
    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        // Step 5: add the category once and move on to the next category
        matched.push(category);
        break;
      }
    }
  }

  // Step 6: return the array of matched category names
  return matched;
}
