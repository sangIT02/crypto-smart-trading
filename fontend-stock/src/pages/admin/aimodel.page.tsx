import React, { useEffect, useState } from "react";
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
import { Pagination, ConfigProvider } from "antd";
import { AddAiModelModal } from "../../components/admin/AddAiModelModal";
import { manageAIModelService, type AddNewModelData, type AIModel, type TotalModel } from "../../services/admin/manageAIModelService";
import type { PageData } from "../../services/userService";
import { formatBinanceTime } from "../../components/position/OpenOrder";
import { formatDate } from "../../helper/FormatDateTime";
import { toast } from "react-toastify";

type ModelStatus = "Running" | "Stopped";
type ModelType = "Forecasting" ;


export const AiModelPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1); // 1-based page để gửi cho backend
  const [pageSize, setPageSize] = useState(10);
  const [pageData, setPageData] = useState<PageData<AIModel> | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalModels, setTotalModels] = useState<TotalModel>({
    totalAIModel: 0,
    totalAIModelActive: 0,
    totalAIModelInActive: 0,
  });

  const models = pageData?.content || [];
  const totalItems = pageData?.totalElements || 0;

  const fetchModels = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = await manageAIModelService.getAllModelsWithPagination(page, size);
      setPageData(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách mô hình:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateModel = async (modelId: number) => {
    const toastId = toast.loading("Đang cập nhật trạng thái mô hình...");
    try {
      const response = await manageAIModelService.updateModelStatus(modelId);
      console.log("da", response.data.code);
      if (response.data.code === 200) {
        toast.update(toastId, {
                render: `Đã cập nhật thành công!`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
      }
      fetchModels(currentPage, pageSize);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái mô hình.", {
        toastId,
      });
      console.error("Lỗi khi cập nhật trạng thái mô hình:", error);
    }
  };

  const fetchTotalModels = async () => {
    try {
      const response = await manageAIModelService.getTotalModels();
      const data: TotalModel = response.data.data;
      setTotalModels(data);
    } catch (error) {
      console.error("Lỗi khi tải tổng mô hình:", error);
    }
  }

  // Gọi API khi thay đổi trang, kích thước trang
  useEffect(() => {
    fetchModels(currentPage, pageSize);
    fetchTotalModels();
  }, [currentPage, pageSize]);

  // Reset về trang 1 khi thay đổi search hoặc filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page); // Gửi trực tiếp page từ Ant Design (1-based)
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "12px",
    border: "2px solid #2e2e2e",
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
            <h3 className="text-white fw-bold mb-1">Quản lý mô hình AI</h3>
            <div className="text-secondary small">
              Theo dõi trạng thái, hiệu suất, độ chính xác và điều khiển các mô
              hình AI
            </div>
          </div>

          <button
            className="btn text-dark fw-semibold"
            style={{ backgroundColor: "#F0B90B", border: "none" }}
            onClick={() => setShowModal(true)}
          >
            + Thêm mô hình
          </button>
        </div>
      </div>

      <div className="row g-3 mb-2">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Tổng mô hình</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {totalModels.totalAIModel}
                </div>
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
                  {totalModels.totalAIModelActive}
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
                  {0}
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
                  {totalModels.totalAIModelInActive}
                </div>
              </div>
              <Power size={18} color="#F6465D" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-2 mb-2" style={cardStyle}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-8">
            <label className="form-label text-secondary small">
              Tìm kiếm mô hình
            </label>
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
                onChange={handleSearchChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label text-secondary small">
              Trạng thái
            </label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={inputStyle}
            >
              <option value="All">Tất cả</option>
              <option value="Running">Running</option>
              <option value="Stopped">Stopped</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-2">
        <div className="col-12 col-xl-12">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Danh sách mô hình</h5>
              <span className="text-secondary small">
                {totalItems} kết quả
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
                    <th className="border-0 bg-transparent">Trained at</th>
                    <th className="border-0 bg-transparent" title="Độ chính xác (Accuracy): Tỷ lệ phần trăm các dự đoán đúng trên tổng số mẫu.">Accuracy</th>
                    <th className="border-0 bg-transparent" title="Sai số tuyệt đối trung bình (MAE): Mô hình dự đoán lệch bao nhiêu so với thực tế.">mae</th>
                    <th className="border-0 bg-transparent" title="Sai số bình phương trung bình (RMSE): Mô hình dự đoán lệch bao nhiêu so với thực tế.">rmse</th>
                    <th className="border-0 bg-transparent text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((model) => (
                    <tr key={model.id}>
                      <td style={{ backgroundColor: "transparent" }}>
                        {model.id}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        <div>
                          <div className="text-white fw-semibold">
                            {model.modelName}
                          </div>
                          <div className="text-secondary small">
                            {"LSTM"}
                          </div>
                        </div>
                      </td>

                      <td style={{ backgroundColor: "transparent" }} title="Dự đoán các giá trị tương lai dựa trên quy luật từ quá khứ.">
                        {"Forecasting"}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        <span
                          className="px-2 py-1 rounded small"
                          style={getBadgeStyle(model.isActive ? "Running" : "Stopped")}
                        >
                          {model.isActive ? "Running" : "Stopped"}
                        </span>
                      </td>
                      <td style={{ backgroundColor: "transparent" }}>
                        {formatDate(model.trainedAt, "full")}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        {model.isActive === false
                          ? "--"
                          : `${model.directionAcc}%`}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        {model.isActive === false
                          ? "--"
                          : `${model.mae} `}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        {model.rmse}
                      </td>

                      <td style={{ backgroundColor: "transparent" }}>
                        <div className="d-flex justify-content-center gap-2 flex-wrap">


                          <button
                            className="btn btn-sm"
                            onClick = {() => handleUpdateModel(model.id)}
                            style={{
                              color:
                                model.isActive === false
                                  ? "#00C087"
                                  : "#F6465D",
                              backgroundColor:
                                model.isActive === false
                                  ? "rgba(0, 192, 135, 0.12)"
                                  : "rgba(246, 70, 93, 0.12)",
                              border:
                                model.isActive === false
                                  ? "1px solid rgba(0, 192, 135, 0.2)"
                                  : "1px solid rgba(246, 70, 93, 0.2)",
                            }}
                            title={
                              model.isActive === false
                                ? "Bật mô hình"
                                : "Tắt mô hình"
                            }
                          >
                            <Power size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {models.length === 0 && (
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

            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
              <span className="text-secondary small">
                Hiển thị {startIndex} - {endIndex} trong {totalItems} mô hình
              </span>
              
              {totalItems > 0 && (
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#F0B90B",
                      colorBgContainer: "#111",
                      colorText: "#fff",
                      colorBorder: "#1f1f1f",
                      borderRadius: 6,
                    },
                  }}
                >
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePaginationChange}
                    pageSizeOptions={["5", "10", "20", "50"]}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Tổng ${total} mô hình`}
                    locale={{
                      items_per_page: "/ trang",
                      jump_to: "Đến trang",
                      page: "",
                    }}
                    style={{ marginLeft: "auto" }}
                  />
                </ConfigProvider>
              )}
            </div>
          </div>
        </div>
      </div>
      <AddAiModelModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          console.log("NEW MODEL:", data);
        }}
      />
    </div>
  );
};
