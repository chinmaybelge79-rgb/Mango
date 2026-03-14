import { useState } from "react";
import { useStore } from "@/store";

type Tab = 'positions' | 'orders' | 'history' | 'summary';

export function BottomTerminal() {
  const { positions, orders, balance, margin, equity } = useStore();
  const [tab, setTab] = useState<Tab>('positions');

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'positions', label: 'Positions', count: positions.length },
    { id: 'orders',   label: 'Orders',    count: orders.filter(o => o.status === 'OPEN').length },
    { id: 'history',  label: 'History' },
    { id: 'summary',  label: 'Account' },
  ];

  return (
    <div className="h-44 border-t bg-card flex flex-col shrink-0" style={{ borderColor: 'hsl(var(--border))' }}>
      {/* Tab bar */}
      <div className="flex border-b shrink-0" style={{ borderColor: 'hsl(var(--border))' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-5 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition-colors border-b-2 ${
              tab === t.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${tab === t.id ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === 'positions' && (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-secondary/70">
              <tr>
                {['Symbol', 'Side', 'Size', 'Entry', 'Mark Price', 'PnL'].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-xs">No open positions</td></tr>
              ) : (
                positions.map((pos: any) => {
                  const pnl = pos.pnl ?? 0;
                  return (
                    <tr key={pos.id} className="border-t hover:bg-secondary/20 transition-colors" style={{ borderColor: 'hsl(var(--border))' }}>
                      <td className="px-4 py-2 font-medium">{pos.symbol}</td>
                      <td className="px-4 py-2">
                        <span className={`text-[9px] tracking-widest px-2 py-0.5 rounded-sm font-medium ${
                          pos.side === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono">{pos.size}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground">{pos.entry_price?.toFixed(2)}</td>
                      <td className="px-4 py-2 font-mono">{pos.currentPrice?.toFixed(2) ?? '—'}</td>
                      <td className={`px-4 py-2 font-mono font-medium ${pnl > 0 ? 'price-up' : pnl < 0 ? 'price-down' : 'text-muted-foreground'}`}>
                        {pnl > 0 ? '+' : ''}{pnl.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {tab === 'orders' && (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">No pending orders</div>
        )}

        {tab === 'history' && (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">No trade history</div>
        )}

        {tab === 'summary' && (
          <div className="grid grid-cols-3 gap-4 p-5">
            {[
              { label: 'Balance',     value: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Equity',      value: `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
              { label: 'Margin Used', value: `$${margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            ].map(({ label, value }) => (
              <div key={label} className="border rounded p-4" style={{ borderColor: 'hsl(var(--border))' }}>
                <div className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-2">{label}</div>
                <div className="font-mono text-base font-medium">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
