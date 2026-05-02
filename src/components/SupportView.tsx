/**
 * SupportView.tsx
 *
 * Supportive guidance view explaining how to use PolyCare.
 * Uses the same glass panel style as the matching view.
 */

interface SupportViewProps {
  onGoHome: () => void;
  onGoMatch: () => void;
}

const STEPS = [
  {
    num: "01",
    title: "Describe your situation",
    body: "Type what's going on in your own words. There's no wrong way to say it — use everyday language, not official terms.",
  },
  {
    num: "02",
    title: "Review your matches",
    body: "PolyCare scores each campus resource against your description and returns the top three most relevant options.",
  },
  {
    num: "03",
    title: "Take the first step",
    body: "Each result tells you exactly what to do first and what to bring. Start with the highest-ranked resource.",
  },
];

export default function SupportView({ onGoHome, onGoMatch }: SupportViewProps) {
  return (
    <div className="section-reveal relative z-10 min-h-screen px-4 py-12 sm:px-8">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-10">
        <button
          type="button"
          onClick={onGoHome}
          className="back-btn-in inline-flex items-center gap-2 rounded-full px-4 py-2
            text-sm font-medium backdrop-blur-sm
            transition-all duration-200 hover:-translate-x-0.5 active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", color: "#cbd5e1" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f1f5f9"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </button>
        <span className="text-lg font-extrabold tracking-tight text-white">
          Poly<span style={{ color: "#60a5fa" }}>Care</span>
        </span>
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: "#67b8c8" }}>
            How it works
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f1f5f9" }}>
            You don't have to figure it out alone.
          </h2>
          <p className="mt-3 text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#94a3b8" }}>
            PolyCare is designed to be fast, calm, and judgment-free. Here's how to get the most out of it.
          </p>
        </header>

        {/* Steps */}
        <div className="space-y-4 mb-10">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl p-6 backdrop-blur-sm flex gap-5 items-start"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <span
                className="flex-shrink-0 text-2xl font-black tabular-nums"
                style={{ color: "rgba(103,184,200,0.35)", lineHeight: 1 }}
                aria-hidden="true"
              >
                {step.num}
              </span>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: "#e2e8f0" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance note */}
        <div
          className="rounded-2xl p-5 mb-10 text-center"
          style={{ background: "rgba(103,184,200,0.07)", border: "1px solid rgba(103,184,200,0.15)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            PolyCare runs entirely in your browser. Nothing you type is stored or sent anywhere.
            It's just you and the campus resources that are here to help.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={onGoMatch}
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5
              text-sm font-semibold text-white
              transition-all duration-200
              hover:-translate-y-[2px] active:scale-[0.97]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            style={{ background: "linear-gradient(135deg, #2d6abf 0%, #4a52a8 100%)", boxShadow: "0 4px 20px rgba(60,80,180,0.35)" }}
          >
            Start matching
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
