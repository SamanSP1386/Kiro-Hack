import { useState, useRef, useCallback } from "react";
import type { MatchedResource } from "./types/resource";
import { findResources, getFallbackResources } from "./utils/matcher";
import { findResourcesWithAI } from "./utils/aiMatcher";
import ConstellationHero from "./components/ConstellationHero";
import { SearchForm } from "./components/SearchForm";
import { ResultsList } from "./components/ResultsList";
import ResourcesView from "./components/ResourcesView";
import SupportView from "./components/SupportView";

// ── Neuron network ────────────────────────────────────────────────────────────

function NeuronLayer() {
  const nodes = [
    { id:  1, cx:  80, cy:  90 }, { id:  2, cx: 240, cy:  50 },
    { id:  3, cx: 430, cy: 160 }, { id:  4, cx: 620, cy:  70 },
    { id:  5, cx: 800, cy: 190 }, { id:  6, cx: 940, cy:  80 },
    { id:  7, cx: 140, cy: 310 }, { id:  8, cx: 360, cy: 390 },
    { id:  9, cx: 560, cy: 330 }, { id: 10, cx: 730, cy: 410 },
    { id: 11, cx: 890, cy: 350 }, { id: 12, cx:  55, cy: 490 },
    { id: 13, cx: 290, cy: 540 }, { id: 14, cx: 490, cy: 570 },
    { id: 15, cx: 670, cy: 510 }, { id: 16, cx: 850, cy: 560 },
    { id: 17, cx: 970, cy: 460 }, { id: 18, cx: 190, cy: 210 },
    { id: 19, cx: 510, cy: 260 }, { id: 20, cx: 810, cy: 300 },
    { id: 21, cx: 100, cy: 720 }, { id: 22, cx: 300, cy: 680 },
    { id: 23, cx: 500, cy: 760 }, { id: 24, cx: 700, cy: 700 },
    { id: 25, cx: 900, cy: 780 }, { id: 26, cx: 200, cy: 900 },
    { id: 27, cx: 450, cy: 950 }, { id: 28, cx: 650, cy: 880 },
    { id: 29, cx: 850, cy: 960 }, { id: 30, cx:  60, cy:1050 },
    { id: 31, cx: 350, cy:1100 }, { id: 32, cx: 600, cy:1080 },
    { id: 33, cx: 800, cy:1150 }, { id: 34, cx: 960, cy:1060 },
    { id: 35, cx: 150, cy:1250 }, { id: 36, cx: 420, cy:1300 },
    { id: 37, cx: 680, cy:1280 }, { id: 38, cx: 900, cy:1350 },
  ];

  const edges: [number, number][] = [
    [1,2],[2,3],[3,4],[4,5],[5,6],
    [1,7],[2,18],[3,19],[4,9],[5,10],[6,11],
    [7,8],[8,9],[9,10],[10,11],
    [7,13],[8,14],[9,15],[10,16],[11,17],
    [12,13],[13,14],[14,15],[15,16],[16,17],
    [18,19],[19,20],[18,8],[20,10],[12,7],[17,11],
    [12,21],[13,22],[14,23],[15,24],[16,25],
    [21,22],[22,23],[23,24],[24,25],
    [21,26],[22,27],[23,28],[24,29],
    [26,27],[27,28],[28,29],
    [26,30],[27,31],[28,32],[29,33],[25,34],
    [30,31],[31,32],[32,33],[33,34],
    [30,35],[31,36],[32,37],[33,38],
    [35,36],[36,37],[37,38],
  ];

  const flowSet = new Set(["2-3","4-5","8-9","13-14","19-20","22-23","27-28","31-32","36-37"]);
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const nodeColor = (id: number) =>
    id % 3 === 0 ? "#67b8c8" : id % 3 === 1 ? "#8b9fd4" : "#7b7fc4";

  return (
    <svg
      aria-hidden="true"
      className="neuron-svg pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      viewBox="0 0 1000 1400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="nGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lGlow" x="-5%" y="-200%" width="110%" height="500%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {edges.map(([a, b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        if (!na || !nb) return null;
        const key = `${a}-${b}`;
        const isFlow = flowSet.has(key);
        const dx = nb.cx - na.cx, dy = nb.cy - na.cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        return (
          <g key={key}>
            <line x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
              stroke="#4a5080" strokeWidth="0.9" className="n-line"
              style={{ animationDelay: `${((a + b) * 0.23) % 6}s` }}
              filter="url(#lGlow)" />
            {isFlow && (
              <line x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
                stroke="#5a8aaa" strokeWidth="1.4"
                strokeDasharray={`${len * 0.25} ${len}`}
                className="n-flow"
                style={{ animationDelay: `${((a * b) * 0.17) % 5}s`, animationDuration: `${4.5 + (a % 3) * 0.8}s` }}
                filter="url(#lGlow)" />
            )}
          </g>
        );
      })}

      {nodes.map((n) => {
        const col = nodeColor(n.id);
        return (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r={13} fill={col} fillOpacity={0.07} />
            <circle cx={n.cx} cy={n.cy} r={n.id % 5 === 0 ? 3.8 : 2.8}
              fill={col} className="n-dot"
              style={{ animationDelay: `${(n.id * 0.41) % 4}s` }}
              filter="url(#nGlow)" />
          </g>
        );
      })}
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type View = "hero" | "match" | "resources" | "support";

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // Backend state — unchanged
  const [input,       setInput]       = useState("");
  const [results,     setResults]     = useState<MatchedResource[]>([]);
  const [isFallback,  setIsFallback]  = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);

  // View state — single source of truth, no transition phases
  const [activeView, setActiveView] = useState<View>("hero");

  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  async function handleSubmit() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!input.trim()) {
        setResults(getFallbackResources());
        setIsFallback(true);
        setHasSearched(true);
        return;
      }

      const aiResults = await findResourcesWithAI(input);

      if (aiResults && aiResults.length > 0) {
        setResults(aiResults);
        setIsFallback(false);
      } else if (aiResults !== null) {
        const keywordResults = findResources(input);
        const allFallback = keywordResults.every((r) => r.score === 0);
        if (allFallback) {
          setResults([]);
          setIsFallback(false);
        } else {
          setResults(keywordResults);
          setIsFallback(false);
        }
      } else {
        const keywordResults = findResources(input);
        const allFallback = keywordResults.every((r) => r.score === 0);
        setResults(keywordResults);
        setIsFallback(allFallback);
      }

      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Navigation — instant view swap, no delays ─────────────────────────────
  // View changes immediately on click. CSS handles the content reveal.

  const navigateTo = useCallback((target: Exclude<View, "hero">, focusTextarea = false) => {
    setActiveView(target);
    if (secondaryRef.current) secondaryRef.current.scrollTop = 0;
    if (focusTextarea && target === "match") {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, []);

  const goHome = useCallback(() => {
    setActiveView("hero");
  }, []);

  const isOnHero      = activeView === "hero";
  const isOnSecondary = !isOnHero;

  return (
    <div className="page-bg fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>

      {/* Fixed neuron layer */}
      <NeuronLayer />

      {/* Ambient orbs */}
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -top-40 -left-40 w-[560px] h-[560px] rounded-full"
        style={{ zIndex: 0, background: "radial-gradient(circle, rgba(50,50,180,0.14) 0%, transparent 68%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed top-1/2 -right-24 w-[420px] h-[420px] rounded-full"
        style={{ zIndex: 0, animationDelay: "5s", background: "radial-gradient(circle, rgba(20,100,140,0.08) 0%, transparent 65%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -bottom-20 left-1/3 w-[480px] h-[480px] rounded-full"
        style={{ zIndex: 0, animationDelay: "10s", background: "radial-gradient(circle, rgba(80,50,160,0.09) 0%, transparent 65%)" }} />

      {/* ── Hero layer — always mounted, shown when active ── */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 1,
          display: isOnHero ? undefined : "none",
        }}
        aria-hidden={isOnSecondary}
      >
        <ConstellationHero
          onStartMatching={() => navigateTo("match")}
          onGoResources={()   => navigateTo("resources")}
          onGoSupport={()     => navigateTo("support")}
          isExiting={false}
        />
      </div>

      {/* ── Secondary layer — fades in when mounted ── */}
      {isOnSecondary && (
        <div
          key={activeView}
          ref={secondaryRef}
          className="view-in fixed inset-0 overflow-y-auto"
          style={{ zIndex: 2 }}
        >
          {/* Match view */}
          {activeView === "match" && (
            <div className="relative px-4 pb-28 pt-12 sm:px-8 min-h-full">
              <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(103,184,200,0.3), rgba(99,102,241,0.3), transparent)" }} />

              <div className="mx-auto max-w-2xl">
                <div className="back-btn-in mb-8">
                  <button type="button" onClick={goHome}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-150 hover:-translate-x-0.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", color: "#cbd5e1" }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.12)"; el.style.color = "#f1f5f9"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.color = "#cbd5e1"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Home
                  </button>
                </div>

                <header className="mb-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: "#67b8c8" }}>
                    Student Support Finder
                  </p>
                  <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f1f5f9" }}>
                    What's on your mind?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#94a3b8" }}>
                    Describe your situation and we'll find the right campus resources.
                  </p>
                </header>

                <div className="rounded-2xl p-6 backdrop-blur-lg" style={{
                  background: "rgba(8, 18, 48, 0.85)",
                  border: "1px solid rgba(80,120,200,0.22)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}>
                  <SearchForm
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    textareaRef={textareaRef}
                    isLoading={isLoading}
                  />
                </div>

                {/* Empty state */}
                {!hasSearched && !isLoading && (
                  <p className="mt-5 text-center text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
                    Try one of the example prompts, or describe your situation in your own words.
                  </p>
                )}

                {/* Loading state */}
                {isLoading && (
                  <p className="mt-5 text-center text-xs animate-pulse" style={{ color: "rgba(148,163,184,0.7)" }}>
                    Finding the right support for you...
                  </p>
                )}

                {/* Results */}
                {hasSearched && !isLoading && (
                  <div className="mt-8 pb-4">
                    <ResultsList results={results} isFallback={isFallback} />
                  </div>
                )}
                </div>
              </div>
          )}

          {activeView === "resources" && (
            <ResourcesView onGoHome={goHome} onGoMatch={() => navigateTo("match")} />
          )}

          {activeView === "support" && (
            <SupportView onGoHome={goHome} onGoMatch={() => navigateTo("match")} />
          )}
        </div>
      )}
    </div>
  );
}
