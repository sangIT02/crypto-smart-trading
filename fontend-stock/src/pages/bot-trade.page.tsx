import React, { useMemo, useState } from "react";

type BotMode = "ai" | "manual" | "signal";
type BotStatus = "running" | "paused" | "stopped";

type BotTradeItem = {
    id: number;
    name: string;
    symbol: string;
    mode: BotMode;
    status: BotStatus;
    strategy: string;
    riskLevel: "Low" | "Medium" | "High";
    allocatedCapital: number;
    dailyPnl: number;
    totalPnl: number;
    winRate: number;
    createdAt: string;
};

type BotCardProps = {
    bot: BotTradeItem;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number) => void;
};

type AddBotFormProps = {
    onAdd: (item: BotTradeItem) => void;
    onCancel: () => void;
};

const MOCK_BOTS: BotTradeItem[] = [
    {
        id: 1,
        name: "BTC Momentum Bot",
        symbol: "BTC/USDT",
        mode: "ai",
        status: "running",
        strategy: "Trend Following",
        riskLevel: "Medium",
        allocatedCapital: 2500,
        dailyPnl: 38.4,
        totalPnl: 286.2,
        winRate: 68.4,
        createdAt: "31/03/2026",
    },
    {
        id: 2,
        name: "ETH Signal Bot",
        symbol: "ETH/USDT",
        mode: "signal",
        status: "paused",
        strategy: "Breakout Retest",
        riskLevel: "Low",
        allocatedCapital: 1200,
        dailyPnl: -6.1,
        totalPnl: 94.7,
        winRate: 61.2,
        createdAt: "30/03/2026",
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

const STRATEGY_OPTIONS = [
    "Trend Following",
    "Breakout Retest",
    "Mean Reversion",
    "Scalping",
    "Smart DCA",
    "Momentum Trading",
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
            <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 1.3, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>
                {title}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fafafa", letterSpacing: -0.4, marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: 12, color: "#71717a", lineHeight: 1.6 }}>{hint}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: BotStatus }) {
    const map = {
        running: { text: "RUNNING", bg: "#07130b", border: "#16371f", color: "#4ade80", dot: "#22c55e" },
        paused: { text: "PAUSED", bg: "#161616", border: "#2a2a2a", color: "#a1a1aa", dot: "#71717a" },
        stopped: { text: "STOPPED", bg: "#190707", border: "#4c1010", color: "#fca5a5", dot: "#ef4444" },
    }[status];

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: map.bg, border: `1px solid ${map.border}`, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: map.dot, boxShadow: status === "running" ? "0 0 8px rgba(34,197,94,0.65)" : "none" }} />
            <span style={{ fontSize: 10, color: map.color, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: 0.8 }}>{map.text}</span>
        </div>
    );
}

function ModeBadge({ mode }: { mode: BotMode }) {
    const map = {
        ai: { label: "AI", color: "#f0b90b", bg: "#171107", border: "#4a380e" },
        manual: { label: "MANUAL", color: "#a1a1aa", bg: "#111111", border: "#2a2a2a" },
        signal: { label: "SIGNAL", color: "#60a5fa", bg: "rgba(37,99,235,0.12)", border: "rgba(37,99,235,0.28)" },
    }[mode];

    return (
        <span
            style={{
                fontSize: 10,
                padding: "4px 9px",
                borderRadius: 999,
                background: map.bg,
                border: `1px solid ${map.border}`,
                color: map.color,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: 0.3,
            }}
        >
            {map.label}
        </span>
    );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ background: "#050505", border: "1px solid #161616", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 1.1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
                {label}
            </div>
            <div style={{ fontSize: 12, color: "#ececec", lineHeight: 1.6, wordBreak: "break-word" }}>{value}</div>
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
            <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 1.1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 12, color: positive ? "#4ade80" : "#fca5a5", fontWeight: 600 }}>{value}</div>
        </div>
    );
}

function BotCard({ bot, onDelete, onToggleStatus }: BotCardProps) {
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
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#f5f5f5" }}>{bot.name}</div>
                        <StatusBadge status={bot.status} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <ModeBadge mode={bot.mode} />
                        <span style={{ fontSize: 11, color: "#71717a" }}>{bot.symbol}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#71717a", marginTop: 6 }}>Tạo lúc {bot.createdAt}</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 12 }}>
                <MiniInfo label="Chiến lược" value={bot.strategy} />
                <MiniInfo label="Risk Level" value={bot.riskLevel} />
                <MiniInfo label="Vốn phân bổ" value={`${formatPrice(bot.allocatedCapital)} USDT`} />
                <MiniInfo label="Win Rate" value={`${bot.winRate.toFixed(1)}%`} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 12 }}>
                <PnlBox label="Daily PnL" value={formatMoney(bot.dailyPnl)} positive={bot.dailyPnl >= 0} />
                <PnlBox label="Total PnL" value={formatMoney(bot.totalPnl)} positive={bot.totalPnl >= 0} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={tagStyle}>{bot.symbol}</span>
                    <span style={tagStyle}>{bot.strategy}</span>
                    <span style={tagGoldStyle}>Bot Trade</span>
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

