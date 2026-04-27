import { useMemo } from "react";
import {
  AlertTriangle,
  Shield,
  Activity,
  Search,
} from "lucide-react";

type TxItem = {
  id: string;
  user: string;
  pair: string;
  amount: string;
  type: string;
  risk: "Low" | "Medium" | "High";
  status: "Normal" | "Suspicious" | "Blocked";
  time: string;
};

export const MonitoringPage = () => {
  const transactions: TxItem[] = useMemo(
    () => [
      {
        id: "TX-88231",
        user: "Nguyen Van A",
        pair: "BTC/USDT",
        amount: "0.8 BTC",
        type: "Withdraw",
        risk: "High",
        status: "Suspicious",
        time: "10:42",
      },
      {
        id: "TX-88232",
        user: "Tran Thi B",
        pair: "ETH/USDT",
        amount: "12 ETH",
        type: "Trade",
        risk: "Low",
        status: "Normal",
        time: "10:40",
      },
      {
        id: "TX-88233",
        user: "Le Minh C",
        pair: "SOL/USDT",
        amount: "1200 SOL",
        type: "Deposit",
        risk: "Medium",
        status: "Normal",
        time: "10:38",
      },
      {
        id: "TX-88234",
        user: "Pham D",
        pair: "BNB/USDT",
        amount: "50 BNB",
        type: "Withdraw",
        risk: "High",
        status: "Blocked",
        time: "10:35",
      },
    ],
    []
  );

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "Low":
      case "Normal":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.12)",
          border: "1px solid rgba(0, 192, 135, 0.2)",
        };
      case "Medium":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.12)",
          border: "1px solid rgba(240, 185, 11, 0.2)",
        };
      case "High":
      case "Suspicious":
      case "Blocked":
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

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
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
            Giám sát giao dịch & bảo mật
          </h4>
          <div className="text-secondary small">
            Theo dõi giao dịch bất thường, rủi ro và hành vi đáng ngờ
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn text-dark fw-semibold"
            style={{ backgroundColor: "#F0B90B", border: "none" }}
          >
            Chặn giao dịch
          </button>
          <button
            className="btn text-white"
            style={{
              backgroundColor: "#111",
              border: "1px solid #1f1f1f",
            }}
          >
            Xuất log
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="row g-3 mb-4">
        {[
          {
            title: "Giao dịch nguy cơ cao",
            value: "12",
            icon: AlertTriangle,
            color: "#F6465D",
          },
          {
            title: "Đang bị chặn",
            value: "5",
            icon: Shield,
            color: "#F0B90B",
          },
          {
            title: "Giao dịch/phút",
            value: "1,284",
            icon: Activity,
            color: "#00C087",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
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
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER BAR */}
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
              placeholder="Tìm user / mã giao dịch..."
              className="bg-transparent border-0 text-white"
              style={{ outline: "none" }}
            />
          </div>

          {["All", "High", "Medium", "Low"].map((f) => (
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
        <h5 className="text-white fw-bold mb-3">Log giao dịch</h5>

        <div className="table-responsive">
          <table className="table table-dark align-middle">
            <thead>
              <tr style={{ color: "#7d8592" }}>
                <th>Mã</th>
                <th>User</th>
                <th>Cặp</th>
                <th>Loại</th>
                <th>Khối lượng</th>
                <th>Risk</th>
                <th>Trạng thái</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.user}</td>
                  <td>{tx.pair}</td>
                  <td>{tx.type}</td>
                  <td>{tx.amount}</td>

                  <td>
                    <span
                      className="px-2 py-1 rounded"
                      style={{ ...getBadgeStyle(tx.risk), fontSize: "11px" }}
                    >
                      {tx.risk}
                    </span>
                  </td>

                  <td>
                    <span
                      className="px-2 py-1 rounded"
                      style={{ ...getBadgeStyle(tx.status), fontSize: "11px" }}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="text-secondary">{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};