import type { MatchedResource } from "../types/resource";
import { ResourceCard } from "./ResourceCard";

interface ResultsListProps {
  results: MatchedResource[];
  isFallback: boolean;
}

export function ResultsList({ results, isFallback }: ResultsListProps) {
  if (results.length === 0) return null;

  return (
    <section className="w-full space-y-4" aria-label="Matched resources">
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
