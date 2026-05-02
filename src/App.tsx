import { useState } from "react";
import type { MatchedResource } from "./types/resource";
import { findResources, getFallbackResources } from "./utils/matcher";
import { SearchForm } from "./components/SearchForm";
import { ResultsList } from "./components/ResultsList";
import ConstellationHero from "./components/ConstellationHero";

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<MatchedResource[]>([]);
  const [isFallback, setIsFallback] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSubmit() {
    const matched = findResources(input);
    const allFallback = matched.every((r) => r.score === 0);

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
    <div>
      {/* ── Hero ── */}
      <ConstellationHero />

      {/* ── Search + results ── */}
      <div
        id="search-section"
        className="animated-bg relative min-h-screen w-full overflow-hidden px-4 py-16"
      >
        {/* Ambient orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.25) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-xl space-y-8">

          {/* Section header */}
          <header className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Cal Poly · Student Support
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Poly<span className="text-blue-400">Care</span>
            </h2>
            <p className="text-sm text-white/55">
              Describe what you're going through. We'll find the right support.
            </p>
          </header>

          {/* Search form panel */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md shadow-xl shadow-black/20">
            <SearchForm
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Empty state */}
          {!hasSearched && (
            <p className="text-center text-sm text-white/35">
              Try one of the prompts above, or describe your situation in your own words.
            </p>
          )}

          {/* Results */}
          {hasSearched && (
            <ResultsList results={results} isFallback={isFallback} />
          )}

        </div>
      </div>
    </div>
  );
}
