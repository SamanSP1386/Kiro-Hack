/**
 * keywordMap.ts
 *
 * Maps student problem categories to normalized-friendly keywords.
 * All keywords are lowercase and apostrophe-free so they match the output
 * of normalizeText() without any further transformation.
 *
 * Consumed by extractMatchedCategories.ts.
 * Edit keyword arrays here to tune matching — no other files need changing.
 */

export const keywordMap: Record<string, string[]> = {
  food: [
    "food", "hungry", "hunger", "groceries", "meal", "meals",
    "eat", "eating", "starving", "pantry", "snacks", "dining",
    "cant afford food", "no food", "skipping meals",
  ],

  financial: [
    "money", "rent", "bill", "bills", "financial", "expense", "expenses",
    "afford", "broke", "debt", "fees", "tuition", "payment", "cash",
    "fund", "funding", "cant pay", "no money", "lost income",
    "unexpected cost", "emergency funds",
  ],

  "mental-health": [
    "stress", "stressed", "anxiety", "anxious", "depressed", "depression",
    "overwhelmed", "panic", "burnout", "sad", "lonely", "mental health",
    "therapy", "counseling", "struggling", "hopeless", "exhausted",
    "crying", "upset", "cant cope", "falling apart", "breaking down",
    "suicidal", "crisis", "unsafe", "desperate", "hurt myself",
    "cant go on", "end it",
  ],

  academic: [
    "failing", "fail", "class", "classes", "exam", "exams", "study",
    "studying", "homework", "assignment", "grade", "grades", "behind",
    "tutoring", "tutor", "learning", "professor", "course", "courses",
    "gpa", "test", "advising", "advisor", "schedule", "registration",
    "major", "graduation", "withdraw", "withdrawal", "drop", "dropping",
    "requirements", "credits", "academic probation", "falling behind",
  ],

  technology: [
    "laptop", "computer", "device", "wifi", "internet", "software",
    "login", "password", "portal", "canvas", "email", "tech", "technology",
    "broken laptop", "no computer", "cant log in", "cant access",
    "access problem", "hardware", "borrow laptop",
  ],

  housing: [
    "housing", "homeless", "homelessness", "rent", "roommate", "eviction",
    "evicted", "shelter", "apartment", "dorm", "living situation",
    "kicked out", "move out", "nowhere to stay", "unsafe housing",
    "temporary housing", "losing housing",
  ],

  accessibility: [
    "disability", "disabled", "accommodation", "accommodations", "adhd",
    "dyslexia", "accessibility", "extended time", "note taker", "mobility",
    "hearing", "vision", "impairment", "learning disability",
    "testing accommodations", "need accommodations",
  ],

  career: [
    "interview", "job", "internship", "career", "resume", "networking",
    "professional", "attire", "clothes", "career fair", "hire", "hiring",
    "job search", "work experience", "cover letter", "linkedin",
  ],
};

/**
 * Maps a detected keyword category to the resource categories it should
 * surface in results. One keyword category can map to multiple resource
 * categories to broaden relevant matches.
 */
export const categoryToResourceCategories: Record<string, string[]> = {
  food:            ["food", "basic-needs"],
  financial:       ["financial", "basic-needs"],
  "mental-health": ["mental-health"],
  academic:        ["academic"],
  technology:      ["technology"],
  housing:         ["housing", "basic-needs"],
  accessibility:   ["accessibility"],
  career:          ["career"],
};
