import axios from "axios";
import { getAccessToken } from "./auth";
import { create } from "zustand";

const base_url = "http://localhost:8080/api/order";

export const orderService = {
  getLeverageMargin(symbol: string) {
    const accessToken = getAccessToken();
    return axios.get(`${base_url}/leverage-margin?symbol=${symbol}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  changeMarginType(symbol: string, marginType: string) {
    const accessToken = getAccessToken();
    const body = {
      symbol,
      marginType,
    };
    return axios.post(`${base_url}/change-margin-type`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  changeLeverage(symbol: string, leverage: number) {
    const accessToken = getAccessToken();
    const body = {
      symbol,
      leverage,
    };
    return axios.post(`${base_url}/change-leverage`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  },

  getAllOrders() {
    const accessToken = getAccessToken();
    return axios.get(`${base_url}/all-orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
  cancelOrder(symbol: string, orderId: number) {
    const accessToken = getAccessToken();
    return axios.delete(
      `${base_url}/cancel-order?symbol=${symbol}&orderId=${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  createOrder(body: LimitOrderRequest) {
    const accessToken = getAccessToken();
    return axios.post(`${base_url}/limit`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  },
};

export type LimitOrderRequest = {
  symbol: string;
  side: string;
  type: string;
  timeInForce: string;
  price: string;
  quantity: string;
};
export type MarketOrderRequest = {
  symbol: string;
  side: string;
  type: string;
  quantity: string;
};
export type LeverageMarginResponse = {
  symbol: string;
  leverage: string;
  isolated: boolean;
};
export interface BinanceOrder {
  orderId: number;
  symbol: string;
  status:
    | "NEW"
    | "PARTIALLY_FILLED"
    | "FILLED"
    | "CANCELED"
    | "REJECTED"
    | "EXPIRED"
    | string;
  clientOrderId: string;
  price: string;
  avgPrice: string;
  origQty: string;
  executedQty: string;
  cumQuote: string;
  timeInForce: string;
  type:
    | "LIMIT"
    | "MARKET"
    | "STOP"
    | "STOP_MARKET"
    | "TAKE_PROFIT"
    | "TAKE_PROFIT_MARKET"
    | "TRAILING_STOP_MARKET"
    | string;
  reduceOnly: boolean;
  closePosition: boolean;
  side: "BUY" | "SELL" | string;
  positionSide: "BOTH" | "LONG" | "SHORT" | string;
  stopPrice: string;
  workingType: "MARK_PRICE" | "CONTRACT_PRICE" | string;
  priceProtect: boolean;
  origType: string;
  priceMatch: string;
  selfTradePreventionMode: string;
  goodTillDate: number;
  time: number;
  updateTime: number;
}
