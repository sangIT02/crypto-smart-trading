import React, { useEffect, useState } from "react";
import {
  Activity,
  Brain,
  Power,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Pagination, ConfigProvider } from "antd";
import { AddAiModelModal } from "../../components/admin/AddAiModelModal";
import {
  manageAIModelService,
  type AIModel,
  type TotalModel,
} from "../../services/admin/manageAIModelService";
import type { PageData } from "../../services/userService";
import { formatDate } from "../../helper/FormatDateTime";
import { toast } from "react-toastify";

export const AiModelPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(0);
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

      const response =
        await manageAIModelService.getAllModelsWithPagination(page, size);

      setPageData(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách mô hình:", error);
    } finally {
      setLoading(false);
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
  };

  const handleUpdateModel = async (modelId: number) => {
    const toastId = toast.loading(
      "Đang cập nhật trạng thái mô hình..."
    );

    try {
      const response =
        await manageAIModelService.updateModelStatus(modelId);

      if (response.data.code === 200) {
        toast.update(toastId, {
          render: "Đã cập nhật thành công!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      fetchModels(currentPage, pageSize);
      fetchTotalModels();
    } catch (error) {
      toast.update(toastId, {
        render: "Có lỗi xảy ra khi cập nhật trạng thái mô hình.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      console.error("Lỗi khi cập nhật trạng thái mô hình:", error);
    }
  };

  useEffect(() => {
    fetchModels(currentPage, pageSize);
    fetchTotalModels();
  }, [currentPage, pageSize]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handlePaginationChange = (
    page: number,
    newPageSize: number
  ) => {
    setCurrentPage(page - 1);

    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(0);
    }
  };

  const startIndex =
    totalItems === 0 ? 0 : currentPage * pageSize + 1;

  const endIndex = Math.min(
    (currentPage + 1) * pageSize,
    totalItems
  );

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#0A0A0A",
    borderRadius: "16px",
    border: "1px solid #1F1F1F",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
  };

  const getBadgeStyle = (
    isActive: boolean
  ): React.CSSProperties => {
    return isActive
      ? {
          color: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
        }
      : {
          color: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: "500",
        };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          maxWidth: "1480px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                margin: 0,
                color: "#fff",
              }}
            >
              Quản lý mô hình AI
            </h1>

            <p
              style={{
                color: "#888",
                marginTop: "6px",
              }}
            >
              Theo dõi trạng thái và quản lý các mô hình AI
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "12px 28px",
              backgroundColor: "#F0B90B",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Thêm mô hình
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    Tổng mô hình
                  </div>

                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                      color: "#fff",
                    }}
                  >
                    {totalModels.totalAIModel}
                  </div>
                </div>

                <Brain size={40} color="#F0B90B" />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    Đang hoạt động
                  </div>

                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                      color: "#10B981",
                    }}
                  >
                    {totalModels.totalAIModelActive}
                  </div>
                </div>

                <Activity size={40} color="#10B981" />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    Cần cảnh báo
                  </div>

                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                      color: "#F59E0B",
                    }}
                  >
                    0
                  </div>
                </div>

                <ShieldAlert size={40} color="#F59E0B" />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#888",
                      fontSize: "14px",
                    }}
                  >
                    Đã dừng
                  </div>

                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                      color: "#EF4444",
                    }}
                  >
                    {totalModels.totalAIModelInActive}
                  </div>
                </div>

                <Power size={40} color="#EF4444" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div style={cardStyle} className="mb-3">
          <div style={{ padding: "15px 28px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                alignItems: "end",
              }}
            >
              <div style={{ flex: 1, minWidth: "300px" }}>
                <label
                  style={{
                    color: "#888",
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Tìm kiếm mô hình
                </label>

                <div
                  style={{
                    position: "relative",
                    backgroundColor: "#111",
                    border: "1px solid #1F1F1F",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "14px",
                      color: "#666",
                    }}
                  />

                  <input
                    type="text"
                    placeholder="Tìm theo tên mô hình..."
                    value={search}
                    onChange={handleSearchChange}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#fff",
                      paddingLeft: "40px",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </div>

              <div style={{ minWidth: "180px" }}>
                <label
                  style={{
                    color: "#888",
                    fontSize: "14px",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Trạng thái
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#111",
                    border: "1px solid #1F1F1F",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  <option value="All">Tất cả</option>
                  <option value="Running">Running</option>
                  <option value="Stopped">Stopped</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={cardStyle}>
          <div
            style={{
              padding: "15px 28px",
              borderBottom: "1px solid #1F1F1F",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              Danh sách mô hình
            </h5>

            <span style={{ color: "#888" }}>
              {totalItems} kết quả
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    color: "#888",
                    borderBottom: "1px solid #222",
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    ID
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    Mô hình
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    Loại
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    Trạng thái
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    Trained At
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    Accuracy
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    MAE
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    RMSE
                  </th>

                  <th
                    style={{
                      textAlign: "center",
                      padding: "20px 24px",
                      fontWeight: "normal",
                    }}
                  >
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {models.map((model) => (
                  <tr
                    key={model.id}
                    style={{
                      borderBottom: "1px solid #1F1F1F",
                    }}
                  >
                    <td
                      style={{
                        padding: "20px 24px",
                        color: "#aaa",
                        fontFamily: "monospace",
                      }}
                    >
                      {model.id}
                    </td>

                    <td style={{ padding: "20px 24px" }}>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          {model.modelName}
                        </div>

                        <div
                          style={{
                            color: "#888",
                            fontSize: "14px",
                          }}
                        >
                          LSTM
                        </div>
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "20px 24px",
                        color: "#ccc",
                      }}
                    >
                      Forecasting
                    </td>

                    <td style={{ padding: "20px 24px" }}>
                      <span
                        style={getBadgeStyle(model.isActive)}
                      >
                        {model.isActive
                          ? "Running"
                          : "Stopped"}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "20px 24px",
                        color: "#ccc",
                      }}
                    >
                      {formatDate(model.trainedAt, "full")}
                    </td>

                    <td
                      style={{
                        padding: "20px 24px",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                    >
                      {model.isActive === false
                        ? "--"
                        : `${model.directionAcc}%`}
                    </td>

                    <td
                      style={{
                        padding: "20px 24px",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                    >
                      {model.isActive === false
                        ? "--"
                        : model.mae}
                    </td>

                    <td
                      style={{
                        padding: "20px 24px",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                    >
                      {model.rmse}
                    </td>

                    <td style={{ padding: "20px 24px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleUpdateModel(model.id)
                          }
                          style={{
                            padding: "8px 12px",
                            backgroundColor:
                              model.isActive
                                ? "rgba(239, 68, 68, 0.12)"
                                : "rgba(16, 185, 129, 0.12)",
                            border: model.isActive
                              ? "1px solid rgba(239, 68, 68, 0.3)"
                              : "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "8px",
                            color: model.isActive
                              ? "#EF4444"
                              : "#10B981",
                            cursor: "pointer",
                          }}
                          title={
                            model.isActive
                              ? "Tắt mô hình"
                              : "Bật mô hình"
                          }
                        >
                          <Power size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {models.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: "60px 20px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      Không tìm thấy mô hình phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div
              style={{
                padding: "24px 28px",
                borderTop: "1px solid #1F1F1F",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ color: "#888" }}>
                Hiển thị {startIndex} - {endIndex} trong
                tổng {totalItems} mô hình
              </div>

              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#F0B90B",
                    colorBgContainer: "#111",
                    colorText: "#fff",
                    colorBorder: "#1F1F1F",
                    borderRadius: 8,
                  },
                }}
              >
                <Pagination
                  current={currentPage + 1}
                  pageSize={pageSize}
                  total={totalItems}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  showQuickJumper
                  pageSizeOptions={[
                    "10",
                    "20",
                    "50",
                    "100",
                  ]}
                  showTotal={(total) =>
                    `Tổng ${total} mô hình`
                  }
                  locale={{
                    items_per_page: "/ trang",
                    jump_to: "Đến trang",
                    page: "",
                  }}
                />
              </ConfigProvider>
            </div>
          )}
        </div>
      </div>

      <AddAiModelModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data: any) => {
          console.log("NEW MODEL:", data);
        }}
      />
    </div>
  );
};
