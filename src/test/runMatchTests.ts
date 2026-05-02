/**
 * Quick manual test — run with:
 *   npx tsx src/test/runMatchTests.ts
 *
 * No test framework needed. Just logs match results to the terminal
 * so Dev A can verify quality against expectedResults.ts.
 */

import { findResources } from "../utils/matcher";
import { expectedMatchTests } from "../data/expectedResults";

console.log("=".repeat(60));
console.log("MATCH QUALITY TEST");
console.log("=".repeat(60));

for (const test of expectedMatchTests) {
  const results = findResources(test.prompt);

  console.log(`\nPROMPT: "${test.prompt}"`);
  console.log(`EXPECTED: ${test.expectedTopResults.join(" → ")}`);
  console.log("GOT:");

  if (results.length === 0) {
    console.log("  ⚠️  No results returned");
  } else {
    results.forEach((r, i) => {
      const expected = test.expectedTopResults[i];
      const match = expected && r.name === expected ? "✅" : "❌";
      console.log(`  ${i + 1}. ${match} ${r.name} (score: ${r.score})`);
      console.log(`     reason: ${r.matchReason}`);
    });
  }

  console.log("-".repeat(60));
}
