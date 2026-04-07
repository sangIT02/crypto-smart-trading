import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Coins,
  Bot,
  Brain,
  Bell,
  ShieldAlert,
  ChartCandlestick,
} from "lucide-react";

const menus = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Quản lý người dùng", path: "/admin/users", icon: Users },
  { label: "Quản lý coin", path: "/admin/coins", icon: Coins },
  { label: "Quản lý mô hình AI", path: "/admin/ai-models", icon: Brain },
  { label: "Giám sát giao dịch", path: "/admin/trades", icon: ChartCandlestick },
  { label: "Giám sát Bot/Grid", path: "/admin/bots", icon: Bot },
  { label: "Thông báo hàng loạt", path: "/admin/notifications", icon: Bell },
  { label: "Bảo mật hệ thống", path: "/admin/security", icon: ShieldAlert },
];

export function AdminSidebar() {
  return (
    <aside
      className="d-none d-lg-flex flex-column border-end"
      style={{
        width: "280px",
        backgroundColor: "#0B0E11",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="px-4 py-3 border-bottom"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <h5 className="mb-1 text-white">Trading Admin</h5>
        <small style={{ color: "#8A8F98" }}>OKX Style Admin</small>
      </div>

      <div className="flex-grow-1 p-3">
        <div className="nav flex-column gap-2">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `text-decoration-none rounded-3 px-3 py-3 d-flex align-items-center gap-2 ${
                    isActive ? "admin-sidebar-link-active" : "admin-sidebar-link"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}