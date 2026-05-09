import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { ConfigProvider, theme } from "antd";

import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
    <GoogleOAuthProvider
      clientId="558206795512-n6c3ncohhvi17gh0dt7kmlqhi828judp.apps.googleusercontent.com"
    >
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgElevated: "#1e2329",
            colorText: "#ffffff",
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
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e2329",
              color: "#ffffff",
              border: "1px solid #2a2e39",
            },
            success: {
              iconTheme: {
                primary: "#0ECB81",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#F6465D",
                secondary: "#fff",
              },
            },
          }}
        />
      </ConfigProvider>
    </GoogleOAuthProvider>
  //</StrictMode>
);