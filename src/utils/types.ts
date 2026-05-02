/**
 * types.ts
 *
 * Shared TypeScript interfaces for the resource matcher.
 * All backend utils import from here — do not redefine these elsewhere.
 */

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

export interface MatchedResult extends Resource {
  score: number;
  matchedTerms: string[];
  matchReason: string;
}
