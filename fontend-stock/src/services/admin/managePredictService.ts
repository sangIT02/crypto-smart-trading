import axios from "axios";
import { getAccessToken } from "../auth";

const base_url = "http://localhost:8080/api/admin/predict";
const token = getAccessToken();

export const managePredictService = {
  getTotalOrderType(){
    return axios.get(`${base_url}/total-order-type`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

export type TotalOrderTypeResponse = {
  type: string;
  count: number;
};