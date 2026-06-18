import React, { useCallback, useEffect, useState } from "react";
import {
  positionService,
  type PositionDTO,
} from "../../services/positionService";
import { toast } from "react-toastify";
import { useSocketStorePrice } from "../../store/useSocketStore";
import { usePositionRefreshStore } from "../../store/positionRefreshStore";
import axios from "axios";

const formatNumber = (value: number, digits = 2) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const OpenPosition: React.FC = () => {
  const prices = useSocketStorePrice((state) => state.prices);
  const refreshVersion = usePositionRefreshStore((state) => state.refreshVersion);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positionList, setPositionList] = useState<PositionDTO[]>([]);
  const fetchPositions = useCallback(async () => {
    try {
  const response = await positionService.getPositions();
  const data: PositionDTO[] = response.data; // Bỏ await ở đây vì response.data không phải là Promise
  setPositionList(data);
} catch (error: unknown) {
  // Mặc định câu thông báo lỗi chung
  let toastMessage = "Đã có lỗi xảy ra khi lấy vị thế.";

  // 1. Kiểm tra nếu đây là lỗi từ API gọi bằng Axios
  if (axios.isAxiosError(error)) {
    // Dùng optional chaining (?.) để phòng trường hợp backend không trả về data hoặc message
    toastMessage = error.response?.data?.message || toastMessage;
  } 
  // 2. Kiểm tra nếu đây là lỗi chung của JavaScript (lỗi mạng, lỗi cú pháp...)
  else if (error instanceof Error) {
    toastMessage = error.message;
  }

  toast.error(toastMessage);
  console.error("Error fetching positions:", error);
}
  }, []);
  const handleClosePosition = async (symbol: string, positionAmt: string) => {
    try {
      const amount = parseFloat(positionAmt);
      // 1. Chặn ngay từ đầu nếu không có vị thế
      if (amount === 0) {
        console.warn("Không có vị thế đang mở để đóng!");
        return;
      }
      const side = amount > 0 ? "SELL" : "BUY";
      const quantityToSend = Math.abs(amount).toString();
      const response = await positionService.closePosition({
        symbol,
        side,
        type: "MARKET",
        quantity: quantityToSend,
      });
      toast.success("Đã gửi lệnh thành công!");
      console.log("Close position response:", response.data);
      await fetchPositions();
    } catch (error) {
      console.error("Error closing position:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPositions();
    };
    fetchData();
  }, [fetchPositions, refreshVersion]);

  return (
    <div className="position-page bg-black text-light min-vh-60">
      <div className="container-fluid px-0">
        <div className="table-responsive position-table-wrap">
          <table className="table position-table align-middle mb-0">
            <thead>
              <tr>
                <th className="sticky-col-left text-start">Mã</th>
                <th className="text-start">Kích thước</th>
                <th className="text-start">Giá vào</th>
                <th className="text-start">Giá hòa vốn</th>
                <th className="text-start">Giá đánh dấu</th>
                <th className="text-start">Giá thanh lí</th>
                <th className="text-start">Tỉ lệ Margin</th>
                <th className="text-start">Margin</th>
                <th className="text-start">PNL (ROI %)</th>
                <th className="sticky-col-right text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {positionList.map((pos) => {
                const unRealizedProfit = Number(pos.unRealizedProfit);
                const isWin = unRealizedProfit >= 0;
                const liveMarkPrice = prices[pos.symbol] || pos.markPrice;
                const leverage = Number(pos.leverage);

                // 1. Kích thước tính bằng USDT (Notional Value) - Lấy trị tuyệt đối vì short notional bị âm
                const notionalSize = Math.abs(Number(pos.notional));

                // 2. Tính Margin của vị thế
                // Nếu Isolated: Lấy trực tiếp isolatedMargin
                // Nếu Cross: Tính bằng Notional / Đòn bẩy
                const marginUsed =
                  pos.marginType === "isolated"
                    ? Number(pos.isolatedMargin)
                    : notionalSize / leverage;

                // 3. Tính ROE % (Lợi nhuận / Vốn ký quỹ)
                const roePercent =
                  marginUsed > 0 ? (unRealizedProfit / marginUsed) * 100 : 0;

                // 4. Tỉ lệ Margin (Lưu ý: Tỉ lệ này thường lấy từ Account API chung cho cả tài khoản Cross.
                // Ở đây tôi đang giả định bạn truyền nó từ ngoài vào, hoặc tạm để một biến mock)
                const accountMarginRatio = 0.57; // Bạn nên thay bằng props truyền vào từ Get Account API

                return (
                  <tr key={pos.symbol}>
                    <td className="sticky-col-left text-start symbol-cell">
                      <div className="symbol-name">{pos.symbol}</div>
                      <div className="mt-1">
                        <span
                          className={`side-badge ${
                            Number(pos.positionAmt) > 0
                              ? "side-long"
                              : "side-short"
                          }`}
                        >
                          {Number(pos.positionAmt) > 0 ? "LONG" : "SHORT"}{" "}
                          {pos.leverage}x
                        </span>
                      </div>
                    </td>

                    {/* Kích thước hiển thị theo USDT */}
                    <td className="text-start">
                      {formatNumber(notionalSize, 2)} USDT
                    </td>

                    <td className="text-start">
                      {formatNumber(Number(pos.entryPrice), 2)}
                    </td>
                    <td className="text-start">
                      {formatNumber(Number(pos.breakEvenPrice), 2)}
                    </td>
                    <td className="text-start">
                      {formatNumber(Number(liveMarkPrice), 2)}
                    </td>

                    <td className="text-start text-warning">
                      {Number(pos.liquidationPrice) > 0
                        ? formatNumber(Number(pos.liquidationPrice), 2)
                        : "--"}
                    </td>

                    {/* Tỉ lệ Margin toàn tài khoản */}
                    <td className="text-start">
                      {formatNumber(accountMarginRatio, 2)}%
                    </td>

                    {/* Margin đã dùng và Loại Margin */}
                    <td className="text-start">
                      <div>{formatNumber(marginUsed, 2)} USDT</div>
                      <div className="small text-gray">
                        (
                        {pos.marginType === "cross"
                          ? "Cross Margin"
                          : "Isolated"}
                        )
                      </div>
                    </td>

                    {/* PNL và ROE % */}
                    <td className="text-start">
                      <div
                        className={
                          isWin
                            ? "pnl-positive text-success"
                            : "pnl-negative text-danger"
                        }
                      >
                        <div className="fw-semibold">
                          {isWin ? "+" : ""}
                          {formatNumber(unRealizedProfit, 2)} USDT
                        </div>
                        <div className="small">
                          ({isWin ? "+" : ""}
                          {formatNumber(roePercent, 2)}%)
                        </div>
                      </div>
                    </td>

                    <td className="sticky-col-right text-center">
                      <div className="d-flex justify-content-center gap-2 flex-nowrap">
                        <button
                          type="button"
                          className="btn btn-binance-action btn-sm text-white"
                        >
                          TP/SL
                        </button>
                        <button
                          type="button"
                          className="btn btn-binance-action btn-sm btn-warning"
                        >
                          Giới hạn
                        </button>
                        <button
                          type="button"
                          className="btn btn-binance-action btn-sm btn-warning"
                          onClick={() =>
                            handleClosePosition(pos.symbol, pos.positionAmt)
                          }
                        >
                          Thị trường
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-modal">
              <div className="modal-header border-secondary-subtle">
                <h5 className="modal-title text-light">Chốt lời / Dừng lỗ</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1 small text-secondary">
                    <span>Chốt lời</span>
                    <span className="text-success">Giá đánh dấu:</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Giá kích hoạt"
                    className="form-control form-control-dark"
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1 small text-secondary">
                    <span>Dừng lỗ</span>
                    <span className="text-danger">Giá đánh dấu</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Giá kích hoạt"
                    className="form-control form-control-dark"
                  />
                </div>

                <div className="d-flex gap-4 small text-secondary">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="priceType"
                      id="markPrice"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="markPrice">
                      Giá đánh dấu
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="priceType"
                      id="lastPrice"
                    />
                    <label className="form-check-label" htmlFor="lastPrice">
                      Giá gần nhất
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-secondary-subtle">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-warning fw-semibold text-dark"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

