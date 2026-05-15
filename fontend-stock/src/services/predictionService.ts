import axios from "axios";
import { getAccessToken } from "./auth";

const BASE_URL = "http://localhost:8080/api/prediction"; 
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
        return axios.get("http://localhost:8080/api/models",{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },
    getHistoriPredict(){
        const accessToken = getAccessToken();
        return axios.get(`http://localhost:8080/api/prediction/history`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
}