/**
 * validateResources.ts
 *
 * Backend integrity checks for the PolyCare resource dataset.
 * Run with: npx tsx src/test/validateResources.ts
 *
 * Checks:
 *   1. All resource IDs are unique
 *   2. All category values are valid ResourceCategory members
 *   3. All urgency values are valid UrgencyLevel members
 *   4. No resource has an empty tags array
 *   5. All three fallback IDs exist in the resource dataset
 */

import { resources } from "../data/resources";
import { FALLBACK_RESOURCE_IDS } from "../data/expectedResults";
import type { ResourceCategory, UrgencyLevel } from "../types/resource";

// Minimal local declaration so process.exitCode type-checks without @types/node.
declare const process: { exitCode: number };

// ── Valid value sets (mirrors types/resource.ts) ─────────────────────────────

const VALID_CATEGORIES = new Set<ResourceCategory>([
  "food",
  "basic-needs",
  "financial",
  "mental-health",
  "academic",
  "technology",
  "housing",
  "accessibility",
  "career",
]);

const VALID_URGENCY = new Set<UrgencyLevel>(["low", "medium", "high"]);

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

// ── Run checks ────────────────────────────────────────────────────────────────

console.log("=".repeat(60));
console.log("RESOURCE DATASET VALIDATION");
console.log("=".repeat(60));

// 1. Unique IDs
console.log("\n1. Unique resource IDs");
const ids = resources.map((r) => r.id);
const idSet = new Set(ids);
check(
  `All ${ids.length} IDs are unique`,
  idSet.size === ids.length,
  idSet.size < ids.length
    ? `Duplicates: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(", ")}`
    : undefined
);

// 2. Valid categories
console.log("\n2. Valid category values");
for (const r of resources) {
  check(
    `${r.id} — category "${r.category}"`,
    VALID_CATEGORIES.has(r.category as ResourceCategory),
    `"${r.category}" is not a valid ResourceCategory`
  );
}

// 3. Valid urgency values
console.log("\n3. Valid urgency values");
for (const r of resources) {
  check(
    `${r.id} — urgency "${r.urgency}"`,
    VALID_URGENCY.has(r.urgency as UrgencyLevel),
    `"${r.urgency}" is not a valid UrgencyLevel`
  );
}

// 4. Non-empty tags arrays
console.log("\n4. Non-empty tags arrays");
for (const r of resources) {
  check(
    `${r.id} — ${r.tags.length} tag(s)`,
    r.tags.length > 0,
    "tags array is empty"
  );
}

// 5. Fallback IDs exist in dataset
console.log("\n5. Fallback IDs present in dataset");
for (const id of FALLBACK_RESOURCE_IDS) {
  const exists = resources.some((r) => r.id === id);
  check(`Fallback "${id}" exists`, exists, "ID not found in resources array");
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log("\n" + "=".repeat(60));
console.log(`RESULT: ${passed} passed, ${failed} failed`);
console.log(failed === 0 ? "✅ PASS" : "❌ FAIL");
console.log("=".repeat(60));

if (failed > 0) process.exitCode = 1;
