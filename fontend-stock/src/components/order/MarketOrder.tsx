import React, { useEffect, useMemo, useState } from "react";
import { Slider } from "antd";
import { toast } from "react-toastify";
import {
  orderService,
  type LeverageMarginResponse,
  type LimitOrderRequest,
  type MarketOrderRequest,
} from "../../services/orderService";
import { TPSL } from "./TPSL";

type MarginMode = "Cross" | "Isolated";

export const MarketOrder = ({ symbol }: { symbol: string }) => {
  const balance = 5000;
  const bestBidOfferPrice = 66000; // dùng làm giá tham chiếu để tính quantity / liquidation

  const [showSltp, setShowSltp] = useState(false);
  const [leverage, setLeverage] = useState(1);
  const [percent, setPercent] = useState(0);

  const [marginMode, setMarginMode] = useState<MarginMode>("Cross");
  const [showMarginModal, setShowMarginModal] = useState(false);
  const [showLeverageModal, setShowLeverageModal] = useState(false);
  const [tempMarginMode, setTempMarginMode] = useState<MarginMode>("Cross");
  const [tempLeverage, setTempLeverage] = useState(1);

  const MIN_LEV = 1;
  const MAX_LEV = 150;

  const clampPct = (v: number) => Math.min(Math.max(v, 0), 100);

  const totalUsdt = useMemo(() => {
    return (percent / 100) * balance;
  }, [percent, balance]);

  const notional = useMemo(() => {
    return totalUsdt * leverage;
  }, [totalUsdt, leverage]);

  // Với market order, dùng giá thị trường hiện tại / giá tham chiếu để ước tính quantity
  const quantity = useMemo(() => {
    if (!bestBidOfferPrice || bestBidOfferPrice <= 0) return 0;
    return notional / bestBidOfferPrice;
  }, [notional, bestBidOfferPrice]);

  const estimatedCost = useMemo(() => {
    return totalUsdt;
  }, [totalUsdt]);

  const increasePct = () => setPercent((p) => clampPct(p + 1));
  const decreasePct = () => setPercent((p) => clampPct(p - 1));

  const handlePctInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercent(clampPct(Number(e.target.value) || 0));
  };

  const fetchNewOrder = async (payload: LimitOrderRequest) => {
    try {
      const response = await orderService.createOrder(payload);
      const data = await response.data;
      console.log("ORDER RESPONSE:", data);
      toast.success("Đặt lệnh market thành công!");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, binanceCode } = error.response.data;
        toast.error(`Lỗi từ sàn (${binanceCode}): ${message}`);
      } else {
        toast.error("Lỗi hệ thống không xác định!");
      }
    }
  };

  const buildOrderPayload = (side: "BUY" | "SELL"): MarketOrderRequest => {
    return {
      symbol,
      side,
      type: "MARKET",
      quantity: String(quantity),
    };
  };

  const handleSubmit = (side: "BUY" | "SELL") => {
    if (quantity <= 0) {
      toast.error("Số lượng không hợp lệ!");
      return;
    }

    const payload = buildOrderPayload(side);
    // fetchNewOrder(payload);
  };

  const fetchLeverageMargin = async () => {
    const response = await orderService.getLeverageMargin(symbol);
    const data: LeverageMarginResponse = await response.data;

    if (data.isolated !== true) {
      setMarginMode("Cross");
    } else {
      setMarginMode("Isolated");
    }

    setLeverage(Number(data.leverage));
  };

  const maintenanceMarginRate = 0.005;

  const { longLiqPrice, shortLiqPrice } = useMemo(() => {
    if (!bestBidOfferPrice || !quantity || quantity <= 0 || balance <= 0) {
      return { longLiqPrice: 0, shortLiqPrice: 0 };
    }

    const entryValue = bestBidOfferPrice * quantity;
    const margin = marginMode === "Cross" ? balance : estimatedCost;
    const mmr = maintenanceMarginRate;

    const longLiq = (entryValue - margin) / (quantity * (1 - mmr));
    const shortLiq = (entryValue + margin) / (quantity * (1 + mmr));

    return {
      longLiqPrice: longLiq > 0 ? longLiq : 0,
      shortLiqPrice: shortLiq > 0 ? shortLiq : 0,
    };
  }, [bestBidOfferPrice, quantity, balance, marginMode, estimatedCost]);

  const ChangeMargin = async () => {
    let marginType = "";
    if (marginMode === tempMarginMode) return;

    marginType = tempMarginMode === "Cross" ? "CROSSED" : "ISOLATED";

    const toastId = toast.loading("Đang thay đổi chế độ ký quỹ...");

    try {
      await orderService.changeMarginType(symbol, marginType);
      setMarginMode(tempMarginMode);
      setShowMarginModal(false);

      toast.update(toastId, {
        render: `Đã chuyển sang chế độ ${tempMarginMode}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Lỗi đổi Margin:", error);

      toast.update(toastId, {
        render: "Không thể đổi chế độ khi đang có vị thế/lệnh treo!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const ChangeLeverage = async () => {
    if (tempLeverage === leverage) return;
    const toastId = toast.loading("Đang thay đổi đòn bẩy...");

    try {
      await orderService.changeLeverage(symbol, tempLeverage);
      setLeverage(tempLeverage);
      setShowLeverageModal(false);

      toast.update(toastId, {
        render: `Đã chuyển sang đòn bẩy ${tempLeverage}x!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Lỗi đổi đòn bẩy:", error);

      toast.update(toastId, {
        render: "Không thể đổi đòn bẩy khi đang có vị thế/lệnh treo!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchLeverageMargin();
  }, []);

  return (
    <>
      <div style={{ color: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <span style={{ color: "gray" }}>Số dư khả dụng </span>
            <span>{balance.toLocaleString()} USDT</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              style={topButtonStyle}
              onClick={() => {
                setTempMarginMode(marginMode);
                setShowMarginModal(true);
              }}
            >
              {marginMode}
            </button>

            <button
              type="button"
              style={topButtonStyle}
              onClick={() => {
                setTempLeverage(leverage);
                setShowLeverageModal(true);
              }}
            >
              {leverage}x
            </button>
          </div>

          {/* Market price reference */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9em",
                color: "gray",
              }}
            >
              Giá thị trường
            </label>
            <div
              className="rounded-2 d-flex justify-content-between order-box"
              style={{
                padding: "8px",
                background: "#000",
                border: "2px solid #2E2E2E",
              }}
            >
              <span className="fw-bold text-white">
                {bestBidOfferPrice.toLocaleString()}
              </span>
              <span style={{ color: "white" }}>USDT</span>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9em",
                color: "gray",
              }}
            >
              Số lượng (%)
            </label>
            <div
              className="rounded-2 d-flex justify-content-between order-box"
              style={{
                padding: "8px",
                background: "#000",
                border: "2px solid #555",
              }}
            >
              <button
                type="button"
                style={{ backgroundColor: "transparent", border: "none" }}
                onClick={decreasePct}
              >
                <i className="bi bi-dash fw-bold text-white" />
              </button>
              <div className="d-flex">
                <input
                  type="text"
                  className="text-center fw-bold text-white no-spinner"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    width: "100%",
                  }}
                  value={Math.round(percent)}
                  onChange={handlePctInput}
                />
                <span style={{ color: "white" }}>%</span>
              </div>
              <button
                type="button"
                style={{ backgroundColor: "transparent", border: "none" }}
                onClick={increasePct}
              >
                <i className="bi bi-plus text-white fw-bold" />
              </button>
            </div>

            <Slider
              min={0}
              max={100}
              value={percent}
              onChange={(value) => setPercent(value as number)}
              tooltip={{ formatter: null }}
              marks={{ 0: "0%", 25: "25%", 50: "50%", 75: "75%", 100: "100%" }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9em",
                color: "gray",
              }}
            >
              Thông tin lệnh
            </label>

            <div
              className="rounded-2 order-box"
              style={{
                padding: "12px",
                background: "#000",
                border: "2px solid #555",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Chi phí lệnh
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {estimatedCost.toFixed(2)} USDT
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Giá trị vị thế
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {notional.toFixed(2)} USDT
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Khối lượng ước tính
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {quantity.toFixed(6)} {symbol.replace("USDT", "")}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Thanh lý Long
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {longLiqPrice > 0 ? `${longLiqPrice.toFixed(2)} USDT` : "--"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Thanh lý Short
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {shortLiqPrice > 0
                    ? `${shortLiqPrice.toFixed(2)} USDT`
                    : "--"}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              id="sltp-checkbox"
              checked={showSltp}
              onChange={(e) => setShowSltp(e.target.checked)}
            />
            <p className="m-0 ms-2">SL/TP</p>
          </div>

          {showSltp && <TPSL />}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#089981",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => handleSubmit("BUY")}
            >
              Mua/Long
            </button>

            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#f23645",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => handleSubmit("SELL")}
            >
              Bán/Short
            </button>
          </div>
        </div>
      </div>

      {showMarginModal && (
        <div style={overlayStyle} onClick={() => setShowMarginModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                Chế độ Margin
              </div>
              <button
                type="button"
                onClick={() => setShowMarginModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#EAECEF",
                  fontSize: "22px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
              <button
                type="button"
                onClick={() => setTempMarginMode("Cross")}
                style={{
                  flex: 1,
                  height: "44px",
                  borderRadius: "10px",
                  border:
                    tempMarginMode === "Cross"
                      ? "2px solid #EAECEF"
                      : "1px solid #394150",
                  background: "#1E2533",
                  color: "#EAECEF",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cross
              </button>

              <button
                type="button"
                onClick={() => setTempMarginMode("Isolated")}
                style={{
                  flex: 1,
                  height: "44px",
                  borderRadius: "10px",
                  border:
                    tempMarginMode === "Isolated"
                      ? "2px solid #EAECEF"
                      : "1px solid #394150",
                  background: "#1E2533",
                  color: "#EAECEF",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Isolated
              </button>
            </div>

            <button
              type="button"
              onClick={ChangeMargin}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "12px",
                border: "none",
                background: "#F0B90B",
                color: "#1E2329",
                fontWeight: 700,
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}

      {showLeverageModal && (
        <div style={overlayStyle} onClick={() => setShowLeverageModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "26px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                Điều chỉnh đòn bẩy
              </div>
              <button
                type="button"
                onClick={() => setShowLeverageModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#EAECEF",
                  fontSize: "22px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                height: "56px",
                borderRadius: "14px",
                border: "1px solid #455065",
                background: "#1F2633",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
                marginBottom: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => setTempLeverage((p) => Math.max(p - 1, MIN_LEV))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8B93A6",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                −
              </button>

              <input
                type="text"
                value={`${tempLeverage}x`}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  let v = Number(raw) || MIN_LEV;
                  v = Math.min(Math.max(v, MIN_LEV), MAX_LEV);
                  setTempLeverage(v);
                }}
                style={{
                  width: "120px",
                  textAlign: "center",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#EAECEF",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              />

              <button
                type="button"
                onClick={() => setTempLeverage((p) => Math.min(p + 1, MAX_LEV))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8B93A6",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            <Slider
              min={MIN_LEV}
              max={MAX_LEV}
              value={tempLeverage}
              onChange={(value) => setTempLeverage(value as number)}
              tooltip={{ formatter: null }}
              marks={{
                1: "1x",
                30: "30x",
                60: "60x",
                90: "90x",
                120: "120x",
                150: "150x",
              }}
            />

            <button
              type="button"
              onClick={ChangeLeverage}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "12px",
                border: "none",
                background: "#F0B90B",
                color: "#1E2329",
                fontWeight: 700,
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: "24px",
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "540px",
  background: "#1E2533",
  borderRadius: "24px",
  padding: "28px",
  color: "#fff",
  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
};

const topButtonStyle: React.CSSProperties = {
  flex: 1,
  height: "42px",
  background: "#11161F",
  border: "1px solid #1E2329",
  color: "#B7BDC6",
  fontWeight: 600,
  borderRadius: "8px",
  cursor: "pointer",
};
