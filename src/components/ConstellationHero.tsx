/**
 * ConstellationHero.tsx
 *
 * Cinematic full-screen hero section for PolyCare.
 * Self-contained — no external images, no external libraries.
 * Tailwind CSS + global CSS classes from index.css.
 */

// ── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Resources",    href: "#resources"    },
  { label: "Support",      href: "#support"      },
] as const;

// ── Resource pills ───────────────────────────────────────────────────────────

interface ResourcePill {
  id: string;
  icon: string;
  label: string;
}

const RESOURCE_PILLS: ResourcePill[] = [
  { id: "food",      icon: "🌾", label: "Food"          },
  { id: "housing",   icon: "🏡", label: "Housing"       },
  { id: "tutoring",  icon: "📖", label: "Tutoring"      },
  { id: "mental",    icon: "🌿", label: "Mental Health" },
  { id: "tech",      icon: "💻", label: "Tech Help"     },
  { id: "emergency", icon: "🤝", label: "Emergency Aid" },
];

// ── Scroll helper ────────────────────────────────────────────────────────────

function scrollToSearch() {
  const el = document.getElementById("search-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ConstellationHero() {
  return (
    <section
      aria-label="PolyCare hero"
      className="animated-bg relative min-h-screen w-full flex flex-col overflow-hidden"
    >
      {/* ── Ambient orbs ── */}
      <div
        aria-hidden="true"
        className="orb-pulse pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="orb-pulse pointer-events-none absolute -bottom-40 -right-20 w-[480px] h-[480px] rounded-full"
        style={{
          animationDelay: "3s",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.07) 0%, transparent 65%)",
        }}
      />

      {/* ── Navigation ── */}
      <nav
        aria-label="Main navigation"
        className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16"
      >
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          Poly<span className="text-blue-400">Care</span>
        </a>

        <ul className="hidden sm:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <span className="sm:hidden text-white/50 text-sm" aria-hidden="true">
          Menu
        </span>
      </nav>

      {/* ── Hero body ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-8 text-center">

        {/* Eyebrow */}
        <div className="hero-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200 backdrop-blur-sm">
          <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
          Cal Poly Student Support
        </div>

        {/* Headline */}
        <h1 className="hero-fade-up delay-100 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Find the right campus{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #93c5fd, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            support
          </span>
          , faster.
        </h1>

        {/* Subtext */}
        <p className="hero-fade-up delay-200 mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
          Describe what you're going through — in your own words. PolyCare
          matches you with the campus resources that can actually help, from
          food and housing to mental health and emergency aid.
        </p>

        {/* CTA buttons */}
        <div className="hero-fade-up delay-300 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={scrollToSearch}
            className="
              group inline-flex items-center gap-2 rounded-full
              bg-blue-500 px-7 py-3 text-sm font-semibold text-white
              shadow-lg shadow-blue-900/40
              transition-all duration-200
              hover:bg-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/50
              active:translate-y-0 active:scale-95 active:shadow-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            "
          >
            Start matching
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={scrollToSearch}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-white/20 bg-white/10 px-7 py-3
              text-sm font-semibold text-white/85 backdrop-blur-sm
              transition-all duration-200
              hover:bg-white/20 hover:text-white hover:-translate-y-0.5 hover:border-white/30
              active:translate-y-0 active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            "
          >
            Explore support
          </button>
        </div>

        {/* Resource pills */}
        <div
          className="hero-fade-up delay-400 mt-14 flex flex-wrap justify-center gap-2"
          aria-label="Supported resource types"
        >
          {RESOURCE_PILLS.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/55 backdrop-blur-sm transition-colors duration-150 hover:bg-white/10 hover:text-white/80"
            >
              <span aria-hidden="true">{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="hero-fade-up delay-500 mt-16 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="text-white/25">
            <rect x="1" y="1" width="14" height="18" rx="7" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="6" r="2" fill="currentColor" className="animate-bounce" />
          </svg>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,15,30,0.6))",
        }}
      />
    </section>
  );
}
