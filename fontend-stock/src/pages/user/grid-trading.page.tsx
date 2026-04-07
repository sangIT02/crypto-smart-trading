import React, { useMemo, useState } from "react";

type GridStatus = "running" | "paused" | "stopped";

type GridBotItem = {
    id: number;
    symbol: string;
    lowerPrice: number;
    upperPrice: number;
    grids: number;
    investment: number;
    profitRate: number;
    realizedPnl: number;
    unrealizedPnl: number;
    createdAt: string;
    status: GridStatus;
    strategy: "arithmetic" | "geometric";
};

type StatusBadgeProps = {
    status: GridStatus;
};

type GridCardProps = {
    bot: GridBotItem;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number) => void;
};

type AddGridFormProps = {
    onAdd: (item: GridBotItem) => void;
    onCancel: () => void;
};

const MOCK_BOTS: GridBotItem[] = [
    {
        id: 1,
        symbol: "BTC/USDT",
        lowerPrice: 64000,
        upperPrice: 76000,
        grids: 12,
        investment: 1500,
        profitRate: 8.42,
        realizedPnl: 96.3,
        unrealizedPnl: 29.5,
        createdAt: "31/03/2026",
        status: "running",
        strategy: "arithmetic",
    },
    {
        id: 2,
        symbol: "ETH/USDT",
        lowerPrice: 3200,
        upperPrice: 3900,
        grids: 18,
        investment: 900,
        profitRate: 5.18,
        realizedPnl: 31.2,
        unrealizedPnl: -8.7,
        createdAt: "30/03/2026",
        status: "paused",
        strategy: "geometric",
    },
];

const SYMBOL_OPTIONS = [
    "BTC/USDT",
    "ETH/USDT",
    "SOL/USDT",
    "BNB/USDT",
    "XRP/USDT",
    "DOGE/USDT",
    "ARB/USDT",
    "OP/USDT",
];

function formatPrice(value: number) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: value < 100 ? 2 : 0,
        maximumFractionDigits: value < 100 ? 4 : 2,
    }).format(value);
}

function formatMoney(value: number) {
    return `${value >= 0 ? "+" : ""}${formatPrice(value)} USDT`;
}

function StatusBadge({ status }: StatusBadgeProps) {
    const map = {
        running: {
            text: "RUNNING",
            bg: "#07130b",
            border: "#16371f",
            color: "#4ade80",
            dot: "#22c55e",
        },
        paused: {
            text: "PAUSED",
            bg: "#161616",
            border: "#2a2a2a",
            color: "#a1a1aa",
            dot: "#71717a",
        },
        stopped: {
            text: "STOPPED",
            bg: "#190707",
            border: "#4c1010",
            color: "#fca5a5",
            dot: "#ef4444",
        },
    }[status];

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: map.bg,
                border: `1px solid ${map.border}`,
                borderRadius: 999,
                padding: "4px 10px",
                whiteSpace: "nowrap",
            }}
        >
            <div
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: map.dot,
                    boxShadow: status === "running" ? "0 0 8px rgba(34,197,94,0.65)" : "none",
                }}
            />
            <span
                style={{
                    fontSize: 10,
                    color: map.color,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    letterSpacing: 0.8,
                }}
            >
                {map.text}
            </span>
        </div>
    );
}

