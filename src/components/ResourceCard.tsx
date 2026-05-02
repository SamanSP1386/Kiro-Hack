import { useState } from "react";
import type { MatchedResource } from "../types/resource";

interface ResourceCardProps {
  resource: MatchedResource;
  rank: number;
  revealDelay?: number;
  userInput?: string;
}

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

type Feedback = "up" | "down" | null;

export function ResourceCard({ resource, rank, revealDelay = 0, userInput = "" }: ResourceCardProps) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const categoryLabel = CATEGORY_LABELS[resource.category] ?? resource.category;

  function handleFeedback(value: "up" | "down") {
    if (feedback === value) {
      setFeedback(null);
      return;
    }
    setFeedback(value);

    // Log feedback for AI training purposes
    // In production this would POST to a backend endpoint
    console.log("[feedback]", {
      resourceId: resource.id,
      resourceName: resource.name,
      userInput,
      matchReason: resource.matchReason,
      feedback: value,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <article
      className="card-reveal rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
      style={{
        animationDelay: `${revealDelay}ms`,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />

      <div className="p-5 space-y-4">

        {/* Header: rank + name + category */}
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
          <span
            className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: "rgba(96,165,250,0.12)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.22)" }}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Why you got this result */}
        <div
          className="rounded-xl px-3 py-2.5"
          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(165,180,252,0.7)" }}>
            Why this matched
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#c7d2fe" }}>
            {resource.matchReason}
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

        {/* About */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(148,163,184,0.55)" }}>
            About
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
            {resource.description}
          </p>
        </div>

        {/* What to do first */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(148,163,184,0.55)" }}>
            What to do first
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
            {resource.what_to_do_first}
          </p>
        </div>

        {/* What to bring */}
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

        {/* Hours, location, contact, appointment */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs" style={{ color: "#94a3b8" }}>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">🕐</span>
            {resource.hours}
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📍</span>
            {resource.location}
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📞</span>
            {resource.contact_method}
          </span>
          <span className="flex items-center gap-1">
            <span aria-hidden="true">{resource.appointment_required ? "📅" : "🚶"}</span>
            {resource.appointment_required ? "Appointment needed" : "Drop-in welcome"}
          </span>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

        {/* Footer: website link + feedback */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Website link */}
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            style={{
              background: "rgba(59,130,246,0.12)",
              color: "#93c5fd",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.22)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.12)")}
          >
            Visit website
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Thumbs feedback */}
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
              {feedback === null ? "Was this helpful?" : feedback === "up" ? "Thanks for the feedback!" : "Got it, we'll improve."}
            </span>
            <button
              type="button"
              onClick={() => handleFeedback("up")}
              aria-label="This result was helpful"
              aria-pressed={feedback === "up"}
              className="rounded-full p-1.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              style={{
                background: feedback === "up" ? "rgba(52,211,153,0.18)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${feedback === "up" ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: feedback === "up" ? "#34d399" : "#64748b",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7.5V12h1.5l1-1h5l2-2V7H9l1-4.5A1 1 0 009 1.5L6 5H2.5A.5.5 0 002 5.5V7.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleFeedback("down")}
              aria-label="This result was not helpful"
              aria-pressed={feedback === "down"}
              className="rounded-full p-1.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              style={{
                background: feedback === "down" ? "rgba(248,113,113,0.18)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${feedback === "down" ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: feedback === "down" ? "#f87171" : "#64748b",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M12 6.5V2h-1.5l-1 1h-5L2 5v2.5h2.5l-1 4.5A1 1 0 004.5 13L7.5 9.5H11.5A.5.5 0 0012 9V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}
