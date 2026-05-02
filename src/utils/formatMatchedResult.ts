/**
 * formatMatchedResult.ts
 *
 * Combines a raw resource object with the ScoreResult from scoreResource()
 * to produce a MatchedResource ready for the UI.
 *
 * Does not generate its own matchReason — scoreResource already provides it.
 */

import type { Resource, MatchedResource } from "../types/resource";
import type { ScoreResult } from "./scoreResource";

/**
 * @param resource    - A resource entry from resources.json
 * @param scoreResult - The full ScoreResult returned by scoreResource()
 * @returns MatchedResource with all resource fields + score + matchedTerms + matchReason
 */
export function formatMatchedResult(
  resource: Resource,
  scoreResult: ScoreResult
): MatchedResource {
  return {
    ...resource,
    score: scoreResult.score,
    matchedTerms: scoreResult.matchedTerms,
    matchReason: scoreResult.matchReason,
  };
}
