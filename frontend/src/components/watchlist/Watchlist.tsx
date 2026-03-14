import { useStore } from "@/store";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useRef, useEffect } from "react";
import { AssetIcon } from "@/components/common/AssetIcon";
import { getAssetBySym } from "@/constants/assets";

const ASSETS = [
  { symbol: "BTCUSD",   label: "Bitcoin",   cat: "Crypto" },
  { symbol: "ETHUSD",   label: "Ethereum",  cat: "Crypto" },
  { symbol: "SOLUSD",   label: "Solana",    cat: "Crypto" },
  { symbol: "EURUSD",   label: "EUR/USD",   cat: "Forex" },
  { symbol: "GBPUSD",   label: "GBP/USD",   cat: "Forex" },
  { symbol: "USDJPY",   label: "USD/JPY",   cat: "Forex" },
  { symbol: "AAPL",     label: "Apple Inc.",cat: "Stocks" },
  { symbol: "NVDA",     label: "NVIDIA",    cat: "Stocks" },
  { symbol: "MSFT",     label: "Microsoft", cat: "Stocks" },
  { symbol: "TSLA",     label: "Tesla",     cat: "Stocks" },
  { symbol: "NASDAQ",   label: "Nasdaq 100",cat: "Indices" },
  { symbol: "SPX",      label: "S&P 500",   cat: "Indices" },
  { symbol: "XAUUSD",   label: "Gold",      cat: "Commodities" },
];

export function Watchlist() {
  const { prices, selectedSymbol, setSelectedSymbol } = useStore();
  const prevPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    prevPricesRef.current = { ...prices };
  }, [prices]);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes("JPY")) return price.toFixed(2);
    if (price > 10000) return price.toFixed(0);
    if (price > 100)  return price.toFixed(1);
    if (price > 1)    return price.toFixed(3);
    return price.toFixed(4);
  };

  const categories = Array.from(new Set(ASSETS.map(a => a.cat)));

  return (
    <div className="w-56 border-r bg-card flex flex-col shrink-0 scanline-anim" style={{ borderColor: 'hsl(var(--border))' }}>
      {/* Header */}
      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: 'hsl(var(--border))' }}>
        <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">Market Watch</span>
      </div>

      {/* Assets grouped by category */}
      <div className="flex-1 overflow-y-auto">
        {categories.map(cat => (
          <div key={cat}>
            <div className="px-3 py-1.5 text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase font-medium border-b" style={{ borderColor: 'hsl(var(--border))' }}>
              {cat}
            </div>
            {ASSETS.filter(a => a.cat === cat).map(({ symbol, label }) => {
              const price = prices[symbol] || 0;
              const prevPrice = prevPricesRef.current[symbol] || price;
              const isUp = price >= prevPrice;
              const isSelected = selectedSymbol === symbol;

              return (
                <div
                  key={symbol}
                  onClick={() => setSelectedSymbol(symbol)}
                  className={`watchlist-row flex items-center justify-between px-3 py-2 cursor-pointer border-l-2 ${
                    isSelected
                      ? 'active border-l-primary bg-primary/5'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <AssetIcon 
                      sym={symbol} 
                      cat={cat} 
                      domain={getAssetBySym(symbol)?.domain} 
                      size="sm" 
                      className="shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-foreground truncate">{symbol}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-mono ${isUp ? 'price-up' : 'price-down'}`}>
                      {price > 0 ? formatPrice(price, symbol) : '—'}
                    </div>
                    <div className={`flex items-center justify-end gap-0.5 text-[9px] ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? <ArrowUp className="h-2 w-2" /> : <ArrowDown className="h-2 w-2" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
