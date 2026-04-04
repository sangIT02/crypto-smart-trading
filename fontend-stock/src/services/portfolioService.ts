import axios from "axios"
import { getAccessToken } from "./auth"
export interface FuturesBalanceResponse {
    canTrade: boolean;
    canWithdraw: boolean;
    totalWalletBalance: string;     // Dùng string để đảm bảo độ chính xác thập phân
    totalUnrealizedProfit: string;
    totalMarginBalance: string;
    availableBalance: string;
    assets: AssetItem[];
    positions: PositionItem[];
}

export interface AssetItem {
    asset: string;
    walletBalance: string;
    unrealizedProfit: string;
    marginBalance: string;
    maintMargin: string;
    initialMargin: string;
    positionInitialMargin: string;
    openOrderInitialMargin: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
    marginAvailable: boolean;
    updateTime: number; // Long trong Java tương ứng với number trong TS
}

export interface PositionItem {
    symbol: string;
    initialMargin: string;
    maintMargin: string;
    unrealizedProfit: string;
    positionInitialMargin: string;
    openOrderInitialMargin: string;
    leverage: string;      // Binance trả về leverage dạng chuỗi số
    isolated: boolean;     // Quan trọng: Để biết lệnh là Cross hay Isolated
    entryPrice: string;
    maxNotional: string;
    bidNotional: string;
    askNotional: string;
    positionSide: "BOTH" | "LONG" | "SHORT"; // Dùng Union Type để chặt chẽ hơn
    positionAmt: string;   // Khối lượng lệnh (âm là Short, dương là Long)
    updateTime: number;
}
const base_url = "http://localhost:8080/api/account"

export const portfolioService = {
    getBalance(){
        const accessToken = getAccessToken();

        return axios.get(`${base_url}/balance`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}