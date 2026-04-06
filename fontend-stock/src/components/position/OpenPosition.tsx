import React, { useState } from 'react';

interface PositionData {
  id: string;
  symbol: string;
  leverage: number;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  breakEvenPrice: number;
  markPrice: number;
  liqPrice: number;
  marginRatio: number;
  margin: number;
  pnl: number;
  roe: number;
  estFunding: number;
}

const demoData: PositionData[] = [
  {
    id: '1',
    symbol: 'BTCUSDT',
    leverage: 50,
    side: 'LONG',
    size: 0.125,
    entryPrice: 66240.5,
    breakEvenPrice: 66260.0,
    markPrice: 67100.2,
    liqPrice: 64100.0,
    marginRatio: 4.5,
    margin: 165.5,
    pnl: 107.46,
    roe: 64.93,
    estFunding: -0.15,
  },
  {
    id: '2',
    symbol: 'ETHUSDT',
    leverage: 20,
    side: 'SHORT',
    size: 2.45,
    entryPrice: 3520.1,
    breakEvenPrice: 3515.0,
    markPrice: 3480.5,
    liqPrice: 3800.0,
    marginRatio: 8.2,
    margin: 430.2,
    pnl: 97.02,
    roe: 27.56,
    estFunding: 0.05,
  },
];

const formatNumber = (value: number, digits = 2) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const OpenPosition: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPos, setSelectedPos] = useState<PositionData | null>(null);

  const openTpSlModal = (pos: PositionData) => {
    setSelectedPos(pos);
    setIsModalOpen(true);
  };

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
                <th className="text-start">Phí funding ước tính</th>
                <th className="sticky-col-right text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {demoData.map((pos) => {
                const isWin = pos.pnl >= 0;

                return (
                  <tr key={pos.id}>
                    <td className="sticky-col-left text-start symbol-cell">
                      <div className="symbol-name">{pos.symbol}</div>
                      <div className="mt-1">
                        <span
                          className={`side-badge ${
                            pos.side === 'LONG' ? 'side-long' : 'side-short'
                          }`}
                        >
                          {pos.side} {pos.leverage}x
                        </span>
                      </div>
                    </td>

                    <td className="text-start">{formatNumber(pos.size, 3)}</td>
                    <td className="text-start">{formatNumber(pos.entryPrice, 2)}</td>
                    <td className="text-start">{formatNumber(pos.breakEvenPrice, 2)}</td>
                    <td className="text-start">{formatNumber(pos.markPrice, 2)}</td>
                    <td className="text-start text-warning">
                      {formatNumber(pos.liqPrice, 2)}
                    </td>
                    <td className="text-start">{formatNumber(pos.marginRatio, 2)}%</td>
                    <td className="text-start">{formatNumber(pos.margin, 2)} USDT</td>

                    <td className="text-start">
                      <div className={isWin ? 'pnl-positive' : 'pnl-negative'}>
                        <div className="fw-semibold">
                          {isWin ? '+' : ''}
                          {formatNumber(pos.pnl, 2)} USDT
                        </div>
                        <div className="small">
                          ({isWin ? '+' : ''}
                          {formatNumber(pos.roe, 2)}%)
                        </div>
                      </div>
                    </td>

                    <td className="text-start funding-text">
                      {pos.estFunding > 0 ? '+' : ''}
                      {formatNumber(pos.estFunding, 2)} USDT
                    </td>

                    <td className="sticky-col-right text-center">
                      <div className="d-flex justify-content-center gap-2 flex-nowrap">
                        <button
                          type="button"
                          className="btn btn-binance-action btn-sm text-white"
                          onClick={() => openTpSlModal(pos)}
                        >
                          TP/SL
                        </button>
                        <button type="button" className="btn btn-binance-action btn-sm btn-warning">
                          Giới hạn
                        </button>
                        <button type="button" className="btn btn-binance-action btn-sm btn-warning">
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

      {isModalOpen && selectedPos && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-modal">
              <div className="modal-header border-secondary-subtle">
                <h5 className="modal-title text-light">
                  Chốt lời / Dừng lỗ - {selectedPos.symbol}
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
                      Giá đánh dấu: {formatNumber(selectedPos.markPrice, 2)}
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
                      Giá đánh dấu: {formatNumber(selectedPos.markPrice, 2)}
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