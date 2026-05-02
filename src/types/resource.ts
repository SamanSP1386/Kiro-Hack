export type ResourceCategory =
  | "food"
  | "basic-needs"
  | "financial"
  | "mental-health"
  | "academic"
  | "technology"
  | "housing"
  | "accessibility"
  | "career";

export type UrgencyLevel = "low" | "medium" | "high";

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  tags: string[];
  description: string;
  best_for: string;
  urgency: UrgencyLevel;
  what_to_do_first: string;
  what_to_prepare: string[];
  appointment_required: boolean;
  contact_method: string;
  hours: string;
  location: string;
  link: string;
  backup_options: string[];
}

export interface MatchedResource extends Resource {
  score: number;
  matchedTerms: string[];
  matchReason: string;
}
