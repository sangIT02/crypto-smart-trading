import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "antd";
import { Bell, Search, Moon, Sun, KeyRound, Sparkles, Activity } from "lucide-react";

export function AppHeader() {
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
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexShrink: 0,
                        padding: "8px 12px",
                        borderRadius: 14,
                        border: "1px solid #1f1f1f",
                        background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                    }}
                >
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: "linear-gradient(180deg, rgba(240,185,11,0.16) 0%, rgba(240,185,11,0.05) 100%)",
                            border: "1px solid rgba(240,185,11,0.28)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#f0b90b",
                            flexShrink: 0,
                        }}
                    >
                        <KeyRound size={16} />
                    </div>

                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 2,
                            }}
                        >
                            <span
                                style={{
                                    color: "#fafafa",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    letterSpacing: 0.4,
                                }}
                            >
                                CRYPTOMIND
                            </span>

                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "2px 8px",
                                    borderRadius: 999,
                                    background: "#171107",
                                    border: "1px solid #4a380e",
                                    color: "#f0b90b",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 0.6,
                                }}
                            >
                                <Sparkles size={10} />
                                PRO
                            </span>
                        </div>

                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: 11,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#22c55e",
                                    boxShadow: "0 0 10px rgba(34,197,94,0.7)",
                                }}
                            />
                            Hệ thống đang hoạt động
                        </div>
                    </div>
                </div>

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

                <div style={{ flex: 1 }} />

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 12,
                            background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                            border: "1px solid #1a1a1a",
                            color: "#e5e7eb",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                        }}
                    >
                        <Activity size={14} color="#f0b90b" />
                        <div style={{ lineHeight: 1.1 }}>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#fafafa",
                                    fontWeight: 600,
                                }}
                            >
                                Market 24/7
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#6b7280",
                                }}
                            >
                                Crypto never sleeps
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "8px 12px",
                            borderRadius: 12,
                            background: "linear-gradient(180deg, rgba(240,185,11,0.08) 0%, rgba(240,185,11,0.03) 100%)",
                            border: "1px solid rgba(240,185,11,0.18)",
                            minWidth: 132,
                            textAlign: "right",
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
