import { useState } from "react";
import { useStore, type OrderType } from "@/store";

export function TradingPanel() {
  const { selectedSymbol, prices, balance } = useStore();
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [size, setSize] = useState("1");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const currentPrice = prices[selectedSymbol] || 0;
  const estimatedMargin = currentPrice > 0 ? (parseFloat(size || "0") * currentPrice) : 0;

  const executeTrade = async (side: 'BUY' | 'SELL') => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: selectedSymbol, type: orderType, side, size, price: currentPrice })
      });
      if (!response.ok) throw new Error("Order failed");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-72 border-l bg-card flex flex-col shrink-0 overflow-y-auto" style={{ borderColor: 'hsl(var(--border))' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {selectedSymbol}
          </span>
          <span className="text-xs text-muted-foreground">Order Entry</span>
        </div>
        <div className="font-mono text-sm text-primary mt-0.5">
          {currentPrice > 0 ? currentPrice.toFixed(currentPrice > 100 ? 2 : 4) : '—'}
        </div>
      </div>

      {/* Order type tabs */}
      <div className="flex border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        {(['MARKET', 'LIMIT', 'STOP'] as OrderType[]).map(t => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`flex-1 py-2 text-[10px] tracking-[0.15em] font-medium uppercase transition-colors ${
              orderType === t
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ borderColor: orderType === t ? 'hsl(var(--primary))' : 'transparent' }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="flex-1 px-4 py-4 space-y-4">

        {orderType !== 'MARKET' && (
          <div>
            <label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Price</label>
            <input
              type="number"
              defaultValue={currentPrice}
              className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}

        <div>
          <label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block">Quantity (Units)</label>
          <input
            type="number"
            value={size}
            onChange={e => setSize(e.target.value)}
            className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block text-green-600">Take Profit</label>
            <input
              type="number"
              value={tp}
              onChange={e => setTp(e.target.value)}
              placeholder="Optional"
              className="w-full bg-secondary border border-border rounded px-2 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1.5 block text-red-600">Stop Loss</label>
            <input
              type="number"
              value={sl}
              onChange={e => setSl(e.target.value)}
              placeholder="Optional"
              className="w-full bg-secondary border border-border rounded px-2 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <div>
            <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground mb-0.5">Balance</div>
            <div className="text-xs font-mono text-foreground">${balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground mb-0.5">Est. Value</div>
            <div className="text-xs font-mono text-primary">${estimatedMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>

        {/* Buy / Sell */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => executeTrade('BUY')}
            className="btn-buy py-3 rounded text-white text-xs tracking-[0.2em] font-semibold uppercase"
          >
            Buy
          </button>
          <button
            onClick={() => executeTrade('SELL')}
            className="btn-sell py-3 rounded text-white text-xs tracking-[0.2em] font-semibold uppercase"
          >
            Sell
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="text-[9px] text-muted-foreground/50 text-center tracking-wider">
          B = Buy · S = Sell · ESC = Cancel
        </div>
      </div>
    </div>
  );
}
