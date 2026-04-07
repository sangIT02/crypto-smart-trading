import axios from "axios";
import { getAccessToken } from "./auth";

const base_url = "http://localhost:8080/api/position";

export const positionService = {
  getPositions() {
    const accessToken = getAccessToken();
    return axios.get(`${base_url}/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  },
  closePosition(body: ClosePositionRequest) {
    const accessToken = getAccessToken();
    return axios.post(`${base_url}/close`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
}

export type ClosePositionRequest = {
  symbol: string,
  side: string,
  type: string,
  quantity: string,
}












export type PositionSide = 'BOTH' | 'LONG' | 'SHORT';
export type PositionDTO = {
  symbol: string;
  positionSide: PositionSide;
  positionAmt: string;
  entryPrice: string;
  breakEvenPrice: string;
  markPrice: string;
  unRealizedProfit: string;
  liquidationPrice: string;
  isolatedMargin: string;
  notional: string;
  marginAsset: string;
  isolatedWallet: string;
  initialMargin: string;
  maintMargin: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  adl: number;
  bidNotional: string;
  askNotional: string;
  updateTime: number; // Thời gian trả về dạng timestamp millis
};