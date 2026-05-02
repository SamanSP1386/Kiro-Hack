# Kiro-Hack

File structure

A simple structure:

student-resource-matcher/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SearchForm.jsx
│   │   ├── ResourceCard.jsx
│   │   ├── ResultsList.jsx
│   │   └── SamplePrompts.jsx
│   ├── data/
│   │   └── resources.json
│   ├── utils/
│   │   ├── keywordMap.js
│   │   ├── matchResources.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js

If using TypeScript:

components/*.tsx
utils/*.ts
App.tsx
main.tsx
What each file does
src/data/resources.json

Your mock resource dataset.

src/utils/keywordMap.js

Maps student words to categories.

Example:

export const keywordMap = {
  food: ["food", "hungry", "groceries", "meal", "eat"],
  financial: ["money", "rent", "bill", "expense", "broke"],
  "mental-health": ["stress", "anxiety", "overwhelmed", "panic", "depressed"],
  academic: ["failing", "class", "homework", "study", "exam", "grade"],
  technology: ["laptop", "computer", "wifi", "device", "login"],
  housing: ["housing", "rent", "eviction", "roommate", "homeless"],
  accessibility: ["accommodation", "disability", "adhd", "accessibility"],
  career: ["interview", "resume", "internship", "job"]
};
src/utils/matchResources.js

Main matching logic.

Responsibilities:

normalize user text
score each resource
sort by score
return top 3
src/components/SearchForm.jsx

Text area + button.

src/components/ResultsList.jsx

Maps matched results into cards.

src/components/ResourceCard.jsx

Displays each result.

src/components/SamplePrompts.jsx

Clickable example prompts for demo.

src/App.jsx

Holds state:

input text
matched results
loading state if needed