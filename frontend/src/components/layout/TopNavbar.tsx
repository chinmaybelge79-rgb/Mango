import { useStore } from "@/store";
import { Bell, Settings, User, Zap, Search as SearchIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AssetIcon } from "@/components/common/AssetIcon";
import { ASSET_GROUPS, getAssetBySym } from "@/constants/assets";

export function TopNavbar() {
  const { isConnected, selectedSymbol, setSelectedSymbol } = useStore();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const activeAsset = getAssetBySym(selectedSymbol);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0 relative z-50 border-white/5">
      {/* Brand & Active Asset */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="font-bold text-xl tracking-wider text-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            MANGO
          </span>
        </div>

        {activeAsset && (
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <AssetIcon sym={activeAsset.sym} cat={activeAsset.cat} domain={activeAsset.domain} size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide leading-none">{activeAsset.sym}</span>
              <span className="text-[10px] text-white/40 leading-none mt-1">{activeAsset.label}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Center Search (Command Palette Style) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4" ref={searchRef}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search assets, indices, and more..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            className="h-10 w-full bg-[#2A2E39]/40 border border-white/5 rounded-full pl-10 pr-12 text-[13px] text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-[#2A2E39]/60 hover:bg-[#2A2E39]/50 transition-all font-medium"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="text-[10px] text-muted-foreground/30 font-bold tracking-tighter border border-white/5 rounded px-1.5 py-0.5 bg-black/30">
              ⌘K
            </span>
          </div>

          {/* Search Dropdown */}
          {showSearch && search.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1E26] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto z-50">
              {ASSET_GROUPS.map((group) => {
                const matches = group.assets.filter(a => 
                  a.sym.toLowerCase().includes(search.toLowerCase()) || 
                  a.label.toLowerCase().includes(search.toLowerCase())
                );
                
                if (matches.length === 0) return null;

                return (
                  <div key={group.cat}>
                    <div className="px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-white/20 bg-white/2">
                      {group.cat}
                    </div>
                    {matches.map((asset) => (
                      <button
                        key={asset.sym}
                        onClick={() => {
                          setSelectedSymbol(asset.sym);
                          setSearch("");
                          setShowSearch(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors group/item border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <AssetIcon sym={asset.sym} cat={group.cat} domain={asset.domain} size="sm" />
                          <div>
                            <div className="text-xs font-bold text-white group-hover/item:text-primary transition-colors">{asset.sym}</div>
                            <div className="text-[10px] text-white/40">{asset.label}</div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover/item:opacity-100 text-primary text-[10px] font-bold">TRADE</div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-xs text-green-400 font-semibold tracking-wide">
          <span className="live-dot inline-block w-2 h-2 rounded-full bg-green-400" />
          {isConnected ? "LIVE" : "SYNCING"}
        </div>
        <div className="w-px h-5 bg-white/5" />
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Bell className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}
