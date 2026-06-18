import axios from "axios";
import { getAccessToken } from "../auth";

const base_url = "https://crypto-smart-trading.onrender.com/api/admin/orders"
const accessToken = getAccessToken();

export const manageOrderService = {
  getSymbolTotal() {
    return axios.get(`${base_url}/symbol-total`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },

  getTotalTypeOrder(){
    return axios.get(`${base_url}/total-buy-sell`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
}

export type SymbolTotal = {
  symbol: string;
  totalOrders: number;
  color?: string;
}
export type TotalTypeOrder = {
  name: string;
  value: number;
}
