# Tasks — PolyCare Resource Finder

## Implementation Plan

Tasks are ordered by dependency. Complete each phase before moving to the next.

---

## Phase 1 — Project Setup

- [x] 1.1 Scaffold the project with `npm create vite@latest . -- --template react-ts`
- [x] 1.2 Install dependencies: `npm install`
- [x] 1.3 Install Tailwind CSS and configure it (`tailwind.config.js`, `postcss.config.js`)
- [x] 1.4 Add `VITE_GROQ_API_KEY` to `.env` (and add `.env` to `.gitignore`)
- [x] 1.5 Verify the dev server runs with `npm run dev`

---

## Phase 2 — Data and Types (Dev A owns this)

- [x] 2.1 Confirm `src/types/resource.ts` exports `Resource`, `MatchedResource`, `ResourceCategory`, `UrgencyLevel`
- [x] 2.2 Confirm `src/data/resources.ts` exports a typed `Resource[]` array with 12 entries
- [x] 2.3 Confirm `src/data/keywordMap.json` covers all 9 categories
- [x] 2.4 Confirm `src/data/expectedResults.ts` exports `expectedMatchTests` and `FALLBACK_RESOURCE_IDS`
- [x] 2.5 Run `npx tsx src/test/runMatchTests.ts` and verify all 7 prompts return sensible results

---

## Phase 3 — Matching Logic (Dev B owns this)

- [x] 3.1 Confirm `findResources(userInput)` returns `MatchedResource[]` sorted by score
- [x] 3.2 Confirm `getFallbackResources()` returns the 3 fallback resources when input is empty or unmatched
- [x] 3.3 Manually test all 7 prompts from `expectedResults.ts` and share output with Dev A
- [x] 3.4 Fix any weak matches by updating tags in `resources.ts` (Dev A) or scoring weights in `matcher.ts` (Dev B)

---

## Phase 4 — Core UI Components (Dev B owns this)

- [x] 4.1 Create `src/components/Header.tsx` — app name and subtitle
- [x] 4.2 Create `src/components/SearchForm.tsx` — textarea input and submit button with loading state
- [x] 4.3 Create `src/components/UrgencyBadge.tsx` — color-coded urgency indicator
- [x] 4.4 Create `src/components/CategoryBadge.tsx` — readable category label
- [x] 4.5 Create `src/components/ResourceCard.tsx` — full result card using MatchedResource props
- [x] 4.6 Create `src/components/ResultsList.tsx` — renders up to 3 ResourceCards with fallback header

---

## Phase 5 — App Wiring (both devs)

- [x] 5.1 Update `src/App.tsx` to hold input state, results state, loading state, and isFallback flag
- [x] 5.2 Wire `SearchForm.onSubmit` → `findResources()` → set results state
- [x] 5.3 Pass results and isFallback to `ResultsList`
- [x] 5.4 Verify the full flow works end-to-end in the browser

---

## Phase 6 — AI Integration (Groq, replaces OpenAI plan)

- [x] 6.1 Create `src/utils/aiMatcher.ts` — calls Groq API with resource catalogue + student input
- [x] 6.2 AI runs as primary matcher; keyword matcher is silent fallback on failure
- [x] 6.3 Handle API errors, timeouts, and empty responses gracefully
- [x] 6.4 Non-campus input returns empty state message instead of forced fallback results
- [x] 6.5 Test with and without `VITE_GROQ_API_KEY` to confirm fallback works

---

## Phase 7 — Polish and Demo Prep

- [x] 7.1 Add sample prompts as clickable chips below the input
- [x] 7.2 Review all card copy for tone — calm, supportive, plain language
- [ ] 7.3 Test on mobile width (375px) and fix any layout issues
- [ ] 7.4 Check color contrast on urgency badges and category badges
- [x] 7.5 Write a short README with: what the app does, how to run it, and the tech stack

---

## Phase 8 — Submission Checklist

- [x] 8.1 Confirm `.kiro/` directory is committed and not in `.gitignore`
- [x] 8.2 Confirm repo is public with an OSI-approved license (MIT recommended)
- [ ] 8.3 Confirm the app runs from a fresh `npm install && npm run dev`
- [ ] 8.4 Record or prepare a short demo walkthrough
