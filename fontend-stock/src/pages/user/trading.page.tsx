import { useNavigate } from "react-router-dom";
import TradingChart from "../../components/chart/trading.chart";
import { useEffect, useState } from "react";
import { PositionContainer } from "../../components/position/PositionContainer";
import { keyAccountService } from "../../services/keyAccountService";

export const Trading = () => {
  const navigate = useNavigate();

  const [keyStatus, setKeyStatus] = useState<boolean | null>(null);

  const fetchKeyStatus = async () => {
    try {
      const response = await keyAccountService.getKeyStatus();
      const data = response.data.data.connected;
      console.log("", data);
      setKeyStatus(data);
    } catch (error) {
      setKeyStatus(false);
    }
  };

  useEffect(() => {
    fetchKeyStatus();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "135%",
        gap: "2px",
      }}
    >
      {/* Trading Content */}
      <div style={{ flex: 2 }}>
        <TradingChart />
      </div>

      <div style={{ flex: 1 }}>
        <PositionContainer />
      </div>

      {/* Modal */}
      {keyStatus === false && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 10, 15, 0.78)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            // đưa modal lên trên
            alignItems: "flex-start",
            paddingTop: "110px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "430px",
              background: "#000",
              border: "2px solid #2e2e2e",
              borderRadius: "20px",
              padding: "36px",
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0,0,0,0.45)",
              color: "white",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            {/* Title */}
            <h2
              style={{
                color: "white",
                margin: "0 0 10px",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Binance API Required
            </h2>

            {/* Description */}
            <p
              style={{
                color: "#9ca3af",
                margin: "0 0 30px",
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              Bạn cần kết nối API Binance trước khi sử dụng các tính năng giao
              dịch và quản lý vị thế theo thời gian thực.
            </p>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              {/* Connect */}
              <button
                onClick={() => navigate("/apikey")}
                style={{
                  padding: "12px 24px",
                  background: "#F0B90B",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Thêm API Key
              </button>

              {/* Guide */}
              <button
                onClick={() => navigate("/apikey")}
                style={{
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  border: "2px solid #2e2e2e",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                Hướng dẫn lấy API key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
