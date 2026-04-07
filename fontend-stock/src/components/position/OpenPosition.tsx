import React, { useEffect, useState } from 'react';
import { positionService, type PositionDTO } from '../../services/positionService';
import { toast } from 'react-toastify';





const formatNumber = (value: number, digits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const OpenPosition: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positionList, setPositionList] = useState<PositionDTO[]>([]);
  const fetchPositions = async () => {
    try {
      const response = await positionService.getPositions();
      const data:PositionDTO[] = await response.data;
      setPositionList(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  }
  const handleClosePosition = async (symbol: string, positionAmt: string) => {
  try {
    const amount = parseFloat(positionAmt);
    // 1. Chặn ngay từ đầu nếu không có vị thế
    if (amount === 0) {
      console.warn('Không có vị thế đang mở để đóng!');
      return;
    }
    // 2. Xác định Side đóng chuẩn xác bất chấp One-way hay Hedge mode
    // - Khối lượng dương (> 0) là đang Long -> Đóng bằng lệnh SELL
    // - Khối lượng âm (< 0) là đang Short -> Đóng bằng lệnh BUY
    const side = amount > 0 ? 'SELL' : 'BUY';

    // 3. Lấy giá trị tuyệt đối của khối lượng (Xóa dấu trừ nếu là lệnh Short)
    const quantityToSend = Math.abs(amount).toString();

    // 4. Gửi request gọi API
    const response = await positionService.closePosition({ 
      symbol, 
      side, 
      type: 'MARKET', 
      quantity: quantityToSend 
    });
    toast.success('Đã gửi lệnh thành công!');
    console.log('Close position response:', response.data);
    
    // Ở đây bạn có thể trigger thêm việc refresh lại UI để số dư cập nhật
  } catch (error) {
    console.error('Error closing position:', error);
  }
};

  useEffect(() => {
    fetchPositions();
  }, []);

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
                const isWin = Number(pos.unRealizedProfit) >= 0;

                return (
                  <tr key={pos.symbol}>
                    <td className="sticky-col-left text-start symbol-cell">
                      <div className="symbol-name">{pos.symbol}</div>
                      <div className="mt-1">
                        <span
                          className={`side-badge ${
                            Number(pos.positionAmt) > 0 ? 'side-long' : 'side-short'
                          }`}
                        >
                          {Number(pos.positionAmt) > 0 ? 'LONG' : 'SHORT'} {10}x
                        </span>
                      </div>
                    </td>

                    <td className="text-start">{formatNumber(Number(pos.positionAmt), 3)}</td>
                    <td className="text-start">{formatNumber(Number(pos.entryPrice), 2)}</td>
                    <td className="text-start">{formatNumber(Number(pos.breakEvenPrice), 2)}</td>
                    <td className="text-start">{formatNumber(Number(pos.markPrice), 2)}</td>
                    <td className="text-start text-warning">
                      {formatNumber(Number(pos.liquidationPrice), 2)}
                    </td>
                    <td className="text-start">{formatNumber((Number(pos.positionInitialMargin) / Number(pos.positionAmt)) * 100, 2)}%</td>
                    <td className="text-start">{formatNumber(Number(pos.positionInitialMargin), 2)} USDT</td>

                    <td className="text-start">
                      <div className={isWin ? 'pnl-positive' : 'pnl-negative'}>
                        <div className="fw-semibold">
                          {isWin ? '+' : ''}
                          {formatNumber(Number(pos.unRealizedProfit), 2)} USDT
                        </div>
                        <div className="small">
                          ({isWin ? '+' : ''}
                          {formatNumber((Number(pos.unRealizedProfit) / Number(pos.initialMargin)) * 100, 2)}%)
                        </div>
                      </div>
                    </td>

                    {/* <td className="text-start funding-text">
                      {pos.estFunding > 0 ? '+' : ''}
                      {formatNumber(Number(pos.estFunding), 2)} USDT
                    </td> */}

                    <td className="sticky-col-right text-center">
                      <div className="d-flex justify-content-center gap-2 flex-nowrap">
                        <button
                          type="button"
                          className="btn btn-binance-action btn-sm text-white"
                        >
                          TP/SL
                        </button>
                        <button type="button" className="btn btn-binance-action btn-sm btn-warning">
                          Giới hạn
                        </button>
                        <button type="button" className="btn btn-binance-action btn-sm btn-warning"
                          onClick={() => handleClosePosition(pos.symbol, pos.positionAmt)}>
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

      {isModalOpen  && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-modal">
              <div className="modal-header border-secondary-subtle">
                <h5 className="modal-title text-light">
                  Chốt lời / Dừng lỗ 
                </h5>
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
                    <span className="text-success">
                      Giá đánh dấu: 
                    </span>
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
                    <span className="text-danger">
                      Giá đánh dấu
                    </span>
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
                <button type="button" className="btn btn-warning fw-semibold text-dark">
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