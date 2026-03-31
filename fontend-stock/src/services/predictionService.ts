import axios from "axios";

const BASE_URL = "http://localhost:8080/api/prediction"; 
export const predictionService = {
    getAiSignal(symbol:string, timeframe:string, model:string, currentPrice:number){
        return axios.get(`${BASE_URL}?symbol=${symbol}&timeframe=${timeframe}&model=${model}&currentPrice=${currentPrice}`);
    },

    getAllModels(){
        return axios.get("http://localhost:8080/api/models");
    }

}