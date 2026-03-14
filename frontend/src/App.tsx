import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TradingTerminal from "./TradingTerminal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* /trade with optional symbol param — defaults to BTCUSD */}
        <Route path="/trade" element={<TradingTerminal />} />
        <Route path="/trade/:symbol" element={<TradingTerminal />} />
      </Routes>
    </BrowserRouter>
  );
}
