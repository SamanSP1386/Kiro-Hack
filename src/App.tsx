import { useState, useRef, useCallback, useEffect } from "react";
import type { MatchedResource } from "./types/resource";
import { findResources } from "./utils/matcher";
import { findResourcesWithAI } from "./utils/aiMatcher";
import ConstellationHero from "./components/ConstellationHero";
import { SearchForm } from "./components/SearchForm";
import { ResultsList } from "./components/ResultsList";
import ResourcesView from "./components/ResourcesView";
import SupportView from "./components/SupportView";
import AboutView from "./components/AboutView";

// ── Neuron network ────────────────────────────────────────────────────────────
// Per-node/per-edge proximity highlighting via direct DOM attribute mutation.
// No React state on mousemove — zero re-render cost.
// Nodes within HIGHLIGHT_RADIUS of the cursor light up individually.
// Edges whose endpoints are near the cursor also brighten.

const HIGHLIGHT_RADIUS = 140; // viewBox units (viewBox is 0–1000)

// Node and edge data defined outside the component so they are stable
// references — no recreation on every render.
const NODES = [
  // Row 0
  { id:  1, cx:  50, cy:  40 }, { id:  2, cx: 160, cy:  20 },
  { id:  3, cx: 290, cy:  70 }, { id:  4, cx: 420, cy:  30 },
  { id:  5, cx: 550, cy:  80 }, { id:  6, cx: 680, cy:  25 },
  { id:  7, cx: 800, cy:  65 }, { id:  8, cx: 920, cy:  35 },
  { id:  9, cx: 980, cy: 110 },
  // Row 1
  { id: 10, cx:  90, cy: 160 }, { id: 11, cx: 220, cy: 140 },
  { id: 12, cx: 360, cy: 180 }, { id: 13, cx: 490, cy: 150 },
  { id: 14, cx: 620, cy: 190 }, { id: 15, cx: 750, cy: 155 },
  { id: 16, cx: 870, cy: 200 }, { id: 17, cx: 960, cy: 170 },
  // Row 2
  { id: 18, cx:  30, cy: 270 }, { id: 19, cx: 150, cy: 290 },
  { id: 20, cx: 280, cy: 260 }, { id: 21, cx: 410, cy: 300 },
  { id: 22, cx: 540, cy: 270 }, { id: 23, cx: 660, cy: 310 },
  { id: 24, cx: 790, cy: 275 }, { id: 25, cx: 910, cy: 305 },
  // Row 3
  { id: 26, cx: 110, cy: 400 }, { id: 27, cx: 240, cy: 380 },
  { id: 28, cx: 370, cy: 420 }, { id: 29, cx: 500, cy: 390 },
  { id: 30, cx: 630, cy: 430 }, { id: 31, cx: 760, cy: 400 },
  { id: 32, cx: 880, cy: 440 }, { id: 33, cx: 970, cy: 410 },
  // Row 4
  { id: 34, cx:  60, cy: 510 }, { id: 35, cx: 190, cy: 530 },
  { id: 36, cx: 320, cy: 500 }, { id: 37, cx: 450, cy: 545 },
  { id: 38, cx: 580, cy: 515 }, { id: 39, cx: 710, cy: 550 },
  { id: 40, cx: 840, cy: 520 }, { id: 41, cx: 950, cy: 555 },
  // Row 5
  { id: 42, cx: 130, cy: 640 }, { id: 43, cx: 270, cy: 660 },
  { id: 44, cx: 400, cy: 630 }, { id: 45, cx: 530, cy: 670 },
  { id: 46, cx: 660, cy: 640 }, { id: 47, cx: 790, cy: 675 },
  { id: 48, cx: 920, cy: 645 },
  // Row 6
  { id: 49, cx:  70, cy: 760 }, { id: 50, cx: 210, cy: 780 },
  { id: 51, cx: 350, cy: 750 }, { id: 52, cx: 480, cy: 790 },
  { id: 53, cx: 610, cy: 760 }, { id: 54, cx: 740, cy: 800 },
  { id: 55, cx: 870, cy: 770 }, { id: 56, cx: 970, cy: 800 },
  // Row 7
  { id: 57, cx: 140, cy: 890 }, { id: 58, cx: 300, cy: 870 },
  { id: 59, cx: 440, cy: 910 }, { id: 60, cx: 580, cy: 880 },
  { id: 61, cx: 720, cy: 920 }, { id: 62, cx: 860, cy: 890 },
  { id: 63, cx: 960, cy: 930 },
  // Extra fill nodes
  { id: 64, cx: 500, cy: 470 }, { id: 65, cx: 200, cy: 470 },
  { id: 66, cx: 750, cy: 470 }, { id: 67, cx: 350, cy: 580 },
  { id: 68, cx: 620, cy: 580 }, { id: 69, cx: 100, cy: 580 },
  { id: 70, cx: 880, cy: 580 },
];

