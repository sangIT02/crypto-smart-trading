export function StatCards() {
    const stats = [
        {
            label: 'Total Portfolio Value',
            value: '$45,234.56',
            change: '+12.45%',
            isPositive: true,
            icon: '💰',
        },
        {
            label: "Today's PNL",
            value: '$2,834.50',
            change: '+8.32%',
            isPositive: true,
            icon: '📈',
        },
        {
            label: 'Active Bots',
            value: '8',
            change: '+2 this week',
            isPositive: true,
            icon: '🤖',
        },
        {
            label: 'AI Accuracy',
            value: '78.5%',
            change: '+2.3% avg',
            isPositive: true,
            icon: '🧠',
        },
    ]

    return (
        // Sử dụng hệ thống Grid của Bootstrap: row và các cột col
        <div className="row g-3">
            {stats.map((stat) => (
                <div key={stat.label} className="col-12 col-md-6 col-lg-3" style={{opacity: 0.9}}>
                    <div 
                        className="card h-100  p-4 transition-all"
                        style={{ 
                            backgroundColor: '#000', // Màu nền Card của Binance
                            borderRadius: '12px',
                            border: '3px solid #2E2E2E' // Border mờ kiểu sàn giao dịch
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                {/* Label: Màu chữ xám phụ */}
                                <p className="mb-1 small" style={{ color: '#848E9C' }}>
                                    {stat.label}
                                </p>
                                
                                {/* Value: Chữ trắng đậm */}
                                <h3 className="mb-1 fw-bold text-white fs-4">
                                    {stat.value}
                                </h3>
                                
                                {/* Change: Xanh nếu tăng, Đỏ nếu giảm */}
                                <div 
                                    className="small fw-medium"
                                    style={{ 
                                        color: stat.isPositive ? '#0ECB81' : '#F6465D' 
                                    }}
                                >
                                    {stat.change}
                                </div>
                            </div>

                            {/* Icon Wrapper */}
                            <div 
                                className="d-flex align-items-center justify-content-center rounded-circle"
                                style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    backgroundColor: 'rgba(252, 213, 53, 0.1)', // Vàng Binance loãng
                                    fontSize: '24px'
                                }}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}