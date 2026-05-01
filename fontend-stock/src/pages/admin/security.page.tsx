import { useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  MapPin,
  Monitor,
  Smartphone,
  Search,
  Clock,
} from "lucide-react";

type LoginItem = {
  id: string;
  user: string;
  ip: string;
  location: string;
  device: string;
  time: string;
  status: "Success" | "Failed" | "Suspicious";
};

export const SecurityPage = () => {
  const logins: LoginItem[] = useMemo(
    () => [
      {
        id: "LG-1001",
        user: "Nguyen Van A",
        ip: "103.91.xx.24",
        location: "Vietnam - Ho Chi Minh",
        device: "Chrome / Windows",
        time: "10:42",
        status: "Success",
      },
      {
        id: "LG-1002",
        user: "Tran Thi B",
        ip: "14.177.xx.88",
        location: "Vietnam - Hanoi",
        device: "Safari / iPhone",
        time: "10:40",
        status: "Failed",
      },
      {
        id: "LG-1003",
        user: "Pham D",
        ip: "185.23.xx.12",
        location: "Unknown (VPN)",
        device: "Firefox / Linux",
        time: "10:38",
        status: "Suspicious",
      },
      {
        id: "LG-1004",
        user: "Le Minh C",
        ip: "27.72.xx.112",
        location: "Vietnam - Da Nang",
        device: "Chrome / Android",
        time: "10:35",
        status: "Success",
      },
      {
        id: "LG-1005",
        user: "Hoang Thi D",
        ip: "171.244.xx.70",
        location: "Vietnam - Ho Chi Minh",
        device: "Edge / Windows",
        time: "09:55",
        status: "Success",
      },
    ],
    []
  );

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#0A0A0A",
    border: "1px solid #1F1F1F",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Success":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.15)",
          border: "1px solid rgba(0, 192, 135, 0.4)",
        };
      case "Failed":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.15)",
          border: "1px solid rgba(240, 185, 11, 0.4)",
        };
      case "Suspicious":
        return {
          color: "#F6465D",
          backgroundColor: "rgba(246, 70, 93, 0.15)",
          border: "1px solid rgba(246, 70, 93, 0.4)",
        };
      default:
        return {
          color: "#9CA3AF",
          backgroundColor: "rgba(156, 163, 175, 0.15)",
          border: "1px solid rgba(156, 163, 175, 0.4)",
        };
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", padding: "24px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "32px", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: 0 }}>
              Giám sát Bảo mật
            </h1>
            <p style={{ color: "#888", marginTop: "6px" }}>
              Theo dõi lịch sử đăng nhập và phát hiện hoạt động bất thường
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
            }}
          >
            Xuất Log Excel
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
          gap: "20px", 
          marginBottom: "32px" 
        }}>
          {[
            { title: "Phiên đăng nhập hôm nay", value: "2,847", color: "#00C087", icon: Shield },
            { title: "Tỷ lệ bất thường", value: "0.81%", color: "#F6465D", icon: AlertTriangle },
            { title: "IP lạ / VPN", value: "47", color: "#F0B90B", icon: MapPin },
            { title: "Thiết bị mới", value: "18", color: "#22C55E", icon: Monitor },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={cardStyle}>
                <div style={{ padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ color: "#888", fontSize: "14.5px" }}>{stat.title}</div>
                      <div style={{ 
                        fontSize: "36px", 
                        fontWeight: "700", 
                        marginTop: "10px", 
                        color: stat.color 
                      }}>
                        {stat.value}
                      </div>
                    </div>
                    <div style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: `${stat.color}15`,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                    }}>
                      <Icon size={28} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Section - Dropdown đơn giản */}
        <div style={cardStyle} className="mb-4">
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "end" }}>

              {/* Dropdown Chọn Thời Gian */}
              <div style={{ minWidth: "220px" }}>
                <div style={{ color: "#888", fontSize: "13.5px", marginBottom: "6px" }}>
                  Xem theo thời gian
                </div>
                <select
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "15px",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  defaultValue="today"
                >
                  <option value="today">Hôm nay</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="thismonth">Tháng này</option>
                  <option value="all">Tất cả thời gian</option>
                </select>
              </div>

              {/* Search */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div style={{ color: "#888", fontSize: "13.5px", marginBottom: "6px" }}>
                  Tìm kiếm
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#111",
                  border: "1px solid #1F1F1F",
                  borderRadius: "12px",
                  padding: "11px 16px",
                }}>
                  <Search size={18} style={{ color: "#666", marginRight: "10px" }} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên người dùng, IP hoặc thiết bị..."
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#fff",
                      width: "100%",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <div style={{ color: "#888", fontSize: "13.5px", marginBottom: "6px" }}>
                  Trạng thái
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["All", "Success", "Failed", "Suspicious"].map((status) => (
                    <button
                      key={status}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: status === "All" ? "#F0B90B" : "#111",
                        color: status === "All" ? "#000" : "#fff",
                        border: status === "All" ? "none" : "1px solid #333",
                        borderRadius: "10px",
                        fontWeight: "500",
                        cursor: "pointer",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login History Table */}
        <div style={cardStyle}>
          <div style={{ 
            padding: "24px 28px", 
            borderBottom: "1px solid #1F1F1F", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Clock size={22} color="#F0B90B" />
              <h5 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
                Lịch sử đăng nhập
              </h5>
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>
              Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#888", borderBottom: "1px solid #222" }}>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Người dùng</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>IP Address</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Vị trí</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Thiết bị</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Thời gian</th>
                  <th style={{ textAlign: "left", padding: "20px 24px", fontWeight: "normal" }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {logins.map((log) => (
                  <tr 
                    key={log.id} 
                    style={{ 
                      borderBottom: "1px solid #1F1F1F",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <td style={{ padding: "18px 24px", fontFamily: "monospace", color: "#aaa" }}>{log.id}</td>
                    <td style={{ padding: "18px 24px", fontWeight: "500" }}>{log.user}</td>
                    <td style={{ padding: "18px 24px", fontFamily: "monospace" }}>{log.ip}</td>
                    
                    <td style={{ padding: "18px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MapPin size={16} style={{ color: "#888" }} />
                        {log.location}
                      </div>
                    </td>

                    <td style={{ padding: "18px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {log.device.includes("iPhone") || log.device.includes("Android") ? (
                          <Smartphone size={16} style={{ color: "#888" }} />
                        ) : (
                          <Monitor size={16} style={{ color: "#888" }} />
                        )}
                        {log.device}
                      </div>
                    </td>

                    <td style={{ padding: "18px 24px", color: "#888" }}>{log.time}</td>

                    <td style={{ padding: "18px 24px" }}>
                      <span
                        style={{
                          ...getBadgeStyle(log.status),
                          padding: "8px 18px",
                          borderRadius: "8px",
                          fontSize: "13.5px",
                          fontWeight: "500",
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};