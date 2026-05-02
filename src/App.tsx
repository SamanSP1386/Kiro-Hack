import { useState, useEffect, useRef } from "react";
import type { MatchedResource } from "./types/resource";
import { findResources, getFallbackResources } from "./utils/matcher";
import { SearchForm } from "./components/SearchForm";
import { ResultsList } from "./components/ResultsList";
import ConstellationHero from "./components/ConstellationHero";

// ── Neuron network ────────────────────────────────────────────────────────────

function NeuronLayer() {
  const nodes = [
    // Upper hero zone
    { id:  1, cx:  80, cy:  90, d: "nd-1" },
    { id:  2, cx: 240, cy:  50, d: "nd-2" },
    { id:  3, cx: 430, cy: 160, d: "nd-3" },
    { id:  4, cx: 620, cy:  70, d: "nd-4" },
    { id:  5, cx: 800, cy: 190, d: "nd-5" },
    { id:  6, cx: 940, cy:  80, d: "nd-6" },
    { id:  7, cx: 140, cy: 310, d: "nd-7" },
    { id:  8, cx: 360, cy: 390, d: "nd-8" },
    { id:  9, cx: 560, cy: 330, d: "nd-1" },
    { id: 10, cx: 730, cy: 410, d: "nd-2" },
    { id: 11, cx: 890, cy: 350, d: "nd-3" },
    { id: 12, cx:  55, cy: 490, d: "nd-4" },
    { id: 13, cx: 290, cy: 540, d: "nd-5" },
    { id: 14, cx: 490, cy: 570, d: "nd-6" },
    { id: 15, cx: 670, cy: 510, d: "nd-7" },
    { id: 16, cx: 850, cy: 560, d: "nd-8" },
    { id: 17, cx: 970, cy: 460, d: "nd-1" },
    { id: 18, cx: 190, cy: 210, d: "nd-2" },
    { id: 19, cx: 510, cy: 260, d: "nd-3" },
    { id: 20, cx: 810, cy: 300, d: "nd-4" },
    // Lower search zone
    { id: 21, cx: 100, cy: 720, d: "nd-5" },
    { id: 22, cx: 300, cy: 680, d: "nd-6" },
    { id: 23, cx: 500, cy: 760, d: "nd-7" },
    { id: 24, cx: 700, cy: 700, d: "nd-8" },
    { id: 25, cx: 900, cy: 780, d: "nd-1" },
    { id: 26, cx: 200, cy: 900, d: "nd-2" },
    { id: 27, cx: 450, cy: 950, d: "nd-3" },
    { id: 28, cx: 650, cy: 880, d: "nd-4" },
    { id: 29, cx: 850, cy: 960, d: "nd-5" },
    { id: 30, cx:  60, cy:1050, d: "nd-6" },
    { id: 31, cx: 350, cy:1100, d: "nd-7" },
    { id: 32, cx: 600, cy:1080, d: "nd-8" },
    { id: 33, cx: 800, cy:1150, d: "nd-1" },
    { id: 34, cx: 960, cy:1060, d: "nd-2" },
    { id: 35, cx: 150, cy:1250, d: "nd-3" },
    { id: 36, cx: 420, cy:1300, d: "nd-4" },
    { id: 37, cx: 680, cy:1280, d: "nd-5" },
    { id: 38, cx: 900, cy:1350, d: "nd-6" },
  ];

  const edges = [
    [1,2],[2,3],[3,4],[4,5],[5,6],
    [1,7],[2,18],[3,19],[4,9],[5,10],[6,11],
    [7,8],[8,9],[9,10],[10,11],
    [7,13],[8,14],[9,15],[10,16],[11,17],
    [12,13],[13,14],[14,15],[15,16],[16,17],
    [18,19],[19,20],[18,8],[20,10],
    [12,7],[17,11],
    [12,21],[13,22],[14,23],[15,24],[16,25],
    [21,22],[22,23],[23,24],[24,25],
    [21,26],[22,27],[23,28],[24,29],
    [26,27],[27,28],[28,29],
    [26,30],[27,31],[28,32],[29,33],[25,34],
    [30,31],[31,32],[32,33],[33,34],
    [30,35],[31,36],[32,37],[33,38],
    [35,36],[36,37],[37,38],
  ];

  // Subset of edges that get the traveling-light animation
  const flowEdges = new Set([
    "2-3","4-5","8-9","13-14","19-20",
    "22-23","27-28","31-32","36-37",
  ]);

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      viewBox="0 0 1000 1400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Node glow filter */}
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Line glow filter */}
        <filter id="lineGlow" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Cyan gradient for flow lines */}
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="50%"  stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base lines — shimmer */}
      {edges.map(([a, b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        if (!na || !nb) return null;
        const key = `${a}-${b}`;
        return (
          <line
            key={key}
            x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
            stroke="#6366f1"
            strokeWidth="1.0"
            className="n-line"
            style={{ animationDelay: `${((a + b) * 0.23) % 5}s` }}
            filter="url(#lineGlow)"
          />
        );
      })}

      {/* Flow lines — traveling light on select edges */}
      {edges.map(([a, b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        if (!na || !nb) return null;
        const key = `${a}-${b}`;
        if (!flowEdges.has(key)) return null;
        const dx = nb.cx - na.cx, dy = nb.cy - na.cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        return (
          <line
            key={`flow-${key}`}
            x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeDasharray={`${len * 0.3} ${len}`}
            className="n-flow"
            style={{
              animationDelay: `${((a * b) * 0.17) % 6}s`,
              animationDuration: `${4 + (a % 3)}s`,
            }}
            filter="url(#lineGlow)"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.id} className={n.d}>
          {/* Outer halo */}
          <circle
            cx={n.cx} cy={n.cy} r={14}
            fill={n.id % 3 === 0 ? "#22d3ee" : n.id % 3 === 1 ? "#818cf8" : "#6366f1"}
            fillOpacity={0.08}
          />
          {/* Core dot with glow */}
          <circle
            cx={n.cx} cy={n.cy}
            r={n.id % 4 === 0 ? 4 : 3}
            fill={n.id % 3 === 0 ? "#22d3ee" : n.id % 3 === 1 ? "#a5b4fc" : "#818cf8"}
            className="n-dot"
            style={{ animationDelay: `${(n.id * 0.41) % 3.5}s` }}
            filter="url(#nodeGlow)"
          />
        </g>
      ))}
    </svg>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // Backend state — unchanged
  const [input,       setInput]       = useState("");
  const [results,     setResults]     = useState<MatchedResource[]>([]);
  const [isFallback,  setIsFallback]  = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Transition state
  const [isExiting,     setIsExiting]     = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const heroRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  function handleSubmit() {
    const matched     = findResources(input);
    const allFallback = matched.every((r) => r.score === 0);
    if (!input.trim()) {
      setResults(getFallbackResources());
      setIsFallback(true);
    } else {
      setResults(matched);
      setIsFallback(allFallback);
    }
    setHasSearched(true);
  }

  function handleStartMatching() {
    setIsExiting(true);
    setTimeout(() => setSearchVisible(true), 460);
  }

  function handleBackToHome() {
    // Scroll back to top, then reset state after scroll completes
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      setSearchVisible(false);
      setIsExiting(false);
    }, 600);
  }

  // Scroll to search section once visible
  useEffect(() => {
    if (searchVisible && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchVisible]);

  return (
    <div className="page-bg relative min-h-screen">
      {/* Fixed neuron layer */}
      <NeuronLayer />

      {/* Ambient orbs */}
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -top-48 -left-48 w-[640px] h-[640px] rounded-full" style={{ zIndex: 0, background: "radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 68%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed top-1/3 -right-32 w-[500px] h-[500px] rounded-full" style={{ zIndex: 0, animationDelay: "4s", background: "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 65%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed bottom-0 left-1/4 w-[560px] h-[560px] rounded-full" style={{ zIndex: 0, animationDelay: "8s", background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)" }} />

      {/* Hero */}
      <div ref={heroRef} className="relative" style={{ zIndex: 1 }}>
        <ConstellationHero
          onStartMatching={handleStartMatching}
          isExiting={isExiting}
        />
      </div>

      {/* Search section */}
      {searchVisible && (
        <div
          ref={searchRef}
          id="search-section"
          className="section-reveal relative px-4 pb-28 pt-12"
          style={{ zIndex: 1 }}
        >
          {/* Separator glow line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.35), rgba(99,102,241,0.35), transparent)" }}
          />

          <div className="mx-auto max-w-2xl">

            {/* ── Back button ── */}
            <div className="back-btn-in mb-8">
              <button
                type="button"
                onClick={handleBackToHome}
                className="
                  inline-flex items-center gap-2 rounded-full
                  px-4 py-2 text-sm font-medium
                  backdrop-blur-sm
                  transition-all duration-200
                  hover:-translate-x-0.5 hover:border-white/25
                  active:scale-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#94a3b8",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(255,255,255,0.11)";
                  el.style.color = "#e2e8f0";
                  el.style.borderColor = "rgba(255,255,255,0.24)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "rgba(255,255,255,0.06)";
                  el.style.color = "#94a3b8";
                  el.style.borderColor = "rgba(255,255,255,0.14)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Home
              </button>
            </div>

            {/* Section header */}
            <header className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-3" style={{ color: "#22d3ee" }}>
                Student Support Finder
              </p>
              <h2
                className="text-white"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.08 }}
              >
                What's on your mind?
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#94a3b8" }}>
                There's no wrong way to say it. Describe your situation and we'll
                find the right campus resources for you.
              </p>
            </header>

            {/* Search panel — stronger contrast */}
            <div
              className="rounded-2xl p-6 backdrop-blur-lg"
              style={{
                background: "rgba(15, 30, 70, 0.72)",
                border: "1px solid rgba(34,211,238,0.22)",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.12), 0 24px 64px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <SearchForm value={input} onChange={setInput} onSubmit={handleSubmit} />
            </div>

            {/* Empty state */}
            {!hasSearched && (
              <p className="mt-5 text-center text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
                Try one of the example prompts, or describe your situation in your own words.
              </p>
            )}

            {/* Results */}
            {hasSearched && (
              <div className="mt-8">
                <ResultsList results={results} isFallback={isFallback} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
