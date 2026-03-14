import { useEffect, useRef } from "react";
import { useStore } from "@/store";

const TV_SYMBOL_MAP: Record<string, string> = {
  // Crypto
  BTCUSD:   "BINANCE:BTCUSDT",
  ETHUSD:   "BINANCE:ETHUSDT",
  SOLUSD:   "BINANCE:SOLUSDT",
  BNBUSD:   "BINANCE:BNBUSDT",
  XRPUSD:   "BINANCE:XRPUSDT",
  ADAUSD:   "BINANCE:ADAUSDT",
  DOTUSD:   "BINANCE:DOTUSDT",
  DOGEUSD:  "BINANCE:DOGEUSDT",
  MATICUSD: "BINANCE:MATICUSDT",
  LINKUSD:  "BINANCE:LINKUSDT",
  LTCUSD:   "BINANCE:LTCUSDT",
  AVAXUSD:  "BINANCE:AVAXUSDT",
  ATOMUSD:  "BINANCE:ATOMUSDT",
  UNIUSD:   "BINANCE:UNIUSDT",
  NEARUSD:  "BINANCE:NEARUSDT",

  // Commodities
  XAUUSD:    "OANDA:XAUUSD",
  XAGUSD:    "OANDA:XAGUSD",
  CRUDEOIL:  "NYMEX:CL1!",
  BRENT:     "ICEEURE:BRN1!",
  NATGAS:    "NYMEX:NG1!",
  COPPER:    "COMEX:HG1!",
  PLATINUM:  "NYMEX:PL1!",
  PALLADIUM: "NYMEX:PA1!",
  CORN:      "CBOT:ZC1!",
  WHEAT:     "CBOT:ZW1!",

  // Forex
  // Forex - Majors
  EURUSD: "OANDA:EURUSD",
  GBPUSD: "OANDA:GBPUSD",
  USDJPY: "OANDA:USDJPY",
  AUDUSD: "OANDA:AUDUSD",
  USDCAD: "OANDA:USDCAD",
  USDCHF: "OANDA:USDCHF",
  NZDUSD: "OANDA:NZDUSD",
  // Forex - Minors & Crosses
  EURJPY: "OANDA:EURJPY",
  GBPJPY: "OANDA:GBPJPY",
  EURGBP: "OANDA:EURGBP",
  EURCHF: "OANDA:EURCHF",
  EURAUD: "OANDA:EURAUD",
  EURCAD: "OANDA:EURCAD",
  EURNZD: "OANDA:EURNZD",
  GBPCHF: "OANDA:GBPCHF",
  GBPAUD: "OANDA:GBPAUD",
  GBPCAD: "OANDA:GBPCAD",
  GBPNZD: "OANDA:GBPNZD",
  AUDJPY: "OANDA:AUDJPY",
  AUDCHF: "OANDA:AUDCHF",
  AUDCAD: "OANDA:AUDCAD",
  AUDNZD: "OANDA:AUDNZD",
  NZDJPY: "OANDA:NZDJPY",
  NZDCHF: "OANDA:NZDCHF",
  NZDCAD: "OANDA:NZDCAD",
  CADJPY: "OANDA:CADJPY",
  CADCHF: "OANDA:CADCHF",
  CHFJPY: "OANDA:CHFJPY",
  // Forex - Exotics
  USDTRY: "FX_IDC:USDTRY",
  USDMXN: "FX_IDC:USDMXN",
  USDZAR: "FX_IDC:USDZAR",
  USDSGD: "OANDA:USDSGD",
  USDHKD: "OANDA:USDHKD",
  USDNOK: "OANDA:USDNOK",
  USDSEK: "OANDA:USDSEK",
  USDDKK: "OANDA:USDDKK",
  EURTRY: "FX_IDC:EURTRY",
  USDINR: "FX_IDC:USDINR",

  // Stocks (MNCs)
  AAPL: "NASDAQ:AAPL", MSFT: "NASDAQ:MSFT", NVDA: "NASDAQ:NVDA", AMZN: "NASDAQ:AMZN", GOOGL: "NASDAQ:GOOGL",
  META: "NASDAQ:META", TSLA: "NASDAQ:TSLA", BRKB: "NYSE:BRK.B", UNH: "NYSE:UNH", V: "NYSE:V",
  JPM: "NYSE:JPM", LLY: "NYSE:LLY", AVGO: "NASDAQ:AVGO", MA: "NYSE:MA", WMT: "NYSE:WMT",
  HD: "NYSE:HD", PG: "NYSE:PG", COST: "NASDAQ:COST", JNJ: "NYSE:JNJ", ORCL: "NYSE:ORCL",
  ADBE: "NASDAQ:ADBE", CRM: "NYSE:CRM", AMD: "NASDAQ:AMD", PEP: "NASDAQ:PEP", KO: "NYSE:KO",

  // Indices
  NASDAQ:  "NASDAQ:NDX",
  SPX:     "CBOE:SPX",
  DOW:     "DJ:DJI",
  RUSSELL: "TVC:RUT",
  DAX:     "XETR:DAX",
  FTSE:    "CURRENCYCOM:UK100",
  CAC:     "EURONEXT:CAC40",
  NIKKEI:  "OSE:NI225",
  HSI:     "HSI:HSI",
  ASX:     "ASX:XJO",
};

export function TradingChart() {
  const { selectedSymbol, prices } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPrice = prices[selectedSymbol] || 0;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== "undefined" && containerRef.current) {
        new (window as any).TradingView.widget({
          container_id: "tv_chart_container",
          symbol: TV_SYMBOL_MAP[selectedSymbol] || `BINANCE:${selectedSymbol.replace("USD", "USDT")}`,
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0A0A0A",
          enable_publishing: false,
          allow_symbol_change: false,
          save_image: false,
          hide_side_toolbar: false,
          overrides: {
            "paneProperties.background": "#0A0A0A",
            "paneProperties.backgroundType": "solid",
            "scalesProperties.lineColor": "#1a1a1a",
            "scalesProperties.textColor": "#555",
          },
          autosize: true,
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [selectedSymbol]);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Chart top bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b shrink-0" style={{ background: '#0D0D0D', borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-bold text-base text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {selectedSymbol}
          </span>
        </div>
        <div className="font-mono text-sm text-primary font-medium">
          {currentPrice > 0 ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—'}
        </div>
        <div className="ml-auto flex items-center gap-3 text-[10px] tracking-widest text-muted-foreground uppercase">
          <span>1m</span><span>5m</span><span className="text-primary">1H</span><span>4H</span><span>1D</span>
        </div>
      </div>

      {/* TradingView chart */}
      <div id="tv_chart_container" className="flex-1" ref={containerRef} />
    </div>
  );
}
