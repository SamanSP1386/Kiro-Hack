import type { MatchedResource } from "../types/resource";

interface ResourceCardProps {
  resource: MatchedResource;
  rank: number;
  revealDelay?: number;
}

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: "high",   color: "#fbbf24", bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.22)" },
  medium: { label: "medium", color: "#94a3b8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)" },
  low:    { label: "low",    color: "#34d399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.22)" },
};

const CATEGORY_LABELS: Record<string, string> = {
  food:            "Food",
  "basic-needs":   "Basic Needs",
  financial:       "Financial",
  "mental-health": "Mental Health",
  academic:        "Academic",
  technology:      "Technology",
  housing:         "Housing",
  accessibility:   "Accessibility",
  career:          "Career",
};

export function ResourceCard({ resource, rank, revealDelay = 0 }: ResourceCardProps) {
  const urg = URGENCY_CONFIG[resource.urgency] ?? URGENCY_CONFIG.medium;
  const categoryLabel = CATEGORY_LABELS[resource.category] ?? resource.category;

  return (
    <article
      className="card-reveal rounded-2xl p-5 space-y-3
        backdrop-blur-sm
        transition-all duration-200
        hover:-translate-y-0.5"
      style={{
        animationDelay: `${revealDelay}ms`,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.30)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
            aria-label={`Result ${rank}`}
          >
            {rank}
          </span>
          <h3 className="font-semibold leading-snug" style={{ color: "#f1f5f9" }}>
            {resource.name}
          </h3>
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-1.5 justify-end">
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: "rgba(96,165,250,0.12)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.22)" }}
          >
            {categoryLabel}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium inline-flex items-center gap-1"
            style={{ background: urg.bg, color: urg.color, border: `1px solid ${urg.border}` }}
          >
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: urg.color }} />
            {urg.label}
          </span>
        </div>
      </div>

      {/* Match reason */}
      <p className="text-sm italic leading-relaxed" style={{ color: "#94a3b8" }}>
        {resource.matchReason}
      </p>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

      {/* What to do first */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(148,163,184,0.55)" }}>
          What to do first
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
          {resource.what_to_do_first}
        </p>
      </div>

      {/* What to prepare */}
      {resource.what_to_prepare.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(148,163,184,0.55)" }}>
            What to bring
          </p>
          <ul className="space-y-0.5">
            {resource.what_to_prepare.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-sm" style={{ color: "#94a3b8" }}>
                <span aria-hidden="true" className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: "rgba(96,165,250,0.7)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score debug */}
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", color: "rgba(148,163,184,0.35)" }}>
        <span>score: {resource.score}</span>
        <span>matched: {resource.matchedTerms.length > 0 ? resource.matchedTerms.join(", ") : "—"}</span>
      </div>
    </article>
  );
}
