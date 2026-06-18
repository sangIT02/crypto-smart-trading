import axios from "axios";

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
const API_URL = "https://crypto-smart-trading.onrender.com/api/auth";

export const authService = {
  login: (email: string, password: string) => {
        return axios.post(`${API_URL}/login`, { email, password });
    },

  loginGoogle: (token: string) => {
    return axios.post(`${API_URL}/google`, { token });
  },

  logout(){
    clearTokens();
    window.location.href = "/register";
  }
}
