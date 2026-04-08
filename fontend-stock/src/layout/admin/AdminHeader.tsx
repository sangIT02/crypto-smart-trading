import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "antd";
import { Bell, Search, Moon, Sun } from "lucide-react";

type HeaderTickerItem = {
    label: string;
    value: string;
    positive?: boolean;
};

const TICKER_ITEMS: HeaderTickerItem[] = [
    { label: "BTC", value: "69,850  +2.14%", positive: true },
    { label: "ETH", value: "3,515  -0.84%", positive: false },
    { label: "OI", value: "+3.2%", positive: true },
    { label: "Funding", value: "+0.0100%", positive: true },
    { label: "F&G", value: "68" },
    { label: "SOL", value: "3,515  -0.84%", positive: false },

    { label: "DOGE", value: "3,515  -0.84%", positive: false },

    { label: "LINK", value: "3,515  -0.84%", positive: false },

    { label: "UNI", value: "3,515  -0.84%", positive: false },

];

export function AdminHeader() {
    const [dark, setDark] = useState(true);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeText = useMemo(() => {
        return now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }, [now]);

    const dateText = useMemo(() => {
        return now.toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }, [now]);

    return (
        <header
            style={{
                background: "#000",
                borderBottom: "1px solid #171717",
                position: "sticky",
                top: 0,
                zIndex: 100,
                padding: "10px 18px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.24)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    minHeight: 56,
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ flex: 1, maxWidth: 420 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: "#0a0a0a",
                            border: "1px solid #1a1a1a",
                            borderRadius: 12,
                            padding: "10px 12px",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                        }}
                    >
                        <Search size={14} color="#6b7280" />
                        <input
                            style={{
                                color: "#fff",
                                fontSize: 13,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                width: "100%",
                            }}
                            placeholder="Tìm kiếm coin, tín hiệu, chiến lược..."
                        />
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        minWidth: 280,
                        maxWidth: 700,
                        overflow: "hidden",
                    }}
                >
                    <style>{`
        @keyframes ticker-scroll {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }
    `}</style>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "9px 12px",
                            borderRadius: 12,
                            background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                            border: "1px solid #1a1a1a",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 10,
                                color: "#6b7280",
                                textTransform: "uppercase",
                                letterSpacing: 1.2,
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            Live Data
                        </span>

                        <div
                            style={{
                                overflow: "hidden",
                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "max-content",
                                    gap: 14,
                                    animation: "ticker-scroll 18s linear infinite",
                                }}
                            >
                                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
                                    <div
                                        key={`${item.label}-${index}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#fafafa",
                                                fontSize: 11,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            style={{
                                                color:
                                                    item.positive === undefined
                                                        ? "#9ca3af"
                                                        : item.positive
                                                            ? "#0ECB81"
                                                            : "#F6465D",
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 0,
                    }}
                >


                    <button type="button" onClick={() => setDark((prev) => !prev)} style={iconBtnStyle}>
                        {dark ? <Moon size={16} color="#a1a1aa" /> : <Sun size={16} color="#f0b90b" />}
                    </button>

                    <button type="button" style={iconBtnStyle}>
                        <Badge
                            count={3}
                            size="small"
                            offset={[-2, 2]}
                            styles={{ indicator: { backgroundColor: "#f0b90b", color: "#111" } }}
                        >
                            <Bell size={16} color="#c4c7ce" />
                        </Badge>
                    </button>
                    <div
                        style={{
                            padding: "8px 12px",
                            borderRadius: 12,
                            background: "linear-gradient(180deg, rgba(240,185,11,0.08) 0%, rgba(240,185,11,0.03) 100%)",
                            border: "1px solid rgba(240,185,11,0.18)",
                            minWidth: 132,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                color: "#f0b90b",
                                fontSize: 13,
                                fontWeight: 700,
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                letterSpacing: 0.4,
                            }}
                        >
                            {timeText}
                        </div>
                        <div
                            style={{
                                color: "#7c828d",
                                fontSize: 10,
                                marginTop: 2,
                            }}
                        >
                            {dateText}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

const iconBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
    border: "1px solid #1a1a1a",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.15s",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
};