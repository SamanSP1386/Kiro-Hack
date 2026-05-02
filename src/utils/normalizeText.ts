/**
 * normalizeText.ts
 *
 * Converts raw user input into a clean, consistent string that all
 * other utils can safely run substring/includes checks against.
 *
 * Pipeline:
 *   1. Lowercase
 *   2. Remove punctuation (keeps letters, digits, and spaces)
 *   3. Collapse multiple spaces into one
 *   4. Trim leading/trailing whitespace
 */

/**
 * @param text - Raw user input
 * @returns Normalized string ready for keyword matching
 */
export function normalizeText(text: string): string {
  if (typeof text !== "string") return "";

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ")        // collapse multiple spaces
    .trim();
}
