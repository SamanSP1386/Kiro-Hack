/**
 * normalizeText.ts
 *
 * Converts raw user input into a consistent lowercase string that all
 * other utils can safely run substring/includes checks against.
 */

/**
 * @param text - Raw user input
 * @returns Trimmed, lowercased string
 */
export function normalizeText(text: string): string {
  if (typeof text !== "string") return "";
  return text.trim().toLowerCase();
}
