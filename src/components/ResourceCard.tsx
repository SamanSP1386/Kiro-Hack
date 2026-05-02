import type { MatchedResource } from "../types/resource";

interface ResourceCardProps {
  resource: MatchedResource;
  rank: number;
}

const URGENCY_STYLES: Record<string, string> = {
  high: "bg-amber-100 text-amber-800",
  medium: "bg-slate-100 text-slate-700",
  low: "bg-green-100 text-green-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  "basic-needs": "Basic Needs",
  financial: "Financial",
  "mental-health": "Mental Health",
  academic: "Academic",
  technology: "Technology",
  housing: "Housing",
  accessibility: "Accessibility",
  career: "Career",
};

export function ResourceCard({ resource, rank }: ResourceCardProps) {
  const urgencyStyle = URGENCY_STYLES[resource.urgency] ?? URGENCY_STYLES.medium;
  const categoryLabel = CATEGORY_LABELS[resource.category] ?? resource.category;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {rank}
          </span>
          <h2 className="font-semibold text-slate-900">{resource.name}</h2>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
            {categoryLabel}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${urgencyStyle}`}>
            {resource.urgency}
          </span>
        </div>
      </div>

      {/* Match reason */}
      <p className="text-sm text-slate-600 italic">{resource.matchReason}</p>

      {/* What to do first */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          What to do first
        </p>
        <p className="mt-1 text-sm text-slate-800">{resource.what_to_do_first}</p>
      </div>

      {/* What to prepare */}
      {resource.what_to_prepare.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            What to bring
          </p>
          <ul className="mt-1 list-disc list-inside text-sm text-slate-700 space-y-0.5">
            {resource.what_to_prepare.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Debug info */}
      <div className="border-t border-slate-100 pt-2 text-xs text-slate-400 space-y-0.5">
        <p>score: {resource.score}</p>
        <p>
          matched:{" "}
          {resource.matchedTerms.length > 0
            ? resource.matchedTerms.join(", ")
            : "—"}
        </p>
      </div>
    </article>
  );
}
