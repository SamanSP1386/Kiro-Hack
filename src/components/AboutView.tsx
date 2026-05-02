/**
 * AboutView.tsx
 *
 * Lightweight About page — same visual pattern as ResourcesView / SupportView.
 */

interface AboutViewProps {
  onGoHome:  () => void;
  onGoMatch: () => void;
}

export default function AboutView({ onGoHome, onGoMatch }: AboutViewProps) {
  const backBtn = (
    <button
      type="button"
      onClick={onGoHome}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
        backdrop-blur-sm transition-all duration-150
        hover:-translate-x-0.5 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", color: "#cbd5e1" }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.12)"; el.style.color = "#f1f5f9"; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.color = "#cbd5e1"; }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Home
    </button>
  );

  return (
    <div className="relative px-4 pb-28 pt-12 sm:px-8 min-h-full">
      <div className="mx-auto max-w-2xl">

        {/* Back */}
        <div className="back-btn-in mb-8">{backBtn}</div>

        {/* Header */}
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: "#67b8c8" }}>
            About
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f1f5f9" }}>
            What is PolyCare?
          </h2>
          <p className="mt-3 text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#94a3b8" }}>
            A fast, private tool built for Cal Poly students.
          </p>
        </header>

        {/* Content cards */}
        <div className="space-y-4 mb-10">

          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <h3 className="font-semibold mb-2" style={{ color: "#e2e8f0" }}>The idea</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              When students are struggling, the last thing they need is to search through a dozen
              office websites. PolyCare lets you describe what's going on in plain language and
              instantly surfaces the campus resources most likely to help — food, housing, mental
              health, academic support, tech help, emergency aid, and more.
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <h3 className="font-semibold mb-2" style={{ color: "#e2e8f0" }}>How it works</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              Type a sentence or two about your situation. PolyCare scores each campus resource
              against your words and returns the top matches — with what to do first, what to
              bring, and where to go. No login. No forms. No waiting.
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <h3 className="font-semibold mb-2" style={{ color: "#e2e8f0" }}>Privacy</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              Everything runs in your browser. Nothing you type is stored or sent to any server.
              PolyCare is a tool, not a service — your situation stays yours.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={onGoMatch}
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5
              text-sm font-semibold text-white
              transition-transform duration-150
              hover:-translate-y-[2px] active:scale-[0.97]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            style={{ background: "linear-gradient(135deg, #2d6abf 0%, #4a52a8 100%)", boxShadow: "0 4px 20px rgba(60,80,180,0.35)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(60,80,180,0.50)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(60,80,180,0.35)"; }}
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
