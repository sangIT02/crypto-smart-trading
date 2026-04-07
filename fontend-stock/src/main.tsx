import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider, theme } from "antd";
// 1. Import Toaster vào đây
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, // ← Bật dark mode toàn bộ Ant Design
        token: {
          colorBgElevated: "#1e2329", // Nền dropdown
          colorText: "#ffffff", // Text trắng
          colorTextSecondary: "#848e9c",
          colorBorder: "#2a2e39",
          borderRadius: 8,
        },
      }}
    >
      <App />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false} // Bật thanh chạy lùi thời gian
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // <--- Tự động đổi màu nền đen chữ trắng hợp với Ant Design
      />

      {/* 2. Đặt Toaster ngay dưới App */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e2329", // Khớp với colorBgElevated của bạn
            color: "#ffffff",
            border: "1px solid #2a2e39", // Khớp với colorBorder của bạn
          },
          success: {
            iconTheme: { primary: "#0ECB81", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#F6465D", secondary: "#fff" },
          },
        }}
      />
    </ConfigProvider>
  </StrictMode>,
);