const EDGES: [number, number][] = [
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],
  [1,10],[2,11],[3,12],[4,13],[5,14],[6,15],[7,16],[8,17],[9,17],
  [10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],
  [10,18],[11,19],[12,20],[13,21],[14,22],[15,23],[16,24],[17,25],
  [18,19],[19,20],[20,21],[21,22],[22,23],[23,24],[24,25],
  [18,26],[19,27],[20,27],[21,28],[22,29],[23,30],[24,31],[25,32],
  [26,27],[27,28],[28,29],[29,30],[30,31],[31,32],[32,33],
  [26,34],[27,35],[28,36],[29,37],[30,38],[31,39],[32,40],[33,41],
  [34,35],[35,36],[36,37],[37,38],[38,39],[39,40],[40,41],
  [34,42],[35,43],[36,43],[37,44],[38,45],[39,46],[40,47],[41,48],
  [42,43],[43,44],[44,45],[45,46],[46,47],[47,48],
  [42,49],[43,50],[44,51],[45,52],[46,53],[47,54],[48,55],
  [49,50],[50,51],[51,52],[52,53],[53,54],[54,55],[55,56],
  [49,57],[50,58],[51,58],[52,59],[53,60],[54,61],[55,62],[56,63],
  [57,58],[58,59],[59,60],[60,61],[61,62],[62,63],
  // Diagonals
  [2,10],[4,12],[6,14],[8,16],
  [11,20],[13,22],[15,24],
  [19,28],[21,29],[23,31],
  [27,36],[29,38],[31,40],
  [35,44],[37,45],[39,47],
  [43,52],[45,53],[47,55],
  [50,59],[52,60],[54,62],
  // Extra fill edges
  [36,64],[37,64],[38,64],[29,64],[30,64],
  [27,65],[35,65],[26,65],[19,65],
  [31,66],[40,66],[39,66],[24,66],
  [43,67],[44,67],[36,67],[45,67],
  [45,68],[46,68],[38,68],[39,68],
  [34,69],[42,69],[26,69],
  [40,70],[41,70],[48,70],[32,70],
];

const FLOW_SET = new Set([
  "1-2","4-5","7-8","11-12","14-15","20-21","23-24",
  "28-29","31-32","37-38","44-45","47-48","52-53","59-60","62-63",
  "36-64","45-68",
]);

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));
const dotR = (id: number) => id % 7 === 0 ? 2.2 : id % 4 === 0 ? 1.8 : 1.4;
const nodeColor = (id: number) =>
  id % 3 === 0 ? "#67b8c8" : id % 3 === 1 ? "#8b9fd4" : "#7b7fc4";

