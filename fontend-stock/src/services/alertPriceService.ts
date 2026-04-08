import axios from "axios";
import { getAccessToken } from "./auth";

export type ConditionType = "PRICE_ABOVE" | "PRICE_BELOW" | "MA_CROSS_UP" | "MA_CROSS_DOWN";
export type AlertMode = "ONCE" | "RECURRING";
// Danh sách để hiển thị lên Select Option trên giao diện
export const CONDITION_OPTIONS = [
  { value: "PRICE_ABOVE", label: "Giá tăng trên" },
  { value: "PRICE_BELOW", label: "Giá giảm dưới" },
  { value: "MA_CROSS_UP", label: "Cắt lên đường MA" },
  { value: "MA_CROSS_DOWN", label: "Cắt xuống đường MA" },
];
export interface AlertCreateRequest {
  symbol: string;           // Ví dụ: "BTCUSDT"
  conditionType: ConditionType;
  targetPrice: number;      // Ở FE dùng number, BE sẽ tự map sang BigDecimal
  alertMode: AlertMode;
  note?: string;            // Dấu "?" vì ghi chú có thể để trống
}
const base_url = "http://localhost:8080/api/alert";

export const alertPriceService ={
  CreateAlertsPrice(body: AlertCreateRequest) {
    const token = getAccessToken();
    return axios.post(`${base_url}/create`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  GetAlertsPrice() {
    const token = getAccessToken();
    return axios.get(`${base_url}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export interface AlertPriceResponse {
  id: number;
  symbol: string;
  conditionType: ConditionType;
  targetPrice: number;
  alertMode: AlertMode;
  note: string | null;
  isTriggered: number;
  isActive: number;
  createdAt: string; 
  triggeredAt: string | null;
}