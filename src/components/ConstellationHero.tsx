/**
 * ConstellationHero.tsx
 *
 * Full-viewport hero. Navbar buttons have distinct destinations.
 * "support" word uses a solid accent color — no gradient text blur.
 */

interface ConstellationHeroProps {
  onStartMatching: () => void;
  onGoResources:   () => void;
  onGoSupport:     () => void;
  isExiting:       boolean;
}

interface Pill { id: string; icon: string; label: string; }
const PILLS: Pill[] = [
  { id: "food",      icon: "🌾", label: "Food"          },
  { id: "housing",   icon: "🏡", label: "Housing"       },
  { id: "tutoring",  icon: "📖", label: "Tutoring"      },
  { id: "mental",    icon: "🌿", label: "Mental Health" },
  { id: "tech",      icon: "💻", label: "Tech Help"     },
  { id: "emergency", icon: "🤝", label: "Emergency Aid" },
];

export default function ConstellationHero({
  onStartMatching,
  onGoResources,
  onGoSupport,
  isExiting,
}: ConstellationHeroProps) {

  const navBtnClass = `
    px-4 py-2 rounded-lg text-sm font-medium
    transition-colors duration-200
    hover:text-white hover:bg-white/[0.09]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
  `;

  return (
    <section
      aria-label="PolyCare hero"
      className={`relative w-full min-h-screen flex flex-col
        ${isExiting ? "hero-exiting pointer-events-none" : ""}`}
    >
      {/* ── Nav ── */}
      <nav
        aria-label="Main navigation"
        className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16"
      >
        <span className="text-xl font-extrabold tracking-tight text-white select-none">
          Poly<span style={{ color: "#60a5fa" }}>Care</span>
        </span>

        <ul className="hidden sm:flex items-center gap-1" role="list">
          <li>
            <button type="button" onClick={onStartMatching} className={navBtnClass} style={{ color: "#cbd5e1" }}>
              Match
            </button>
          </li>
          <li>
            <button type="button" onClick={onGoResources} className={navBtnClass} style={{ color: "#cbd5e1" }}>
              Resources
            </button>
          </li>
          <li>
            <button type="button" onClick={onGoSupport} className={navBtnClass} style={{ color: "#cbd5e1" }}>
              Support
            </button>
          </li>
        </ul>

        {/* Mobile nav */}
        <div className="flex sm:hidden items-center gap-1">
          <button type="button" onClick={onStartMatching} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            Match
          </button>
        </div>
      </nav>

      {/* ── Hero body ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-4 text-center">

        {/* Eyebrow */}
        <div
          className="fade-up mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5
            text-xs font-semibold uppercase tracking-[0.18em]
            border border-white/[0.10] bg-white/[0.06] backdrop-blur-sm"
          style={{ color: "#8bb8d0" }}
        >
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#67b8c8" }} />
          Cal Poly Student Support
        </div>

        {/* Headline
            FIX: "support" uses a solid color, not gradient text.
            Gradient text (WebkitTextFillColor: transparent) causes subpixel
            blur on some browsers when inside a backdrop-blur ancestor.
            Solid #7eb8e8 is crisp, readable, and visually distinct. */}
        <h1
          className="fade-up delay-1 max-w-3xl text-white"
          style={{
            fontSize: "clamp(2.4rem, 6.5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
          }}
        >
          Find the right campus{" "}
          <span style={{ color: "#7eb8e8" }}>support</span>
          {", "}
          <span style={{ color: "#e2e8f0" }}>faster.</span>
        </h1>

        {/* Subtext */}
        <p
          className="fade-up delay-2 mt-6 max-w-lg leading-[1.8]"
          style={{ fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "#94a3b8" }}
        >
          Describe what you're going through, in your own words.{" "}
          <span style={{ color: "#cbd5e1", fontWeight: 600 }}>PolyCare</span>{" "}
          matches you with the campus resources that can actually help.
        </p>

        {/* CTA */}
        <div className="fade-up delay-3 mt-10">
          <button
            type="button"
            onClick={onStartMatching}
            className="
              group inline-flex items-center gap-2.5 rounded-full
              px-8 py-3.5 text-sm font-semibold text-white
              transition-transform duration-150
              hover:-translate-y-[3px] active:translate-y-0 active:scale-[0.96]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
              focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
            "
            style={{
              background: "linear-gradient(135deg, #2d6abf 0%, #4a52a8 100%)",
              boxShadow: "0 4px 20px rgba(60,80,180,0.35)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(60,80,180,0.50)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(60,80,180,0.35)"; }}
          >
            Start matching
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1">
              <path d="M2.5 7.5h10M9 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Resource pills */}
        <div className="fade-up delay-4 mt-12 flex flex-wrap justify-center gap-2" aria-label="Supported resource types">
          {PILLS.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                text-xs font-medium backdrop-blur-sm
                border border-white/[0.09] bg-white/[0.04]
                transition-colors duration-150
                hover:bg-white/[0.09] hover:border-white/[0.16]"
              style={{ color: "#94a3b8" }}
            >
              <span aria-hidden="true">{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
