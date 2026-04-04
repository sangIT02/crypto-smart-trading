// File: src/services/userService.js
import axios from "axios";


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

// 1. Cấu hình đường dẫn gốc của Backend Spring Boot
const API_URL = "http://localhost:8080/api/users"; 

// 2. Định nghĩa object userService chứa các hàm gọi API
const userService = {
    
    // Hàm đăng ký
    sentOtp: (email: string) => {
        // Gọi API POST lên Backend
        return axios.post(`${API_URL}/sent-otp?email=${email}`);
    },

    // Bạn có thể viết thêm các hàm khác ở đây
    login: (email: string, password: string) => {
        return axios.post(`${API_URL}/login`, { email, password });
    },
    
    verifyOtp: (email: string,password:string, otp: string) => {
        const body = {email,password, otp};
        return axios.post(`${API_URL}/verify-otp`,body);
    }

    


};

// 3. Xuất nó ra để các nơi khác dùng
export default userService;