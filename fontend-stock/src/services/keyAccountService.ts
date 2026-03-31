import axios from "axios";

const base_url = "http://localhost:8080/api/account"; 

export const keyAccountService = {
    addKeyAccount(userId: number, apiKey: string, secretKey:string, nameAccount:string){
        const body = {
            userId: userId,
            apiKey: apiKey,
            secretKey: secretKey,
            nameAccount: nameAccount,
        }
        return axios.post(`${base_url}/add-key`,body)
    }
}