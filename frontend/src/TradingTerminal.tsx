import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TopNavbar } from "./components/layout/TopNavbar";
import { TradingChart } from "./components/charts/TradingChart";
import { TradingPanel } from "./components/trading-panel/TradingPanel";
import { BottomTerminal } from "./components/bottom-terminal/BottomTerminal";
import { useStore } from "./store";

// All supported symbols
const VALID_SYMBOLS = [
  "BTCUSD", "ETHUSD", "SOLUSD", "BNBUSD", "XRPUSD", "ADAUSD", "DOTUSD", "DOGEUSD", "MATICUSD", "LINKUSD", "LTCUSD", "AVAXUSD", "ATOMUSD", "UNIUSD", "NEARUSD",
  "XAUUSD", "XAGUSD", "CRUDEOIL", "BRENT", "NATGAS", "COPPER", "PLATINUM", "PALLADIUM", "CORN", "WHEAT",
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD", 
  "EURJPY", "GBPJPY", "EURGBP", "EURCHF", "EURAUD", "EURCAD", "EURNZD", "GBPCHF", "GBPAUD", "GBPCAD", "GBPNZD",
  "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY",
  "USDTRY", "USDMXN", "USDZAR", "USDSGD", "USDHKD", "USDNOK", "USDSEK", "USDDKK", "EURTRY", "USDINR",
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "BRKB", "UNH", "V", "JPM", "LLY", "AVGO", "MA", "WMT", "HD", "PG", "COST", "JNJ", "ORCL", "ADBE", "CRM", "AMD", "PEP", "KO",
  "NASDAQ", "SPX", "DOW", "RUSSELL", "DAX", "FTSE", "CAC", "NIKKEI", "HSI", "ASX",
];

export default function TradingTerminal() {
  const { symbol } = useParams<{ symbol?: string }>();
  const navigate = useNavigate();
  const { updatePrices, setConnectionStatus, setPositions, setSelectedSymbol } = useStore();

  // Set symbol from URL on mount / change
  useEffect(() => {
    const target = symbol?.toUpperCase() ?? "BTCUSD";
    if (VALID_SYMBOLS.includes(target)) {
      setSelectedSymbol(target);
    } else {
      navigate("/trade/BTCUSD", { replace: true });
    }
  }, [symbol]);

  // WebSocket + polling
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:3000");
    ws.onopen = () => setConnectionStatus(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "init" || data.type === "price_update") {
          updatePrices(data.prices);
        }
      } catch {}
    };
    ws.onclose = () => setConnectionStatus(false);

    const fetchPortfolio = async () => {
      try {
        const posRes = await fetch("http://127.0.0.1:3000/api/positions");
        if (posRes.ok) setPositions(await posRes.json());
      } catch {}
    };
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 1500);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground antialiased">
      <TopNavbar />
      {/* No Watchlist — full-width chart + panel layout */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <TradingChart />
          <BottomTerminal />
        </div>
        <TradingPanel />
      </div>
    </div>
  );
}
