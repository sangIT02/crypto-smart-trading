import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Mail,
  Megaphone,
  Search,
  Send,
  Smartphone,
  Users,
} from "lucide-react";

type NotificationStatus = "Sent" | "Scheduled" | "Draft";
type NotificationChannel = "In-app" | "Email" | "Push" | "In-app + Email";

type NotificationItem = {
  id: string;
  title: string;
  target: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: string;
};

export const NotificationPage = () => {
  const [search, setSearch] = useState("");
  const [targetGroup, setTargetGroup] = useState("all");
  const [channel, setChannel] = useState("inapp");
  const [priority, setPriority] = useState("normal");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const notifications: NotificationItem[] = useMemo(
    () => [
      {
        id: "NTF-001",
        title: "Bảo trì hệ thống Futures",
        target: "Toàn bộ người dùng",
        channel: "In-app + Email",
        status: "Scheduled",
        createdAt: "2026-04-08 09:00",
      },
      {
        id: "NTF-002",
        title: "Cảnh báo biến động mạnh BTC",
        target: "Nhóm traders active",
        channel: "Push",
        status: "Sent",
        createdAt: "2026-04-08 08:15",
      },
      {
        id: "NTF-003",
        title: "Nâng cấp AI Signal Engine",
        target: "Người dùng bot AI",
        channel: "In-app",
        status: "Draft",
        createdAt: "2026-04-07 21:40",
      },
      {
        id: "NTF-004",
        title: "Cập nhật điều khoản sử dụng",
        target: "Toàn bộ người dùng",
        channel: "Email",
        status: "Sent",
        createdAt: "2026-04-07 14:10",
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
        item.channel.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [notifications, search]);

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
      case "Sent":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.12)",
          border: "1px solid rgba(0, 192, 135, 0.2)",
        };
      case "Scheduled":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.12)",
          border: "1px solid rgba(240, 185, 11, 0.2)",
        };
      case "Draft":
        return {
          color: "#9CA3AF",
          backgroundColor: "rgba(156, 163, 175, 0.12)",
          border: "1px solid rgba(156, 163, 175, 0.2)",
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
    <div
      className="container-fluid py-4 pt-0"
      style={{ backgroundColor: "#000", minHeight: "100vh" }}
    >
      <div className="py-2">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h3 className="text-white fw-bold mb-1">Thông báo hàng loạt</h3>
          </div>

          <button
            className="btn text-dark fw-semibold"
            style={{ backgroundColor: "#F0B90B", border: "none" }}
          >
            <Send size={16} className="me-2" />
            Gửi ngay
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Tổng thông báo</div>
                <div className="text-white fw-bold fs-4 mt-2">{notifications.length}</div>
              </div>
              <Bell size={18} color="#F0B90B" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Đã gửi</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {notifications.filter((x) => x.status === "Sent").length}
                </div>
              </div>
              <CheckCircle2 size={18} color="#00C087" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Đã lên lịch</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {notifications.filter((x) => x.status === "Scheduled").length}
                </div>
              </div>
              <CalendarClock size={18} color="#F0B90B" />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="card p-3 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-secondary small">Bản nháp</div>
                <div className="text-white fw-bold fs-4 mt-2">
                  {notifications.filter((x) => x.status === "Draft").length}
                </div>
              </div>
              <Megaphone size={18} color="#9CA3AF" />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Tạo thông báo mới</h5>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Tiêu đề thông báo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label text-secondary small">Nhóm người nhận</label>
                <select
                  className="form-select"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  style={inputStyle}
                >
                  <option value="all">Toàn bộ người dùng</option>
                  <option value="active">Nhóm traders active</option>
                  <option value="ai">Người dùng bot AI</option>
                  <option value="vip">Người dùng VIP</option>
                  <option value="risk">Người dùng cần cảnh báo rủi ro</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-secondary small">Mức ưu tiên</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={inputStyle}
                >
                  <option value="low">Thấp</option>
                  <option value="normal">Bình thường</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Kênh gửi</label>
              <div className="row g-2">
                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    className="btn w-100 text-white"
                    onClick={() => setChannel("inapp")}
                    style={{
                      backgroundColor: channel === "inapp" ? "#F0B90B" : "#111",
                      color: channel === "inapp" ? "#000" : "#fff",
                      border: channel === "inapp" ? "none" : "1px solid #1f1f1f",
                      fontWeight: 600,
                    }}
                  >
                    <Bell size={15} className="me-2" />
                    In-app
                  </button>
                </div>

                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    className="btn w-100 text-white"
                    onClick={() => setChannel("email")}
                    style={{
                      backgroundColor: channel === "email" ? "#F0B90B" : "#111",
                      color: channel === "email" ? "#000" : "#fff",
                      border: channel === "email" ? "none" : "1px solid #1f1f1f",
                      fontWeight: 600,
                    }}
                  >
                    <Mail size={15} className="me-2" />
                    Email
                  </button>
                </div>

                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    className="btn w-100 text-white"
                    onClick={() => setChannel("push")}
                    style={{
                      backgroundColor: channel === "push" ? "#F0B90B" : "#111",
                      color: channel === "push" ? "#000" : "#fff",
                      border: channel === "push" ? "none" : "1px solid #1f1f1f",
                      fontWeight: 600,
                    }}
                  >
                    <Smartphone size={15} className="me-2" />
                    Push
                  </button>
                </div>

                <div className="col-12 col-md-3">
                  <button
                    type="button"
                    className="btn w-100 text-white"
                    onClick={() => setChannel("multi")}
                    style={{
                      backgroundColor: channel === "multi" ? "#F0B90B" : "#111",
                      color: channel === "multi" ? "#000" : "#fff",
                      border: channel === "multi" ? "none" : "1px solid #1f1f1f",
                      fontWeight: 600,
                    }}
                  >
                    <Users size={15} className="me-2" />
                    Multi
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Nội dung</label>
              <textarea
                className="form-control"
                rows={7}
                placeholder="Nhập nội dung thông báo..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn text-dark fw-semibold"
                style={{ backgroundColor: "#F0B90B", border: "none" }}
              >
                <Send size={16} className="me-2" />
                Gửi thông báo
              </button>

              <button
                className="btn text-white"
                style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
              >
                Lưu bản nháp
              </button>

              <button
                className="btn text-white"
                style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}
              >
                Lên lịch gửi
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-4 h-100" style={cardStyle}>
            <h5 className="text-white fw-bold mb-3">Xem trước</h5>

            <div
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #171717",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: "rgba(240,185,11,0.12)",
                    color: "#F0B90B",
                  }}
                >
                  <Bell size={14} />
                </div>
                <div>
                  <div className="text-white small fw-semibold">
                    {title || "Tiêu đề thông báo"}
                  </div>
                  <div className="text-secondary" style={{ fontSize: "11px" }}>
                    {targetGroup === "all"
                      ? "Toàn bộ người dùng"
                      : targetGroup === "active"
                      ? "Nhóm traders active"
                      : targetGroup === "ai"
                      ? "Người dùng bot AI"
                      : targetGroup === "vip"
                      ? "Người dùng VIP"
                      : "Người dùng cần cảnh báo rủi ro"}
                  </div>
                </div>
              </div>

              <div className="text-secondary small">
                {message || "Nội dung thông báo sẽ hiển thị tại đây..."}
              </div>
            </div>

            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #171717",
              }}
            >
              <div className="text-white small fw-semibold mb-2">Thông tin gửi</div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Kênh</span>
                <span className="text-white small">
                  {channel === "inapp"
                    ? "In-app"
                    : channel === "email"
                    ? "Email"
                    : channel === "push"
                    ? "Push"
                    : "In-app + Email + Push"}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Ưu tiên</span>
                <span className="text-white small">{priority}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Người nhận</span>
                <span className="text-white small">
                  {targetGroup === "all"
                    ? "All Users"
                    : targetGroup === "active"
                    ? "Active Traders"
                    : targetGroup === "ai"
                    ? "AI Bot Users"
                    : targetGroup === "vip"
                    ? "VIP Users"
                    : "Risk Group"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-4" style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="text-white fw-bold mb-0">Lịch sử thông báo</h5>

          <div className="position-relative" style={{ width: "100%", maxWidth: "320px" }}>
            <Search
              size={16}
              className="position-absolute top-50 translate-middle-y"
              style={{ left: "12px", color: "#6c757d" }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Tìm thông báo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark align-middle mb-0">
            <thead>
              <tr style={{ color: "#7d8592" }}>
                <th className="border-0 bg-transparent">Mã</th>
                <th className="border-0 bg-transparent">Tiêu đề</th>
                <th className="border-0 bg-transparent">Nhóm nhận</th>
                <th className="border-0 bg-transparent">Kênh</th>
                <th className="border-0 bg-transparent">Trạng thái</th>
                <th className="border-0 bg-transparent">Thời gian</th>
                <th className="border-0 bg-transparent text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotifications.map((item) => (
                <tr key={item.id}>
                  <td style={{ backgroundColor: "transparent" }}>{item.id}</td>
                  <td style={{ backgroundColor: "transparent" }}>
                    <div className="text-white fw-semibold">{item.title}</div>
                  </td>
                  <td style={{ backgroundColor: "transparent" }}>{item.target}</td>
                  <td style={{ backgroundColor: "transparent" }}>{item.channel}</td>
                  <td style={{ backgroundColor: "transparent" }}>
                    <span
                      className="px-2 py-1 rounded small"
                      style={getBadgeStyle(item.status)}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ backgroundColor: "transparent" }}>{item.createdAt}</td>
                  <td style={{ backgroundColor: "transparent" }}>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <button
                        className="btn btn-sm text-white"
                        style={{
                          backgroundColor: "#111",
                          border: "1px solid #1f1f1f",
                        }}
                      >
                        Xem
                      </button>
                      <button
                        className="btn btn-sm text-white"
                        style={{
                          backgroundColor: "#111",
                          border: "1px solid #1f1f1f",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          color: "#F0B90B",
                          backgroundColor: "rgba(240, 185, 11, 0.12)",
                          border: "1px solid rgba(240, 185, 11, 0.2)",
                        }}
                      >
                        Gửi lại
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredNotifications.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-secondary py-4"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Không tìm thấy thông báo phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};