import React, { useMemo, useState } from "react";
import {
  Activity,
  Brain,
  Cpu,
  Eye,
  Gauge,
  Power,
  RefreshCcw,
  Search,
  ShieldAlert,
} from "lucide-react";

type ModelStatus = "Running" | "Warning" | "Stopped";
type ModelType = "Forecasting" | "Strategy" | "Detection" | "Ensemble";

type AiModelItem = {
  id: string;
  name: string;
  type: ModelType;
  version: string;
  status: ModelStatus;
  accuracy: number;
  latency: number;
  cpu: number;
  requests: number;
  lastUpdated: string;
};

export const AiModelPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const models: AiModelItem[] = useMemo(
    () => [
      {
        id: "AI-001",
        name: "TrendSense",
        type: "Forecasting",
        version: "v2.1.0",
        status: "Running",
        accuracy: 87.4,
        latency: 118,
        cpu: 71,
        requests: 18240,
        lastUpdated: "2026-04-08 09:12",
      },
      {
        id: "AI-002",
        name: "Grid Optimizer",
        type: "Strategy",
        version: "v1.8.2",
        status: "Running",
        accuracy: 91.2,
        latency: 92,
        cpu: 62,
        requests: 14093,
        lastUpdated: "2026-04-08 09:05",
      },
      {
        id: "AI-003",
        name: "Risk Guard",
        type: "Detection",
        version: "v3.0.1",
        status: "Warning",
        accuracy: 94.1,
        latency: 240,
        cpu: 89,
        requests: 22341,
        lastUpdated: "2026-04-08 08:48",
      },
      {
        id: "AI-004",
        name: "Signal Fusion",
        type: "Ensemble",
        version: "v1.2.5",
        status: "Stopped",
        accuracy: 0,
        latency: 0,
        cpu: 0,
        requests: 0,
        lastUpdated: "2026-04-07 22:30",
      },
      {
        id: "AI-005",
        name: "Volatility Scan",
        type: "Detection",
        version: "v1.4.3",
        status: "Running",
        accuracy: 88.7,
        latency: 101,
        cpu: 57,
        requests: 12690,
        lastUpdated: "2026-04-08 09:09",
      },
    ],
    []
  );

  const filteredModels = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return models.filter((model) => {
      const matchSearch =
        !keyword ||
        model.id.toLowerCase().includes(keyword) ||
        model.name.toLowerCase().includes(keyword) ||
        model.type.toLowerCase().includes(keyword) ||
        model.version.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "All" || model.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [models, search, statusFilter]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#0b0b0b",
    border: "1px solid #1a1a1a",
    color: "#fff",
  };

  const getBadgeStyle = (value: string): React.CSSProperties => {
    switch (value) {
      case "Running":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.12)",
          border: "1px solid rgba(0, 192, 135, 0.2)",
        };
      case "Warning":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.12)",
          border: "1px solid rgba(240, 185, 11, 0.2)",
        };
      case "Stopped":
        return {
          color: "#F6465D",
          backgroundColor: "rgba(246, 70, 93, 0.12)",
          border: "1px solid rgba(246, 70, 93, 0.2)",
        };
      default:
        return {
          color: "#9CA3AF",
          backgroundColor: "rgba(156, 163, 175, 0.12)",
          border: "1px solid rgba(156, 163, 175, 0.2)",
        };
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 85) return "#F6465D";
    if (value >= 65) return "#F0B90B";
    return "#00C087";
  };

  const renderProgress = (value: number) => (
    <div style={{ minWidth: "120px" }}>
      <div className="d-flex justify-content-between mb-1">
        <span className="text-secondary" style={{ fontSize: "11px" }}>
          {value}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#151515",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: getProgressColor(value),
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="container-fluid py-4 pt-0"
      style={{ backgroundColor: "#000", minHeight: "100vh" }}
    >
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="text-secondary small mb-1">AI Model Management</div>
            <h3 className="text-white fw-bold mb-1">Quản lý mô hình AI</h3>
            <div className="text-secondary small">
              Theo dõi trạng thái, hiệu suất, độ chính xác và điều khiển các mô hình AI
            </div>
          </div>

          <button
            className="btn text-dark fw-semibold"
            style={{ backgroundColor: "#F0B90B", border: "none" }}
          >
            + Thêm mô hình
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Tổng mô hình</div>
                <div className="text-white fw-bold fs-4 mt-2">{models.length}</div>
              </div>
              <Brain size={18} color="#F0B90B" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Đang hoạt động</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {models.filter((m) => m.status === "Running").length}
                </div>
              </div>
              <Activity size={18} color="#00C087" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Cần cảnh báo</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {models.filter((m) => m.status === "Warning").length}
                </div>
              </div>
              <ShieldAlert size={18} color="#F0B90B" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Dừng hoạt động</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {models.filter((m) => m.status === "Stopped").length}
                </div>
              </div>
              <Power size={18} color="#F6465D" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4" style={cardStyle}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-8">
            <label className="form-label text-secondary small">Tìm kiếm mô hình</label>
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 translate-middle-y"
                style={{ left: "12px", color: "#6c757d" }}
              />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm theo ID, tên mô hình, loại, version..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label text-secondary small">Trạng thái</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="All">Tất cả</option>
              <option value="Running">Running</option>
              <option value="Warning">Warning</option>
              <option value="Stopped">Stopped</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Danh sách mô hình</h5>
              <span className="text-secondary small">
                {filteredModels.length} kết quả
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-dark align-middle mb-0">
                <thead>
                  <tr style={{ color: "#7d8592" }}>
                    <th className="border-0 bg-transparent">ID</th>
                    <th className="border-0 bg-transparent">Mô hình</th>
                    <th className="border-0 bg-transparent">Loại</th>
                    <th className="border-0 bg-transparent">Trạng thái</th>
                    <th className="border-0 bg-transparent">Accuracy</th>
                    <th className="border-0 bg-transparent">Latency</th>
                    <th className="border-0 bg-transparent">Requests</th>
                    <th className="border-0 bg-transparent text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModels.map((model) => (
                    <tr key={model.id}>
                      <td style={{ backgroundColor: "transparent" }}>{model.id}</td>

                      <td style={{ backgroundColor: "transparent" }}>
                        <div>
                          <div className="text-white fw-semibold">{model.name}</div>
                          <div className="text-secondary small">{model.version}</div>
                        </div>
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>{model.type}</td>

                      <td style={{ backgroundColor: "transparent" }}>
                        <span
                          className="px-2 py-1 rounded small"
                          style={getBadgeStyle(model.status)}
                        >
                          {model.status}
                        </span>
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        {model.status === "Stopped" ? "--" : `${model.accuracy}%`}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        {model.status === "Stopped" ? "--" : `${model.latency} ms`}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        {model.requests.toLocaleString()}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-sm text-white"
                            style={{
                              backgroundColor: "#111",
                              border: "1px solid #1f1f1f",
                            }}
                            title="Xem chi tiết"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            className="btn btn-sm"
                            style={{
                              color: "#F0B90B",
                              backgroundColor: "rgba(240, 185, 11, 0.12)",
                              border: "1px solid rgba(240, 185, 11, 0.2)",
                            }}
                            title="Restart"
                          >
                            <RefreshCcw size={15} />
                          </button>

                          <button
                            className="btn btn-sm"
                            style={{
                              color: model.status === "Stopped" ? "#00C087" : "#F6465D",
                              backgroundColor:
                                model.status === "Stopped"
                                  ? "rgba(0, 192, 135, 0.12)"
                                  : "rgba(246, 70, 93, 0.12)",
                              border:
                                model.status === "Stopped"
                                  ? "1px solid rgba(0, 192, 135, 0.2)"
                                  : "1px solid rgba(246, 70, 93, 0.2)",
                            }}
                            title={model.status === "Stopped" ? "Bật mô hình" : "Tắt mô hình"}
                          >
                            <Power size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredModels.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-secondary py-4"
                        style={{ backgroundColor: "transparent" }}
                      >
                        Không tìm thấy mô hình phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card p-4 h-100" style={cardStyle}>
            <h5 className="text-white fw-bold mb-3">Hiệu suất hệ thống AI</h5>

            <div
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #171717",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <Cpu size={16} color="#F0B90B" />
                <span className="text-white small fw-semibold">CPU Usage</span>
              </div>

              <div className="d-flex flex-column gap-3">
                {models.slice(0, 4).map((model) => (
                  <div key={model.id}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary small">{model.name}</span>
                      <span className="text-white small">{model.cpu}%</span>
                    </div>
                    {renderProgress(model.cpu)}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #171717",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <Gauge size={16} color="#F0B90B" />
                <span className="text-white small fw-semibold">Tóm tắt nhanh</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Avg Accuracy</span>
                <span className="text-white small">90.35%</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Avg Latency</span>
                <span className="text-white small">137 ms</span>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Tổng requests</span>
                <span className="text-white small">67,364</span>
              </div>
            </div>

            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "rgba(240, 185, 11, 0.08)",
                border: "1px solid rgba(240, 185, 11, 0.15)",
              }}
            >
              <div className="text-white small fw-semibold mb-1">Khuyến nghị</div>
              <div className="text-secondary small">
                Risk Guard đang có latency cao và CPU usage lớn. Nên kiểm tra lại tài nguyên hoặc restart model.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};