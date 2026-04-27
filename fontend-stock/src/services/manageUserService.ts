import axios from "axios";
import { getAccessToken } from "./auth";

const base_url = "http://localhost:8080/api/admin/user";

export const manageUserService = {
  getAllUsers: (page: number, size: number) => {
    const token = getAccessToken();
    return axios.get(`${base_url}/get-total-user?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getTotalUser: () => {
    const token = getAccessToken();
    return axios.get(`${base_url}/get-all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateUserStatus: (userId: number) => {
    const token = getAccessToken();
    return axios.put(`${base_url}/status/${userId}`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export type quantityUser = {
  totalUser: number;
  activateUser: number;
};
