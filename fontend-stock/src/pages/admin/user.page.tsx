import React, { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Filter,
  Lock,
  Search,
  Unlock,
  UserCheck,
  Users,
  UserX,
  AlertTriangle,
} from "lucide-react";
import { Pagination, ConfigProvider } from "antd";
import { manageUserService, type quantityUser } from "../../services/admin/manageUserService";
import type { PageData } from "../../services/userService";
import { formatDate } from "../../helper/FormatDateTime";
import { toast } from "react-toastify";

type UserItem = {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  totalOrder: number;
};

export const UserPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Locked">("All");
  const [quantityUser, setQuantityUser] = useState<quantityUser>({
    totalUser: 0,
    activateUser: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageData, setPageData] = useState<PageData<UserItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const users = pageData?.content || [];

  const fetchUsers = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = await manageUserService.getAllUsers(page, size);
      setPageData(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await manageUserService.getTotalUser();
      const totalUserData = response.data.data as quantityUser;
      setQuantityUser(totalUserData);
    } catch (error) {
      console.error("Lỗi khi tải tổng số người dùng:", error);
    }
  };

  // Gọi API khi thay đổi trang, kích thước trang, search hoặc filter
  useEffect(() => {
    fetchTotalUsers();
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, search, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleStatusChange = async (id: number, isCurrentlyActive: boolean) => {
    const action = isCurrentlyActive ? "khóa" : "mở khóa";
    const confirmMessage = `Bạn có chắc chắn muốn ${action} tài khoản này không?`;

    if (!window.confirm(confirmMessage)) return;

    const toastId = toast.loading("Đang cập nhật trạng thái...");

    try {
      const response = await manageUserService.updateUserStatus(id);
      if (response.data.code === 200) {
        toast.update(toastId, {
          render: `Đã ${action} tài khoản thành công!`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        fetchUsers(currentPage, pageSize);
        fetchTotalUsers();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.update(toastId, {
        render: "Có lỗi xảy ra khi cập nhật trạng thái tài khoản.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page - 1);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(0);
    }
  };

  const totalUsers = pageData?.totalElements || 0;
  const startIndex = totalUsers === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalUsers);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#0A0A0A",
    borderRadius: "16px",
    border: "1px solid #1F1F1F",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
  };

  const getBadgeStyle = (isActive: boolean): React.CSSProperties => {
    return isActive
      ? {
          color: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "13.5px",
          fontWeight: "500",
        }
      : {
          color: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "13.5px",
          fontWeight: "500",
        };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000",}}>
      <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: 0, color: "#fff" }}>
              Quản lý Người dùng
            </h1>
            <p style={{ color: "#888", marginTop: "6px" }}>
              Theo dõi và quản lý tất cả tài khoản người dùng trong hệ thống
            </p>
          </div>

          <button
            style={{
              padding: "12px 28px",
              backgroundColor: "#F0B90B",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            + Thêm người dùng mới
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px", marginBottom: "15px" }}>
          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#888", fontSize: "14.5px" }}>Tổng người dùng</div>
                  <div style={{ fontSize: "36px", fontWeight: "700", marginTop: "8px" }}>{totalUsers}</div>
                </div>
                <Users size={42} style={{ color: "#F0B90B" }} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#888", fontSize: "14.5px" }}>Đang hoạt động</div>
                  <div style={{ fontSize: "36px", fontWeight: "700", marginTop: "8px", color: "#10B981" }}>
                    {quantityUser.activateUser}
                  </div>
                </div>
                <UserCheck size={42} style={{ color: "#10B981" }} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#888", fontSize: "14.5px" }}>Đang khóa</div>
                  <div style={{ fontSize: "36px", fontWeight: "700", marginTop: "8px", color: "#EF4444" }}>
                    {quantityUser.totalUser - quantityUser.activateUser}
                  </div>
                </div>
                <UserX size={42} style={{ color: "#EF4444" }} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#888", fontSize: "14.5px" }}>Rủi ro cao</div>
                  <div style={{ fontSize: "36px", fontWeight: "700", marginTop: "8px", color: "#F59E0B" }}>0</div>
                </div>
                <AlertTriangle size={42} style={{ color: "#F59E0B" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={cardStyle} className="mb-3">
          <div style={{ padding: "15px 28px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "end" }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <label style={{ color: "#888", fontSize: "14px", marginBottom: "8px", display: "block" }}>
                  Tìm kiếm người dùng
                </label>
                <div style={{
                  position: "relative",
                  backgroundColor: "#111",
                  border: "1px solid #1F1F1F",
                  borderRadius: "12px",
                  padding: "12px 16px",
                }}>
                  <Search size={18} style={{ position: "absolute", left: "16px", top: "14px", color: "#666" }} />
                  <input
                    type="text"
                    placeholder="Tìm theo ID, tên, hoặc email..."
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
                <label style={{ color: "#888", fontSize: "14px", marginBottom: "8px", display: "block" }}>
                  Trạng thái
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Locked")}
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
                  <option value="All">Tất cả trạng thái</option>
                  <option value="Active">Đang hoạt động</option>
                  <option value="Locked">Đã khóa</option>
                </select>
              </div>

              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#111",
                  border: "1px solid #1F1F1F",
                  borderRadius: "12px",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "48px",
                }}
              >
                <Filter size={18} />
                Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={cardStyle}>
          <div style={{ padding: "15px 28px", borderBottom: "1px solid #1F1F1F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Danh sách người dùng</h5>
            <span style={{ color: "#888" }}>{totalUsers} kết quả</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#888", borderBottom: "1px solid #222" }}>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Thông tin người dùng</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Trạng thái</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Ngày tạo</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Số lệnh giao dịch</th>
                  <th style={{ textAlign: "center", padding: "20px 24px", fontWeight: "normal" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #1F1F1F" }}>
                    <td style={{ padding: "20px 24px", fontFamily: "monospace", color: "#aaa" }}>{user.id}</td>
                    
                    <td style={{ padding: "20px 24px" }}>
                      <div>
                        <div style={{ fontWeight: "600", color: "#fff" }}>{user.fullName}</div>
                        <div style={{ color: "#888", fontSize: "14px" }}>{user.email}</div>
                      </div>
                    </td>

                    <td style={{ padding: "20px 24px" }}>
                      <span style={getBadgeStyle(user.isActive)}>
                        {user.isActive ? "Đang hoạt động" : "Đã khóa"}
                      </span>
                    </td>

                    <td style={{ padding: "20px 24px", color: "#ccc" }}>{formatDate(user.createdAt)}</td>
                    <td style={{ padding: "20px 24px", fontWeight: "500" }}>{user.totalOrder}</td>

                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#111",
                            border: "1px solid #1F1F1F",
                            borderRadius: "8px",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>

                        {user.isActive ? (
                          <button
                            onClick={() => handleStatusChange(user.id, true)}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "rgba(239, 68, 68, 0.12)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              borderRadius: "8px",
                              color: "#EF4444",
                              cursor: "pointer",
                            }}
                            title="Khóa tài khoản"
                          >
                            <Lock size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, false)}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "rgba(16, 185, 129, 0.12)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              borderRadius: "8px",
                              color: "#10B981",
                              cursor: "pointer",
                            }}
                            title="Mở khóa tài khoản"
                          >
                            <Unlock size={18} />
                          </button>
                        )}

                        <button
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "rgba(0, 192, 135, 0.12)",
                            border: "1px solid rgba(0, 192, 135, 0.3)",
                            borderRadius: "8px",
                            color: "#00C087",
                            cursor: "pointer",
                          }}
                          title="Kích hoạt"
                        >
                          <UserCheck size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center", color: "#666" }}>
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalUsers > 0 && (
            <div style={{ padding: "24px 28px", borderTop: "1px solid #1F1F1F", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ color: "#888" }}>
                Hiển thị {startIndex} - {endIndex} trong tổng {totalUsers} người dùng
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
                  total={totalUsers}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  showQuickJumper
                  pageSizeOptions={["10", "20", "50", "100"]}
                  showTotal={(total) => `Tổng ${total} người dùng`}
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
    </div>
  );
};