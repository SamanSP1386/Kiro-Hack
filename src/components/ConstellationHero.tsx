/**
 * ConstellationHero.tsx
 *
 * Full-screen hero for PolyCare.
 * Sits at the top of the single continuous page.
 * isExiting → triggers heroExit animation before search section reveals.
 */

interface ConstellationHeroProps {
  onStartMatching: () => void;
  isExiting: boolean;
}

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Resources",    href: "#resources"    },
  { label: "Support",      href: "#support"      },
] as const;

interface Pill { id: string; icon: string; label: string; }
const PILLS: Pill[] = [
  { id: "food",      icon: "🌾", label: "Food"          },
  { id: "housing",   icon: "🏡", label: "Housing"       },
  { id: "tutoring",  icon: "📖", label: "Tutoring"      },
  { id: "mental",    icon: "🌿", label: "Mental Health" },
  { id: "tech",      icon: "💻", label: "Tech Help"     },
  { id: "emergency", icon: "🤝", label: "Emergency Aid" },
];

export default function ConstellationHero({ onStartMatching, isExiting }: ConstellationHeroProps) {
  return (
    <section
      aria-label="PolyCare hero"
      className={`relative min-h-screen w-full flex flex-col overflow-hidden
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
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60
                  transition-colors duration-200
                  hover:text-white hover:bg-white/[0.08]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero body ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-6 text-center">

        {/* Eyebrow */}
        <div
          className="fade-up mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5
            text-xs font-semibold uppercase tracking-[0.18em]
            border border-white/[0.12] bg-white/[0.07] backdrop-blur-sm"
          style={{ color: "#93c5fd" }}
        >
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
          Cal Poly Student Support
        </div>

        {/* Headline */}
        <h1
          className="fade-up delay-1 max-w-3xl text-white"
          style={{
            fontSize: "clamp(2.5rem, 6.5vw, 4.2rem)",
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
          }}
        >
          Find the right campus{" "}
          <span
            style={{
              background: "linear-gradient(100deg, #60a5fa 0%, #818cf8 45%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            support
          </span>
          {", "}
          <span style={{ color: "#e2e8f0" }}>faster.</span>
        </h1>

        {/* Subtext */}
        <p
          className="fade-up delay-2 mt-7 max-w-lg leading-[1.8] sm:text-lg"
          style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "#94a3b8" }}
        >
          Describe what you're going through — in your own words.{" "}
          <span style={{ color: "#e2e8f0", fontWeight: 500 }}>PolyCare</span>{" "}
          matches you with the campus resources that can actually help.
        </p>

        {/* Single CTA */}
        <div className="fade-up delay-3 mt-11">
          <button
            type="button"
            onClick={onStartMatching}
            className="
              group inline-flex items-center gap-2.5 rounded-full
              px-8 py-3.5 text-sm font-semibold text-white
              transition-all duration-[220ms] cubic-bezier(0.22,1,0.36,1)
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
              focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
              hover:-translate-y-[3px] active:translate-y-0 active:scale-[0.97]
            "
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 4px 24px rgba(99,102,241,0.45), 0 1px 4px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 32px rgba(99,102,241,0.60), 0 2px 8px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 24px rgba(99,102,241,0.45), 0 1px 4px rgba(0,0,0,0.3)";
            }}
          >
            Start matching
            <svg
              width="15" height="15" viewBox="0 0 15 15" fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path d="M2.5 7.5h10M9 3.5l4 4-4 4"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Resource pills */}
        <div
          className="fade-up delay-4 mt-14 flex flex-wrap justify-center gap-2"
          aria-label="Supported resource types"
        >
          {PILLS.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                text-xs font-medium backdrop-blur-sm
                border border-white/[0.09] bg-white/[0.05]
                transition-colors duration-150
                hover:bg-white/[0.10] hover:border-white/[0.15]"
              style={{ color: "#94a3b8" }}
            >
              <span aria-hidden="true">{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="fade-up delay-5 mt-16 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "rgba(148,163,184,0.4)" }}>
            Scroll
          </span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" style={{ color: "rgba(148,163,184,0.3)" }}>
            <rect x="1" y="1" width="14" height="18" rx="7" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="6" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