function AddBotForm({ onAdd, onCancel }: AddBotFormProps) {
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("BTC/USDT");
    const [mode, setMode] = useState<BotMode>("ai");
    const [strategy, setStrategy] = useState("Trend Following");
    const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">("Medium");
    const [allocatedCapital, setAllocatedCapital] = useState("");
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!name || !allocatedCapital) return;

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));

        onAdd({
            id: Date.now(),
            name,
            symbol,
            mode,
            status: "running",
            strategy,
            riskLevel,
            allocatedCapital: Number(allocatedCapital),
            dailyPnl: 0,
            totalPnl: 0,
            winRate: 0,
            createdAt: new Date().toLocaleDateString("vi-VN"),
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
                            Tạo Bot Trade mới
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#71717a", lineHeight: 1.6 }}>
                            Thiết lập bot giao dịch theo chiến lược, vốn và mức rủi ro mong muốn.
                        </div>
                    </div>

                    <button type="button" onClick={onCancel} style={{ ...iconBtn, width: 32, height: 32, color: "#9ca3af", flexShrink: 0 }}>
                        <CloseIcon />
                    </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={fieldLabel}>TÊN BOT</label>
                    <input type="text" placeholder="Ví dụ: BTC Momentum Bot" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
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
                        <label style={fieldLabel}>MODE</label>
                        <select value={mode} onChange={(e) => setMode(e.target.value as BotMode)} style={inputStyle}>
                            <option value="ai" style={{ background: "#050505", color: "#fff" }}>AI</option>
                            <option value="manual" style={{ background: "#050505", color: "#fff" }}>Manual</option>
                            <option value="signal" style={{ background: "#050505", color: "#fff" }}>Signal</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
                    <div>
                        <label style={fieldLabel}>CHIẾN LƯỢC</label>
                        <select value={strategy} onChange={(e) => setStrategy(e.target.value)} style={inputStyle}>
                            {STRATEGY_OPTIONS.map((item) => (
                                <option key={item} value={item} style={{ background: "#050505", color: "#fff" }}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={fieldLabel}>RISK LEVEL</label>
                        <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as "Low" | "Medium" | "High")} style={inputStyle}>
                            <option value="Low" style={{ background: "#050505", color: "#fff" }}>Low</option>
                            <option value="Medium" style={{ background: "#050505", color: "#fff" }}>Medium</option>
                            <option value="High" style={{ background: "#050505", color: "#fff" }}>High</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={fieldLabel}>VỐN PHÂN BỔ (USDT)</label>
                    <input type="number" placeholder="Ví dụ: 2500" value={allocatedCapital} onChange={(e) => setAllocatedCapital(e.target.value)} style={inputStyle} />
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
                    <span style={{ fontSize: 14, flexShrink: 0 }}>🤖</span>
                    <div style={{ fontSize: 11, color: "#d6a728", lineHeight: 1.7, fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
                        Bot trade cần được giám sát định kỳ. Hãy ưu tiên thiết lập mức vốn hợp lý, chiến lược rõ ràng và risk level phù hợp với khẩu vị rủi ro.
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={onCancel} style={{ ...smallBtn, flex: 1, padding: "11px 0", justifyContent: "center", color: "#a1a1aa", borderColor: "#222", background: "#080808" }}>
                        Hủy
                    </button>

                    <button
                        type="button"
                        onClick={submit}
                        disabled={!name || !allocatedCapital || loading}
                        style={{
                            flex: 2,
                            padding: "11px 0",
                            borderRadius: 10,
                            cursor: !name || !allocatedCapital || loading ? "not-allowed" : "pointer",
                            background: !name || !allocatedCapital || loading ? "#1a1a1a" : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
                            border: !name || !allocatedCapital || loading ? "1px solid #242424" : "1px solid #e0ae10",
                            color: !name || !allocatedCapital || loading ? "#666" : "#111",
                            fontSize: 13,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                            fontWeight: 700,
                            opacity: !name || !allocatedCapital ? 0.7 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow: !name || !allocatedCapital || loading ? "none" : "0 8px 22px rgba(240,185,11,0.16)",
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                Đang tạo...
                            </>
                        ) : (
                            "Tạo Bot Trade"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export const BotTrade = () => {
    const [bots, setBots] = useState<BotTradeItem[]>(MOCK_BOTS);
    const [showForm, setShowForm] = useState(false);

    const stats = useMemo(() => {
        const totalCapital = bots.reduce((sum, bot) => sum + bot.allocatedCapital, 0);
        const totalPnl = bots.reduce((sum, bot) => sum + bot.totalPnl, 0);
        const running = bots.filter((bot) => bot.status === "running").length;
        const avgWinRate = bots.length ? bots.reduce((sum, bot) => sum + bot.winRate, 0) / bots.length : 0;

        return {
            total: bots.length,
            running,
            totalCapital,
            totalPnl,
            avgWinRate,
        };
    }, [bots]);

    function handleAdd(newBot: BotTradeItem) {
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

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <BotTradeRoundIcon />
                            <span style={{ fontSize: 10, color: "#6b7280", letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>
                                Bot Trade
                            </span>
                        </div>

                        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#fafafa", letterSpacing: -0.3 }}>
                            Quản lí Bot Trade
                        </h1>

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
                        Tạo bot mới
                    </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12, marginBottom: 18 }}>
                    <StatCard title="Tổng bot" value={stats.total} hint="Tất cả bot đang quản lí" />
                    <StatCard title="Đang chạy" value={stats.running} hint="Bot đang hoạt động" />
                    <StatCard title="Tổng vốn" value={`${formatPrice(stats.totalCapital)} USDT`} hint="Vốn đang phân bổ" />
                    <StatCard title="Tổng PnL" value={formatMoney(stats.totalPnl)} hint="Hiệu suất cộng dồn" />
                    <StatCard title="Avg Win Rate" value={`${stats.avgWinRate.toFixed(1)}%`} hint="Trung bình toàn bộ bot" />
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
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
                        <div style={{ fontSize: 14, color: "#71717a" }}>Chưa có bot trade nào</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, alignItems: "start" }}>
                        {bots.map((bot) => (
                            <BotCard key={bot.id} bot={bot} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
                        ))}
                    </div>
                )}

                {showForm && <AddBotForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}
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

function BotTradeRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M8 14l3-3 2 2 3-4" />
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
