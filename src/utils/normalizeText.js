/**
 * normalizeText.js
 *
 * Converts raw user input into a consistent lowercase string that all
 * other utils can safely run substring/includes checks against.
 */

/**
 * @param {string} text - Raw user input
 * @returns {string} Trimmed, lowercased string
 */
export function normalizeText(text) {
  if (typeof text !== "string") return "";
  return text.trim().toLowerCase();
}
