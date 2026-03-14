export interface Asset {
  label: string;
  sym: string;
  tag: string;
  domain?: string; // For stock logos
}

export interface AssetGroup {
  cat: string;
  color: string;
  assets: Asset[];
}

export const ASSET_GROUPS: AssetGroup[] = [
  {
    cat: "Crypto",
    color: "#F59E0B",
    assets: [
      { label: "Bitcoin",       sym: "BTCUSD",   tag: "BTC/USD" },
      { label: "Ethereum",      sym: "ETHUSD",   tag: "ETH/USD" },
      { label: "Solana",        sym: "SOLUSD",   tag: "SOL/USD" },
      { label: "BNB",           sym: "BNBUSD",   tag: "BNB/USD" },
      { label: "XRP",           sym: "XRPUSD",   tag: "XRP/USD" },
      { label: "Cardano",       sym: "ADAUSD",   tag: "ADA/USD" },
      { label: "Polkadot",      sym: "DOTUSD",   tag: "DOT/USD" },
      { label: "Chainlink",     sym: "LINKUSD",  tag: "LINK/USD" },
      { label: "Avalanche",     sym: "AVAXUSD",  tag: "AVAX/USD" },
      { label: "Litecoin",      sym: "LTCUSD",   tag: "LTC/USD" },
    ],
  },
  {
    cat: "Forex",
    color: "#3B82F6",
    assets: [
      { label: "EUR / USD",     sym: "EURUSD",   tag: "EUR/USD" },
      { label: "GBP / USD",     sym: "GBPUSD",   tag: "GBP/USD" },
      { label: "USD / JPY",     sym: "USDJPY",   tag: "USD/JPY" },
      { label: "AUD / USD",     sym: "AUDUSD",   tag: "AUD/USD" },
      { label: "USD / CHF",     sym: "USDCHF",   tag: "USD/CHF" },
      { label: "USD / CAD",     sym: "USDCAD",   tag: "USD/CAD" },
      { label: "NZD / USD",     sym: "NZDUSD",   tag: "NZD/USD" },
      { label: "EUR / JPY",     sym: "EURJPY",   tag: "EUR/JPY" },
      { label: "GBP / JPY",     sym: "GBPJPY",   tag: "GBP/JPY" },
      { label: "EUR / GBP",     sym: "EURGBP",   tag: "EUR/GBP" },
      { label: "EUR / AUD",     sym: "EURAUD",   tag: "EUR/AUD" },
      { label: "GBP / AUD",     sym: "GBPAUD",   tag: "GBP/AUD" },
      { label: "USD / TRY",     sym: "USDTRY",   tag: "USD/TRY" },
      { label: "USD / INR",     sym: "USDINR",   tag: "USD/INR" },
      { label: "USD / MXN",     sym: "USDMXN",   tag: "USD/MXN" },
      { label: "USD / ZAR",     sym: "USDZAR",   tag: "USD/ZAR" },
    ],
  },
  {
    cat: "Stocks",
    color: "#10B981",
    assets: [
      { label: "Apple Inc.",      sym: "AAPL",     tag: "AAPL",  domain: "apple.com" },
      { label: "Microsoft",       sym: "MSFT",     tag: "MSFT",  domain: "microsoft.com" },
      { label: "NVIDIA Corp.",    sym: "NVDA",     tag: "NVDA",  domain: "nvidia.com" },
      { label: "Amazon.com",      sym: "AMZN",     tag: "AMZN",  domain: "amazon.com" },
      { label: "Alphabet Inc.",   sym: "GOOGL",    tag: "GOOGL", domain: "google.com" },
      { label: "Meta Platforms",  sym: "META",     tag: "META",  domain: "facebook.com" },
      { label: "Tesla, Inc.",     sym: "TSLA",     tag: "TSLA",  domain: "tesla.com" },
      { label: "Broadcom Inc.",   sym: "AVGO",     tag: "AVGO",  domain: "broadcom.com" },
      { label: "Visa Inc.",       sym: "V",        tag: "V",     domain: "visa.com" },
      { label: "Mastercard",      sym: "MA",       tag: "MA",    domain: "mastercard.com" },
      { label: "JPMorgan Chase",  sym: "JPM",      tag: "JPM",   domain: "jpmorganchase.com" },
      { label: "Eli Lilly",       sym: "LLY",      tag: "LLY",   domain: "lilly.com" },
      { label: "Walmart Inc.",    sym: "WMT",      tag: "WMT",   domain: "walmart.com" },
      { label: "Adobe Inc.",      sym: "ADBE",     tag: "ADBE",  domain: "adobe.com" },
      { label: "Oracle Corp.",    sym: "ORCL",     tag: "ORCL",  domain: "oracle.com" },
    ],
  },
  {
    cat: "Indices",
    color: "#A78BFA",
    assets: [
      { label: "Nasdaq 100",    sym: "NASDAQ",   tag: "US100" },
      { label: "S&P 500",       sym: "SPX",      tag: "SPX500" },
      { label: "Dow Jones 30",  sym: "DOW",      tag: "US30" },
      { label: "Russell 2000",  sym: "RUSSELL",  tag: "US2000" },
      { label: "DAX 40",        sym: "DAX",      tag: "GER40" },
      { label: "FTSE 100",      sym: "FTSE",     tag: "UK100" },
      { label: "Nikkei 225",    sym: "NIKKEI",   tag: "JPN225" },
    ],
  },
  {
    cat: "Commodities",
    color: "#F97316",
    assets: [
      { label: "Gold / USD",    sym: "XAUUSD",   tag: "GOLD" },
      { label: "Silver / USD",  sym: "XAGUSD",   tag: "SILVER" },
      { label: "Crude Oil",     sym: "CRUDEOIL", tag: "WTI" },
      { label: "Brent Oil",     sym: "BRENT",    tag: "BRENT" },
      { label: "Natural Gas",   sym: "NATGAS",   tag: "GAS" },
    ],
  },
];

export const getAssetBySym = (sym: string) => {
  for (const group of ASSET_GROUPS) {
    const asset = group.assets.find(a => a.sym === sym);
    if (asset) return { ...asset, cat: group.cat, color: group.color };
  }
  return null;
};
