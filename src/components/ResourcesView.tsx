/**
 * ResourcesView.tsx
 *
 * Informational view showing the resource categories PolyCare covers.
 * Uses the same glass panel style as the matching view.
 */

interface ResourcesViewProps {
  onGoHome: () => void;
  onGoMatch: () => void;
}

const CATEGORIES = [
  { icon: "🌾", label: "Food",          desc: "Campus food pantry, meal support, and emergency groceries for students facing food insecurity." },
  { icon: "🏡", label: "Housing",       desc: "Help with housing instability, eviction risk, unsafe living situations, and temporary shelter." },
  { icon: "🌿", label: "Mental Health", desc: "Counseling, crisis support, and psychological services for stress, anxiety, burnout, and more." },
  { icon: "📖", label: "Academic",      desc: "Tutoring, academic advising, study support, and help navigating academic standing or withdrawal." },
  { icon: "💻", label: "Technology",    desc: "Laptop loans, IT help desk, login issues, and access to campus software and online tools." },
  { icon: "💰", label: "Financial",     desc: "Emergency grants, financial aid advising, and support for unexpected expenses or loss of income." },
  { icon: "♿", label: "Accessibility", desc: "Disability accommodations, extended time, note-taking support, and accessibility resources." },
  { icon: "🤝", label: "Career",        desc: "Interview clothing, resume help, career fairs, internship prep, and professional readiness." },
];

export default function ResourcesView({ onGoHome, onGoMatch }: ResourcesViewProps) {
  return (
    <div className="section-reveal relative z-10 min-h-screen px-4 py-12 sm:px-8">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-3xl mx-auto mb-10">
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

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: "#67b8c8" }}>
            Campus Resources
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f1f5f9" }}>
            What PolyCare covers
          </h2>
          <p className="mt-3 text-sm leading-relaxed max-w-lg mx-auto" style={{ color: "#94a3b8" }}>
            PolyCare connects you with eight categories of Cal Poly campus support.
            Describe your situation and we'll match you with the most relevant resources.
          </p>
        </header>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="rounded-2xl p-5 backdrop-blur-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                <h3 className="font-semibold text-sm" style={{ color: "#e2e8f0" }}>{cat.label}</h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{cat.desc}</p>
            </div>
          ))}
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
            Find your match
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
