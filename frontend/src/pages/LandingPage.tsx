import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ASSET_GROUPS } from "@/constants/assets";
import { AssetIcon } from "@/components/common/AssetIcon";
import { Zap, BarChart3, Globe, Shield, Crosshair, Moon } from "lucide-react";

const TICKERS = [
  { sym: "BTC/USD", price: "65,358.34", change: "+2.41%", up: true },
  { sym: "ETH/USD", price: "3,604.40",  change: "+1.89%", up: true },
  { sym: "XAU/USD", price: "2,284.25",  change: "-0.32%", up: false },
  { sym: "EUR/USD", price: "1.0854",    change: "+0.12%", up: true },
  { sym: "NASDAQ",  price: "18,135.00", change: "+0.94%", up: true },
  { sym: "S&P 500", price: "5,218.20",  change: "+0.76%", up: true },
  { sym: "SOL/USD", price: "145.07",    change: "-1.14%", up: false },
  { sym: "GBP/USD", price: "1.2620",    change: "+0.08%", up: true },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Real-Time Streaming",
    desc: "Live WebSocket price feeds across crypto, forex, commodities, and indices. Sub-second updates.",
  },
  {
    icon: BarChart3,
    title: "Advanced Charting",
    desc: "Powered by TradingView — full-featured charts with 100+ technical indicators and drawing tools.",
  },
  {
    icon: Globe,
    title: "Multi-Asset Markets",
    desc: "Trade Bitcoin, Gold, Nasdaq, EUR/USD, and 15+ instruments from one unified terminal.",
  },
  {
    icon: Shield,
    title: "Demo Trading Engine",
    desc: "Practice with $100,000 virtual capital. Real market conditions, zero financial risk.",
  },
  {
    icon: Crosshair,
    title: "Precision Order Entry",
    desc: "Market, Limit, and Stop orders. Built-in Take Profit & Stop Loss with margin calculations.",
  },
  {
    icon: Moon,
    title: "Dark Terminal UI",
    desc: "Designed for professional traders. Every pixel optimized for long trading sessions.",
  },
];

const STATS = [
  { value: "15+",    label: "Instruments" },
  { value: "< 1s",  label: "Price Latency" },
  { value: "$100K",  label: "Demo Capital" },
  { value: "24/7",   label: "Market Data" },
];


