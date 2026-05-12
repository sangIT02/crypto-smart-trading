import React, { useMemo, useState } from "react";
import {
  Bell,
  Mail,
  Megaphone,
  Search,
  Send,
  Smartphone,
  Users,
} from "lucide-react";
import { Pagination, ConfigProvider } from "antd";

type NotificationChannel =
  | "In-app"
  | "Email"
  | "Push"
  | "In-app + Email";

type NotificationType =
  | "System"
  | "Promotion"
  | "Market Alert"
  | "Update"
  | "Security"
  | "Event";

type NotificationItem = {
  id: string;
  title: string;
  target: string;
  channel: NotificationChannel;
  createdAt: string;
};

export const NotificationPage = () => {
  const [search, setSearch] = useState("");
  const [targetGroup, setTargetGroup] = useState("all");
  const [channel, setChannel] = useState("inapp");
  const [priority, setPriority] = useState("normal");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState<NotificationType>("System");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const notifications: NotificationItem[] = useMemo(
    () => [
      {
        id: "NTF-001",
        title: "Bảo trì hệ thống Futures",
        target: "Toàn bộ người dùng",
        channel: "In-app + Email",
        createdAt: "2026-04-08 09:00",
      },
      {
        id: "NTF-002",
        title: "Cảnh báo biến động mạnh BTC",
        target: "Nhóm traders active",
        channel: "Push",
        createdAt: "2026-04-08 08:15",
      },
      {
        id: "NTF-003",
        title: "Nâng cấp AI Signal Engine",
        target: "Người dùng bot AI",
        channel: "In-app",
        createdAt: "2026-04-07 21:40",
      },
      {
        id: "NTF-004",
        title: "Cập nhật điều khoản sử dụng",
        target: "Toàn bộ người dùng",
        channel: "Email",
        createdAt: "2026-04-07 14:10",
      },
      {
        id: "NTF-005",
        title: "Cập nhật đòn bẩy BTC",
        target: "Người dùng VIP",
        channel: "In-app",
        createdAt: "2026-04-06 11:20",
      },
      {
        id: "NTF-006",
        title: "Khuyến nghị quản lý rủi ro",
        target: "Nhóm traders active",
        channel: "Push",
        createdAt: "2026-04-06 09:10",
      },
      {
        id: "NTF-007",
        title: "Cập nhật AI Prediction",
        target: "Người dùng bot AI",
        channel: "Email",
        createdAt: "2026-04-05 19:30",
      },
    ],
    []
  );

  const filteredNotifications = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return notifications.filter((item) => {
      if (!keyword) return true;
      return (
        item.id.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword) ||
        item.target.toLowerCase().includes(keyword) ||
        item.channel.toLowerCase().includes(keyword)
      );
    });
  }, [notifications, search]);

  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredNotifications.slice(start, end);
  }, [filteredNotifications, currentPage, pageSize]);

  const totalNotifications = filteredNotifications.length;

  const startIndex =
    totalNotifications === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endIndex = Math.min(
    currentPage * pageSize,
    totalNotifications
  );

  const handlePaginationChange = (
    page: number,
    newPageSize: number
  ) => {
    setCurrentPage(page);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#0A0A0A",
    borderRadius: "16px",
    border: "1px solid #1F1F1F",
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#000",
    border: "1px solid #1F1F1F",
    color: "#fff",
    borderRadius: "12px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000" }}>
      {/* Cải thiện placeholder dễ nhìn hơn */}
      <style>{`
        .form-control::placeholder,
        .form-select::placeholder,
        textarea::placeholder {
          color: #aaa !important;
          opacity: 1 !important;
          font-size: 14px;
        }
        /* Có thể thêm style cho select option nếu cần */
      `}</style>

      <div
        style={{
          maxWidth: "1480px",
          margin: "10px auto",
          padding: "0 24px",
        }}
      >
        <div className="row g-4">
          {/* ==================== TẠO THÔNG BÁO MỚI ==================== */}
          <div className="col-12 col-xl-7">
            <div
              style={{
                ...cardStyle,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "28px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "24px",
                  }}
                >
                  <Megaphone size={22} color="#F0B90B" />
                  <h5
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Tạo thông báo mới
                  </h5>
                </div>

                {/* Tiêu đề + Loại thông báo */}
                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-7">
                    <label
                      style={{
                        color: "#888",
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Tiêu đề thông báo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tiêu đề thông báo..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div className="col-12 col-md-5">
                    <label
                      style={{
                        color: "#888",
                        fontSize: "14px",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Loại thông báo
                    </label>
                    <select
                      className="form-select"
                      value={notificationType}
                      onChange={(e) => setNotificationType(e.target.value as NotificationType)}
                      style={{
                        ...inputStyle,
                        padding: "7px 16px",
                      }}
                    >
                      <option value="System">System - Hệ thống</option>
                      <option value="Promotion">Promotion - Khuyến mãi</option>
                      <option value="Market Alert">Market Alert - Cảnh báo thị trường</option>
                      <option value="Update">Update - Cập nhật</option>
                      <option value="Security">Security - Bảo mật</option>
                      <option value="Event">Event - Sự kiện</option>
                    </select>
                  </div>
                </div>

                {/* Kênh gửi */}
                <div className="mb-4">
                  <label
                    style={{
                      color: "#888",
                      fontSize: "14px",
                      marginBottom: "10px",
                      display: "block",
                    }}
                  >
                    Kênh gửi
                  </label>
                  <div className="row g-2">
                    {[
                      { key: "inapp", label: "In-app", icon: <Bell size={16} /> },
                      { key: "email", label: "Email", icon: <Mail size={16} /> },
                    ].map((item) => (
                      <div className="col-12 col-md-3" key={item.key}>
                        <button
                          type="button"
                          className="btn w-100"
                          onClick={() => setChannel(item.key)}
                          style={{
                            backgroundColor: channel === item.key ? "#F0B90B" : "#111",
                            color: channel === item.key ? "#000" : "#fff",
                            border: channel === item.key ? "none" : "1px solid #1F1F1F",
                            fontWeight: 600,
                            padding: "12px",
                            borderRadius: "12px",
                          }}
                        >
                          <span className="me-2">{item.icon}</span>
                          {item.label}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nội dung */}
                <div className="mb-4">
                  <label
                    style={{
                      color: "#888",
                      fontSize: "14px",
                      marginBottom: "10px",
                      display: "block",
                    }}
                  >
                    Nội dung thông báo
                  </label>
                  <textarea
                    rows={7}
                    className="form-control"
                    placeholder="Nhập nội dung..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <button
                  className="btn"
                  style={{
                    backgroundColor: "#F0B90B",
                    color: "#000",
                    borderRadius: "12px",
                    padding: "12px 26px",
                    fontWeight: "600",
                    border: "none",
                    marginTop: "auto",
                  }}
                >
                  <Send size={17} className="me-2" />
                  Gửi thông báo
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-12 col-xl-5">
            <div
              style={{
                ...cardStyle,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "28px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    marginBottom: "24px",
                  }}
                >
                  Xem trước
                </h5>

                <div
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid #1F1F1F",
                    borderRadius: "14px",
                    padding: "20px",
                    marginBottom: "18px",
                    flex: 1,
                    overflowY: "auto",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(240,185,11,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Bell size={20} color="#F0B90B" />
                    </div>

                    <div>
                      <div style={{ color: "#fff", fontWeight: "600" }}>
                        {title || "Tiêu đề thông báo"}
                      </div>
                      <div style={{ color: "#777", fontSize: "13px", marginTop: "2px" }}>
                        {notificationType} • Hôm nay
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#bbb",
                      lineHeight: "1.7",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {message || "Nội dung thông báo sẽ hiển thị tại đây..."}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#111",
                    border: "1px solid #1F1F1F",
                    borderRadius: "14px",
                    padding: "18px",
                  }}
                >
                  <div style={{ color: "#fff", fontWeight: "600", marginBottom: "14px" }}>
                    Thông tin gửi
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#888" }}>Kênh</span>
                    <span style={{ color: "#fff" }}>
                      {channel === "inapp" ? "In-app" : channel === "email" ? "Email" : "Push"}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#888" }}>Loại</span>
                    <span style={{ color: "#fff" }}>{notificationType}</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#888" }}>Người nhận</span>
                    <span style={{ color: "#fff" }}>
                      {targetGroup === "all" ? "All Users" : targetGroup === "active" ? "Active Traders" : "VIP Users"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== LỊCH SỬ THÔNG BÁO + PHÂN TRANG ==================== */}
        <div style={{ ...cardStyle, marginTop: "24px" }}>
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid #1F1F1F",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
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
              Lịch sử thông báo
            </h5>

            <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#666",
                }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm thông báo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 44px",
                  backgroundColor: "#111",
                  border: "1px solid #1F1F1F",
                  borderRadius: "12px",
                  color: "#fff",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#888", borderBottom: "1px solid #1F1F1F" }}>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "500" }}>Mã</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "500" }}>Tiêu đề</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "500" }}>Nhóm nhận</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "500" }}>Kênh</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "500" }}>Thời gian</th>
                  <th style={{ textAlign: "center", padding: "20px 24px", fontWeight: "500" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotifications.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #1F1F1F" }}>
                    <td style={{ padding: "20px 24px", color: "#aaa", fontFamily: "monospace" }}>{item.id}</td>
                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ color: "#fff", fontWeight: "600" }}>{item.title}</div>
                    </td>
                    <td style={{ padding: "20px 24px", color: "#ccc" }}>{item.target}</td>
                    <td style={{ padding: "20px 24px", color: "#F0B90B", fontWeight: "500" }}>{item.channel}</td>
                    <td style={{ padding: "20px 24px", color: "#888" }}>{item.createdAt}</td>
                    <td style={{ padding: "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                        <button style={{ padding: "8px 14px", backgroundColor: "#111", border: "1px solid #1F1F1F", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
                          Xem
                        </button>
                        <button style={{ padding: "8px 14px", backgroundColor: "rgba(240,185,11,0.12)", border: "1px solid rgba(240,185,11,0.25)", borderRadius: "8px", color: "#F0B90B", cursor: "pointer" }}>
                          Gửi lại
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedNotifications.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center", color: "#666" }}>
                      Không tìm thấy thông báo phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {totalNotifications > 0 && (
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
                Hiển thị {startIndex} - {endIndex} trong tổng {totalNotifications} thông báo
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
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalNotifications}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  showQuickJumper
                  pageSizeOptions={["5", "10", "20", "50"]}
                  showTotal={(total) => `Tổng ${total} thông báo`}
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