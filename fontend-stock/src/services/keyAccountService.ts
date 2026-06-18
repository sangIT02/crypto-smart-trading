import axios from "axios";
import { getAccessToken } from "./auth";

const base_url = "https://crypto-smart-trading.onrender.com/api/account"; 

export const keyAccountService = {
    addKeyAccount(userId: number, apiKey: string, secretKey:string, nameAccount:string){
        const token = getAccessToken();
        const body = {
            userId: userId,
            apiKey: apiKey,
            secretKey: secretKey,
            nameAccount: nameAccount,
        }
        return axios.post(`${base_url}/add-key`,body, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    },

    getKeyStatus(){
        const token = getAccessToken();
        return axios.get(`${base_url}/status`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    },
}
