import React, { use, useEffect, useMemo, useState } from "react";
import {
  Eye,
  Filter,
  Lock,
  Search,
  Unlock,
  UserCheck,
} from "lucide-react";
import { Pagination, ConfigProvider } from "antd";
import { manageUserService, type quantityUser } from "../../services/manageUserService";
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
  const [currentPage, setCurrentPage] = useState(0); // Spring Boot bắt đầu từ 0
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

  // Gọi API khi thay đổi trang, kích thước trang, search hoặc filter
  useEffect(() => {
    fetchTotalUsers();
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, search, statusFilter]);

  // Reset về trang 1 khi thay đổi search hoặc filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleStatusChange = async (id: number, isCurrentlyActive: boolean) => {
  // Xác nhận trước khi thực hiện hành động nguy hiểm
  const action = isCurrentlyActive ? "khóa" : "mở khóa";
  const confirmMessage = `Bạn có chắc chắn muốn ${action} tài khoản này không?`;

  if (!window.confirm(confirmMessage)) {
    return; // Người dùng bấm Cancel → dừng lại
  }

  const toastId = toast.loading("Đang cập nhật trạng thái...");
  
  try {
    const response = await manageUserService.updateUserStatus(id);
    console.log("", response.data.code);
    if (response.data.code === 200) {
      // Refresh danh sách sau khi cập nhật thành công
      toast.update(toastId, {
              render: `Đã cập nhật thành công!`,
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
      fetchUsers(currentPage, pageSize);
      if (typeof fetchTotalUsers === "function") {
        fetchTotalUsers();
      }
      
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
    setCurrentPage(page - 1); // Antd dùng 1-based, Spring dùng 0-based
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(0);
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

  const totalUsers = pageData?.totalElements || 0;
  const startIndex = totalUsers === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalUsers);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
  };

  const getBadgeStyle = (value: boolean): React.CSSProperties => {
    if (value) {
      return {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
      };
    }
    return {
      color: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(239, 68, 68, 0.2)",
    };
  };

  return (
    <div className="container-fluid py-4 pt-0" style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h3 className="text-white fw-bold mb-1">Quản lý người dùng</h3>
            <div className="text-secondary small">
              Theo dõi tài khoản, trạng thái, mức rủi ro và hành động quản trị
            </div>
          </div>

          <button
            className="btn text-dark fw-semibold"
            style={{ backgroundColor: "#F0B90B", border: "none" }}
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      {/* Cards thống kê */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Tổng người dùng</div>
            <div className="text-white fw-bold fs-4 mt-2">{totalUsers}</div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Đang hoạt động</div>
            <div className="text-white fw-bold fs-4 mt-2">
              {quantityUser.activateUser
}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Đang khóa</div>
            <div className="text-white fw-bold fs-4 mt-2">
              {quantityUser.totalUser - quantityUser.activateUser}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Rủi ro cao</div>
            <div className="text-white fw-bold fs-4 mt-2">0</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card p-4 mb-4" style={cardStyle}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-5">
            <label className="form-label text-secondary small">Tìm kiếm</label>
            <div className="position-relative">
              <Search size={16} className="position-absolute top-50 translate-middle-y" style={{ left: "12px", color: "#6c757d" }} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm theo ID, tên, email..."
                value={search}
                onChange={handleSearchChange}
                style={{ backgroundColor: "#0b0b0b", border: "1px solid #1a1a1a", color: "#fff" }}
              />
            </div>
          </div>

          <div className="col-12 col-lg-3">
            <label className="form-label text-secondary small">Trạng thái</label>
            <select
              className="form-select"
              value={statusFilter}
              style={{ backgroundColor: "#0b0b0b", border: "1px solid #1a1a1a", color: "#fff" }}
            >
              <option value="All">Tất cả</option>
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
            </select>
          </div>

          <div className="col-12 col-lg-1">
            <button className="btn w-100 text-white" style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}>
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="card p-4" style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Danh sách người dùng</h5>
          <span className="text-secondary small">{totalUsers} kết quả</span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark align-middle mb-0">
            <thead>
              <tr style={{ color: "#7d8592" }}>
                <th className="border-0 bg-transparent">ID</th>
                <th className="border-0 bg-transparent">Người dùng</th>
                <th className="border-0 bg-transparent">Trạng thái</th>
                <th className="border-0 bg-transparent">Ngày tạo</th>
                <th className="border-0 bg-transparent">Giao dịch</th>
                <th className="border-0 bg-transparent text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ backgroundColor: "transparent" }}>{user.id}</td>
                  <td style={{ backgroundColor: "transparent" }}>
                    <div>
                      <div className="text-white fw-semibold">{user.fullName}</div>
                      <div className="text-secondary small">{user.email}</div>
                    </div>
                  </td>
                  <td style={{ backgroundColor: "transparent" }}>
                    <span className="px-2 py-1 rounded small" style={getBadgeStyle(user.isActive)}>
                      {user.isActive ? "Active" : "Locked"}
                    </span>
                  </td>
                  <td style={{ backgroundColor: "transparent" }}>{formatDate(user.createdAt)}</td>
                  <td style={{ backgroundColor: "transparent" }}>{user.totalOrder}</td>
<td style={{ backgroundColor: "transparent" }}>
  <div className="d-flex justify-content-center gap-2 flex-wrap">
    {/* Nút xem chi tiết */}
    <button
      className="btn btn-sm text-white"
      style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
      title="Xem chi tiết"
    >
      <Eye size={15} />
    </button>

    {/* Nút Khóa / Mở khóa với xác nhận */}
    {user.isActive ? (
      <button
        className="btn btn-sm"
        style={{
          color: "#EF4444",                    // Màu đỏ cho hành động khóa
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}
        title="Khóa tài khoản"
        onClick={() => handleStatusChange(user.id, true)}   // true = đang active → muốn khóa
      >
        <Lock size={15} />
      </button>
    ) : (
      <button
        className="btn btn-sm"
        style={{
          color: "#10B981",                    // Màu xanh cho hành động mở khóa
          backgroundColor: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
        }}
        title="Mở khóa tài khoản"
        onClick={() => handleStatusChange(user.id, false)}  // false = đang khóa → muốn mở
      >
        <Unlock size={15} />
      </button>
    )}

    {/* Nút khác giữ nguyên */}
    <button
      className="btn btn-sm"
      style={{
        color: "#00C087",
        backgroundColor: "rgba(0, 192, 135, 0.12)",
        border: "1px solid rgba(0, 192, 135, 0.2)",
      }}
      title="Kích hoạt"
    >
      <UserCheck size={15} />
    </button>
  </div>
</td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-secondary py-5">
                    Không tìm thấy người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ant Design Pagination */}
        {totalUsers > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
            <div className="text-secondary small">
              Hiển thị {startIndex} - {endIndex} trong tổng {totalUsers} người dùng
            </div>

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
                style={{ marginLeft: "auto" }}
              />
            </ConfigProvider>
          </div>
        )}
      </div>
    </div>
  );
};