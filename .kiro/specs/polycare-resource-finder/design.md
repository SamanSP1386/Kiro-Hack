# Design — PolyCare Resource Finder

## Architecture Overview

PolyCare is a single-page React application with no backend. All matching logic runs client-side using a local typed dataset and a keyword scoring algorithm. OpenAI API calls are made directly from the client as an optional enhancement layer.

```
User Input
    │
    ▼
findResources(userInput)        ← src/utils/matcher.ts
    │
    ├── detectCategories()      ← keywordMap.json
    ├── scoreResource()         ← tag matching + category alignment + urgency boost
    └── getFallbackResources()  ← if score === 0 for all resources
    │
    ▼
MatchedResource[]
    │
    ├── (optional) OpenAI API   ← rewrite matchReason only
    │
    ▼
ResultsList → ResourceCard × 3
```

---

## Component Tree

```
App
└── HomePage
    ├── Header
    ├── SearchForm
    │   ├── <textarea> or <input>
    │   └── <button> Find Support
    ├── ResultsList
    │   └── ResourceCard (× up to 3)
    │       ├── UrgencyBadge
    │       ├── CategoryBadge
    │       └── PrepList
    └── Footer (optional)
```

---

## Component Specs

### `Header`
- App name: **PolyCare**
- Subtitle: "Describe what you're going through. We'll find the right support."
- No navigation links needed for MVP

### `SearchForm`
Props: `onSubmit: (input: string) => void`, `isLoading: boolean`
- Single text input (textarea preferred for multi-line)
- Submit button labeled "Find Support"
- Button shows loading state while matching/AI call is in progress
- Clears or retains input after submit (either acceptable)

### `ResultsList`
Props: `results: MatchedResource[]`, `isFallback: boolean`
- Renders up to 3 `ResourceCard` components
- If `isFallback` is true, shows a soft header: "Here are some good places to start"
- If `isFallback` is false, shows: "Here's what we found for you"

### `ResourceCard`
Props: `resource: MatchedResource`, `rank: number`
- Displays all fields from `MatchedResource`
- `rank` used to visually distinguish the top result (e.g. slightly larger or accented)
- Shows urgency badge (high = warm color, medium = neutral)
- Shows appointment_required as a simple label: "Appointment needed" or "Drop-in welcome"

### `UrgencyBadge`
Props: `urgency: "high" | "medium" | "low"`
- High: amber/orange tone
- Medium: slate/neutral tone
- Low: not shown (no low-urgency resources in current dataset)

### `CategoryBadge`
Props: `category: ResourceCategory`
- Displays a readable label for the category (e.g. "Mental Health", "Academic", "Food")
- Soft background color per category

---

## Data Flow

1. User types input and clicks "Find Support"
2. `SearchForm` calls `onSubmit(inputText)`
3. `App` (or `HomePage`) calls `findResources(inputText)`
4. If results array is empty or all scores are 0 → call `getFallbackResources()`
5. (Optional) For each result, call OpenAI API to rewrite `matchReason`
6. Pass `MatchedResource[]` and `isFallback: boolean` to `ResultsList`
7. `ResultsList` renders one `ResourceCard` per result

---

## Matching Algorithm

Defined in `src/utils/matcher.ts`. Scoring weights:

| Signal | Points |
|---|---|
| Direct tag match in user input | +2 per tag |
| Keyword category maps to resource category | +3 per category |
| Resource is high-urgency AND input contains urgent words | +2 |

Resources with score 0 are filtered out. Top 3 by score are returned.

If no resource scores above 0, `getFallbackResources()` returns the three default resources with score 0 and a generic match reason.

---

## OpenAI Integration

- Model: `gpt-3.5-turbo` (cheapest, fast enough)
- Called after local matching completes
- One API call per result card (max 3 calls per search)
- Prompt pattern:
  ```
  A student said: "{userInput}"
  This resource matched: "{resource.name}"
  Local match reason: "{matchReason}"
  
  Rewrite the match reason in 1-2 warm, plain sentences a stressed student would find reassuring.
  ```
- If the call fails, the original `matchReason` string is used — no error shown to user
- API key stored in `.env` as `VITE_OPENAI_API_KEY`

---

## Styling Notes

- Tailwind CSS utility classes only
- Color palette: calm, not clinical — soft blues, greens, warm neutrals
- No harsh reds except for crisis-related urgency indicators
- Mobile-first layout — single column on small screens, max-width container on desktop
- Font: system font stack is fine for MVP

---

## File Locations

| File | Purpose |
|---|---|
| `src/types/resource.ts` | Shared types — Resource, MatchedResource, ResourceCategory |
| `src/data/resources.ts` | Typed resource dataset (12 entries) |
| `src/data/keywordMap.json` | Keyword → category mapping |
| `src/data/expectedResults.ts` | Test prompts + fallback IDs |
| `src/utils/matcher.ts` | Core matching logic |
| `src/components/Header.tsx` | App header |
| `src/components/SearchForm.tsx` | Input + submit |
| `src/components/ResultsList.tsx` | Results container |
| `src/components/ResourceCard.tsx` | Individual result card |
| `src/components/UrgencyBadge.tsx` | Urgency indicator |
| `src/components/CategoryBadge.tsx` | Category label |
| `src/App.tsx` | Root component, state management |
