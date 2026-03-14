import { create } from 'zustand';

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP';
export type OrderSide = 'BUY' | 'SELL';

export interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  size: number;
  entry_price: number;
  currentPrice?: number;
  pnl?: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  size: number;
  price: number;
  status: string;
}

interface MangoState {
  selectedSymbol: string;
  prices: Record<string, number>;
  positions: Position[];
  orders: Order[];
  balance: number;
  equity: number;
  margin: number;
  isConnected: boolean;
  
  setSelectedSymbol: (symbol: string) => void;
  updatePrices: (prices: Record<string, number>) => void;
  setPositions: (positions: Position[]) => void;
  setOrders: (orders: Order[]) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useStore = create<MangoState>((set) => ({
  selectedSymbol: 'BTCUSD',
  prices: {},
  positions: [],
  orders: [],
  balance: 100000,
  equity: 100000,
  margin: 0,
  isConnected: false,

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  updatePrices: (prices) => set({ prices }),
  setPositions: (positions) => set({ positions }),
  setOrders: (orders) => set({ orders }),
  setConnectionStatus: (status) => set({ isConnected: status }),
}));
