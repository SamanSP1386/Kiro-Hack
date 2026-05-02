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

// ── Neuron network ─────────────────────────────────────────────────────────────
// 85 nodes scattered at random positions across the canvas.
// Edges connect any two nodes within CONNECT_DIST of each other (proximity graph).
// This produces varied angles and an organic, non-grid look.
// Each node drifts independently (±6px) — lines follow their endpoints.
// Mouse proximity highlights individual nodes and connected edges.

const HIGHLIGHT_RADIUS = 130;
const DRIFT_AMP   = 6;
const DRIFT_SPEED = 0.00032;
const CONNECT_DIST = 155; // max distance to auto-connect two nodes
const MAX_EDGES_PER_NODE = 4; // cap connections per node to avoid clutter

// 85 nodes at hand-placed random positions (seeded for consistency).
// Positions cover the full 1000×1000 viewBox with varied density.
const NODES = [
  {id:  1,cx:  47,cy:  83,ph:0.00}, {id:  2,cx: 198,cy:  31,ph:0.74},
  {id:  3,cx: 312,cy: 118,ph:1.48}, {id:  4,cx: 471,cy:  55,ph:2.22},
  {id:  5,cx: 603,cy: 142,ph:2.96}, {id:  6,cx: 744,cy:  38,ph:3.70},
  {id:  7,cx: 881,cy: 107,ph:4.44}, {id:  8,cx: 963,cy:  29,ph:5.18},
  {id:  9,cx: 134,cy: 197,ph:0.37}, {id: 10,cx: 267,cy: 244,ph:1.11},
  {id: 11,cx: 389,cy: 178,ph:1.85}, {id: 12,cx: 528,cy: 261,ph:2.59},
  {id: 13,cx: 672,cy: 193,ph:3.33}, {id: 14,cx: 815,cy: 248,ph:4.07},
  {id: 15,cx: 941,cy: 172,ph:4.81}, {id: 16,cx:  62,cy: 318,ph:5.55},
  {id: 17,cx: 183,cy: 371,ph:0.18}, {id: 18,cx: 341,cy: 307,ph:0.92},
  {id: 19,cx: 456,cy: 388,ph:1.66}, {id: 20,cx: 594,cy: 322,ph:2.40},
  {id: 21,cx: 731,cy: 394,ph:3.14}, {id: 22,cx: 862,cy: 341,ph:3.88},
  {id: 23,cx: 977,cy: 298,ph:4.62}, {id: 24,cx: 108,cy: 452,ph:5.36},
  {id: 25,cx: 249,cy: 497,ph:0.09}, {id: 26,cx: 387,cy: 441,ph:0.83},
  {id: 27,cx: 512,cy: 518,ph:1.57}, {id: 28,cx: 648,cy: 463,ph:2.31},
  {id: 29,cx: 783,cy: 507,ph:3.05}, {id: 30,cx: 912,cy: 448,ph:3.79},
  {id: 31,cx:  38,cy: 561,ph:4.53}, {id: 32,cx: 171,cy: 608,ph:5.27},
  {id: 33,cx: 304,cy: 572,ph:0.01}, {id: 34,cx: 437,cy: 631,ph:0.75},
  {id: 35,cx: 569,cy: 584,ph:1.49}, {id: 36,cx: 698,cy: 618,ph:2.23},
  {id: 37,cx: 829,cy: 573,ph:2.97}, {id: 38,cx: 958,cy: 612,ph:3.71},
  {id: 39,cx:  93,cy: 687,ph:4.45}, {id: 40,cx: 224,cy: 731,ph:5.19},
  {id: 41,cx: 358,cy: 694,ph:5.93}, {id: 42,cx: 487,cy: 748,ph:0.67},
  {id: 43,cx: 621,cy: 712,ph:1.41}, {id: 44,cx: 754,cy: 758,ph:2.15},
  {id: 45,cx: 883,cy: 703,ph:2.89}, {id: 46,cx: 972,cy: 768,ph:3.63},
  {id: 47,cx:  51,cy: 812,ph:4.37}, {id: 48,cx: 179,cy: 857,ph:5.11},
  {id: 49,cx: 313,cy: 821,ph:5.85}, {id: 50,cx: 444,cy: 874,ph:0.59},
  {id: 51,cx: 578,cy: 838,ph:1.33}, {id: 52,cx: 711,cy: 882,ph:2.07},
  {id: 53,cx: 843,cy: 847,ph:2.81}, {id: 54,cx: 967,cy: 891,ph:3.55},
  {id: 55,cx: 126,cy: 943,ph:4.29}, {id: 56,cx: 258,cy: 968,ph:5.03},
  {id: 57,cx: 391,cy: 951,ph:5.77}, {id: 58,cx: 524,cy: 977,ph:0.51},
  {id: 59,cx: 657,cy: 955,ph:1.25}, {id: 60,cx: 789,cy: 972,ph:1.99},
  {id: 61,cx: 921,cy: 948,ph:2.73}, {id: 62,cx: 155,cy: 128,ph:3.47},
  {id: 63,cx: 423,cy:  92,ph:4.21}, {id: 64,cx: 689,cy: 128,ph:4.95},
  {id: 65,cx: 832,cy:  62,ph:5.69}, {id: 66,cx:  29,cy: 218,ph:0.43},
  {id: 67,cx: 501,cy: 162,ph:1.17}, {id: 68,cx: 762,cy: 172,ph:1.91},
  {id: 69,cx: 918,cy: 218,ph:2.65}, {id: 70,cx: 143,cy: 538,ph:3.39},
  {id: 71,cx: 618,cy: 538,ph:4.13}, {id: 72,cx: 872,cy: 498,ph:4.87},
  {id: 73,cx:  28,cy: 438,ph:5.61}, {id: 74,cx: 978,cy: 518,ph:0.35},
  {id: 75,cx: 338,cy: 158,ph:1.09}, {id: 76,cx: 558,cy: 428,ph:1.83},
  {id: 77,cx: 728,cy: 298,ph:2.57}, {id: 78,cx:  88,cy: 778,ph:3.31},
  {id: 79,cx: 968,cy: 678,ph:4.05}, {id: 80,cx: 448,cy: 538,ph:4.79},
  {id: 81,cx: 218,cy: 168,ph:5.53}, {id: 82,cx: 648,cy: 778,ph:0.27},
  {id: 83,cx: 338,cy: 878,ph:1.01}, {id: 84,cx: 778,cy: 638,ph:1.75},
  {id: 85,cx: 498,cy: 298,ph:2.49},
];