export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tickerX, setTickerX] = useState(0);
  const tickerRef = useRef<number>(0);
  const [assetSearch, setAssetSearch] = useState("");
  const [navSearch, setNavSearch] = useState("");
  const [isNavSearchFocused, setIsNavSearchFocused] = useState(false);
  const navSearchRef = useRef<HTMLDivElement>(null);

  // Close nav search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target as Node)) {
        setIsNavSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subtle parallax on hero
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Animate ticker scroll
  useEffect(() => {
    let raf: number;
    const step = () => {
      tickerRef.current -= 0.4;
      const totalWidth = TICKERS.length * 200; // approx px per item
      if (Math.abs(tickerRef.current) > totalWidth) tickerRef.current = 0;
      setTickerX(tickerRef.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const parallaxX = (mousePos.x - 0.5) * 20;
  const parallaxY = (mousePos.y - 0.5) * 20;

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── FLOATING NAV ── */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
        <nav className="max-w-7xl mx-auto h-20 bg-[#080808]/40 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-between px-10 pointer-events-auto transition-all hover:border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[#D6A046] font-bold text-2xl tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                MANGO
              </span>
              <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
              <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase hidden sm:block mt-0.5">Terminal</span>
            </div>

            {/* Search Container */}
            <div className="w-full max-w-sm hidden lg:block">
              <div className="relative group" ref={navSearchRef}>
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={navSearch}
                  onChange={e => setNavSearch(e.target.value)}
                  onFocus={() => setIsNavSearchFocused(true)}
                  placeholder="Search market ecosystem..."
                  className="w-full bg-white/5 border border-transparent rounded-full pl-11 pr-12 py-3 text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-white/10 focus:bg-white/10 transition-all font-medium"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <span className="text-[10px] text-white/20 font-bold border border-white/5 rounded px-1.5 py-0.5 bg-black/40">
                    ⌘K
                  </span>
                </div>
                
                {isNavSearchFocused && navSearch.trim() && (
                  <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden z-20 py-2">
                    {(() => {
                      const q = navSearch.toLowerCase().trim();
                      const matches = ASSET_GROUPS.flatMap(g => g.assets).filter(a => 
                        a.label.toLowerCase().includes(q) || a.sym.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q)
                      ).slice(0, 8);

                      if (matches.length === 0) return <div className="px-5 py-5 text-[11px] text-white/30 text-center italic">No results found</div>;
                      
                      return matches.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate(`/trade/${m.sym}`);
                            setNavSearch("");
                            setIsNavSearchFocused(false);
                          }}
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 group transition-colors text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[11px] font-bold text-[#D6A046] group-hover:bg-[#D6A046]/10 transition-colors">
                              {m.tag.replace('/', '')}
                            </div>
                            <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{m.label}</span>
                          </div>
                          <span className="text-[10px] tracking-widest text-[#D6A046] font-bold opacity-0 group-hover:opacity-100 transition-opacity">TRADE NOW</span>
                        </button>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Links + Launch */}
          <div className="flex items-center gap-8 relative z-50">
            <div className="hidden xl:flex items-center gap-7 text-[11px] tracking-widest text-white/30 uppercase font-black">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#brokers" className="hover:text-white transition-colors">Broker List</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#markets" className="hover:text-white transition-colors">Markets</a>
            </div>
            <button
              onClick={() => navigate("/trade")}
              className="bg-[#D6A046] hover:bg-[#E2AB4F] text-black text-[11px] font-black tracking-widest uppercase px-7 py-3.5 rounded-full transition-all active:scale-95 shadow-[0_15px_30px_rgba(214,160,70,0.25)]"
            >
              Start Trading
            </button>
          </div>
        </nav>
      </div>

      {/* ── TICKER BAR ── */}
      <div className="fixed top-32 left-0 right-0 z-40 overflow-hidden border-y border-white/5 bg-[#080808]/50 backdrop-blur-md h-9 flex items-center">
        <div className="flex items-center gap-0 whitespace-nowrap" style={{ transform: `translateX(${tickerX}px)` }}>
          {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
            <div key={i} className="flex items-center gap-4 px-10 border-r border-white/5 last:border-0 group">
              <span className="text-[10px] text-white/30 tracking-[0.2em] font-black uppercase group-hover:text-white/50 transition-colors">{t.sym}</span>
              <span className="text-[11px] font-bold text-white/80">{t.price}</span>
              <span className={`text-[10px] font-bold ${t.up ? "text-green-400" : "text-red-400"}`}>
                {t.up ? "▲" : "▼"} {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-52 pb-20 px-6 overflow-hidden">
        {/* Background radial gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at ${50 + parallaxX * 0.3}% ${45 + parallaxY * 0.3}%, rgba(214,160,70,0.06) 0%, transparent 70%)`,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6A046]/20 bg-[#D6A046]/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D6A046]/80">Live Markets · Demo Trading</span>
          </div>

          <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight mb-8">
            <span className="block text-white">Trade with the</span>
            <span className="block italic font-serif" style={{ color: '#D6A046', textShadow: '0 0 80px rgba(214,160,70,0.3)' }}>
              precision
            </span>
            <span className="block text-white">of a pro.</span>
          </h1>

          <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed font-medium">
            MANGO is a professional-grade trading terminal with real-time price streaming,
            advanced charting, and a full demo engine — built for serious traders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/trade")}
              className="group flex items-center gap-3 px-8 py-4 bg-[#D6A046] text-black text-sm font-semibold tracking-[0.15em] uppercase rounded hover:bg-[#e8b55a] transition-all duration-300 shadow-[0_0_40px_rgba(214,160,70,0.25)] hover:shadow-[0_0_60px_rgba(214,160,70,0.4)]"
            >
              Open Terminal
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button className="px-8 py-4 border border-white/10 text-white/50 text-sm tracking-[0.15em] uppercase rounded hover:border-white/30 hover:text-white/80 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Hero terminal mockup */}
        <div
          className="relative z-10 mt-20 w-full max-w-5xl mx-auto"
          style={{ transform: `perspective(1200px) rotateX(4deg) rotateY(${parallaxX * 0.08}deg)`, transition: "transform 0.1s ease" }}
        >
          <div className="rounded-xl border border-white/10 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            {/* Mock terminal top bar */}
            <div className="bg-[#111] border-b border-white/5 px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase">MANGO · Professional Trading Terminal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                LIVE
              </div>
            </div>

            {/* Mock terminal body */}
            <div className="bg-[#0A0A0A] h-64 md:h-96 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-36 border-r border-white/5 flex flex-col text-[10px]">
                <div className="px-3 py-2 text-white/20 tracking-widest border-b border-white/5">CRYPTO</div>
                {[["BTCUSD","65,358","up"],["ETHUSD","3,604","up"],["SOLUSD","145","down"]].map(([s,p,d]) => (
                  <div key={s} className={`flex justify-between px-3 py-2 border-l-2 ${d==='up'?'border-[#D6A046] bg-[#D6A046]/5':'border-transparent'}`}>
                    <span className="text-white/50">{s}</span>
                    <span className={`font-mono ${d==='up'?'text-green-400':'text-red-400'}`}>{p}</span>
                  </div>
                ))}
                <div className="px-3 py-2 text-white/20 tracking-widest border-b border-t border-white/5 mt-1">FOREX</div>
                {[["EURUSD","1.0854","up"],["GBPUSD","1.2620","up"]].map(([s,p,d]) => (
                  <div key={s} className="flex justify-between px-3 py-2">
                    <span className="text-white/50">{s}</span>
                    <span className={`font-mono ${d==='up'?'text-green-400':'text-red-400'}`}>{p}</span>
                  </div>
                ))}
              </div>

              {/* Fake chart area */}
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-2 border-b border-white/5 flex items-center gap-3">
                  <span className="text-white font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>BTCUSD</span>
                  <span className="text-green-400 font-mono text-sm">65,358.34</span>
                  <span className="text-green-400/60 text-xs">+2.41%</span>
                </div>
                <div className="flex-1 flex items-end px-4 pb-4 gap-1">
                  {[42,55,38,62,58,71,65,80,68,75,70,85,78,90,82,95,88,72,80,85,92,88,95,100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{
                      height: `${h}%`,
                      background: i % 3 === 0 ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)',
                      minWidth: 6
                    }} />
                  ))}
                </div>
              </div>

              {/* Right panel mock */}
              <div className="w-44 border-l border-white/5 px-3 py-3 hidden md:flex flex-col gap-3">
                <div className="text-[9px] tracking-widest text-white/20 uppercase">Order Entry</div>
                <div className="flex gap-1 text-[9px]">
                  {['Market','Limit','Stop'].map(t => (
                    <div key={t} className={`flex-1 text-center py-1 rounded ${t==='Market'?'bg-[#D6A046]/20 text-[#D6A046]':'text-white/20'}`}>{t}</div>
                  ))}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="bg-white/5 rounded h-6" />
                  <div className="bg-white/5 rounded h-6" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-green-500/20 rounded py-2 text-center text-[9px] text-green-400 font-bold tracking-widest">BUY</div>
                  <div className="bg-red-500/20 rounded py-2 text-center text-[9px] text-red-400 font-bold tracking-widest">SELL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow under card */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-[#D6A046]/10 blur-3xl rounded-full pointer-events-none" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="about" className="py-20 border-y border-white/5 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#D6A046] mb-2" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 40px rgba(214,160,70,0.25)" }}>
                {value}
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/30">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#D6A046]/60 mb-4">Platform Features</div>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Everything a trader needs.
            </h2>
            <p className="text-white/30 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Built from the ground up for professionals who demand speed, clarity, and control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#0A0A0A] p-8 hover:bg-[#0F0F0F] transition-colors group">
                <div className="mb-5">
                  <Icon className="w-10 h-10 text-[#D6A046]" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold tracking-wide mb-3 text-white group-hover:text-[#D6A046] transition-colors">{title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKETS / ASSET CARDS ── */}
      <section id="markets" className="py-28 border-t border-white/5 bg-[#0D0D0D] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#D6A046] font-bold mb-4">Choose Your Market</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Pick an asset, <span className="text-white/40">start trading.</span>
            </h2>
            <p className="text-white/30 mt-4 text-sm font-medium">Click any instrument to open its dedicated chart and trading panel.</p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-14">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              value={assetSearch}
              onChange={e => setAssetSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-[#2A2E39] border border-transparent rounded-full pl-11 pr-4 py-3 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-white/10 transition-all font-medium"
            />
            {assetSearch && (
              <button
                onClick={() => setAssetSearch("")}
                className="absolute inset-y-0 right-4 flex items-center text-white/20 hover:text-white/50 transition-colors text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Asset groups — filtered */}
          {(() => {
            const q = assetSearch.toLowerCase().trim();
            const filtered = ASSET_GROUPS.map(g => ({
              ...g,
              assets: q
                ? g.assets.filter(a =>
                    a.label.toLowerCase().includes(q) ||
                    a.sym.toLowerCase().includes(q) ||
                    a.tag.toLowerCase().includes(q)
                  )
                : g.assets,
            })).filter(g => g.assets.length > 0);

            if (filtered.length === 0) {
              return (
                <div className="text-center py-16 text-white/20 text-sm">
                  No assets found for "<span className="text-white/40">{assetSearch}</span>"
                </div>
              );
            }

            return (
              <div className="space-y-10">
                {filtered.map(({ cat, color, assets }) => (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color }}>{cat}</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {assets.map(({ label, sym, tag }) => (
                        <button
                          key={sym}
                          onClick={() => navigate(`/trade/${sym}`)}
                          className="group relative border border-white/5 rounded-lg p-4 text-left hover:border-white/15 transition-all duration-300 bg-[#0A0A0A] hover:bg-[#101010] overflow-hidden"
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                            style={{ background: `radial-gradient(ellipse at 50% 100%, ${color}12 0%, transparent 70%)` }}
                          />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-[9px] tracking-[0.2em] uppercase" style={{ color: `${color}90` }}>{tag}</div>
                              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                                {(() => {
                                  const currentAsset = assets.find(a => a.sym === sym);
                                  return <AssetIcon sym={sym} cat={cat} domain={currentAsset?.domain} size="md" />;
                                })()}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors mb-3">{label}</div>
                            <div className="flex items-center gap-1 text-[10px] tracking-widest" style={{ color }}>
                              Trade Now
                              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── ABOUT SECTION (PLACEHOLDER) ── */}
      <section id="about" className="py-32 px-6 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6A046]/20 bg-[#D6A046]/5 mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D6A046]/80 font-bold">The Vision</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            About <span className="text-[#D6A046]">MANGO</span> Terminal
          </h2>
          <div className="space-y-6 text-white/40 leading-relaxed text-lg max-w-2xl mx-auto">
            <p>
              MANGO is being designed as a professional-grade trading ecosystem for serious market participants. 
              Our mission is to democratize high-end trading tools through a seamless, institutional-level terminal 
              that prioritizes precision, speed, and beautiful design.
            </p>
            <p className="italic">
              [Placeholder: Additional text to be provided by user...]
            </p>
          </div>
        </div>
      </section>

      {/* ── BROKER LIST SECTION (PLACEHOLDER) ── */}
      <section id="brokers" className="py-32 px-6 border-b border-white/5 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, rgba(214,160,70,0.03) 0%, transparent 50%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6A046]/20 bg-[#D6A046]/5 mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D6A046]/80 font-bold">Trusted Partners</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Certified <span className="text-[#D6A046]">Brokers</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center border-dashed opacity-20 hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 rounded-full border border-white/10 mb-4" />
                <div className="h-2 w-24 bg-white/10 rounded mb-2" />
                <div className="h-2 w-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
          <p className="mt-12 text-white/20 italic text-sm">
            [Placeholder: Real broker integration coming soon. This section will feature verified partner connections.]
          </p>
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(214,160,70,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start trading{" "}
            <span className="italic" style={{ color: "#D6A046" }}>today.</span>
          </h2>
          <p className="text-white/30 mb-10 text-sm leading-relaxed">
            No signup required. Open the terminal, pick an asset, and trade with $100,000 in demo capital.
          </p>
          <button
            onClick={() => navigate("/trade")}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#D6A046] text-black font-bold text-sm tracking-[0.2em] uppercase rounded hover:bg-[#e8b55a] transition-all duration-300 shadow-[0_0_60px_rgba(214,160,70,0.3)] hover:shadow-[0_0_80px_rgba(214,160,70,0.5)]"
          >
            Launch MANGO Terminal →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[#D6A046] font-bold tracking-[0.2em]" style={{ fontFamily: "'Playfair Display', serif" }}>MANGO</span>
        <span className="text-[10px] text-white/20 tracking-widest">© 2026 MANGO Terminal · For educational & demo purposes only.</span>
        <button onClick={() => navigate("/trade")} className="text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-[#D6A046] transition-colors">
          Open Terminal →
        </button>
      </footer>
    </div>
  );
}
