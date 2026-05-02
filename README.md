# PolyCare — Cal Poly Student Support Finder

Students describe a problem in plain language and get matched to the top 3 Cal Poly campus support resources, with a reason for each match and clear next steps.

## How to run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## How to run backend tests

```bash
# Match quality test (7 prompts vs expected results)
npm run test:match

# Dataset integrity validation (unique IDs, valid categories, etc.)
npm run test:validate
```

## Manual test checklist

After `npm run dev`, verify these in the browser:

| Prompt | Expected top result |
|---|---|
| "I don't have money for groceries this week." | Campus Food Pantry |
| "My laptop broke and I have homework due tomorrow." | Laptop and Technology Loan Program |
| "I'm overwhelmed and falling behind in class." | Counseling and Psychological Services |
| "I might lose housing next month." | Student Housing Support Services |
| "I need interview clothes for a career fair." | Career Closet and Professional Prep |
| "I think I need accommodations but I don't know where to start." | Disability Resource Center |
| "I don't know what to do anymore." | Fallback resources (Basic Needs, Advising, Counseling) |
| *(empty input + Find Support)* | Fallback resources |

Also verify:
- Sample prompt chips fill the textarea and trigger search automatically
- Each result card shows: name, category, urgency, match reason, what to do first, what to bring, score, matched terms
- Results header says "Here are some good places to start" for fallbacks

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Local keyword/tag matching (no backend, no API)

## Project structure

```
src/
├── types/resource.ts           # Shared Resource, MatchedResource types
├── data/
│   ├── resources.ts            # 12 typed Cal Poly campus resources
│   ├── keywordMap.json         # Plain-language words → categories
│   └── expectedResults.ts      # Test prompts + fallback IDs
├── utils/
│   ├── matcher.ts              # findResources(), getFallbackResources()
│   ├── normalizeText.ts        # Input normalization
│   ├── extractMatchedCategories.ts
│   ├── scoreResource.ts
│   ├── formatMatchedResult.ts
│   └── keywordMap.ts
├── components/
│   ├── SearchForm.tsx          # Textarea + sample prompts + submit
│   ├── ResultsList.tsx         # Results container
│   └── ResourceCard.tsx        # Individual result card
├── App.tsx                     # Root component + state
└── main.tsx                    # React entry point
```

## License

MIT
