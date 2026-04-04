import React, { useMemo, useState } from "react";

type AlertCondition = ">=" | "<=" | "crosses";
type AlertStatus = "active" | "paused" | "triggered";

type PriceAlertItem = {
    id: number;
    symbol: string;
    condition: AlertCondition;
    targetPrice: number;
    currentPrice: number;
    note: string;
    createdAt: string;
    status: AlertStatus;
    repeat: boolean;
};

type StatusBadgeProps = {
    status: AlertStatus;
};

type AlertCardProps = {
    alert: PriceAlertItem;
    onDelete: (id: number) => void;
    onToggleStatus: (id: number) => void;
};

type AddAlertFormProps = {
    onAdd: (item: PriceAlertItem) => void;
    onCancel: () => void;
};

const MOCK_ALERTS: PriceAlertItem[] = [
    {
        id: 1,
        symbol: "BTC/USDT",
        condition: ">=",
        targetPrice: 72000,
        currentPrice: 69850,
        note: "Breakout vùng kháng cự",
        createdAt: "31/03/2026",
        status: "active",
        repeat: false,
    },
    {
        id: 2,
        symbol: "ETH/USDT",
        condition: "<=",
        targetPrice: 3450,
        currentPrice: 3515,
        note: "Canh mua lại",
        createdAt: "31/03/2026",
        status: "paused",
        repeat: true,
    },
    {
        id: 3,
        symbol: "SOL/USDT",
        condition: "crosses",
        targetPrice: 185,
        currentPrice: 186.2,
        note: "Momentum mạnh",
        createdAt: "30/03/2026",
        status: "triggered",
        repeat: false,
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

function StatusBadge({ status }: StatusBadgeProps) {
    const map = {
        active: {
            text: "ACTIVE",
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
        triggered: {
            text: "TRIGGERED",
            bg: "#171107",
            border: "#4a380e",
            color: "#f0b90b",
            dot: "#f0b90b",
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
                    boxShadow: status === "active" ? "0 0 8px rgba(34,197,94,0.65)" : "none",
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

function StatCard({
    title,
    value,
    hint,
}: {
    title: string;
    value: string | number;
    hint: string;
}) {
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

function AlertCard({ alert, onDelete, onToggleStatus }: AlertCardProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const distance = useMemo(() => {
        const diff = alert.targetPrice - alert.currentPrice;
        const pct = (Math.abs(diff) / alert.currentPrice) * 100;
        return { diff, pct };
    }, [alert.currentPrice, alert.targetPrice]);

    const directionText =
        alert.condition === ">="
            ? "Khi giá lớn hơn hoặc bằng"
            : alert.condition === "<="
                ? "Khi giá nhỏ hơn hoặc bằng"
                : "Khi giá cắt qua";

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
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                            marginBottom: 4,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#f5f5f5",
                            }}
                        >
                            {alert.symbol}
                        </div>
                        <StatusBadge status={alert.status} />
                    </div>

                    <div
                        style={{
                            fontSize: 11,
                            color: "#71717a",
                            lineHeight: 1.7,
                        }}
                    >
                        Tạo lúc {alert.createdAt}
                    </div>
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
                <MiniInfo label="Điều kiện" value={`${directionText} ${formatPrice(alert.targetPrice)}`} />
                <MiniInfo label="Giá hiện tại" value={formatPrice(alert.currentPrice)} />
                <MiniInfo
                    label="Khoảng cách"
                    value={`${distance.diff > 0 ? "+" : ""}${formatPrice(distance.diff)} (${distance.pct.toFixed(2)}%)`}
                />
                <MiniInfo label="Lặp lại" value={alert.repeat ? "Bật" : "Tắt"} />
            </div>

            {alert.note && (
                <div
                    style={{
                        marginBottom: 12,
                        background: "#070707",
                        border: "1px solid #171717",
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
                        Ghi chú
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            color: "#b4b8c0",
                            lineHeight: 1.7,
                        }}
                    >
                        {alert.note}
                    </div>
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={tagStyle}>{alert.condition}</span>
                    <span style={tagStyle}>{alert.symbol}</span>
                    <span style={alert.repeat ? tagGoldStyle : tagStyle}>{alert.repeat ? "Repeat On" : "One-time"}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                        type="button"
                        onClick={() => onToggleStatus(alert.id)}
                        style={{
                            ...smallBtn,
                            color: alert.status === "active" ? "#a1a1aa" : "#f0b90b",
                            borderColor: alert.status === "active" ? "#242424" : "#4a380e",
                            background: alert.status === "active" ? "#0a0a0a" : "#171107",
                        }}
                    >
                        {alert.status === "active" ? "Tạm dừng" : "Bật lại"}
                    </button>

                    {confirmDelete ? (
                        <div style={{ display: "flex", gap: 6 }}>
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                style={{
                                    ...smallBtn,
                                    color: "#9ca3af",
                                    borderColor: "#242424",
                                    background: "#0a0a0a",
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(alert.id)}
                                style={{
                                    ...smallBtn,
                                    color: "#fca5a5",
                                    borderColor: "#4c1010",
                                    background: "#190707",
                                }}
                            >
                                Xóa
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            style={{
                                ...smallBtn,
                                color: "#8b8f97",
                                borderColor: "#222",
                                background: "#0a0a0a",
                            }}
                        >
                            Xóa cảnh báo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function MiniInfo({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
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

function AddAlertForm({ onAdd, onCancel }: AddAlertFormProps) {
    const [symbol, setSymbol] = useState("BTC/USDT");
    const [condition, setCondition] = useState<AlertCondition>(">=");
    const [targetPrice, setTargetPrice] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [note, setNote] = useState("");
    const [repeat, setRepeat] = useState(false);
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!targetPrice || !currentPrice) return;

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));

        onAdd({
            id: Date.now(),
            symbol,
            condition,
            targetPrice: Number(targetPrice),
            currentPrice: Number(currentPrice),
            note,
            createdAt: new Date().toLocaleDateString("vi-VN"),
            status: "active",
            repeat,
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
                    maxWidth: 640,
                    background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                    border: "1px solid #1d1d1d",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.015), 0 12px 32px rgba(0,0,0,0.45)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "#f5f5f5",
                                fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                            }}
                        >
                            Thêm cảnh báo mới
                        </div>
                        <div
                            style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: "#71717a",
                                lineHeight: 1.6,
                            }}
                        >
                            Tạo cảnh báo giá theo phong cách giống trang thêm API key.
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            ...iconBtn,
                            width: 32,
                            height: 32,
                            color: "#9ca3af",
                            flexShrink: 0,
                        }}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 12,
                        marginBottom: 12,
                    }}
                >
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
                        <label style={fieldLabel}>ĐIỀU KIỆN</label>
                        <select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)} style={inputStyle}>
                            <option value=">=" style={{ background: "#050505", color: "#fff" }}>
                                Giá &gt;=
                            </option>
                            <option value="<=" style={{ background: "#050505", color: "#fff" }}>
                                Giá &lt;=
                            </option>
                            <option value="crosses" style={{ background: "#050505", color: "#fff" }}>
                                Giá cắt qua
                            </option>
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 12,
                        marginBottom: 12,
                    }}
                >
                    <div>
                        <label style={fieldLabel}>GIÁ MỤC TIÊU</label>
                        <input
                            type="number"
                            placeholder="Ví dụ: 72000"
                            value={targetPrice}
                            onChange={(e) => setTargetPrice(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={fieldLabel}>GIÁ HIỆN TẠI</label>
                        <input
                            type="number"
                            placeholder="Ví dụ: 69850"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={fieldLabel}>GHI CHÚ</label>
                    <textarea
                        placeholder="Ví dụ: cảnh báo breakout, vào lệnh, chốt lời..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                        }}
                    />
                </div>

                <label
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 16,
                        cursor: "pointer",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={repeat}
                        onChange={(e) => setRepeat(e.target.checked)}
                        style={{ marginTop: 2, accentColor: "#f0b90b" }}
                    />
                    <span
                        style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            lineHeight: 1.7,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                        }}
                    >
                        Lặp lại cảnh báo sau khi được kích hoạt. Tắt nếu chỉ muốn nhận 1 lần.
                    </span>
                </label>

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
                    <span style={{ fontSize: 14, flexShrink: 0 }}>🔔</span>
                    <div
                        style={{
                            fontSize: 11,
                            color: "#d6a728",
                            lineHeight: 1.7,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                        }}
                    >
                        Cảnh báo giá chỉ là tín hiệu nhắc nhở. Không đảm bảo khớp đúng thời điểm biến động mạnh hoặc chênh lệch giá cực nhanh.
                    </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            ...smallBtn,
                            flex: 1,
                            padding: "11px 0",
                            justifyContent: "center",
                            color: "#a1a1aa",
                            borderColor: "#222",
                            background: "#080808",
                        }}
                    >
                        Hủy
                    </button>

                    <button
                        type="button"
                        onClick={submit}
                        disabled={!targetPrice || !currentPrice || loading}
                        style={{
                            flex: 2,
                            padding: "11px 0",
                            borderRadius: 10,
                            cursor: !targetPrice || !currentPrice || loading ? "not-allowed" : "pointer",
                            background:
                                !targetPrice || !currentPrice || loading
                                    ? "#1a1a1a"
                                    : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
                            border:
                                !targetPrice || !currentPrice || loading
                                    ? "1px solid #242424"
                                    : "1px solid #e0ae10",
                            color: !targetPrice || !currentPrice || loading ? "#666" : "#111",
                            fontSize: 13,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                            fontWeight: 700,
                            opacity: !targetPrice || !currentPrice ? 0.7 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow:
                                !targetPrice || !currentPrice || loading
                                    ? "none"
                                    : "0 8px 22px rgba(240,185,11,0.16)",
                        }}
                    >
                        {loading ? (
                            <>
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 12,
                                        height: 12,
                                        border: "2px solid rgba(0,0,0,0.2)",
                                        borderTopColor: "#111",
                                        borderRadius: "50%",
                                        animation: "spin 0.8s linear infinite",
                                    }}
                                />
                                Đang tạo...
                            </>
                        ) : (
                            "Tạo cảnh báo"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PriceAlertsPage() {
    const [alerts, setAlerts] = useState<PriceAlertItem[]>(MOCK_ALERTS);
    const [showForm, setShowForm] = useState(false);

    const stats = useMemo(() => {
        return {
            total: alerts.length,
            active: alerts.filter((a) => a.status === "active").length,
            paused: alerts.filter((a) => a.status === "paused").length,
            triggered: alerts.filter((a) => a.status === "triggered").length,
        };
    }, [alerts]);

    function handleAdd(newAlert: PriceAlertItem) {
        setAlerts((prev) => [newAlert, ...prev]);
        setShowForm(false);
    }

    function handleDelete(id: number) {
        setAlerts((prev) => prev.filter((item) => item.id !== id));
    }

    function handleToggleStatus(id: number) {
        setAlerts((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                if (item.status === "triggered") return { ...item, status: "active" as AlertStatus };
                return {
                    ...item,
                    status: item.status === "active" ? "paused" : "active",
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
                            <BellRoundIcon />
                            <span
                                style={{
                                    fontSize: 10,
                                    color: "#6b7280",
                                    letterSpacing: 3,
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                }}
                            >
                                Price Alerts
                            </span>
                        </div>

                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                margin: 0,
                                color: "#fafafa",
                                letterSpacing: -0.3,
                            }}
                        >
                            Quản lí cảnh báo giá
                        </h1>

                        <p
                            style={{
                                fontSize: 13,
                                color: "#8b8f97",
                                marginTop: 8,
                                lineHeight: 1.7,
                                maxWidth: 620,
                            }}
                        >
                            Theo dõi các mức giá quan trọng để nhận cảnh báo breakout, pullback hoặc vùng chốt lời.
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
                        Thêm cảnh báo mới
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                        gap: 12,
                        marginBottom: 18,
                    }}
                >
                    <StatCard title="Tổng cảnh báo" value={stats.total} hint="Tất cả alerts đã tạo" />
                    <StatCard title="Đang bật" value={stats.active} hint="Đang theo dõi realtime" />
                    <StatCard title="Tạm dừng" value={stats.paused} hint="Chưa nhận thông báo" />
                    <StatCard title="Đã kích hoạt" value={stats.triggered} hint="Đã chạm điều kiện" />
                </div>

                {alerts.length === 0 ? (
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
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                        <div style={{ fontSize: 14, color: "#71717a" }}>Chưa có cảnh báo nào</div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: 14,
                            alignItems: "start",
                        }}
                    >
                        {alerts.map((alert) => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>
                )}

                {showForm && <AddAlertForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}
            </div>
    );
}

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

function BellRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
            <path d="M10 21a2 2 0 0 0 4 0" />
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
