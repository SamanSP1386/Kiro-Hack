import type { MatchedResource } from "../types/resource";
import { ResourceCard } from "./ResourceCard";

interface ResultsListProps {
  results: MatchedResource[];
  isFallback: boolean;
}

export function ResultsList({ results, isFallback }: ResultsListProps) {
  // Empty results = input wasn't campus-related
  if (results.length === 0) {
    return (
      <div
        className="rounded-2xl px-6 py-8 text-center space-y-2"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>
          That doesn't seem like a campus support question.
        </p>
        <p className="text-xs" style={{ color: "rgba(148,163,184,0.55)" }}>
          Try describing a real situation — like stress, housing, food, tech issues, or academic struggles.
        </p>
      </div>
    );
  }

  return (
    <section className="results-spotlight w-full space-y-4" aria-label="Matched resources">
      <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
        {isFallback
          ? "Good places to start"
          : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
      </h2>
      <div className="space-y-3">
        {results.map((resource, i) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            rank={i + 1}
            revealDelay={i * 80}
          />
        ))}
      </div>
    </section>
  );
}
