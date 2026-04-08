import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Bot,
  Brain,
  Coins,
  Shield,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

type StatItem = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
};

type TradeItem = {
  id: string;
  user: string;
  pair: string;
  side: "BUY" | "SELL";
  type: string;
  amount: string;
  status: "Filled" | "Open" | "Cancelled";
};

type BotItem = {
  id: string;
  user: string;
  strategy: string;
  pair: string;
  pnl: string;
  status: "Running" | "Paused" | "Risk";
};

type AlertItem = {
  title: string;
  detail: string;
  level: "High" | "Medium" | "Low";
};

export default function AdminDashboardPage() {
  const stats: StatItem[] = useMemo(
    () => [
      {
        title: "Người dùng hoạt động",
        value: "24,892",
        change: "+8.4%",
        positive: true,
        icon: Users,
      },
      {
        title: "Lệnh toàn hệ thống",
        value: "1,284,201",
        change: "+12.1%",
        positive: true,
        icon: WalletCards,
      },
      {
        title: "Bot/Grid đang chạy",
        value: "3,482",
        change: "+5.6%",
        positive: true,
        icon: Bot,
      },
      {
        title: "Cảnh báo bảo mật",
        value: "17",
        change: "-21.3%",
        positive: false,
        icon: Shield,
      },
    ],
    []
  );

  const recentTrades: TradeItem[] = useMemo(
    () => [
      {
        id: "ORD-90231",
        user: "Nguyen Van A",
        pair: "BTC/USDT",
        side: "BUY",
        type: "Market",
        amount: "0.42 BTC",
        status: "Filled",
      },
      {
        id: "ORD-90232",
        user: "Tran Thi B",
        pair: "ETH/USDT",
        side: "SELL",
        type: "Limit",
        amount: "8 ETH",
        status: "Cancelled",
      },
      {
        id: "ORD-90233",
        user: "Le Minh C",
        pair: "SOL/USDT",
        side: "BUY",
        type: "Grid",
        amount: "540 SOL",
        status: "Open",
      },
      {
        id: "ORD-90234",
        user: "Pham D",
        pair: "BNB/USDT",
        side: "SELL",
        type: "Bot",
        amount: "31 BNB",
        status: "Filled",
      },
    ],
    []
  );

  const runningBots: BotItem[] = useMemo(
    () => [
      {
        id: "BOT-103",
        user: "Nguyen Van A",
        strategy: "Spot Grid",
        pair: "BTC/USDT",
        pnl: "+12.8%",
        status: "Running",
      },
      {
        id: "BOT-104",
        user: "Le Minh C",
        strategy: "Futures Grid",
        pair: "ETH/USDT",
        pnl: "+5.3%",
        status: "Running",
      },
      {
        id: "BOT-105",
        user: "Tran Thi B",
        strategy: "DCA Bot",
        pair: "SOL/USDT",
        pnl: "-3.1%",
        status: "Paused",
      },
      {
        id: "BOT-106",
        user: "Pham D",
        strategy: "AI Signal Bot",
        pair: "BNB/USDT",
        pnl: "-9.7%",
        status: "Risk",
      },
    ],
    []
  );

  const securityAlerts: AlertItem[] = useMemo(
    () => [
      {
        title: "Đăng nhập từ IP bất thường",
        detail: "pham.d • 103.91.xx.24 • 09:42",
        level: "High",
      },
      {
        title: "Nhiều lần nhập sai mật khẩu",
        detail: "tran.b • 14.177.xx.88 • 10:03",
        level: "Medium",
      },
      {
        title: "Thiết bị mới vừa đăng nhập",
        detail: "nguyen.a • 27.72.xx.112 • 10:24",
        level: "Low",
      },
      {
        title: "Yêu cầu rút tiền cần xác minh",
        detail: "user_8921 • 171.244.xx.70 • 10:18",
        level: "High",
      },
    ],
    []
  );

  const aiModels = useMemo(
    () => [
      { name: "TrendSense v2", status: "Running", accuracy: "87.4%", latency: "118ms" },
      { name: "Grid Optimizer", status: "Running", accuracy: "91.2%", latency: "92ms" },
      { name: "Risk Guard", status: "Warning", accuracy: "94.1%", latency: "240ms" },
      { name: "Signal Fusion", status: "Stopped", accuracy: "--", latency: "--" },
    ],
    []
  );

  const getTextColor = (positive?: boolean) => (positive ? "#00C087" : "#F6465D");

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "Filled":
      case "Running":
      case "Low":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.12)",
          border: "1px solid rgba(0, 192, 135, 0.2)",
        };
      case "Open":
        return {
          color: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        };
      case "Paused":
      case "Medium":
      case "Warning":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.12)",
          border: "1px solid rgba(240, 185, 11, 0.2)",
        };
      case "Risk":
      case "High":
      case "Cancelled":
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

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000000",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
  };

  return (
    <div
      className="container-fluid py-4 pt-0"
      style={{ minHeight: "100vh", marginTop: "10px", backgroundColor: "#000" }}
    >
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="text-secondary small mb-1">Admin Dashboard</div>
            <h3 className="text-white fw-bold mb-1">Tổng quan hệ thống quản trị</h3>
            <div className="text-secondary small">
              Theo dõi người dùng, giao dịch, bot, AI và bảo mật trên toàn hệ thống
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn text-dark fw-semibold"
              style={{ backgroundColor: "#F0B90B", border: "none" }}
            >
              Gửi thông báo
            </button>
            <button
              className="btn text-white"
              style={{
                backgroundColor: "#111",
                border: "1px solid #1f1f1f",
              }}
            >
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div className="col-12 col-sm-6 col-xl-3" key={item.title}>
              <div className="card p-3 h-100" style={cardStyle}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-secondary small">{item.title}</div>
                    <div className="text-white fw-bold fs-4 mt-2">{item.value}</div>
                    <div
                      className="small mt-2"
                      style={{ color: getTextColor(item.positive) }}
                    >
                      {item.change}
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 42,
                      height: 42,
                      backgroundColor: "rgba(240,185,11,0.12)",
                      color: "#F0B90B",
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

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#F0B90B",
                  }}
                >
                  <TrendingUp size={14} color="#000" />
                </div>
                <h5 className="text-white fw-bold mb-0">Hoạt động hệ thống</h5>
                <span
                  className="badge"
                  style={{
                    fontSize: "10px",
                    backgroundColor: "rgba(0,192,135,0.12)",
                    color: "#00C087",
                    border: "1px solid rgba(0,192,135,0.2)",
                  }}
                >
                  Live
                </span>
              </div>

              <div className="d-flex flex-wrap gap-4">
                <div>
                  <div className="text-secondary" style={{ fontSize: "12px" }}>
                    Uptime
                  </div>
                  <div className="text-white small">99.98%</div>
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: "12px" }}>
                    Trade Engine
                  </div>
                  <div className="text-white small">Ổn định</div>
                </div>
                <div>
                  <div className="text-secondary" style={{ fontSize: "12px" }}>
                    AI Service
                  </div>
                  <div className="text-white small">Running</div>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-8">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "#0b0b0b",
                    border: "1px solid #171717",
                    minHeight: "260px",
                  }}
                >
                  <div className="text-secondary small mb-3">Khối lượng xử lý 12 mốc gần nhất</div>

                  <div className="d-flex align-items-end gap-2" style={{ height: 180 }}>
                    {[38, 52, 49, 68, 61, 84, 72, 58, 91, 70, 63, 79].map((v, i) => (
                      <div
                        key={i}
                        className="flex-fill d-flex flex-column align-items-center justify-content-end"
                      >
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "32px",
                            height: `${v}%`,
                            background:
                              "linear-gradient(180deg, rgba(240,185,11,1) 0%, rgba(176,130,20,1) 100%)",
                            borderRadius: "8px 8px 0 0",
                          }}
                        />
                        <span className="text-secondary mt-2" style={{ fontSize: "10px" }}>
                          {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded h-100"
                  style={{
                    backgroundColor: "#0b0b0b",
                    border: "1px solid #171717",
                  }}
                >
                  <h6 className="text-white fw-bold mb-3">Dịch vụ cốt lõi</h6>

                  {[
                    { name: "API Gateway", value: 84 },
                    { name: "Trade Engine", value: 72 },
                    { name: "Socket Cluster", value: 79 },
                    { name: "Notifications", value: 44 },
                  ].map((item) => (
                    <div key={item.name} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-secondary small">{item.name}</span>
                        <span className="text-white small">{item.value}%</span>
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
                            width: `${item.value}%`,
                            height: "100%",
                            backgroundColor:
                              item.value >= 80
                                ? "#F0B90B"
                                : item.value >= 60
                                ? "#00C087"
                                : "#6B7280",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-4 h-100" style={cardStyle}>
            <h5 className="text-white fw-bold mb-3">Mô hình AI</h5>

            <div className="list-group list-group-flush">
              {aiModels.map((item) => (
                <div
                  key={item.name}
                  className="list-group-item bg-transparent border-secondary px-0 py-3"
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="text-white small fw-bold">{item.name}</div>
                      <div className="text-secondary" style={{ fontSize: "11px" }}>
                        Accuracy: {item.accuracy}
                      </div>
                    </div>

                    <div className="text-end">
                      <div
                        className="px-2 py-1 rounded small"
                        style={{ ...getBadgeStyle(item.status), fontSize: "11px" }}
                      >
                        {item.status}
                      </div>
                      <div className="text-secondary mt-1" style={{ fontSize: "11px" }}>
                        {item.latency}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-3 p-3 rounded"
              style={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #171717",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <Brain size={16} color="#F0B90B" />
                <span className="text-white small fw-semibold">Tóm tắt AI</span>
              </div>
              <div className="text-secondary small">
                3 model đang chạy, 1 model cần kiểm tra do latency tăng cao.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-7">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Giao dịch gần đây</h5>
              <span className="text-secondary small">Toàn hệ thống</span>
            </div>

            <div className="table-responsive">
              <table className="table table-dark align-middle mb-0">
                <thead>
                  <tr style={{ color: "#7d8592" }}>
                    <th className="border-0 bg-transparent">Mã lệnh</th>
                    <th className="border-0 bg-transparent">Người dùng</th>
                    <th className="border-0 bg-transparent">Cặp</th>
                    <th className="border-0 bg-transparent">Loại</th>
                    <th className="border-0 bg-transparent">Khối lượng</th>
                    <th className="border-0 bg-transparent">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td style={{ backgroundColor: "transparent" }}>{trade.id}</td>
                      <td style={{ backgroundColor: "transparent" }}>{trade.user}</td>
                      <td style={{ backgroundColor: "transparent" }}>{trade.pair}</td>
                      <td style={{ backgroundColor: "transparent" }}>
                        <div className="d-flex flex-column">
                          <span
                            style={{
                              color: trade.side === "BUY" ? "#00C087" : "#F6465D",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {trade.side}
                          </span>
                          <span className="text-secondary" style={{ fontSize: "11px" }}>
                            {trade.type}
                          </span>
                        </div>
                      </td>
                      <td style={{ backgroundColor: "transparent" }}>{trade.amount}</td>
                      <td style={{ backgroundColor: "transparent" }}>
                        <span
                          className="px-2 py-1 rounded"
                          style={{ ...getBadgeStyle(trade.status), fontSize: "11px" }}
                        >
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Bot/Grid đang chạy</h5>
              <Bot size={18} color="#F0B90B" />
            </div>

            <div className="list-group list-group-flush">
              {runningBots.map((bot) => (
                <div
                  key={bot.id}
                  className="list-group-item bg-transparent border-secondary px-0 py-3"
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="text-white small fw-bold">{bot.strategy}</div>
                      <div className="text-secondary" style={{ fontSize: "11px" }}>
                        {bot.user} • {bot.pair}
                      </div>
                    </div>

                    <div className="text-end">
                      <div
                        style={{
                          color: bot.pnl.startsWith("+") ? "#00C087" : "#F6465D",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {bot.pnl}
                      </div>
                      <div
                        className="px-2 py-1 rounded mt-1"
                        style={{ ...getBadgeStyle(bot.status), fontSize: "11px" }}
                      >
                        {bot.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Quản trị nhanh</h5>
              <Bell size={18} color="#F0B90B" />
            </div>

            <div className="row g-3">
              {[
                { title: "Quản lý người dùng", icon: Users },
                { title: "Quản lý coin", icon: Coins },
                { title: "Giám sát AI", icon: Brain },
                { title: "Theo dõi giao dịch", icon: WalletCards },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div className="col-12 col-sm-6" key={item.title}>
                    <button
                      className="w-100 text-start p-3 rounded"
                      style={{
                        backgroundColor: "#0b0b0b",
                        border: "1px solid #171717",
                        color: "#fff",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: 38,
                            height: 38,
                            backgroundColor: "rgba(240,185,11,0.12)",
                            color: "#F0B90B",
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="fw-semibold">{item.title}</div>
                          <div className="text-secondary small">Truy cập nhanh chức năng</div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-4 h-100" style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Cảnh báo bảo mật</h5>
              <AlertTriangle size={18} color="#F0B90B" />
            </div>

            <div className="list-group list-group-flush">
              {securityAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="list-group-item bg-transparent border-secondary px-0 py-3"
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="text-white small fw-bold">{alert.title}</div>
                      <div className="text-secondary" style={{ fontSize: "11px" }}>
                        {alert.detail}
                      </div>
                    </div>

                    <div
                      className="px-2 py-1 rounded"
                      style={{ ...getBadgeStyle(alert.level), fontSize: "11px" }}
                    >
                      {alert.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-3 p-3 rounded"
              style={{
                backgroundColor: "rgba(246,70,93,0.08)",
                border: "1px solid rgba(246,70,93,0.15)",
              }}
            >
              <div className="text-white small fw-semibold mb-1">Lưu ý</div>
              <div className="text-secondary small">
                Có 2 cảnh báo mức cao cần admin kiểm tra ngay.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}