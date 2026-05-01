import { Home, TrendingUp, Zap, Wallet, Grid3X3, Bot, PieChart, MessageCircle, Bell, Settings, KeyRound, User, CircleUser, LogOut } from 'lucide-react'
import { href, Link, useLocation } from 'react-router-dom'

const navItems = [
    { label: 'Tổng quan', href: '/dashboard', icon: Home },
    { label: 'Quản lý người dùng', href: '/users', icon: User },
    { label: 'Quản lý mô hình AI', href: '/ai-models', icon: Zap },
    { label: 'Giám sát giao dịch', href: '/monitoring', icon: Wallet },
    { label: 'Thông báo hàng loạt', href: '/notifications', icon: Bot },
    { label: 'Bảo mật hệ thống', href: '/security', icon: PieChart },
    {label: 'Đăng xuất', href:'/setting', icon: LogOut}
]
export function AdminSidebar() {
    const location = useLocation()
    const pathname = location.pathname

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <div
            className="d-flex flex-column flex-shrink-0 vh-100"
            style={{
                width: '260px', // <<< CHỈNH CHIỀU RỘNG TẠI ĐÂY
                backgroundColor: '#000',
                position: 'sticky',
                top: 0,
                borderRight: '3px solid #2E2E2E'
            }}
        >
            {/* Header / Logo */}
            <div className="p-3" style={{borderBottom: '3px solid #2E2E2E'}}>
                <span className="fs-4 fw-bold tracking-tight text-white font-bold text-center">SDEX</span>
            </div>

            {/* Menu Navigation */}
            <div className="flex-grow-1 overflow-auto p-3 text-white font-bold">
                <ul className="nav nav-pills flex-column mb-auto gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                            <li key={item.href} className="nav-item">
                                <Link
                                    to={item.href}
                                    className={`nav-link d-flex align-items-center gap-3 py-2 px-3 transition-all ${active ? 'fw-bold' : 'text-white'
                                        }`}
                                    style={{
                                        borderRadius: '8px',
                                        // Nếu active thì dùng màu vàng Binance, nếu không thì để trong suốt
                                        backgroundColor: active ? '#FCD535' : 'transparent',
                                        // Chữ màu đen khi nền vàng, chữ màu trắng/xám khi nền tối
                                        color: active ? '#181A20' : '#EAECEF'
                                    }}
                                >
                                    <Icon size={18} color={active ? '#181A20' : '#848E9C'} />
                                    <span className="small">{item.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>

        </div>
    )
}