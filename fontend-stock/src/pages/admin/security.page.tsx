import { useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  MapPin,
  Monitor,
  Smartphone,
  Search,
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
    ],
    []
  );

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "Success":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0,192,135,0.12)",
        };
      case "Failed":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240,185,11,0.12)",
        };
      case "Suspicious":
        return {
          color: "#F6465D",
          backgroundColor: "rgba(246,70,93,0.12)",
        };
      default:
        return {
          color: "#9CA3AF",
          backgroundColor: "rgba(156,163,175,0.12)",
        };
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    border: "1px solid #1a1a1a",
    borderRadius: "12px",
  };

  return (
    <div
      className="container-fluid py-3"
      style={{ minHeight: "100vh", backgroundColor: "#000" }}
    >
      {/* HEADER */}
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h4 className="text-white fw-bold mb-1">
            Giám sát đăng nhập người dùng
          </h4>
          <div className="text-secondary small">
            Theo dõi lịch sử login, IP, thiết bị và phát hiện bất thường
          </div>
        </div>

        <button
          className="btn text-dark fw-semibold"
          style={{ backgroundColor: "#F0B90B", border: "none" }}
        >
          Xuất log
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="row g-3 mb-4">
        {[
          { title: "Login thành công", value: "2,431", color: "#00C087" },
          { title: "Login thất bại", value: "182", color: "#F0B90B" },
          { title: "Nghi ngờ", value: "23", color: "#F6465D" },
        ].map((item) => (
          <div className="col-12 col-md-4" key={item.title}>
            <div className="card p-3" style={cardStyle}>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-secondary small">{item.title}</div>
                  <div className="text-white fw-bold fs-4 mt-2">
                    {item.value}
                  </div>
                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 42,
                    height: 42,
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                  }}
                >
                  <Shield size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="card p-3 mb-3" style={cardStyle}>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div
            className="d-flex align-items-center px-3 py-2 rounded"
            style={{
              backgroundColor: "#111",
              border: "1px solid #1f1f1f",
            }}
          >
            <Search size={16} className="me-2 text-secondary" />
            <input
              placeholder="Tìm user / IP..."
              className="bg-transparent border-0 text-white"
              style={{ outline: "none" }}
            />
          </div>

          {["All", "Success", "Failed", "Suspicious"].map((f) => (
            <button
              key={f}
              className="btn btn-sm text-white"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-4" style={cardStyle}>
        <h5 className="text-white fw-bold mb-3">
          Lịch sử đăng nhập
        </h5>

        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr style={{ color: "#7d8592" }}>
                <th>ID</th>
                <th>User</th>
                <th>IP</th>
                <th>Location</th>
                <th>Device</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {logins.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user}</td>
                  <td>{log.ip}</td>

                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <MapPin size={14} className="text-secondary" />
                      {log.location}
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-1">
                      {log.device.includes("iPhone") ||
                      log.device.includes("Android") ? (
                        <Smartphone size={14} />
                      ) : (
                        <Monitor size={14} />
                      )}
                      {log.device}
                    </div>
                  </td>

                  <td className="text-secondary">{log.time}</td>

                  <td>
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        ...getBadgeStyle(log.status),
                        fontSize: "11px",
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
  );
};