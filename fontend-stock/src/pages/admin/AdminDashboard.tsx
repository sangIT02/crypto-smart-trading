import { useEffect, useMemo, useState } from "react";
import {
  Users,
  WalletCards,
  Shield,
  TrendingUp,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  manageOrderService,
  type SymbolTotal,
  type TotalTypeOrder,
} from "../../services/admin/manageOrderService";
import {
  manageUserService,
  type UserDataPerMonth,
} from "../../services/admin/manageUserService";
import {
  managePredictService,
  type TotalOrderTypeResponse,
} from "../../services/admin/managePredictService";

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#111",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "10px 14px",
          color: "#fff",
        }}
      >
        <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
          {payload[0].payload.symbol}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomBuySellTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#111",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "10px 14px",
          color: "#fff",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>
          {payload[0].payload.name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [pairVolumeData, setPairVolumeData] = useState<SymbolTotal[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserDataPerMonth[]>([]);
  const [orderTypeData, setOrderTypeData] = useState<TotalOrderTypeResponse[]>(
    [],
  );
  const [buySellData, setBuySellData] = useState<TotalTypeOrder[]>([]);
  const fetchUserGrowthData = async () => {
    try {
      const response = await manageUserService.getUserDataPerMonth();
      const data: UserDataPerMonth[] = await response.data.data;
      console.log("User growth data", data);
      setUserGrowthData(data);
    } catch (error) {}
  };

  const fetchSymbolTotal = async () => {
    try {
      const response = await manageOrderService.getSymbolTotal();
      const data = await response.data;
      console.log("Data", data);
      setPairVolumeData(data.data);
    } catch (error) {
      console.error("Error fetching symbol total:", error);
    }
  };

  const fetchOrderTypeData = async () => {
    try {
      const response = await managePredictService.getTotalOrderType();
      const data: TotalOrderTypeResponse[] = await response.data.data;
      console.log("Data", data);
      setOrderTypeData(data);
    } catch (error) {
      console.error("Error fetching order type data:", error);
    }
  };

  const fetchBuySellData = async () => {
    try {
      const response = await manageOrderService.getTotalTypeOrder();
      const data: TotalTypeOrder[] = await response.data.data;
      console.log("Buy/Sell data", data);
      setBuySellData(data);
    } catch (error) {
      console.error("Error fetching buy/sell data:", error);
    }
  };

  useEffect(() => {
    fetchSymbolTotal();
    fetchUserGrowthData();
    fetchOrderTypeData();
    fetchBuySellData();
  }, []);

  const stats = useMemo(
    () => [
      {
        title: "Tổng số người dùng",
        value: "24,892",
        change: "8.4%",
        positive: true,
        icon: Users,
      },
      {
        title: "Tổng lệnh giao dịch",
        value: "1,284,201",
        change: "+12.1%",
        positive: true,
        icon: WalletCards,
      },
      {
        title: "Tổng số mô hình AI",
        value: "10",
        change: "+0",
        positive: true,
        icon: TrendingUp,
      },
      {
        title: "Cảnh báo bảo mật",
        value: "17",
        change: "-21.3%",
        positive: false,
        icon: Shield,
      },
    ],
    [],
  );

  const pairVolumeColors = [
    "#F7931A",
    "#627EEA",
    "#14F195",
    "#F0B90B",
    "#00A2FF",
    "#6B7280",
  ];
  const orderTypeColors = {
    LONG: "#00C087",
    SHORT: "#F6465D",
    FLAT: "#8B8B8B",
  };
  const buySellColors = {
    BUY: "#00C087",
    SELL: "#F6465D",
  };

  // const buySellData = [
  //   { name: "BUY", value: 62,},
  //   { name: "SELL", value: 38},
  // ];

  const recentTrades = useMemo(
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
        amount: "8.15 ETH",
        status: "Filled",
      },
      {
        id: "ORD-90233",
        user: "Le Minh C",
        pair: "SOL/USDT",
        side: "BUY",
        type: "Market",
        amount: "540 SOL",
        status: "Filled",
      },
      {
        id: "ORD-90234",
        user: "Pham D",
        pair: "BNB/USDT",
        side: "SELL",
        type: "Limit",
        amount: "31.4 BNB",
        status: "Cancelled",
      },
    ],
    [],
  );

  const securityAlerts = useMemo(
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
    [],
  );

  const cardStyle = {
    backgroundColor: "#0A0A0A",
    borderRadius: "16px",
    border: "1px solid #1F1F1F",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "Filled":
      case "Low":
        return {
          color: "#00C087",
          backgroundColor: "rgba(0, 192, 135, 0.12)",
          border: "1px solid rgba(0, 192, 135, 0.4)",
        };
      case "Cancelled":
      case "High":
        return {
          color: "#F6465D",
          backgroundColor: "rgba(246, 70, 93, 0.12)",
          border: "1px solid rgba(246, 70, 93, 0.4)",
        };
      case "Medium":
        return {
          color: "#F0B90B",
          backgroundColor: "rgba(240, 185, 11, 0.12)",
          border: "1px solid rgba(240, 185, 11, 0.4)",
        };
      default:
        return {
          color: "#9CA3AF",
          backgroundColor: "rgba(156, 163, 175, 0.12)",
          border: "1px solid rgba(156, 163, 175, 0.4)",
        };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "20px 0",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} style={cardStyle}>
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div style={{ color: "#888", fontSize: "14px" }}>
                        {stat.title}
                      </div>
                      <div
                        style={{
                          fontSize: "32px",
                          fontWeight: "700",
                          marginTop: "12px",
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "rgba(240, 185, 11, 0.1)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#F0B90B",
                      }}
                    >
                      <Icon size={28} />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: stat.positive ? "#00C087" : "#F6465D",
                      fontSize: "15px",
                    }}
                  >
                    {stat.positive ? (
                      <ArrowUp size={18} />
                    ) : (
                      <ArrowDown size={18} />
                    )}
                    {stat.change} so với tháng trước
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr", // ← Đây là phần quan trọng
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          {/* User Growth Line Chart */}
          <div style={cardStyle}>
            <div
              style={{
                padding: "15px 28px",
                borderBottom: "1px solid #1F1F1F",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Người dùng hoạt động theo tháng
              </h5>
            </div>
            <div style={{ padding: "24px", height: "500px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="month" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111", border: "none" }}
                  />
                  <Line
                    type="natural"
                    dataKey="total"
                    stroke="#F0B90B"
                    strokeWidth={4}
                    dot={{ fill: "#F0B90B", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pair Volume Pie Chart */}
          <div style={cardStyle}>
            <div
              style={{
                padding: "15px 28px",
                borderBottom: "1px solid #1F1F1F",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Phân bổ cặp giao dịch phổ biến
              </h5>
            </div>
            <div
              style={{
                padding: "20px 24px",
                height: "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: "260px", height: "260px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pairVolumeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={115}
                      dataKey="totalOrders"
                    >
                      {pairVolumeColors.map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{ marginTop: "24px", width: "100%", maxWidth: "320px" }}
              >
                {pairVolumeData.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        backgroundColor:
                        pairVolumeColors[i % pairVolumeColors.length],
                        borderRadius: "4px",
                        marginRight: "12px",
                      }}
                    />
                    <span style={{ flex: 1, color: "#ccc" }}>
                      {item.symbol}
                    </span>
                    <span style={{ fontWeight: "600" }}>
                      {item.totalOrders}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Volume Area Chart */}

          {/* Order Type Bar Chart */}
          <div style={cardStyle}>
            <div
              style={{
                padding: "15px 28px",
                borderBottom: "1px solid #1F1F1F",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Tỉ lệ dự đoán của AI
              </h5>
            </div>
            <div style={{ padding: "32px", height: "380px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="type" stroke="#555" />
                  <YAxis stroke="#555" />
                  <Tooltip />
                  <Bar dataKey="count" radius={8}>
                    {orderTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          orderTypeColors[
                            entry.type as keyof typeof orderTypeColors
                          ] || "#F0B90B"
                        }
                      />
                    ))}
                  </Bar>{" "}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Buy/Sell Pie */}
          <div style={cardStyle}>
            <div
              style={{
                padding: "15px 28px",
                borderBottom: "1px solid #1F1F1F",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Tỷ lệ BUY / SELL
              </h5>
            </div>
            <div style={{ padding: "40px 24px", height: "380px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={buySellData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={125}
                    dataKey="value"
                  >
                    {buySellData.map((entry, i) => (
                      <Cell key={i} fill={buySellColors[entry.name as keyof typeof buySellColors]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomBuySellTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Trades & Alerts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "15px",
          }}
        >
          {/* Recent Trades */}
          <div style={cardStyle}>
            <div
              style={{
                padding: "15px 28px",
                borderBottom: "1px solid #1F1F1F",
              }}
            >
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Giao dịch gần đây
              </h5>
            </div>
            <div style={{ padding: "0 10px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: "#888", borderBottom: "1px solid #222" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "20px 18px",
                        fontWeight: "normal",
                      }}
                    >
                      Mã lệnh
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "20px 18px",
                        fontWeight: "normal",
                      }}
                    >
                      Người dùng
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "20px 18px",
                        fontWeight: "normal",
                      }}
                    >
                      Cặp
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "20px 18px",
                        fontWeight: "normal",
                      }}
                    >
                      Loại
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "20px 18px",
                        fontWeight: "normal",
                      }}
                    >
                      Khối lượng
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "20px 18px",
                        fontWeight: "normal",
                      }}
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #1F1F1F" }}>
                      <td style={{ padding: "18px", fontFamily: "monospace" }}>
                        {trade.id}
                      </td>
                      <td style={{ padding: "18px" }}>{trade.user}</td>
                      <td style={{ padding: "18px", fontWeight: "500" }}>
                        {trade.pair}
                      </td>
                      <td style={{ padding: "18px" }}>
                        <span
                          style={{
                            color: trade.side === "BUY" ? "#00C087" : "#F6465D",
                            fontWeight: "600",
                          }}
                        >
                          {trade.side}
                        </span>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {trade.type}
                        </div>
                      </td>
                      <td style={{ padding: "18px" }}>{trade.amount}</td>
                      <td style={{ padding: "18px" }}>
                        <span
                          style={{
                            ...getBadgeStyle(trade.status),
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                          }}
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

          {/* Security Alerts */}
          <div style={cardStyle}>
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid #1F1F1F",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AlertTriangle size={22} color="#F0B90B" />
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Cảnh báo bảo mật
              </h5>
            </div>
            <div>
              {securityAlerts.map((alert, index) => (
                <div
                  key={index}
                  style={{
                    padding: "22px 28px",
                    borderBottom:
                      index !== securityAlerts.length - 1
                        ? "1px solid #1F1F1F"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "500" }}>{alert.title}</div>
                      <div
                        style={{
                          color: "#888",
                          fontSize: "13px",
                          marginTop: "4px",
                        }}
                      >
                        {alert.detail}
                      </div>
                    </div>
                    <span
                      style={{
                        ...getBadgeStyle(alert.level),
                        padding: "5px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {alert.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