function NeuronLayer() {
  const svgRef   = useRef<SVGSVGElement>(null);
  const rafRef   = useRef<number>(0);
  const dotRefs  = useRef<Map<number, SVGCircleElement>>(new Map());
  const haloRefs = useRef<Map<number, SVGCircleElement>>(new Map());
  const lineRefs = useRef<Map<string, SVGLineElement>>(new Map());

  const handlePointerMove = useCallback((e: PointerEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      // Map screen coords → viewBox coords (0–1000)
      const mx = ((e.clientX - rect.left) / rect.width)  * 1000;
      const my = ((e.clientY - rect.top)  / rect.height) * 1000;

      // Which nodes are within the highlight radius?
      const nearSet = new Set<number>();
      for (const n of NODES) {
        const dx = n.cx - mx, dy = n.cy - my;
        if (dx * dx + dy * dy < HIGHLIGHT_RADIUS * HIGHLIGHT_RADIUS) {
          nearSet.add(n.id);
        }
      }

      // Update each dot and halo directly on the DOM element
      for (const n of NODES) {
        const dot  = dotRefs.current.get(n.id);
        const halo = haloRefs.current.get(n.id);
        if (!dot || !halo) continue;

        if (nearSet.has(n.id)) {
          const dx = n.cx - mx, dy = n.cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = 1 - dist / HIGHLIGHT_RADIUS; // 1 = closest, 0 = edge
          const baseR = dotR(n.id);
          dot.setAttribute("opacity", String(0.6 + t * 0.4));
          dot.setAttribute("r",       String(baseR + t * 2.8));
          dot.setAttribute("fill",    "#7dd3fc");
          halo.setAttribute("opacity", String(0.06 + t * 0.28));
          halo.setAttribute("r",       String(baseR + 6 + t * 10));
        } else {
          // Restore — CSS animation class handles the base opacity
          dot.removeAttribute("opacity");
          dot.setAttribute("r",    String(dotR(n.id)));
          dot.setAttribute("fill", nodeColor(n.id));
          halo.removeAttribute("opacity");
          halo.setAttribute("r",   String(dotR(n.id) + 6));
        }
      }

      // Update each base line
      for (const [a, b] of EDGES) {
        const line = lineRefs.current.get(`${a}-${b}`);
        if (!line) continue;
        if (nearSet.has(a) || nearSet.has(b)) {
          line.setAttribute("stroke",       "#7dd3fc");
          line.setAttribute("stroke-width", "1.5");
          line.setAttribute("opacity",      "0.70");
        } else {
          line.setAttribute("stroke",       "#4a5080");
          line.setAttribute("stroke-width", "0.7");
          line.removeAttribute("opacity");
        }
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    for (const n of NODES) {
      const dot  = dotRefs.current.get(n.id);
      const halo = haloRefs.current.get(n.id);
      if (dot)  { dot.removeAttribute("opacity"); dot.setAttribute("r", String(dotR(n.id))); dot.setAttribute("fill", nodeColor(n.id)); }
      if (halo) { halo.removeAttribute("opacity"); halo.setAttribute("r", String(dotR(n.id) + 6)); }
    }
    for (const [a, b] of EDGES) {
      const line = lineRefs.current.get(`${a}-${b}`);
      if (line) { line.setAttribute("stroke", "#4a5080"); line.setAttribute("stroke-width", "0.7"); line.removeAttribute("opacity"); }
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    document.addEventListener("pointermove",  handlePointerMove,  { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      document.removeEventListener("pointermove",  handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="neuron-svg pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="nGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lGlow" x="-5%" y="-200%" width="110%" height="500%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Lines — rendered before nodes so dots sit on top */}
      {EDGES.map(([a, b]) => {
        const na = NODE_MAP[a], nb = NODE_MAP[b];
        if (!na || !nb) return null;
        const key = `${a}-${b}`;
        const isFlow = FLOW_SET.has(key);
        const dx = nb.cx - na.cx, dy = nb.cy - na.cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        return (
          <g key={key}>
            <line
              ref={el => { if (el) lineRefs.current.set(key, el); }}
              x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
              stroke="#4a5080" strokeWidth="0.7" className="n-line"
              style={{ animationDelay: `${((a + b) * 0.19) % 6}s` }}
              filter="url(#lGlow)"
            />
            {isFlow && (
              <line
                x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
                stroke="#5a8aaa" strokeWidth="1.1"
                strokeDasharray={`${len * 0.22} ${len}`}
                className="n-flow"
                style={{ animationDelay: `${((a * b) * 0.13) % 5}s`, animationDuration: `${4 + (a % 4) * 0.6}s` }}
                filter="url(#lGlow)"
              />
            )}
          </g>
        );
      })}

      {/* Nodes — rendered on top of lines */}
      {NODES.map((n) => {
        const col = nodeColor(n.id);
        const r   = dotR(n.id);
        return (
          <g key={n.id}>
            <circle
              ref={el => { if (el) haloRefs.current.set(n.id, el); }}
              cx={n.cx} cy={n.cy} r={r + 6} fill={col} fillOpacity={0.05}
            />
            <circle
              ref={el => { if (el) dotRefs.current.set(n.id, el); }}
              cx={n.cx} cy={n.cy} r={r}
              fill={col} className="n-dot"
              style={{ animationDelay: `${(n.id * 0.37) % 4}s` }}
              filter="url(#nGlow)"
            />
          </g>
        );
      })}
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type View = "hero" | "match" | "resources" | "support" | "about";

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

    if (!input.trim()) {
      setHasSearched(false);
      return;
    }

    setIsLoading(true);

    try {
      const aiResults = await findResourcesWithAI(input);

      if (aiResults && aiResults.length > 0) {
        setResults(aiResults);
        setIsFallback(false);
        setHasSearched(true);
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
        setHasSearched(true);
      } else {
        const keywordResults = findResources(input);
        const allFallback = keywordResults.every((r) => r.score === 0);
        if (allFallback) {
          setResults([]);
          setIsFallback(false);
        } else {
          setResults(keywordResults);
          setIsFallback(allFallback);
        }
        setHasSearched(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

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

      <NeuronLayer />

      {/* Ambient orbs */}
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -top-40 -left-40 w-[560px] h-[560px] rounded-full"
        style={{ zIndex: 0, background: "radial-gradient(circle, rgba(50,50,180,0.14) 0%, transparent 68%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed top-1/2 -right-24 w-[420px] h-[420px] rounded-full"
        style={{ zIndex: 0, animationDelay: "5s", background: "radial-gradient(circle, rgba(20,100,140,0.08) 0%, transparent 65%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -bottom-20 left-1/3 w-[480px] h-[480px] rounded-full"
        style={{ zIndex: 0, animationDelay: "10s", background: "radial-gradient(circle, rgba(80,50,160,0.09) 0%, transparent 65%)" }} />

      {/* Hero layer */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 1, display: isOnHero ? undefined : "none" }}
        aria-hidden={isOnSecondary}
      >
        <ConstellationHero
          onStartMatching={() => navigateTo("match")}
          onGoResources={()   => navigateTo("resources")}
          onGoSupport={()     => navigateTo("support")}
          onGoAbout={()       => navigateTo("about")}
          isExiting={false}
        />
      </div>

      {/* Secondary layer */}
      {isOnSecondary && (
        <div
          key={activeView}
          ref={secondaryRef}
          className="view-in fixed inset-0 overflow-y-auto"
          style={{ zIndex: 2 }}
        >
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

                {!hasSearched && !isLoading && (
                  <p className="mt-5 text-center text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
                    Type your situation above and press Find Support, or try one of the example prompts.
                  </p>
                )}

                {isLoading && (
                  <p className="mt-5 text-center text-xs animate-pulse" style={{ color: "rgba(148,163,184,0.7)" }}>
                    Finding the right support for you...
                  </p>
                )}

                {hasSearched && !isLoading && (
                  <div className="mt-8 pb-4">
                    <ResultsList results={results} isFallback={isFallback} userInput={input} />
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

          {activeView === "about" && (
            <AboutView onGoHome={goHome} onGoMatch={() => navigateTo("match")} />
          )}
        </div>
      )}
    </div>
  );
}
