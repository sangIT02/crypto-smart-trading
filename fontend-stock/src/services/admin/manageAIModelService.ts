import axios from "axios";
import { getAccessToken } from "../auth";

const base_url = "http://localhost:8080/api/models";
const token = getAccessToken();

export const manageAIModelService = {
    getAllModels(){
        return axios.get(`${base_url}/all-model`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    getAllModelsWithPagination(page: number, size: number){
        return axios.get(`${base_url}/all-model?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    getTotalModels(){
        return axios.get(`${base_url}/total`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    addModel(symbol: string, interval: string, timeStep: number, limit: number){
        return axios.post(`${base_url}/train-model?symbol=${symbol}&interval=${interval}&time_step=${timeStep}&limit=${limit}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
    updateModelStatus(modelId: number){
        return axios.put(`${base_url}/update-active/${modelId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export type AddNewModelData = {
    symbol: string;
    interval: string;
    timeStep: number;
    limit: number;
}
export type TotalModel = {
    totalAIModel: number;
    totalAIModelActive: number;
    totalAIModelInActive: number;
}

export type AIModel = {
    id: number;
    mae: number;
    rmse: number;
    directionAcc: number;
    isActive: boolean;
    modelName: string;
    trainedAt: string;
}