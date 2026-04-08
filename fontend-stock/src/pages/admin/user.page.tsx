import React, { useMemo, useState } from "react";
import {
  Eye,
  Filter,
  Lock,
  Search,
  ShieldCheck,
  Unlock,
  UserCheck,
  UserX,
} from "lucide-react";

type UserStatus = "Active" | "Locked" | "Suspended";
type KycStatus = "Verified" | "Pending" | "Rejected";
type RiskLevel = "Low" | "Medium" | "High";

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  status: UserStatus;
  kyc: KycStatus;
  risk: RiskLevel;
  registerDate: string;
  totalTrades: number;
};

export const UserPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [kycFilter, setKycFilter] = useState("All");

  const users: UserItem[] = useMemo(
    () => [
      {
        id: "U10293",
        name: "Nguyen Van A",
        email: "vana@gmail.com",
        phone: "0901234567",
        level: "VIP 1",
        status: "Active",
        kyc: "Verified",
        risk: "Low",
        registerDate: "2026-03-01",
        totalTrades: 184,
      },
      {
        id: "U10821",
        name: "Tran Thi B",
        email: "tranb@gmail.com",
        phone: "0912345678",
        level: "Standard",
        status: "Locked",
        kyc: "Pending",
        risk: "Medium",
        registerDate: "2026-02-18",
        totalTrades: 62,
      },
      {
        id: "U10991",
        name: "Le Minh C",
        email: "minhc@gmail.com",
        phone: "0988123123",
        level: "VIP 2",
        status: "Active",
        kyc: "Verified",
        risk: "Low",
        registerDate: "2026-01-20",
        totalTrades: 521,
      },
      {
        id: "U11102",
        name: "Pham D",
        email: "phamd@gmail.com",
        phone: "0977111222",
        level: "Standard",
        status: "Suspended",
        kyc: "Rejected",
        risk: "High",
        registerDate: "2026-03-27",
        totalTrades: 17,
      },
      {
        id: "U11221",
        name: "Hoang Thi E",
        email: "hoange@gmail.com",
        phone: "0934567890",
        level: "VIP 1",
        status: "Active",
        kyc: "Pending",
        risk: "Medium",
        registerDate: "2026-04-01",
        totalTrades: 96,
      },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        !keyword ||
        user.id.toLowerCase().includes(keyword) ||
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword);

      const matchStatus = statusFilter === "All" || user.status === statusFilter;
      const matchKyc = kycFilter === "All" || user.kyc === kycFilter;

      return matchSearch && matchStatus && matchKyc;
    });
  }, [users, search, statusFilter, kycFilter]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
  };

  const getBadgeStyle = (value: string): React.CSSProperties => {
    switch (value) {
      case "Active":
      case "Verified":
      case "Low":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.12)",
          border: "1px solid rgba(0, 192, 135, 0.2)",
        };
      case "Pending":
      case "Medium":
      case "Locked":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.12)",
          border: "1px solid rgba(240, 185, 11, 0.2)",
        };
      case "Rejected":
      case "High":
      case "Suspended":
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

  return (
    <div className="container-fluid py-4 pt-0" style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="text-secondary small mb-1">User Management</div>
            <h3 className="text-white fw-bold mb-1">Quản lý người dùng</h3>
            <div className="text-secondary small">
              Theo dõi tài khoản, trạng thái KYC, mức rủi ro và hành động quản trị
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

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Tổng người dùng</div>
            <div className="text-white fw-bold fs-4 mt-2">{users.length}</div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Đang hoạt động</div>
            <div className="text-white fw-bold fs-4 mt-2">
              {users.filter((u) => u.status === "Active").length}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">KYC hoàn tất</div>
            <div className="text-white fw-bold fs-4 mt-2">
              {users.filter((u) => u.kyc === "Verified").length}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="text-secondary small">Rủi ro cao</div>
            <div className="text-white fw-bold fs-4 mt-2">
              {users.filter((u) => u.risk === "High").length}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4" style={cardStyle}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-5">
            <label className="form-label text-secondary small">Tìm kiếm</label>
            <div className="position-relative">
              <Search
                size={16}
                className="position-absolute top-50 translate-middle-y"
                style={{ left: "12px", color: "#6c757d" }}
              />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Tìm theo ID, tên, email, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  backgroundColor: "#0b0b0b",
                  border: "1px solid #1a1a1a",
                  color: "#fff",
                }}
              />
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <label className="form-label text-secondary small">Trạng thái</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #1a1a1a",
                color: "#fff",
              }}
            >
              <option value="All">Tất cả</option>
              <option value="Active">Active</option>
              <option value="Locked">Locked</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="col-6 col-lg-3">
            <label className="form-label text-secondary small">KYC</label>
            <select
              className="form-select"
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #1a1a1a",
                color: "#fff",
              }}
            >
              <option value="All">Tất cả</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="col-12 col-lg-1">
            <button
              className="btn w-100 text-white"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4" style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white fw-bold mb-0">Danh sách người dùng</h5>
          <span className="text-secondary small">{filteredUsers.length} kết quả</span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark align-middle mb-0">
            <thead>
              <tr style={{ color: "#7d8592" }}>
                <th className="border-0 bg-transparent">ID</th>
                <th className="border-0 bg-transparent">Người dùng</th>
                <th className="border-0 bg-transparent">Cấp độ</th>
                <th className="border-0 bg-transparent">Trạng thái</th>
                <th className="border-0 bg-transparent">KYC</th>
                <th className="border-0 bg-transparent">Rủi ro</th>
                <th className="border-0 bg-transparent">Ngày tạo</th>
                <th className="border-0 bg-transparent">Giao dịch</th>
                <th className="border-0 bg-transparent text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ backgroundColor: "transparent" }}>{user.id}</td>

                  <td style={{ backgroundColor: "transparent" }}>
                    <div>
                      <div className="text-white fw-semibold">{user.name}</div>
                      <div className="text-secondary small">{user.email}</div>
                      <div className="text-secondary small">{user.phone}</div>
                    </div>
                  </td>

                  <td style={{ backgroundColor: "transparent" }}>
                    <span
                      className="px-2 py-1 rounded small"
                      style={{
                        color: "#F0B90B",
                        backgroundColor: "rgba(240, 185, 11, 0.12)",
                        border: "1px solid rgba(240, 185, 11, 0.2)",
                      }}
                    >
                      {user.level}
                    </span>
                  </td>

                  <td style={{ backgroundColor: "transparent" }}>
                    <span
                      className="px-2 py-1 rounded small"
                      style={getBadgeStyle(user.status)}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td style={{ backgroundColor: "transparent" }}>
                    <span
                      className="px-2 py-1 rounded small"
                      style={getBadgeStyle(user.kyc)}
                    >
                      {user.kyc}
                    </span>
                  </td>

                  <td style={{ backgroundColor: "transparent" }}>
                    <span
                      className="px-2 py-1 rounded small"
                      style={getBadgeStyle(user.risk)}
                    >
                      {user.risk}
                    </span>
                  </td>

                  <td style={{ backgroundColor: "transparent" }}>{user.registerDate}</td>

                  <td style={{ backgroundColor: "transparent" }}>{user.totalTrades}</td>

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
                          color: "#00C087",
                          backgroundColor: "rgba(0, 192, 135, 0.12)",
                          border: "1px solid rgba(0, 192, 135, 0.2)",
                        }}
                        title="Xác minh"
                      >
                        <ShieldCheck size={15} />
                      </button>

                      {user.status === "Locked" || user.status === "Suspended" ? (
                        <button
                          className="btn btn-sm"
                          style={{
                            color: "#F0B90B",
                            backgroundColor: "rgba(240, 185, 11, 0.12)",
                            border: "1px solid rgba(240, 185, 11, 0.2)",
                          }}
                          title="Mở khóa"
                        >
                          <Unlock size={15} />
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm"
                          style={{
                            color: "#F6465D",
                            backgroundColor: "rgba(246, 70, 93, 0.12)",
                            border: "1px solid rgba(246, 70, 93, 0.2)",
                          }}
                          title="Khóa tài khoản"
                        >
                          <Lock size={15} />
                        </button>
                      )}

                      <button
                        className="btn btn-sm"
                        style={{
                          color: "#F6465D",
                          backgroundColor: "rgba(246, 70, 93, 0.12)",
                          border: "1px solid rgba(246, 70, 93, 0.2)",
                        }}
                        title="Đình chỉ"
                      >
                        <UserX size={15} />
                      </button>

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

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center text-secondary py-4"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Không tìm thấy người dùng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          <div className="text-secondary small">Hiển thị 1 - {filteredUsers.length} người dùng</div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm text-white"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              Trước
            </button>
            <button
              className="btn btn-sm text-dark fw-semibold"
              style={{
                backgroundColor: "#F0B90B",
                border: "none",
              }}
            >
              1
            </button>
            <button
              className="btn btn-sm text-white"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              2
            </button>
            <button
              className="btn btn-sm text-white"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};