function StatCard({ title, value, hint }: { title: string; value: string | number; hint: string }) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: 0,
                background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                border: "1px solid #1a1a1a",
                borderRadius: 14,
                padding: 16,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.015)",
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    color: "#6b7280",
                    letterSpacing: 1.3,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 8,
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fafafa",
                    letterSpacing: -0.4,
                    marginBottom: 6,
                }}
            >
                {value}
            </div>
            <div
                style={{
                    fontSize: 12,
                    color: "#71717a",
                    lineHeight: 1.6,
                }}
            >
                {hint}
            </div>
        </div>
    );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                background: "#050505",
                border: "1px solid #161616",
                borderRadius: 12,
                padding: "10px 12px",
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    color: "#6b7280",
                    letterSpacing: 1.1,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 6,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: 12,
                    color: "#ececec",
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function GridCard({ bot, onDelete, onToggleStatus }: GridCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div
            style={{
                background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                border: "1px solid #1a1a1a",
                borderRadius: 16,
                padding: 18,
                transition: "all 0.2s ease",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.015), 0 10px 30px rgba(0,0,0,0.35)",
                minWidth: 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1a1a1a";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 14,
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#f5f5f5" }}>{bot.symbol}</div>
                        <StatusBadge status={bot.status} />
                    </div>
                    <div style={{ fontSize: 11, color: "#71717a", lineHeight: 1.7 }}>Tạo lúc {bot.createdAt}</div>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                    marginBottom: 12,
                }}
            >
                <MiniInfo label="Khoảng giá" value={`${formatPrice(bot.lowerPrice)} - ${formatPrice(bot.upperPrice)}`} />
                <MiniInfo label="Số lưới" value={`${bot.grids} grids`} />
                <MiniInfo label="Vốn đầu tư" value={`${formatPrice(bot.investment)} USDT`} />
                <MiniInfo label="Chiến lược" value={bot.strategy === "arithmetic" ? "Arithmetic" : "Geometric"} />
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                    marginBottom: 12,
                }}
            >
                <PnlBox label="Lợi nhuận" value={`${bot.profitRate >= 0 ? "+" : ""}${bot.profitRate.toFixed(2)}%`} positive={bot.profitRate >= 0} />
                <PnlBox label="Realized PnL" value={formatMoney(bot.realizedPnl)} positive={bot.realizedPnl >= 0} />
                <PnlBox label="Unrealized PnL" value={formatMoney(bot.unrealizedPnl)} positive={bot.unrealizedPnl >= 0} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={tagStyle}>{bot.symbol}</span>
                    <span style={tagStyle}>{bot.strategy === "arithmetic" ? "Arithmetic" : "Geometric"}</span>
                    <span style={tagGoldStyle}>Grid Bot</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                        type="button"
                        onClick={() => onToggleStatus(bot.id)}
                        style={{
                            ...smallBtn,
                            color: bot.status === "running" ? "#a1a1aa" : "#f0b90b",
                            borderColor: bot.status === "running" ? "#242424" : "#4a380e",
                            background: bot.status === "running" ? "#0a0a0a" : "#171107",
                        }}
                    >
                        {bot.status === "running" ? "Tạm dừng" : "Chạy lại"}
                    </button>

                    {confirmDelete ? (
                        <div style={{ display: "flex", gap: 6 }}>
                            <button type="button" onClick={() => setConfirmDelete(false)} style={{ ...smallBtn, color: "#9ca3af", borderColor: "#242424", background: "#0a0a0a" }}>
                                Hủy
                            </button>
                            <button type="button" onClick={() => onDelete(bot.id)} style={{ ...smallBtn, color: "#fca5a5", borderColor: "#4c1010", background: "#190707" }}>
                                Xóa
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setConfirmDelete(true)} style={{ ...smallBtn, color: "#8b8f97", borderColor: "#222", background: "#0a0a0a" }}>
                            Xóa bot
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function PnlBox({ label, value, positive }: { label: string; value: string; positive: boolean }) {
    return (
        <div
            style={{
                background: positive ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                border: positive ? "1px solid rgba(34,197,94,0.14)" : "1px solid rgba(239,68,68,0.14)",
                borderRadius: 12,
                padding: "10px 12px",
            }}
        >
            <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 1.1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
                {label}
            </div>
            <div style={{ fontSize: 12, color: positive ? "#4ade80" : "#fca5a5", fontWeight: 600 }}>{value}</div>
        </div>
    );
}

function AddGridForm({ onAdd, onCancel }: AddGridFormProps) {
    const [symbol, setSymbol] = useState("BTC/USDT");
    const [lowerPrice, setLowerPrice] = useState("");
    const [upperPrice, setUpperPrice] = useState("");
    const [grids, setGrids] = useState("10");
    const [investment, setInvestment] = useState("");
    const [strategy, setStrategy] = useState<"arithmetic" | "geometric">("arithmetic");
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!lowerPrice || !upperPrice || !grids || !investment) return;

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));

        onAdd({
            id: Date.now(),
            symbol,
            lowerPrice: Number(lowerPrice),
            upperPrice: Number(upperPrice),
            grids: Number(grids),
            investment: Number(investment),
            profitRate: 0,
            realizedPnl: 0,
            unrealizedPnl: 0,
            createdAt: new Date().toLocaleDateString("vi-VN"),
            status: "running",
            strategy,
        });

        setLoading(false);
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                zIndex: 1000,
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 680,
                    background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                    border: "1px solid #1d1d1d",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.015), 0 12px 32px rgba(0,0,0,0.45)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#f5f5f5", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
                            Tạo Grid Bot mới
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#71717a", lineHeight: 1.6 }}>
                            Thiết lập khoảng giá, số lưới và vốn đầu tư để bot giao dịch tự động.
                        </div>
                    </div>

                    <button type="button" onClick={onCancel} style={{ ...iconBtn, width: 32, height: 32, color: "#9ca3af", flexShrink: 0 }}>
                        <CloseIcon />
                    </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 12 }}>
                    <div>
                        <label style={fieldLabel}>CẶP GIAO DỊCH</label>
                        <select value={symbol} onChange={(e) => setSymbol(e.target.value)} style={inputStyle}>
                            {SYMBOL_OPTIONS.map((item) => (
                                <option key={item} value={item} style={{ background: "#050505", color: "#fff" }}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={fieldLabel}>CHIẾN LƯỢC</label>
                        <select value={strategy} onChange={(e) => setStrategy(e.target.value as "arithmetic" | "geometric")} style={inputStyle}>
                            <option value="arithmetic" style={{ background: "#050505", color: "#fff" }}>Arithmetic</option>
                            <option value="geometric" style={{ background: "#050505", color: "#fff" }}>Geometric</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 12 }}>
                    <div>
                        <label style={fieldLabel}>GIÁ THẤP NHẤT</label>
                        <input type="number" placeholder="Ví dụ: 64000" value={lowerPrice} onChange={(e) => setLowerPrice(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={fieldLabel}>GIÁ CAO NHẤT</label>
                        <input type="number" placeholder="Ví dụ: 76000" value={upperPrice} onChange={(e) => setUpperPrice(e.target.value)} style={inputStyle} />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
                    <div>
                        <label style={fieldLabel}>SỐ GRID</label>
                        <input type="number" placeholder="Ví dụ: 12" value={grids} onChange={(e) => setGrids(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={fieldLabel}>VỐN ĐẦU TƯ (USDT)</label>
                        <input type="number" placeholder="Ví dụ: 1500" value={investment} onChange={(e) => setInvestment(e.target.value)} style={inputStyle} />
                    </div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(180deg, rgba(240,185,11,0.10) 0%, rgba(240,185,11,0.04) 100%)",
                        border: "1px solid rgba(240,185,11,0.22)",
                        borderRadius: 12,
                        padding: "12px 14px",
                        marginBottom: 14,
                        display: "flex",
                        gap: 10,
                    }}
                >
                    <span style={{ fontSize: 14, flexShrink: 0 }}>⚙️</span>
                    <div style={{ fontSize: 11, color: "#d6a728", lineHeight: 1.7, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
                        Grid bot phù hợp hơn với thị trường sideway. Hãy đảm bảo khoảng giá đủ rộng và số grid không quá dày để tránh phí giao dịch tăng cao.
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={onCancel} style={{ ...smallBtn, flex: 1, padding: "11px 0", justifyContent: "center", color: "#a1a1aa", borderColor: "#222", background: "#080808" }}>
                        Hủy
                    </button>

                    <button
                        type="button"
                        onClick={submit}
                        disabled={!lowerPrice || !upperPrice || !grids || !investment || loading}
                        style={{
                            flex: 2,
                            padding: "11px 0",
                            borderRadius: 10,
                            cursor: !lowerPrice || !upperPrice || !grids || !investment || loading ? "not-allowed" : "pointer",
                            background: !lowerPrice || !upperPrice || !grids || !investment || loading ? "#1a1a1a" : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
                            border: !lowerPrice || !upperPrice || !grids || !investment || loading ? "1px solid #242424" : "1px solid #e0ae10",
                            color: !lowerPrice || !upperPrice || !grids || !investment || loading ? "#666" : "#111",
                            fontSize: 13,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                            fontWeight: 700,
                            opacity: !lowerPrice || !upperPrice || !grids || !investment ? 0.7 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow: !lowerPrice || !upperPrice || !grids || !investment || loading ? "none" : "0 8px 22px rgba(240,185,11,0.16)",
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                Đang tạo...
                            </>
                        ) : (
                            "Tạo Grid Bot"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export const GridTrading = () => {
    const [bots, setBots] = useState<GridBotItem[]>(MOCK_BOTS);
    const [showForm, setShowForm] = useState(false);

    const stats = useMemo(() => {
        const totalInvestment = bots.reduce((sum, bot) => sum + bot.investment, 0);
        const totalPnl = bots.reduce((sum, bot) => sum + bot.realizedPnl + bot.unrealizedPnl, 0);
        const running = bots.filter((bot) => bot.status === "running").length;

        return {
            total: bots.length,
            running,
            totalInvestment,
            totalPnl,
        };
    }, [bots]);

    function handleAdd(newBot: GridBotItem) {
        setBots((prev) => [newBot, ...prev]);
        setShowForm(false);
    }

    function handleDelete(id: number) {
        setBots((prev) => prev.filter((item) => item.id !== id));
    }

    function handleToggleStatus(id: number) {
        setBots((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                return {
                    ...item,
                    status: item.status === "running" ? "paused" : "running",
                };
            })
        );
    }

    return (
            <div
                style={{
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                    background: "#000",
                    minHeight: "100vh",
                    color: "#e5e7eb",
                    padding: "28px 24px",
                    margin: "0 auto",
                }}
            >
                <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input, select, textarea { outline: none; }
          input:focus, select:focus, textarea:focus {
            border-color: #f0b90b !important;
            box-shadow: 0 0 0 3px rgba(240,185,11,0.08);
          }
        `}</style>

                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 16,
                        marginBottom: 20,
                    }}
                >
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <GridRoundIcon />
                            <span style={{ fontSize: 10, color: "#6b7280", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>
                                Grid Trading
                            </span>
                        </div>

                        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#fafafa", letterSpacing: -0.3 }}>
                            Quản lí Grid Trading
                        </h1>

                        <p style={{ fontSize: 13, color: "#8b8f97", marginTop: 8, lineHeight: 1.7, maxWidth: 620 }}>
                            Tạo và quản lí các grid bot theo phong cách giống trang API key và price alerts.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        style={{
                            flexShrink: 0,
                            padding: "12px 16px",
                            borderRadius: 12,
                            cursor: "pointer",
                            background: "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
                            border: "1px solid #e0ae10",
                            color: "#111",
                            fontSize: 13,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow: "0 8px 22px rgba(240,185,11,0.16)",
                            marginTop: 2,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                        Tạo grid bot
                    </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 18 }}>
                    <StatCard title="Tổng bot" value={stats.total} hint="Tất cả grid bots" />
                    <StatCard title="Đang chạy" value={stats.running} hint="Bot đang hoạt động" />
                    <StatCard title="Tổng vốn" value={`${formatPrice(stats.totalInvestment)} USDT`} hint="Vốn phân bổ hiện tại" />
                    <StatCard title="Tổng PnL" value={formatMoney(stats.totalPnl)} hint="Realized + Unrealized" />
                </div>

                {bots.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "56px 24px",
                            color: "#3f3f46",
                            border: "1px dashed #1a1a1a",
                            borderRadius: 16,
                            background: "#050505",
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ fontSize: 32, marginBottom: 8 }}>#</div>
                        <div style={{ fontSize: 14, color: "#71717a" }}>Chưa có grid bot nào</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, alignItems: "start" }}>
                        {bots.map((bot) => (
                            <GridCard key={bot.id} bot={bot} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
                        ))}
                    </div>
                )}

                <div
                    style={{
                        marginTop: 24,
                        padding: "14px 16px",
                        borderRadius: 14,
                        background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                        border: "1px solid #1a1a1a",
                        display: "flex",
                        gap: 12,
                    }}
                >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>📈</span>
                    <div style={{ fontSize: 11, color: "#8b8f97", lineHeight: 1.8 }}>
                        Grid bot nên được tính toán và khớp lệnh từ backend hoặc trading engine riêng. FE chỉ nên hiển thị cấu hình, hiệu suất và thao tác quản lý bot.
                    </div>
                </div>

                {showForm && <AddGridForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}
            </div>
    );
};

const tagStyle: React.CSSProperties = {
    fontSize: 10,
    padding: "4px 9px",
    borderRadius: 999,
    background: "#0d0d0d",
    border: "1px solid #232323",
    color: "#a1a1aa",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    letterSpacing: 0.3,
};

const tagGoldStyle: React.CSSProperties = {
    ...tagStyle,
    background: "#171107",
    border: "1px solid #4a380e",
    color: "#f0b90b",
};

const smallBtn: React.CSSProperties = {
    background: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    padding: "6px 10px",
    fontSize: 11,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 4,
    border: "1px solid",
    transition: "all 0.15s",
};

const iconBtn: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #202020",
    cursor: "pointer",
    color: "#7c828d",
    padding: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    transition: "all 0.15s",
};

const fieldLabel: React.CSSProperties = {
    fontSize: 10,
    color: "#6b7280",
    letterSpacing: 1.2,
    display: "block",
    marginBottom: 6,
    textTransform: "uppercase",
    fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#050505",
    border: "1px solid #1a1a1a",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#f3f4f6",
    fontSize: 13,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
};

function GridRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
