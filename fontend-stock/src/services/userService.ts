// File: src/services/userService.js
import axios from "axios";
import { getAccessToken } from "./auth";


export interface PageData<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    // ... bạn có thể thêm các trường khác nếu cần dùng
}
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: PageData<T>;
}

export type Dasboardata = {
    pnl: number,
    order: number,
    totalWarning: number,
}
// 1. Cấu hình đường dẫn gốc của Backend Spring Boot
const API_URL = "https://crypto-smart-trading.onrender.com/api/users"; 

// 2. Định nghĩa object userService chứa các hàm gọi API
const userService = {
    
    // Hàm đăng ký
    sentOtp: (email: string) => {
        // Gọi API POST lên Backend
        return axios.post(`${API_URL}/sent-otp?email=${email}`);
    },

    // Bạn có thể viết thêm các hàm khác ở đây
    
    
    verifyOtp: (email: string,password:string, otp: string) => {
        const body = {email,password, otp};
        return axios.post(`${API_URL}/verify-otp`,body);
    },

    getLoginHistory: (page: number, size: number) => {
        const token = getAccessToken();
        return axios.get(`${API_URL}/login-history?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    getDasboardData: () => {
        const token = getAccessToken();
        return axios.get(`${API_URL}/dashboard-info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};

// 3. Xuất nó ra để các nơi khác dùng
export default userService;
