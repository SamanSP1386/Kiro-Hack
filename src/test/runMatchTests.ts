/**
 * Deterministic backend verification script.
 *
 * Run with:
 *   npx tsx src/test/runMatchTests.ts
 *
 * Exits with code 0 if every prompt passes.
 * Exits with code 1 if any prompt fails.
 *
 * Assertion rule:
 *   expectedTopResults is treated as an ordered expected prefix.
 *   - actual results must contain at least expectedTopResults.length items
 *   - actual names are compared in order against expectedTopResults
 *   - extra actual results beyond the expected list are ignored
 */

import { findResources } from "../utils/matcher";
import { expectedMatchTests } from "../data/expectedResults";

// Minimal local declaration so process.exitCode type-checks without @types/node.
declare const process: { exitCode: number };

// ── Run tests ────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

console.log("=".repeat(60));
console.log("BACKEND MATCH VERIFICATION");
console.log("=".repeat(60));

for (const test of expectedMatchTests) {
  const actual = findResources(test.prompt);
  const expected = test.expectedTopResults;

  // Slice actual down to the length we need to compare
  const actualSlice = actual.slice(0, expected.length).map((r) => r.name);

  // Pass only if every position matches exactly
  const pass =
    actualSlice.length === expected.length &&
    expected.every((name, i) => actualSlice[i] === name);

  if (pass) {
    passed++;
    console.log(`\nPASS: "${test.prompt}"`);
  } else {
    failed++;
    console.log(`\nFAIL: "${test.prompt}"`);
    console.log(`  Expected : ${expected.join(" | ")}`);
    console.log(`  Actual   : ${actualSlice.length > 0 ? actualSlice.join(" | ") : "(no results)"}`);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log("\n" + "=".repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60));

if (failed > 0) {
  process.exitCode = 1;
}
