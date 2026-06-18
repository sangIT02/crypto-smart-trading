import axios from "axios";
import { getAccessToken } from "./auth";

const BASE_URL = "https://crypto-smart-trading.onrender.com/api/prediction"; 
export const predictionService = {
    getAiSignal(symbol:string, timeframe:string, model:string, currentPrice:number){
        const accessToken = getAccessToken();
        return axios.get(`${BASE_URL}?symbol=${symbol}&timeframe=${timeframe}&model=${model}&currentPrice=${currentPrice}`
            ,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
    },

    getAllModels(){
        const accessToken = getAccessToken();
        return axios.get("https://crypto-smart-trading.onrender.com/api/models",{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getHistoriPredict(){
        const accessToken = getAccessToken();
        return axios.get(`https://crypto-smart-trading.onrender.com/api/prediction/history`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}
