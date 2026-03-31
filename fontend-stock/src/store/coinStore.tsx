// src/store/coinStore.ts
import { create } from 'zustand';
import { MOCK_COINS } from '../components/TabBtn';

type Coin = {
    id:       string;
    symbol:   string;
    name:     string;
    price:    number;
    change24h: number;
    image:    string;
};

type CoinStore = {
    selectedCoin:    Coin;
    setSelectedCoin: (coin: Coin) => void;
};

export const useCoinStore = create<CoinStore>((set) => ({
    selectedCoin:    MOCK_COINS[0], // BTC mặc định
    setSelectedCoin: (coin) => set({ selectedCoin: coin }),
}));