// src/store/socketStore.ts
import { create } from 'zustand';

type TickerData = {
    symbol:             string;
    lastPrice:          number;
    priceChange:        number;
    priceChangePercent: number;
    highPrice:          number;
    lowPrice:           number;
    volume:             number;
};

type SocketStore = {
    ticker:    TickerData | null;
    connected: boolean;
    ws:        WebSocket | null;
    connect:    () => void;
    disconnect: () => void;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
    ticker:    null,
    connected: false,
    ws:        null,

    connect: () => {
        if (get().ws) return; // Đã kết nối rồi → bỏ qua

        const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');

        ws.onopen    = () => set({ connected: true });
        ws.onmessage = (e) => {
            const d = JSON.parse(e.data);
            set({
                ticker: {
                    symbol:             d.s,
                    lastPrice:          parseFloat(d.c),
                    priceChange:        parseFloat(d.p),
                    priceChangePercent: parseFloat(d.P),
                    highPrice:          parseFloat(d.h),
                    lowPrice:           parseFloat(d.l),
                    volume:             parseFloat(d.v),
                }
            });
        };
        ws.onerror  = () => set({ connected: false });
        ws.onclose  = () => set({ connected: false, ws: null });

        set({ ws });
    },

    disconnect: () => {
        get().ws?.close();
        set({ ws: null, connected: false });
    },
}));