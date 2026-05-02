# Requirements — PolyCare Resource Finder

## Overview

PolyCare helps Cal Poly students find campus support resources by describing their problem in plain language. The app matches their input to the most relevant resources and tells them exactly what to do next.

---

## User Stories

### 1. Problem Input
**As a** Cal Poly student who is struggling,  
**I want to** type a description of my problem in plain language,  
**So that** I don't have to know the name of the right office or resource.

**Acceptance criteria:**
- There is a single text input on the home page
- The input accepts free-form text with no character minimum enforced on the UI
- A submit button triggers the search
- The input is cleared or retained after submission (either is acceptable for MVP)

---

### 2. Resource Matching
**As a** student who submitted a problem description,  
**I want to** see the top three campus resources that match my situation,  
**So that** I know where to go for help.

**Acceptance criteria:**
- The app returns exactly 3 results (or fewer if fewer match)
- Results are sorted by relevance score, highest first
- Each result shows: resource name, category, why it matched, and what to do first
- If no resource scores above zero, the three fallback resources are shown instead
- Fallback resources are: Basic Needs Office, Academic Advising, Counseling and Psychological Services

---

### 3. Result Card Detail
**As a** student viewing a result,  
**I want to** see enough detail to take action immediately,  
**So that** I don't have to search for more information elsewhere.

**Acceptance criteria:**
- Each result card shows:
  - Resource name
  - Short description
  - Why it matched (match reason)
  - What to do first
  - What to prepare (list)
  - Whether an appointment is required
  - Hours and location
- Urgency level is visually indicated (high / medium)

---

### 4. AI-Enhanced Matching (Groq Integration)
**As a** student describing their problem,  
**I want** the app to understand natural language,  
**So that** I get accurate results even when I don't use the exact right words.

**Acceptance criteria:**
- Groq API (`llama-3.3-70b-versatile`, free tier) is used as the primary matcher
- If the input is not campus-related, the app returns an empty state message instead of forced results
- If the API call fails or times out, the keyword matcher runs silently as fallback
- The app never blocks or errors out due to a failed API call
- API key stored in `.env` as `VITE_GROQ_API_KEY` — never committed to the repo

---

### 5. Fallback for Vague Input
**As a** student who types something vague or unclear,  
**I want** to still see helpful resources,  
**So that** I'm never left with an empty or broken result.

**Acceptance criteria:**
- Empty input shows the fallback resources
- Input that matches no tags or categories shows the fallback resources
- Fallback resources always include Basic Needs Office, Academic Advising, and Counseling Services
- Fallback cards are visually distinguishable (e.g. softer label like "Good starting points")

---

### 6. Accessible and Calm UI
**As a** student who may be stressed or overwhelmed,  
**I want** the app to feel calm and easy to use,  
**So that** it doesn't add to my stress.

**Acceptance criteria:**
- The page has a clear heading and a short supportive subtitle
- Font sizes are readable without zooming
- Color contrast meets WCAG AA minimum
- The submit button has a visible focus state
- The app is usable on mobile screen widths (min 375px)

---

## Out of Scope (MVP)

- User login or accounts
- Saved search history
- Live scraping of Cal Poly websites
- Map or directions integration
- More than 12 resources in the dataset
- More than 3 results per query
- File uploads
