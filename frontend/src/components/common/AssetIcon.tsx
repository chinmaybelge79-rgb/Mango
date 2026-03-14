import React from 'react';

interface AssetIconProps {
  sym: string;
  cat?: string;
  domain?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FLAG_MAPPING: Record<string, string> = {
  eur: "eu", usd: "us", gbp: "gb", jpy: "jp", aud: "au", cad: "ca", chf: "ch", nzd: "nz",
  try: "tr", mxn: "mx", zar: "za", inr: "in", sgd: "sg", hkd: "hk", nok: "no", sek: "se", dkk: "dk"
};

const INDEX_ICONS: Record<string, string> = {
  NASDAQ: "🏛️", SPX: "📈", DOW: "📊", RUSSELL: "💼", DAX: "🇩🇪", FTSE: "🇬🇧", CAC: "🇫🇷", NIKKEI: "🇯🇵", HSI: "🇭🇰", ASX: "🇦🇺"
};

const COMMODITY_ICONS: Record<string, string> = {
  XAUUSD: "🪙", XAGUSD: "🥈", CRUDEOIL: "🛢️", BRENT: "⛽", NATGAS: "🔥", COPPER: "🧱", PLATINUM: "💍", PALLADIUM: "💎", CORN: "🌽", WHEAT: "🌾"
};

export const AssetIcon: React.FC<AssetIconProps> = ({ sym, cat, domain, size = 'md', className = '' }) => {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  
  // Logic to determine category if not provided (fallback)
  const category = cat || (
    sym.endsWith('USD') && sym.length === 6 ? 'Crypto' :
    sym.length === 6 && !sym.includes('XAU') ? 'Forex' :
    domain ? 'Stocks' : 'Indices'
  );

  if (category === "Forex") {
    const base = sym.substring(0, 3).toLowerCase();
    const quote = sym.substring(3, 6).toLowerCase();
    const baseFlag = `https://flagcdn.com/w40/${FLAG_MAPPING[base] || "us"}.png`;
    const quoteFlag = `https://flagcdn.com/w40/${FLAG_MAPPING[quote] || "us"}.png`;

    return (
      <div className={`relative flex items-center ${s} ${className}`}>
        {/* Base Currency Flag (Top Left) */}
        <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-full overflow-hidden border border-black/20 z-10 shadow-sm">
          <img src={baseFlag} alt={base} className="w-full h-full object-cover" />
        </div>
        {/* Quote Currency Flag (Bottom Right) */}
        <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-full overflow-hidden border border-black/20 z-0">
          <img src={quoteFlag} alt={quote} className="w-full h-full object-cover" />
          {/* Visual Overlay/Slash Effect */}
          <div className="absolute inset-0 bg-black/5" />
        </div>
      </div>
    );
  }

  if (category === "Crypto") {
    const cryptoSym = sym.replace('USD', '').toLowerCase();
    const iconUrl = `https://cryptoicons.org/api/icon/${cryptoSym}/40`;
    return (
      <div className={`${s} rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center ${className}`}>
        <img src={iconUrl} alt={sym} className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${cryptoSym}&background=random&color=fff`;
        }} />
      </div>
    );
  }

  if (category === "Stocks" && domain) {
    return (
      <div className={`${s} rounded-md overflow-hidden bg-white flex items-center justify-center p-0.5 border border-white/10 ${className}`}>
        <img src={`https://logo.clearbit.com/${domain}`} alt={sym} className="w-full h-full object-contain" />
      </div>
    );
  }

  if (category === "Indices") {
    return (
      <div className={`${s} flex items-center justify-center text-[10px] ${className}`}>
        {INDEX_ICONS[sym] || "📈"}
      </div>
    );
  }

  if (category === "Commodities") {
      return (
        <div className={`${s} flex items-center justify-center text-[10px] ${className}`}>
          {COMMODITY_ICONS[sym] || "📦"}
        </div>
      );
    }

  return (
    <div className={`${s} flex items-center justify-center bg-white/5 rounded-full border border-white/5 text-[8px] text-white/40 ${className}`}>
      {sym.substring(0, 2)}
    </div>
  );
};
