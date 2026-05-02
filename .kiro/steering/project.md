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
- **AI layer**: OpenAI API (used to generate friendly match explanations, optional enhancement on top of local matching)
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
│   └── matcher.ts          # findResources() and getFallbackResources()
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

- Core matching is always local (keyword + tag scoring) — the app must work without the OpenAI API
- OpenAI is used only to rewrite match reasons into friendlier language
- Fallback resources (Basic Needs Office, Academic Advising, Counseling Services) are shown when no resource scores above zero
- Fallback IDs are defined in `src/data/expectedResults.ts` — do not hardcode them elsewhere

## What to Avoid

- No login or authentication
- No database
- No scraping of live campus websites
- No map integration
- No file uploads
- No more than 12 resources in the dataset
- No more than 3 results shown per query
