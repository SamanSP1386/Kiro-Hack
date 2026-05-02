/**
 * Expected top results for common student prompts.
 * Used by Dev A to verify match quality and by Dev B to tune scoring logic.
 *
 * Run each prompt through findResources() and check that the top results
 * match the expected order (or at least contain the right resources).
 */

export interface ExpectedMatchTest {
  prompt: string;
  expectedTopResults: string[]; // resource names in priority order
}

export const expectedMatchTests: ExpectedMatchTest[] = [
  {
    prompt: "I don't have money for groceries this week.",
    expectedTopResults: [
      "Campus Food Pantry",
      "Basic Needs Office",
      "Emergency Grant Program",
    ],
  },
  {
    prompt: "My laptop broke and I have homework due tomorrow.",
    expectedTopResults: [
      "Laptop and Technology Loan Program",
      "IT Help Desk",
      "Basic Needs Office",
    ],
  },
  {
    prompt: "I'm overwhelmed and falling behind in class.",
    expectedTopResults: [
      "Counseling and Psychological Services",
      "Tutoring and Learning Center",
      "Academic Advising",
    ],
  },
  {
    prompt: "I might lose housing next month.",
    expectedTopResults: [
      "Student Housing Support Services",
      "Basic Needs Office",
      "Emergency Grant Program",
    ],
  },
  {
    prompt: "I need interview clothes for a career fair.",
    expectedTopResults: [
      "Career Closet and Professional Prep",
    ],
  },
  {
    prompt: "I think I need accommodations but I don't know where to start.",
    expectedTopResults: [
      "Disability Resource Center",
      "Academic Advising",
    ],
  },
  {
    prompt: "I don't know what to do anymore.", // vague — should hit fallbacks
    expectedTopResults: [
      "Basic Needs Office",
      "Academic Advising",
      "Counseling and Psychological Services",
    ],
  },
];

/**
 * The three fallback resource IDs used when no strong match is found.
 * These are the safest defaults across the widest range of student situations.
 */
export const FALLBACK_RESOURCE_IDS = [
  "basic-needs-office",
  "academic-advising",
  "counseling-services",
] as const;

export type FallbackResourceId = (typeof FALLBACK_RESOURCE_IDS)[number];
