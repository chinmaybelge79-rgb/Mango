import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection handling
const clients: Set<WebSocket> = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'init', prices: currentPrices }));
  ws.on('close', () => clients.delete(ws));
});

const broadcastPriceUpdate = (data: any) => {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Simulated Price Engine
const currentPrices: Record<string, number> = {
  // Crypto
  BTCUSD: 66000.5, ETHUSD: 3500.25, SOLUSD: 145.5, BNBUSD: 600.1, XRPUSD: 0.61,
  ADAUSD: 0.45, DOTUSD: 7.2, DOGEUSD: 0.16, MATICUSD: 0.72, LINKUSD: 18.5,
  LTCUSD: 85.0, AVAXUSD: 35.5, ATOMUSD: 8.4, UNIUSD: 7.8, NEARUSD: 6.2,

  // Commodities
  XAUUSD: 2350.4, XAGUSD: 28.5, CRUDEOIL: 82.3, BRENT: 87.5, NATGAS: 2.3,
  COPPER: 4.5, PLATINUM: 950.0, PALLADIUM: 1050.0, CORN: 4.5, WHEAT: 6.2,

  // Forex - Majors
  EURUSD: 1.085, GBPUSD: 1.265, USDJPY: 155.4, AUDUSD: 0.665, USDCAD: 1.365,
  USDCHF: 0.905, NZDUSD: 0.605,
  // Forex - Minors & Crosses
  EURJPY: 168.5, GBPJPY: 196.2, EURGBP: 0.855, EURCHF: 0.982, EURAUD: 1.635,
  EURCAD: 1.482, EURNZD: 1.795, GBPCHF: 1.152, GBPAUD: 1.912, GBPCAD: 1.728,
  GBPNZD: 2.095, AUDJPY: 103.2, AUDCHF: 0.598, AUDCAD: 0.908, AUDNZD: 1.098,
  NZDJPY: 94.2, NZDCHF: 0.548, NZDCAD: 0.825, CADJPY: 113.8, CADCHF: 0.662,
  CHFJPY: 171.8,
  // Forex - Exotics
  USDTRY: 32.25, USDMXN: 16.85, USDZAR: 18.45, USDSGD: 1.345, USDHKD: 7.82,
  USDNOK: 10.65, USDSEK: 10.75, USDDKK: 6.92, EURTRY: 34.95, USDINR: 83.35,

  // Stocks (MNCs)
  AAPL: 190.5, MSFT: 420.2, NVDA: 900.5, AMZN: 185.3, GOOGL: 155.8,
  META: 505.4, TSLA: 175.2, BRKB: 410.5, UNH: 490.2, V: 280.4,
  JPM: 195.8, LLY: 760.3, AVGO: 1350.5, MA: 460.2, WMT: 60.5,
  HD: 350.4, PG: 160.2, COST: 730.5, JNJ: 155.4, ORCL: 125.8,
  ADBE: 480.2, CRM: 300.5, AMD: 180.2, PEP: 175.4, KO: 60.2,

  // Indices
  NASDAQ: 18200.5, SPX: 5200.2, DOW: 39500.1, RUSSELL: 2100.0, DAX: 18000.0,
  FTSE: 8200.0, CAC: 8000.0, NIKKEI: 38000.0, HSI: 18500.0, ASX: 7800.0,
};

setInterval(() => {
  Object.keys(currentPrices).forEach(symbol => {
    const volatility = ['XAUUSD', 'BTCUSD', 'ETHUSD', 'NASDAQ'].includes(symbol) ? 0.001 : 0.0005;
    const price = currentPrices[symbol];
    if (price === undefined) return;
    const change = price * (Math.random() * volatility * 2 - volatility);
    currentPrices[symbol] = price + change;
  });
  broadcastPriceUpdate({ type: 'price_update', prices: currentPrices });
}, 1000);

app.get('/api/assets', (req, res) => {
  res.json(Object.keys(currentPrices).map(symbol => ({ symbol, price: currentPrices[symbol] })));
});

app.get('/api/prices', (req, res) => {
  res.json(currentPrices);
});

// A mock user ID for the demo since we aren't building a full auth system
const DEMO_USER_ID = "demo-user-123";

const initDemoUser = async () => {
  try {
    const user = await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: {
        id: DEMO_USER_ID,
        email: "demo@mango.trade",
        password: "hashedpassword",
        accounts: {
          create: {
            balance: 100000.0,
            equity: 100000.0,
            margin: 0.0
          }
        }
      }
    });
    console.log("Demo user initialized:", user.id);
  } catch (e) {
    console.error("DB init error", e);
  }
};

app.post('/api/orders', async (req, res) => {
  const { symbol, type, side, size, price } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        user_id: DEMO_USER_ID,
        symbol,
        type,
        side,
        size: parseFloat(size),
        price: price ? parseFloat(price) : currentPrices[symbol],
        status: 'FILLED' // Auto fill for market demo
      }
    });

    // Create corresponding position for demo
    await prisma.position.create({
      data: {
        user_id: DEMO_USER_ID,
        symbol,
        side,
        size: parseFloat(size),
        entry_price: order.price!
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/positions', async (req, res) => {
  const positions = await prisma.position.findMany({ where: { user_id: DEMO_USER_ID } });
  
  // Calculate live PnL based on current prices
  const withPnL = positions.map((p: any) => {
    const currentPrice = currentPrices[p.symbol] || p.entry_price;
    const diff = p.side === 'BUY' ? (currentPrice - p.entry_price) : (p.entry_price - currentPrice);
    const pnl = diff * p.size;
    return { ...p, currentPrice, pnl };
  });
  
  res.json(withPnL);
});

app.get('/api/history', async (req, res) => {
  const history = await prisma.trade.findMany({ where: { user_id: DEMO_USER_ID }, orderBy: { date: 'desc' } });
  res.json(history);
});

const PORT = process.env.PORT || 3000;
initDemoUser().then(() => {
  server.listen(PORT as number, '0.0.0.0', () => {
    console.log(`MANGO backend running on port ${PORT}`);
  });
});
