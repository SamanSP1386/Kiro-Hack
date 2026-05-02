import resources from "../data/resources.json";
import keywordMap from "../data/keywordMap.json";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  best_for: string;
  urgency: "high" | "medium" | "low";
  what_to_do_first: string;
  what_to_prepare: string[];
  appointment_required: boolean;
  contact_method: string;
  hours: string;
  location: string;
  backup_options: string[];
}

export interface MatchedResource extends Resource {
  score: number;
  matchReason: string;
}

// ── Category mapping ─────────────────────────────────────────────────────────

/**
 * Maps keyword categories (from keywordMap.json) to resource category IDs
 * (from resources.json). One keyword category can map to multiple resource
 * categories so that e.g. "financial" also surfaces "basic-needs" resources.
 */
const categoryToResourceCategories: Record<string, string[]> = {
  food: ["food", "basic-needs"],
  financial: ["financial", "basic-needs"],
  "mental-health": ["mental-health"],
  crisis: ["mental-health"],
  academic: ["academic"],
  advising: ["academic"],
  technology: ["technology"],
  housing: ["housing", "basic-needs"],
  accessibility: ["accessibility"],
  career: ["career"],
  "basic-needs": ["basic-needs", "food", "financial", "housing"],
};

const URGENT_WORDS = [
  "urgent",
  "emergency",
  "now",
  "today",
  "immediately",
  "asap",
  "crisis",
  "desperate",
  "can't",
  "cannot",
];

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Detects which keyword categories are present in the user's input by checking
 * every keyword in keywordMap.json against the lowercased input string.
 */
function detectCategories(inputLower: string): string[] {
  const matched = new Set<string>();

  for (const [category, keywords] of Object.entries(
    keywordMap as Record<string, string[]>
  )) {
    for (const keyword of keywords) {
      if (inputLower.includes(keyword.toLowerCase())) {
        matched.add(category);
        break;
      }
    }
  }

  return Array.from(matched);
}

/**
 * Scores a single resource against the user's input.
 *
 * Scoring weights:
 *  +2 per direct tag match in raw input
 *  +3 per matched keyword category that maps to this resource's category
 *  +2 urgency boost when input sounds urgent and resource is high-urgency
 */
function scoreResource(
  resource: Resource,
  inputLower: string,
  matchedCategories: string[]
): number {
  let score = 0;

  // Direct tag hits
  for (const tag of resource.tags) {
    if (inputLower.includes(tag.toLowerCase())) {
      score += 2;
    }
  }

  // Category alignment
  for (const cat of matchedCategories) {
    const resourceCats = categoryToResourceCategories[cat] ?? [];
    if (resourceCats.includes(resource.category)) {
      score += 3;
    }
  }

  // Urgency boost
  const isUrgentInput = URGENT_WORDS.some((w) => inputLower.includes(w));
  if (resource.urgency === "high" && isUrgentInput) {
    score += 2;
  }

  return score;
}

/**
 * Builds a short human-readable reason why a resource matched, used on result
 * cards. Falls back to a generic message when no tags matched directly.
 */
function buildMatchReason(resource: Resource, userInput: string): string {
  const inputLower = userInput.toLowerCase();

  const matchedTags = resource.tags.filter((tag) =>
    inputLower.includes(tag.toLowerCase())
  );

  if (matchedTags.length > 0) {
    const preview = matchedTags.slice(0, 3).join(", ");
    return `Matched because you mentioned: ${preview}.`;
  }

  return "This resource may help based on your situation.";
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Takes a plain-text student problem description and returns the top N
 * matching campus resources, sorted by relevance score (highest first).
 *
 * @param userInput - The student's free-text problem description
 * @param topN      - Maximum number of results to return (default 3)
 */
export function findResources(
  userInput: string,
  topN: number = 3
): MatchedResource[] {
  if (!userInput || userInput.trim().length === 0) return [];

  const inputLower = userInput.toLowerCase();
  const matchedCategories = detectCategories(inputLower);

  return (resources as Resource[])
    .map((resource) => ({
      ...resource,
      score: scoreResource(resource, inputLower, matchedCategories),
      matchReason: buildMatchReason(resource, userInput),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
