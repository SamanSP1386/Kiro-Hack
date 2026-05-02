/**
 * extractMatchedCategories.js
 *
 * Detects which problem categories are present in the normalized user input
 * by scanning every keyword in keywordMap against the input string.
 */

import { keywordMap } from "./keywordMap.js";

/**
 * @param {string} normalizedInput - Output of normalizeText()
 * @returns {string[]} Array of matched category keys, e.g. ["food", "financial"]
 */
export function extractMatchedCategories(normalizedInput) {
  const matched = new Set();

  for (const [category, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (normalizedInput.includes(keyword.toLowerCase())) {
        matched.add(category);
        break; // one hit per category is enough
      }
    }
  }

  return Array.from(matched);
}