// Build edges by proximity: connect nodes within CONNECT_DIST,
// capping at MAX_EDGES_PER_NODE to keep the graph readable.
function buildEdges(nodes: typeof NODES): [number,number][] {
  const edgeCount = new Map<number, number>();
  const result: [number,number][] = [];
  const added = new Set<string>();

  // Sort candidate pairs by distance so shorter edges are preferred
  const pairs: {a:number,b:number,d:number}[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const na = nodes[i], nb = nodes[j];
      const dx = na.cx - nb.cx, dy = na.cy - nb.cy;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d <= CONNECT_DIST) pairs.push({a: na.id, b: nb.id, d});
    }
  }
  pairs.sort((x, y) => x.d - y.d);

  for (const {a, b} of pairs) {
    const ca = edgeCount.get(a) ?? 0;
    const cb = edgeCount.get(b) ?? 0;
    if (ca >= MAX_EDGES_PER_NODE || cb >= MAX_EDGES_PER_NODE) continue;
    const key = `${a}-${b}`;
    if (added.has(key)) continue;
    added.add(key);
    result.push([a, b]);
    edgeCount.set(a, ca + 1);
    edgeCount.set(b, cb + 1);
  }
  return result;
}

const EDGES: [number,number][] = buildEdges(NODES);

// Pick ~15% of edges as traveling-light edges
const FLOW_SET = new Set<string>(
  EDGES
    .filter((_, i) => i % 7 === 0)
    .map(([a, b]) => `${a}-${b}`)
);

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));
const dotR = (id: number) => id % 7 === 0 ? 2.0 : id % 4 === 0 ? 1.6 : 1.2;
const nodeColor = (id: number) =>
  id % 3 === 0 ? "#67b8c8" : id % 3 === 1 ? "#8b9fd4" : "#7b7fc4";

