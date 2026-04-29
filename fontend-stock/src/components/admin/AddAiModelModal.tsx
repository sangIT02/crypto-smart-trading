import React, { useState } from "react";
import { Info } from "lucide-react";
import { manageAIModelService } from "../../services/manageAIModelService";
import { toast } from "react-toastify";

type AddAiModelModalProps = {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export const AddAiModelModal: React.FC<AddAiModelModalProps> = ({
  show,
  onClose,
  onSubmit,
}) => {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("4h");
  const [timeStep, setTimeStep] = useState(10);
  const [limit, setLimit] = useState(1000);

  const handleTrainModel = async (symbol: string, interval: string, limit: number,timeStep: number) => {
    try {
      const response = await manageAIModelService.addModel(symbol, interval, timeStep, limit);
      console.log("Train model response:", response.data);
      const toastId = toast.loading("Đang train model...");
      // Giả sử response.data có trường 'status' để biết khi nào train xong
      toast.update(toastId, {
              render: `Đang train model...`,
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            onClose();
    } catch (error) {
      console.error("Error training model:", error);
      toast.error("Có lỗi xảy ra khi train model.");
    }
  }
  
  if (!show) return null;

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#111",
    border: "1px solid #2a2a2a",
    color: "#fff",
  };

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content text-white"
          style={{
            background: "linear-gradient(145deg, #0b0b0b, #050505)",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
          }}
        >
          {/* HEADER */}
          <div className="modal-header border-0 pb-0">
            <div>
              <h4 className="fw-bold mb-1">Tạo mô hình AI</h4>
              <div className="text-secondary small">
                Cấu hình dữ liệu và tham số để train model
              </div>
            </div>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body pt-3">
            <div className="row g-3">
              {/* SYMBOL */}
              <div className="col-md-6">
                <label
                  className="form-label small d-flex align-items-center gap-1"
                  title="Cặp coin dùng để train model"
                >
                  Cặp giao dịch
                  <Info size={14} className="text-secondary" />
                </label>
                <select
                  className="form-select"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  style={inputStyle}
                >
                  <option>BTCUSDT</option>
                  <option>ETHUSDT</option>
                  <option>BNBUSDT</option>
                  <option>SOLUSDT</option>
                </select>
              </div>

              {/* INTERVAL */}
              <div className="col-md-6">
                <label
                  className="form-label small d-flex align-items-center gap-1"
                  title="Độ phân giải dữ liệu (nến)"
                >
                  Khung thời gian
                  <Info size={14} className="text-secondary" />
                </label>
                <select
                  className="form-select"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  style={inputStyle}
                >
                  <option value="1h">1H</option>
                  <option value="4h">4H</option>
                  <option value="1d">1D</option>
                </select>
              </div>

              {/* TIME STEP */}
              <div className="col-md-6">
                <label
                  className="form-label small d-flex align-items-center gap-1"
                  title="Số nến đầu vào cho model (ví dụ: 10 nghĩa là dùng 10 cây nến trước đó)"
                >
                  Time Step
                  <Info size={14} className="text-secondary" />
                </label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  value={timeStep}
                  onChange={(e) => setTimeStep(Number(e.target.value))}
                  style={inputStyle}
                />
                <div className="text-secondary small mt-1">
                  Ví dụ: 10 → model nhìn 10 nến gần nhất
                </div>
              </div>

              {/* LIMIT */}
              <div className="col-md-6">
                <label
                  className="form-label small d-flex align-items-center gap-1"
                  title="Số lượng dữ liệu lịch sử dùng để train model"
                >
                  Số nến train
                  <Info size={14} className="text-secondary" />
                </label>
                <select
                  className="form-select"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  style={inputStyle}
                >
                  <option value={1000}>1000</option>
                  <option value={1500}>1500</option>
                  <option value={2000}>2000</option>
                </select>
                <div className="text-secondary small mt-1">
                  Nhiều dữ liệu → model chính xác hơn nhưng train lâu hơn
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 pt-2">
            <button className="btn btn-secondary px-4" onClick={onClose}>
              Hủy
            </button>

            <button
              className="btn fw-semibold px-4"
              style={{
                background: "linear-gradient(135deg, #F0B90B, #ffd666)",
                color: "#000",
                border: "none",
              }}
              onClick={() => handleTrainModel(symbol,interval,limit,timeStep)}
            >
              Train model mới 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
