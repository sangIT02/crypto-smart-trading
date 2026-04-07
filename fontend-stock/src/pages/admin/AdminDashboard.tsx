import React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Brain,
  Coins,
  Cpu,
  DollarSign,
  ShieldAlert,
  Users,
  WalletCards,
} from "lucide-react";

const stats = [
  {
    title: "Người dùng hoạt động",
    value: "24,892",
    change: "+12.4%",
    desc: "So với 7 ngày trước",
    icon: Users,
  },
  {
    title: "Lệnh toàn hệ thống",
    value: "1,284,201",
    change: "+8.7%",
    desc: "Trong 24 giờ gần nhất",
    icon: WalletCards,
  },
  {
    title: "Bot/Grid đang chạy",
    value: "3,482",
    change: "+5.1%",
    desc: "Đang hoạt động ổn định",
    icon: Bot,
  },
  {
    title: "Cảnh báo bảo mật",
    value: "17",
    change: "-9.3%",
    desc: "Mức cao cần xử lý",
    icon: ShieldAlert,
  },
];

const activityBars = [42, 58, 51, 73, 66, 88, 76, 62, 95, 70, 64, 84];

const marketOverview = [
  { symbol: "BTC", price: "$82,451", change: "+2.14%", volume: "$1.2B", positive: true },
  { symbol: "ETH", price: "$4,021", change: "+1.32%", volume: "$864M", positive: true },
  { symbol: "SOL", price: "$188", change: "-0.82%", volume: "$313M", positive: false },
  { symbol: "BNB", price: "$641", change: "+0.64%", volume: "$172M", positive: true },
];

const aiModels = [
  {
    name: "TrendSense v2",
    type: "Forecasting",
    status: "Running",
    accuracy: 87,
    load: 71,
  },
  {
    name: "Grid Optimizer",
    type: "Strategy Engine",
    status: "Running",
    accuracy: 91,
    load: 62,
  },
  {
    name: "Risk Guard",
    type: "Anomaly Detection",
    status: "Warning",
    accuracy: 94,
    load: 89,
  },
];

const recentTrades = [
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
];

const securityAlerts = [
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
];

const quickActions = [
  { title: "Quản lý người dùng", icon: Users },
  { title: "Bật/Tắt coin", icon: Coins },
  { title: "Theo dõi AI model", icon: Brain },
  { title: "Dừng Bot/Grid", icon: Bot },
];

function badgeClass(status: string) {
  switch (status) {
    case "Filled":
    case "Running":
    case "Low":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-400";
    case "Cancelled":
      return "border-zinc-500/30 bg-zinc-500/15 text-zinc-300";
    case "Open":
      return "border-sky-500/30 bg-sky-500/15 text-sky-400";
    case "Warning":
    case "Medium":
      return "border-yellow-500/30 bg-yellow-500/15 text-yellow-400";
    case "High":
      return "border-red-500/30 bg-red-500/15 text-red-400";
    default:
      return "border-zinc-500/30 bg-zinc-500/15 text-zinc-300";
  }
}

