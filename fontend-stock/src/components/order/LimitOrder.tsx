import React, { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Slider } from "antd";
import { toast } from "react-toastify"; // Giả sử dùng toastify
import {
  orderService,
  type LeverageMarginResponse,
  type LimitOrderRequest,
} from "../../services/orderService";
import { TPSL } from "./TPSL";
import type { MarginMode } from "./OrderForm";

type LimitOrderProps = {
    symbol: string;
    leverage: number;
    setLeverage: Dispatch<SetStateAction<number>>;
    marginMode: MarginMode;
    setMarginMode: Dispatch<SetStateAction<MarginMode>>;
}

export const LimitOrder = ({ symbol, leverage, setLeverage, marginMode, setMarginMode }: LimitOrderProps)=>{
  const balance = 5000;
  const bestBidOfferPrice = 66000;

  const [showSltp, setShowSltp] = useState(false);
  const [percent, setPercent] = useState(0);
  const [price, setPrice] = useState(bestBidOfferPrice);

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

  const quantity = useMemo(() => {
    if (!price || price <= 0) return 0;
    return notional / price;
  }, [notional, price]);

  const estimatedCost = useMemo(() => {
    return totalUsdt;
  }, [totalUsdt]);

  const increaseLev = () => setLeverage((p) => Math.min(p + 1, MAX_LEV));
  const decreaseLev = () => setLeverage((p) => Math.max(p - 1, MIN_LEV));

  const handleLevInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = Number(e.target.value.replace(/\D/g, "")) || MIN_LEV;
    v = Math.min(Math.max(v, MIN_LEV), MAX_LEV);
    setLeverage(v);
  };

  const increasePct = () => setPercent((p) => clampPct(p + 1));
  const decreasePct = () => setPercent((p) => clampPct(p - 1));

  const handlePctInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercent(clampPct(Number(e.target.value) || 0));
  };

  const increaseUsdt = () =>
    setPercent((p) => clampPct(((totalUsdt + 1) / balance) * 100));

  const decreaseUsdt = () =>
    setPercent((p) => clampPct((Math.max(totalUsdt - 1, 0) / balance) * 100));

  const handleUsdtInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Math.max(Number(e.target.value) || 0, 0), balance);
    setPercent((v / balance) * 100);
  };

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) || 0;
    setPrice(v);
  };

  const handleSetBbo = () => {
    setPrice(bestBidOfferPrice);
  };

  const buildOrderPayload = (side: "BUY" | "SELL"): LimitOrderRequest => {
    return {
      symbol,
      side,
      type: "LIMIT",
      timeInForce: "GTC",
      price: String(price),
      quantity: String(quantity),
    };
  };

  const fetchNewOrder = async (payload: LimitOrderRequest) => {
    try {
      const response = await orderService.createLimitOrder(payload);
      const data = await response.data;
      console.log("ORDER RESPONSE:", data);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, binanceCode } = error.response.data;
        // Hiển thị toast lỗi ra màn hình
        toast.error(`Lỗi từ sàn (${binanceCode}): ${message}`);
      } else {
        toast.error("Lỗi hệ thống không xác định!");
      }
    }
  };
  const handleSubmit = (side: "BUY" | "SELL") => {
    const payload = buildOrderPayload(side);
    fetchNewOrder(payload);
  };

  const fetchLeverageMargin = async () => {
    const response = await orderService.getLeverageMargin(symbol);
    const data: LeverageMarginResponse = await response.data;
    if (data.isolated != true) {
      setMarginMode("Cross");
    } else {
      setMarginMode("Isolated");
    }
    setLeverage(Number(data.leverage));
  };

  const maintenanceMarginRate = 0.005;

  const { longLiqPrice, shortLiqPrice } = useMemo(() => {
    if (!price || !quantity || quantity <= 0 || balance <= 0) {
      return { longLiqPrice: 0, shortLiqPrice: 0 };
    }

    const entryValue = price * quantity;

    // ĐIỂM SỬA 1: Dùng đúng loại Margin tùy theo Margin Mode
    const margin = marginMode === "Cross" ? balance : estimatedCost;

    // LƯU Ý 2: Cần thay thế mmr này bằng một state được fetch từ API leverageBracket
    const mmr = maintenanceMarginRate;

    // Tính toán
    const longLiq = (entryValue - margin) / (quantity * (1 - mmr));
    const shortLiq = (entryValue + margin) / (quantity * (1 + mmr));

    return {
      // ĐIỂM SỬA 3: Đảm bảo không hiển thị số âm vô lý
      longLiqPrice: longLiq > 0 ? longLiq : 0,
      shortLiqPrice: shortLiq > 0 ? shortLiq : 0,
    };
  }, [price, quantity, balance, marginMode, estimatedCost]); // Đừng quên thêm các dependency này

  const ChangeMargin = async () => {
    // 1. Hiển thị trạng thái đang xử lý (Optional nhưng nên có)
    var marginType = "";
    if (marginMode === tempMarginMode) return;
    if (tempMarginMode === "Cross") {
      marginType = "CROSSED";
    } else {
      marginType = "ISOLATED";
    }
    const toastId = toast.loading("Đang thay đổi chế độ ký quỹ...");

    try {
      const response = await orderService.changeMarginType(symbol, marginType);
      // 3. Nếu thành công (Backend trả về code 200 hoặc tương đương)
      setMarginMode(tempMarginMode);
      setShowMarginModal(false);

      // Cập nhật thông báo thành công
      toast.update(toastId, {
        render: `Đã chuyển sang chế độ ${tempMarginMode}!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      // 4. Nếu thất bại (Ví dụ: Đang có vị thế mở không cho đổi)
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
    const toastId = toast.loading("Đang thay đổi chế độ ký quỹ...");

    try {
      const response = await orderService.changeLeverage(symbol, tempLeverage);
      // 3. Nếu thành công (Backend trả về code 200 hoặc tương đương)
      setLeverage(tempLeverage);
      setShowLeverageModal(false);

      // Cập nhật thông báo thành công
      toast.update(toastId, {
        render: `Đã chuyển sang chế độ ${tempLeverage}x!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      // 4. Nếu thất bại (Ví dụ: Đang có vị thế mở không cho đổi)
      console.error("Lỗi đổi Margin:", error);

      toast.update(toastId, {
        render: "Không thể đổi chế độ khi đang có vị thế/lệnh treo!",
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
          {/* Số dư */}
          <div>
            <span style={{ color: "gray" }}>Số dư khả dụng </span>
            <span>{balance.toLocaleString()} USDT</span>
          </div>

          {/* Cross + Leverage */}
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

          {/* Giá đặt */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9em",
                color: "gray",
              }}
            >
              Giá đặt
            </label>
            <div className="d-flex">
              <div
                className="rounded-2 d-flex justify-content-between order-box"
                style={{
                  width: "80%",
                  padding: "8px",
                  background: "#000",
                  border: "2px solid #2E2E2E",
                }}
              >
                <input
                  type="number"
                  className="text-left fw-bold text-white no-spinner"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    width: "100%",
                  }}
                  value={price || ""}
                  onChange={handlePriceInput}
                />
                <span style={{ color: "white" }}>USDT</span>
              </div>
              <div
                className="rounded-3 ms-3 fw-bold text-white text-center order-box"
                style={{
                  width: "15%",
                  backgroundColor: "#000",
                  border: "2px solid #2E2E2E",
                  alignContent: "center",
                  cursor: "pointer",
                }}
                onClick={handleSetBbo}
              >
                BBO
              </div>
            </div>
          </div>

          {/* Khối lượng (%) */}
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

          {/* Tổng ký quỹ */}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Chi phí lệnh
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {estimatedCost.toFixed(2)} USDT
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Giá trị vị thế
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {notional.toFixed(2)} USDT
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "gray", fontSize: "0.95em" }}>
                  Thanh lý Long
                </span>
                <span style={{ color: "white", fontWeight: 600 }}>
                  {longLiqPrice > 0 ? `${longLiqPrice.toFixed(2)} USDT` : "--"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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

          {/* SL/TP */}
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

          {/* Submit */}
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

      {/* Margin Modal */}
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

            <div
              style={{
                marginBottom: "20px",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {symbol}
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "12px",
                  color: "#B7BDC6",
                  background: "#2B3139",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                Vĩnh cửu
              </span>
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

            <div
              style={{
                color: "#8B93A6",
                fontSize: "14px",
                lineHeight: 1.8,
                marginBottom: "26px",
              }}
            >
              <div>
                • Chuyển chế độ margin chỉ áp dụng cho những hợp đồng được chọn.
              </div>
              <div style={{ marginTop: "8px" }}>
                • Chế độ Cross Margin: Tất cả vị thế cross margin sử dụng cùng
                tài sản ký quỹ sẽ cùng chia sẻ số dư tài sản cross margin. Trong
                thời gian thanh lý, số dư tài sản ký quỹ của bạn cùng với tất cả
                vị thế đang mở có thể sẽ bị tịch thu.
              </div>
              <div style={{ marginTop: "8px" }}>
                Chế độ Isolated Margin: Lượng margin của vị thế được giới hạn
                trong một khoảng nhất định. Nếu giảm xuống thấp hơn mức Margin
                Duy trì, vị thế sẽ bị thanh lý. Tuy nhiên, chế độ này cho phép
                bạn thêm hoặc gỡ margin tùy ý muốn.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
                color: "#EAECEF",
                fontWeight: 600,
              }}
            >
              <span>Chế độ ký quỹ và đòn bẩy mặc định</span>
              <span style={{ color: "#8B93A6" }}>Off &nbsp;›</span>
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

      {/* Leverage Modal */}
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
                marginBottom: "10px",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Đòn bẩy
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

            <div
              style={{
                color: "#8B93A6",
                fontSize: "14px",
                lineHeight: 1.8,
                marginTop: "20px",
                marginBottom: "18px",
              }}
            >
              <div>• Vị thế tối đa 300.000 USDT</div>
              <div>
                • Xin lưu ý rằng việc thay đổi đòn bẩy cũng sẽ áp dụng cho các
                vị thế mở và lệnh đang mở.
              </div>
              <div>
                • Khi chọn đòn bẩy cao hơn, chẳng hạn như [10x], rủi ro thanh lý
                sẽ tăng lên. Hãy luôn kiểm soát mức độ rủi ro của bạn.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "24px",
                color: "#F0B90B",
                flexWrap: "wrap",
              }}
            >
              <span style={{ cursor: "pointer" }}>
                Kiểm tra bảng tỷ lệ Đòn bẩy & số tiền ký quỹ
              </span>
              <span style={{ color: "#5B6578" }}>|</span>
              <span style={{ cursor: "pointer" }}>Tăng hạn mức vị thế</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
                color: "#EAECEF",
                fontWeight: 600,
              }}
            >
              <span>Chế độ ký quỹ và đòn bẩy mặc định</span>
              <span style={{ color: "#8B93A6" }}>Off &nbsp;›</span>
            </div>

            <button
              type="button"
              onClick={() => {
                ChangeLeverage();
              }}
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
