import type { MatchedResource } from "../types/resource";

interface ResourceCardProps {
  resource: MatchedResource;
  rank: number;
  revealDelay?: number;
}

const URGENCY_STYLES: Record<string, { pill: string; dot: string }> = {
  high:   { pill: "bg-amber-400/15 text-amber-300 border-amber-400/20",  dot: "bg-amber-400"  },
  medium: { pill: "bg-slate-400/15 text-slate-300 border-slate-400/20",  dot: "bg-slate-400"  },
  low:    { pill: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20", dot: "bg-emerald-400" },
};

const CATEGORY_LABELS: Record<string, string> = {
  food:           "Food",
  "basic-needs":  "Basic Needs",
  financial:      "Financial",
  "mental-health":"Mental Health",
  academic:       "Academic",
  technology:     "Technology",
  housing:        "Housing",
  accessibility:  "Accessibility",
  career:         "Career",
};

export function ResourceCard({ resource, rank, revealDelay = 0 }: ResourceCardProps) {
  const urgency = URGENCY_STYLES[resource.urgency] ?? URGENCY_STYLES.medium;
  const categoryLabel = CATEGORY_LABELS[resource.category] ?? resource.category;

  return (
    <article
      className="
        card-reveal
        rounded-2xl border border-white/10 bg-white/[0.06]
        p-5 backdrop-blur-sm shadow-lg shadow-black/20
        space-y-3
        transition-all duration-200
        hover:bg-white/[0.09] hover:border-white/15 hover:-translate-y-0.5 hover:shadow-xl
      "
      style={{ animationDelay: `${revealDelay}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Rank badge */}
          <span
            className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/80 text-xs font-bold text-white"
            aria-label={`Result ${rank}`}
          >
            {rank}
          </span>
          <h3 className="font-semibold text-white leading-snug">{resource.name}</h3>
        </div>

        {/* Badges */}
        <div className="flex flex-shrink-0 flex-wrap gap-1.5 justify-end">
          <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-0.5 text-xs text-blue-300">
            {categoryLabel}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-xs ${urgency.pill}`}>
            <span aria-hidden="true" className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${urgency.dot}`} />
            {resource.urgency}
          </span>
        </div>
      </div>

      {/* Match reason */}
      <p className="text-sm text-white/55 italic leading-relaxed">
        {resource.matchReason}
      </p>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* What to do first */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/35 mb-1">
          What to do first
        </p>
        <p className="text-sm text-white/80 leading-relaxed">{resource.what_to_do_first}</p>
      </div>

      {/* What to prepare */}
      {resource.what_to_prepare.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/35 mb-1">
            What to bring
          </p>
          <ul className="space-y-0.5">
            {resource.what_to_prepare.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-sm text-white/65">
                <span aria-hidden="true" className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-blue-400/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Debug / score info */}
      <div className="border-t border-white/8 pt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-white/25">
        <span>score: {resource.score}</span>
        <span>
          matched:{" "}
          {resource.matchedTerms.length > 0
            ? resource.matchedTerms.join(", ")
            : "—"}
        </span>
      </div>
    </article>
  );
}
