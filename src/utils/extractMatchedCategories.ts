/**
 * extractMatchedCategories.ts
 *
 * Detects which problem categories are present in the normalized user input
 * by scanning every keyword in keywordMap against the input string.
 */

import { keywordMap } from "./keywordMap";

/**
 * @param normalizedInput - Output of normalizeText()
 * @returns Array of matched category keys, e.g. ["food", "financial"]
 */
export function extractMatchedCategories(normalizedInput: string): string[] {
  const matched = new Set<string>();

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
