import axios from "axios";
import { getAccessToken } from "./auth";
export type ApiKeyItem = {
    nameAccount: string;
    apiKey: string;
    secretKey: string;
};

const base_url = "http://localhost:8080/api/account";

export const apiKeyService = {
    addKey(nameAccount: string, apiKey: string, secretKey: string){
        const body = {
            nameAccount: nameAccount,
            apiKey: apiKey,
            secretKey: secretKey,
        }
        console.log(body)
        const headers = {
            'Authorization': `Bearer ${getAccessToken()}`
        }
        return axios.post(`${base_url}/add-key`, body, { headers });
    },
    getKeys(){
        const headers = {
            'Authorization': `Bearer ${getAccessToken()}`
        }
        return axios.get(`${base_url}/get-key`, { headers });
    },
    deleteKey(id: number){
        const headers = {
            'Authorization': `Bearer ${getAccessToken()}`
        }
        return axios.delete(`${base_url}/delete-key/${id}`, { headers });
    }
}