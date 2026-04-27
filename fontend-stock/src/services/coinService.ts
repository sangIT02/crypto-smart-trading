import axios from "axios";
import { getAccessToken } from "./auth";

const baseUrl = "http://localhost:8080/api/alert/coin-pair";

export type CoinPairResponse = {
  data: CoinPairData[];
  hasMore: boolean;
  curentPage: number;
}
export type CoinPairData = {
  name: string;
  id: number;
  symbol: string;
  isActive: boolean;
  logoUrl: string;
  tradingPair: string;
}

export type MaSignalsResponse = {
  sma7: number;
  sma25: number;
  sma99: number;
  ema7: number;
  ema25: number;
  ema99: number;
  sellSignal: number;
  buySignal: number;
  neutral: number;
  marketPrice: number;
}

export const coinService = {
  getCoinPairs(page: number, size: number) {
    const token = getAccessToken();
    return axios.get(`${baseUrl}?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getMaSignals(symbol: string, interval: string) {
    const token = getAccessToken();
    return axios.get(`http://localhost:8080/api/ma/all-ma?symbol=${symbol}&interval=${interval}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}