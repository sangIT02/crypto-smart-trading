import { create } from "zustand";

interface SocketState {
  socket: WebSocket | null;
  prices: Record<string, number>;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStorePrice = create<SocketState>((set, get) => {
  // Biến phụ để kiểm soát tần suất cập nhật UI (Tránh lag)
  let lastUpdate = 0;

  return {
    socket: null,
    prices: {},

    connect: () => {
      const currentSocket = get().socket;
      if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) {
        return;
      }

      const socket = new WebSocket("wss://fstream.binance.com/ws/!markPrice@arr");

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          const now = Date.now();
          
          // Chỉ cập nhật State sau mỗi 500ms để giảm tải cho CPU/UI
          // Bạn vẫn có dữ liệu mới nhất nhưng UI không bị "điên" vì nhảy số quá nhanh
          if (now - lastUpdate > 500) {
            const newPrices: Record<string, number> = {};
            data.forEach((item) => {
              newPrices[item.s] = Number(item.p);
              //console.log(`Received price update: ${item.s} = ${item.p}`);
            });

            set((state) => ({
              prices: { ...state.prices, ...newPrices }
            }));
            lastUpdate = now;
          }
        }
      };

      socket.onopen = () => console.log("✅ Binance Connected");
      socket.onclose = () => set({ socket: null });
      socket.onerror = (err) => console.error("❌ Socket Error", err);

      set({ socket });
    },

    disconnect: () => {
      if (get().socket) {
        get().socket?.close();
        set({ socket: null });
      }
    },
  };
});