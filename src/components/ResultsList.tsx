import type { MatchedResource } from "../types/resource";
import { ResourceCard } from "./ResourceCard";

interface ResultsListProps {
  results: MatchedResource[];
  isFallback: boolean;
}

export function ResultsList({ results, isFallback }: ResultsListProps) {
  if (results.length === 0) return null;

  return (
    <section className="w-full space-y-4">
      <h2 className="text-sm font-semibold text-slate-500">
        {isFallback
          ? "Here are some good places to start"
          : `Here's what we found for you (${results.length} result${results.length !== 1 ? "s" : ""})`}
      </h2>
      <div className="space-y-4">
        {results.map((resource, i) => (
          <ResourceCard key={resource.id} resource={resource} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}
