import { useState } from "react";
import type { MatchedResource } from "./types/resource";
import { findResources, getFallbackResources } from "./utils/matcher";
import { SearchForm } from "./components/SearchForm";
import { ResultsList } from "./components/ResultsList";

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<MatchedResource[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSubmit() {
    const matched = findResources(input);

    // Determine if we got real matches or fallbacks
    // Fallback resources all have score 0
    const allFallback = matched.every((r) => r.score === 0);

    // If input is empty, explicitly use fallback
    if (!input.trim()) {
      setResults(getFallbackResources());
      setIsFallback(true);
    } else {
      setResults(matched);
      setIsFallback(allFallback);
    }

    setHasSearched(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Header */}
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-bold text-blue-700">PolyCare</h1>
          <p className="text-slate-500">
            Describe what you're going through. We'll find the right support.
          </p>
        </header>

        {/* Search form */}
        <SearchForm
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />

        {/* Empty state */}
        {!hasSearched && (
          <p className="text-center text-sm text-slate-400">
            Try one of the prompts above, or describe your situation in your own words.
          </p>
        )}

        {/* Results */}
        {hasSearched && (
          <ResultsList results={results} isFallback={isFallback} />
        )}

      </div>
    </div>
  );
}
