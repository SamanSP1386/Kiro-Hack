# PolyCare — Project Steering

## What This App Does

PolyCare is a student support finder for Cal Poly. Students describe a problem they are experiencing related to college or campus life, and the app returns the top three matching campus resources. Each result includes a description of the resource, why it matched, and what the student should do first.

## Target Users

Cal Poly students who are struggling and don't know where to go for help. The app is designed to feel calm, approachable, and fast — not bureaucratic.

## Tech Stack

- **Frontend**: React + TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS
- **Data**: Local typed resource dataset (`src/data/resources.ts`)
- **Matching**: Local keyword/tag scoring logic (`src/utils/matcher.ts`)
- **AI layer**: Groq API with `llama-3.3-70b-versatile` (free tier, 14,400 req/day — used as primary matcher, keyword matcher is silent fallback)
- **Deploy**: Vercel or Netlify

## Project Structure

```
src/
├── types/
│   └── resource.ts         # Shared Resource and MatchedResource types
├── data/
│   ├── resources.ts        # 12 typed Cal Poly campus resources
│   ├── keywordMap.json     # Plain-language words mapped to categories
│   └── expectedResults.ts  # Test prompts and expected match outputs
├── utils/
│   ├── matcher.ts          # findResources() and getFallbackResources() — keyword scoring
│   ├── aiMatcher.ts        # findResourcesWithAI() — Groq API primary matcher
│   ├── normalizeText.ts    # Input normalization
│   ├── extractMatchedCategories.ts
│   ├── scoreResource.ts
│   ├── formatMatchedResult.ts
│   └── keywordMap.ts
├── components/             # React UI components (to be built)
└── App.tsx                 # Root component
```

## Coding Standards

- All files are TypeScript — no plain `.js` files in `src/`
- Use the `Resource` and `MatchedResource` types from `src/types/resource.ts` — do not redefine them elsewhere
- Resource categories must come from the `ResourceCategory` union type — no freeform strings
- Keep components small and focused — one responsibility per file
- Tailwind only for styling — no inline styles, no separate CSS files unless absolutely necessary
- All user-facing text should be calm, supportive, and plain — avoid bureaucratic or clinical language

## Matching Logic Rules

- AI matching (Groq) runs first — sends student input + resource catalogue to `llama-3.3-70b-versatile`
- If AI returns empty matches (non-campus input) or fails, keyword matcher runs as silent fallback
- Core keyword matching is always local — the app works without any API key
- Groq API key stored in `.env` as `VITE_GROQ_API_KEY` — never commit this file
- Fallback resources (Basic Needs Office, Academic Advising, Counseling Services) shown when nothing scores above zero
- Fallback IDs are defined in `src/data/expectedResults.ts` — do not hardcode them elsewhere
- Non-campus input (jokes, nonsense) returns an empty state message, not forced fallback results

## What to Avoid

- No login or authentication
- No database
- No scraping of live campus websites
- No map integration
- No file uploads
- No more than 12 resources in the dataset
- No more than 3 results shown per query