function NeuronLayer() {
  const svgRef    = useRef<SVGSVGElement>(null);
  const mouseRaf  = useRef<number>(0);
  const driftRaf  = useRef<number>(0);
  // Per-node group refs for drift transform
  const nodeGRefs = useRef<Map<number, SVGGElement>>(new Map());
  // Per-node dot/halo refs for mouse highlight
  const dotRefs   = useRef<Map<number, SVGCircleElement>>(new Map());
  const haloRefs  = useRef<Map<number, SVGCircleElement>>(new Map());
  // Per-edge line refs for mouse highlight
  const lineRefs  = useRef<Map<string, SVGLineElement>>(new Map());
  // Current drifted positions (updated by drift loop, read by mouse loop)
  const driftPos  = useRef<Map<number, {x:number,y:number}>>(new Map(
    NODES.map(n => [n.id, {x: n.cx, y: n.cy}])
  ));

  // ── Drift animation loop ──────────────────────────────────────────────────
  // Each node drifts on its own Lissajous path using its unique phase.
  // Drift is ±DRIFT_AMP px — far smaller than node spacing (~100px).
  // Lines are updated by moving their endpoint attributes to match node positions.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let startTime: number | null = null;

    function driftTick(ts: number) {
      if (startTime === null) startTime = ts;
      const t = ts - startTime;

      for (const n of NODES) {
        const dx = Math.sin(t * DRIFT_SPEED + n.ph)       * DRIFT_AMP;
        const dy = Math.cos(t * DRIFT_SPEED * 0.7 + n.ph) * DRIFT_AMP;
        const nx = n.cx + dx;
        const ny = n.cy + dy;

        // Update node group transform
        const g = nodeGRefs.current.get(n.id);
        if (g) g.setAttribute("transform", `translate(${dx.toFixed(2)},${dy.toFixed(2)})`);

        // Store current position for mouse proximity checks
        driftPos.current.set(n.id, { x: nx, y: ny });
      }

      // Update line endpoints to follow their drifted nodes
      for (const [a, b] of EDGES) {
        const pa = driftPos.current.get(a);
        const pb = driftPos.current.get(b);
        const line = lineRefs.current.get(`${a}-${b}`);
        if (line && pa && pb) {
          line.setAttribute("x1", pa.x.toFixed(1));
          line.setAttribute("y1", pa.y.toFixed(1));
          line.setAttribute("x2", pb.x.toFixed(1));
          line.setAttribute("y2", pb.y.toFixed(1));
        }
      }

      driftRaf.current = requestAnimationFrame(driftTick);
    }

    driftRaf.current = requestAnimationFrame(driftTick);
    return () => cancelAnimationFrame(driftRaf.current);
  }, []);

  // ── Mouse proximity highlight ─────────────────────────────────────────────
  const handlePointerMove = useCallback((e: PointerEvent) => {
    cancelAnimationFrame(mouseRaf.current);
    mouseRaf.current = requestAnimationFrame(() => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width)  * 1000;
      const my = ((e.clientY - rect.top)  / rect.height) * 1000;

      const nearSet = new Set<number>();
      for (const n of NODES) {
        const pos = driftPos.current.get(n.id) ?? { x: n.cx, y: n.cy };
        const dx = pos.x - mx, dy = pos.y - my;
        if (dx * dx + dy * dy < HIGHLIGHT_RADIUS * HIGHLIGHT_RADIUS) nearSet.add(n.id);
      }

      for (const n of NODES) {
        const dot  = dotRefs.current.get(n.id);
        const halo = haloRefs.current.get(n.id);
        if (!dot || !halo) continue;
        if (nearSet.has(n.id)) {
          const pos = driftPos.current.get(n.id) ?? { x: n.cx, y: n.cy };
          const dx = pos.x - mx, dy = pos.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = 1 - dist / HIGHLIGHT_RADIUS;
          const baseR = dotR(n.id);
          dot.setAttribute("opacity", String(0.65 + t * 0.35));
          dot.setAttribute("r",       String(baseR + t * 3.0));
          dot.setAttribute("fill",    "#7dd3fc");
          halo.setAttribute("opacity", String(0.07 + t * 0.30));
          halo.setAttribute("r",       String(baseR + 5 + t * 10));
        } else {
          dot.removeAttribute("opacity");
          dot.setAttribute("r",    String(dotR(n.id)));
          dot.setAttribute("fill", nodeColor(n.id));
          halo.removeAttribute("opacity");
          halo.setAttribute("r",   String(dotR(n.id) + 5));
        }
      }

      for (const [a, b] of EDGES) {
        const line = lineRefs.current.get(`${a}-${b}`);
        if (!line) continue;
        if (nearSet.has(a) || nearSet.has(b)) {
          line.setAttribute("stroke",       "#7dd3fc");
          line.setAttribute("stroke-width", "1.4");
          line.setAttribute("opacity",      "0.72");
        } else {
          line.setAttribute("stroke",       "#4a5080");
          line.setAttribute("stroke-width", "0.6");
          line.removeAttribute("opacity");
        }
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    cancelAnimationFrame(mouseRaf.current);
    for (const n of NODES) {
      const dot  = dotRefs.current.get(n.id);
      const halo = haloRefs.current.get(n.id);
      if (dot)  { dot.removeAttribute("opacity"); dot.setAttribute("r", String(dotR(n.id))); dot.setAttribute("fill", nodeColor(n.id)); }
      if (halo) { halo.removeAttribute("opacity"); halo.setAttribute("r", String(dotR(n.id) + 5)); }
    }
    for (const [a, b] of EDGES) {
      const line = lineRefs.current.get(`${a}-${b}`);
      if (line) { line.setAttribute("stroke", "#4a5080"); line.setAttribute("stroke-width", "0.6"); line.removeAttribute("opacity"); }
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
      cancelAnimationFrame(mouseRaf.current);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="nGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lGlow" x="-5%" y="-200%" width="110%" height="500%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Lines — rendered first, endpoints updated by drift loop */}
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
              stroke="#4a5080" strokeWidth="0.6" className="n-line"
              style={{ animationDelay: `${((a + b) * 0.17) % 6}s` }}
              filter="url(#lGlow)"
            />
            {isFlow && (
              <line
                x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
                stroke="#5a8aaa" strokeWidth="1.0"
                strokeDasharray={`${len * 0.20} ${len}`}
                className="n-flow"
                style={{ animationDelay: `${((a * b) * 0.11) % 5}s`, animationDuration: `${3.5 + (a % 5) * 0.5}s` }}
                filter="url(#lGlow)"
              />
            )}
          </g>
        );
      })}

      {/* Nodes — each in its own <g> that the drift loop translates */}
      {NODES.map((n) => {
        const col = nodeColor(n.id);
        const r   = dotR(n.id);
        return (
          <g key={n.id} ref={el => { if (el) nodeGRefs.current.set(n.id, el as SVGGElement); }}>
            <circle
              ref={el => { if (el) haloRefs.current.set(n.id, el); }}
              cx={n.cx} cy={n.cy} r={r + 5} fill={col} fillOpacity={0.05}
            />
            <circle
              ref={el => { if (el) dotRefs.current.set(n.id, el); }}
              cx={n.cx} cy={n.cy} r={r}
              fill={col} className="n-dot"
              style={{ animationDelay: `${(n.id * 0.33) % 4}s` }}
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
  const [input,       setInput]       = useState("");
  const [results,     setResults]     = useState<MatchedResource[]>([]);
  const [isFallback,  setIsFallback]  = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [activeView,  setActiveView]  = useState<View>("hero");

  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  async function handleSubmit() {
    if (isLoading) return;
    if (!input.trim()) { setHasSearched(false); return; }
    setIsLoading(true);
    try {
      const aiResults = await findResourcesWithAI(input);
      if (aiResults && aiResults.length > 0) {
        setResults(aiResults); setIsFallback(false); setHasSearched(true);
      } else if (aiResults !== null) {
        const kw = findResources(input);
        const allFb = kw.every(r => r.score === 0);
        setResults(allFb ? [] : kw); setIsFallback(false); setHasSearched(true);
      } else {
        const kw = findResources(input);
        const allFb = kw.every(r => r.score === 0);
        setResults(allFb ? [] : kw); setIsFallback(allFb); setHasSearched(true);
      }
    } finally { setIsLoading(false); }
  }

  const navigateTo = useCallback((target: Exclude<View, "hero">, focusTextarea = false) => {
    setActiveView(target);
    if (secondaryRef.current) secondaryRef.current.scrollTop = 0;
    if (focusTextarea && target === "match") setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  const goHome = useCallback(() => setActiveView("hero"), []);

  const isOnHero      = activeView === "hero";
  const isOnSecondary = !isOnHero;

  return (
    <div className="page-bg fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <NeuronLayer />

      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -top-40 -left-40 w-[560px] h-[560px] rounded-full"
        style={{ zIndex: 0, background: "radial-gradient(circle, rgba(50,50,180,0.14) 0%, transparent 68%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed top-1/2 -right-24 w-[420px] h-[420px] rounded-full"
        style={{ zIndex: 0, animationDelay: "5s", background: "radial-gradient(circle, rgba(20,100,140,0.08) 0%, transparent 65%)" }} />
      <div aria-hidden="true" className="orb-breathe pointer-events-none fixed -bottom-20 left-1/3 w-[480px] h-[480px] rounded-full"
        style={{ zIndex: 0, animationDelay: "10s", background: "radial-gradient(circle, rgba(80,50,160,0.09) 0%, transparent 65%)" }} />

      <div className="fixed inset-0" style={{ zIndex: 1, display: isOnHero ? undefined : "none" }} aria-hidden={isOnSecondary}>
        <ConstellationHero
          onStartMatching={() => navigateTo("match")}
          onGoResources={()   => navigateTo("resources")}
          onGoSupport={()     => navigateTo("support")}
          onGoAbout={()       => navigateTo("about")}
          isExiting={false}
        />
      </div>

      {isOnSecondary && (
        <div key={activeView} ref={secondaryRef} className="view-in fixed inset-0 overflow-y-auto" style={{ zIndex: 2 }}>
          {activeView === "match" && (
            <div className="relative px-4 pb-28 pt-12 sm:px-8 min-h-full">
              <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(103,184,200,0.3), rgba(99,102,241,0.3), transparent)" }} />
              <div className="mx-auto max-w-2xl">
                <div className="back-btn-in mb-8">
                  <button type="button" onClick={goHome}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-150 hover:-translate-x-0.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", color: "#cbd5e1" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.12)"; el.style.color = "#f1f5f9"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.color = "#cbd5e1"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M11 7H3M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Home
                  </button>
                </div>
                <header className="mb-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: "#67b8c8" }}>Student Support Finder</p>
                  <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f1f5f9" }}>
                    What's on your mind?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#94a3b8" }}>
                    Describe your situation and we'll find the right campus resources.
                  </p>
                </header>
                <div className="rounded-2xl p-6 backdrop-blur-lg" style={{
                  background: "rgba(8,18,48,0.85)", border: "1px solid rgba(80,120,200,0.22)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}>
                  <SearchForm value={input} onChange={setInput} onSubmit={handleSubmit} textareaRef={textareaRef} isLoading={isLoading} />
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
          {activeView === "resources" && <ResourcesView onGoHome={goHome} onGoMatch={() => navigateTo("match")} />}
          {activeView === "support"   && <SupportView   onGoHome={goHome} onGoMatch={() => navigateTo("match")} />}
          {activeView === "about"     && <AboutView     onGoHome={goHome} onGoMatch={() => navigateTo("match")} />}
        </div>
      )}
    </div>
  );
}