function progressColor(value: number) {
  if (value >= 85) return "bg-red-500";
  if (value >= 65) return "bg-yellow-400";
  return "bg-emerald-500";
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#151A21] via-[#10141B] to-[#0E1218] p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Trang tổng quan quản trị</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Theo dõi toàn bộ hệ thống giao dịch, hoạt động AI, bot/grid, bảo mật và tình trạng người dùng trong một giao diện điều hành tập trung.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <button className="rounded-2xl border border-[#F0B90B]/20 bg-[#F0B90B]/12 px-4 py-3 text-sm font-medium text-[#F0B90B] transition hover:bg-[#F0B90B]/18">
              Gửi thông báo
            </button>
            <button className="rounded-2xl border border-white/10 bg-[#171C24] px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-[#1C222B]">
              Xuất báo cáo
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          const positive = item.change.startsWith("+");
          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-[#12161C] p-5 shadow-xl shadow-black/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-400">{item.title}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</h3>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span
                      className={`rounded-full border px-2.5 py-1 ${
                        positive
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-red-500/30 bg-red-500/15 text-red-400"
                      }`}
                    >
                      {item.change}
                    </span>
                    <span className="text-zinc-500">{item.desc}</span>
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#1B2129]">
                  <Icon className="h-5 w-5 text-[#F0B90B]" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Hoạt động hệ thống</h2>
              <p className="text-sm text-zinc-400">Tải giao dịch và xử lý trong 12 mốc gần nhất</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <Activity className="h-3.5 w-3.5" />
              System Stable
            </div>
          </div>

          <div className="flex h-72 items-end gap-2 rounded-2xl border border-white/5 bg-[#0E1218] p-4">
            {activityBars.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-[#F0B90B] to-[#FFD76A] opacity-90"
                  style={{ height: `${value}%` }}
                />
                <span className="text-[10px] text-zinc-500">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Tình trạng dịch vụ</h2>
                <p className="text-sm text-zinc-400">Theo dõi các module cốt lõi</p>
              </div>
              <Cpu className="h-5 w-5 text-[#F0B90B]" />
            </div>

            <div className="space-y-4">
              {[
                ["Trade Engine", 92],
                ["AI Service", 76],
                ["Socket Cluster", 89],
                ["Notification", 64],
              ].map(([name, value]) => (
                <div key={String(name)}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{name}</span>
                    <span className="text-zinc-500">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className={`h-2 rounded-full ${progressColor(Number(value))}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <p className="text-sm text-zinc-400">Truy cập nhanh chức năng admin</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-[#171C24] p-4 text-left transition hover:border-[#F0B90B]/30 hover:bg-[#1A2029]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F0B90B]/12 text-[#F0B90B]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-zinc-100">{item.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Coin overview</h2>
              <p className="text-sm text-zinc-400">Biến động nhanh của các cặp chính</p>
            </div>
            <Coins className="h-5 w-5 text-[#F0B90B]" />
          </div>

          <div className="space-y-3">
            {marketOverview.map((coin) => (
              <div
                key={coin.symbol}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0F141B] px-4 py-4"
              >
                <div>
                  <p className="font-medium text-white">{coin.symbol}</p>
                  <p className="text-xs text-zinc-500">Khối lượng: {coin.volume}</p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-zinc-100">{coin.price}</p>
                  <p className={`text-xs ${coin.positive ? "text-emerald-400" : "text-red-400"}`}>
                    {coin.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Mô hình AI</h2>
              <p className="text-sm text-zinc-400">Trạng thái và hiệu suất hiện tại</p>
            </div>
            <Brain className="h-5 w-5 text-[#F0B90B]" />
          </div>

          <div className="space-y-4">
            {aiModels.map((model) => (
              <div key={model.name} className="rounded-2xl border border-white/8 bg-[#0F141B] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{model.name}</p>
                    <p className="text-xs text-zinc-500">{model.type}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass(model.status)}`}>
                    {model.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-zinc-400">
                      <span>Accuracy</span>
                      <span>{model.accuracy}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${model.accuracy}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-zinc-400">
                      <span>Server Load</span>
                      <span>{model.load}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className={`h-2 rounded-full ${progressColor(model.load)}`}
                        style={{ width: `${model.load}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Giao dịch gần đây</h2>
              <p className="text-sm text-zinc-400">Theo dõi lệnh toàn hệ thống gần nhất</p>
            </div>
            <button className="inline-flex items-center gap-2 text-sm text-[#F0B90B] hover:opacity-90">
              Xem tất cả
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/8">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#0F141B] text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Mã lệnh</th>
                    <th className="px-4 py-3 text-left font-medium">Người dùng</th>
                    <th className="px-4 py-3 text-left font-medium">Cặp</th>
                    <th className="px-4 py-3 text-left font-medium">Loại</th>
                    <th className="px-4 py-3 text-left font-medium">Khối lượng</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id} className="border-t border-white/5 bg-[#12161C]">
                      <td className="px-4 py-4 text-zinc-200">{trade.id}</td>
                      <td className="px-4 py-4 text-zinc-300">{trade.user}</td>
                      <td className="px-4 py-4 text-zinc-300">{trade.pair}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className={`${trade.side === "BUY" ? "text-emerald-400" : "text-red-400"}`}>
                            {trade.side}
                          </span>
                          <span className="text-xs text-zinc-500">{trade.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{trade.amount}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass(trade.status)}`}>
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

        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Cảnh báo bảo mật</h2>
              <p className="text-sm text-zinc-400">Hoạt động bất thường cần theo dõi</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-[#F0B90B]" />
          </div>

          <div className="space-y-3">
            {securityAlerts.map((alert, index) => (
              <div
                key={`${alert.title}-${index}`}
                className="rounded-2xl border border-white/8 bg-[#0F141B] p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="font-medium text-white">{alert.title}</p>
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${badgeClass(alert.level)}`}>
                    {alert.level}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{alert.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Doanh thu phí giao dịch</p>
              <h3 className="text-xl font-semibold">$184,200</h3>
            </div>
          </div>
          <p className="text-sm text-zinc-500">Tăng trưởng ổn định theo hoạt động thị trường.</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Tỷ lệ uptime</p>
              <h3 className="text-xl font-semibold">99.98%</h3>
            </div>
          </div>
          <p className="text-sm text-zinc-500">Hệ thống đang duy trì hiệu năng cao.</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#12161C] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-500/12 text-[#F0B90B]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Bot bị can thiệp</p>
              <h3 className="text-xl font-semibold">29</h3>
            </div>
          </div>
          <p className="text-sm text-zinc-500">Một số bot cần xem xét lại mức rủi ro.</p>
        </div>
      </section>
    </div>
  );
}
