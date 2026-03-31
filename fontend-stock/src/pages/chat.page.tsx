import React, { useMemo, useState } from "react";
import { AppLayout } from "../layout/MainLayout";

type MessageRole = "assistant" | "user";
type AssistantStatus = "online" | "thinking" | "idle";

type ChatMessage = {
    id: number;
    role: MessageRole;
    content: string;
    timestamp: string;
};

type SuggestionItem = {
    id: number;
    title: string;
    prompt: string;
    tag: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        content:
            "Xin chào, tôi là trợ lí giao dịch của Cryptomind. Tôi có thể giúp bạn phân tích xu hướng, gợi ý quản trị rủi ro, kiểm tra tín hiệu hoặc diễn giải dữ liệu bot đang chạy.",
        timestamp: "09:30",
    },
    {
        id: 2,
        role: "user",
        content: "Đánh giá nhanh BTC/USDT hôm nay và vùng giá nào nên chú ý?",
        timestamp: "09:31",
    },
    {
        id: 3,
        role: "assistant",
        content:
            "BTC/USDT đang phù hợp với kịch bản sideway-biến động. Nên chú ý vùng hỗ trợ gần 68,200 - 68,600 và vùng kháng cự 71,800 - 72,400. Nếu giá giữ được phía trên vùng hỗ trợ, chiến lược pullback sẽ an toàn hơn đuổi breakout.",
        timestamp: "09:31",
    },
];

const SUGGESTIONS: SuggestionItem[] = [
    {
        id: 1,
        title: "Phân tích nhanh xu hướng",
        prompt: "Phân tích nhanh BTC/USDT hôm nay theo xu hướng ngắn hạn, trung hạn và vùng giá quan trọng.",
        tag: "Trend",
    },
    {
        id: 2,
        title: "Kiểm tra rủi ro lệnh",
        prompt: "Tôi muốn vào lệnh ETH/USDT, giúp tôi tính rủi ro nếu stoploss 3% và vốn 1000 USDT.",
        tag: "Risk",
    },
    {
        id: 3,
        title: "Gợi ý setup grid",
        prompt: "Đề xuất cho tôi một setup grid trading phù hợp với BTC/USDT trong thị trường sideway.",
        tag: "Grid",
    },
    {
        id: 4,
        title: "Đọc tín hiệu bot",
        prompt: "Giải thích cho tôi tín hiệu hiện tại của bot và trạng thái nên tiếp tục hay tạm dừng.",
        tag: "Bot",
    },
];

export const ChatBot = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<AssistantStatus>("online");

    const stats = useMemo(() => {
        return {
            totalMessages: messages.length,
            userMessages: messages.filter((m) => m.role === "user").length,
            assistantMessages: messages.filter((m) => m.role === "assistant").length,
        };
    }, [messages]);

    function sendMessage(prefilled?: string) {
        const text = (prefilled ?? input).trim();
        if (!text) return;

        const now = new Date();
        const time = now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: "user",
            content: text,
            timestamp: time,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setStatus("thinking");

        setTimeout(() => {
            const reply: ChatMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content:
                    "Tôi đã nhận câu hỏi của bạn. Với tình huống này, bạn nên kết hợp xu hướng chính, khối lượng, vùng hỗ trợ/kháng cự và mức rủi ro tối đa trước khi vào lệnh. Nếu cần, tôi có thể tiếp tục tách ra thành kịch bản buy, sell và quản trị vốn cụ thể.",
                timestamp: new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, reply]);
            setStatus("online");
        }, 900);
    }

    return (
        <AppLayout>
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
                            <BotRoundIcon />
                            <span
                                style={{
                                    fontSize: 10,
                                    color: "#6b7280",
                                    letterSpacing: 3,
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                }}
                            >
                                Trading Assistant
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
                            Trợ lí giao dịch
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setMessages(INITIAL_MESSAGES);
                            setInput("");
                            setStatus("idle");
                        }}
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
                        <span style={{ fontSize: 16, lineHeight: 1 }}>↺</span>
                        Cuộc trò chuyện mới
                    </button>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.9fr)",
                        gap: 16,
                        alignItems: "start",
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                            border: "1px solid #1a1a1a",
                            borderRadius: 18,
                            overflow: "hidden",
                            boxShadow: "0 0 0 1px rgba(255,255,255,0.015), 0 10px 30px rgba(0,0,0,0.35)",
                            minHeight: 720,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                padding: "14px 16px",
                                borderBottom: "1px solid #161616",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 12,
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>Phiên trò chuyện</div>
                                <div style={{ fontSize: 11, color: "#71717a", lineHeight: 1.6 }}>
                                    Bạn có thể hỏi về trend, entry, risk hoặc chiến lược bot.
                                </div>
                            </div>

                            <AssistantStatusPill status={status} />
                        </div>

                        <div
                            style={{
                                padding: 16,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                flex: 1,
                                minHeight: 0,
                                overflowY: "auto",
                                background: "radial-gradient(circle at top, rgba(240,185,11,0.04) 0%, rgba(0,0,0,0) 35%)",
                            }}
                        >
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}
                        </div>

                        <div
                            style={{
                                padding: 16,
                                borderTop: "1px solid #161616",
                                background: "#060606",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    alignItems: "flex-end",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        background: "#050505",
                                        border: "1px solid #1a1a1a",
                                        borderRadius: 14,
                                        padding: "12px 14px",
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                                    }}
                                >
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Nhập câu hỏi cho trợ lí giao dịch..."
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            resize: "none",
                                            border: "none",
                                            outline: "none",
                                            background: "transparent",
                                            color: "#f3f4f6",
                                            fontSize: 13,
                                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                                            lineHeight: 1.7,
                                        }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim()}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        cursor: !input.trim() ? "not-allowed" : "pointer",
                                        background: !input.trim()
                                            ? "#1a1a1a"
                                            : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
                                        border: !input.trim() ? "1px solid #242424" : "1px solid #e0ae10",
                                        color: !input.trim() ? "#666" : "#111",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: !input.trim() ? "none" : "0 8px 22px rgba(240,185,11,0.16)",
                                        flexShrink: 0,
                                    }}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>


                        <div
                            style={{
                                background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                                border: "1px solid #1a1a1a",
                                borderRadius: 18,
                                padding: 16,
                                boxShadow: "0 0 0 1px rgba(255,255,255,0.015)",
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa", marginBottom: 12 }}>Gợi ý nhanh</div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {SUGGESTIONS.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => sendMessage(item.prompt)}
                                        style={{
                                            textAlign: "left",
                                            background: "#070707",
                                            border: "1px solid #171717",
                                            borderRadius: 14,
                                            padding: "12px 12px",
                                            cursor: "pointer",
                                            transition: "all 0.15s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "#4a380e";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "#171717";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                                            <div style={{ fontSize: 12, color: "#f3f4f6", fontWeight: 600 }}>{item.title}</div>
                                            <span style={tagGoldStyle}>{item.tag}</span>
                                        </div>
                                        <div style={{ fontSize: 11, color: "#8b8f97", lineHeight: 1.7 }}>{item.prompt}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            style={{
                                background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
                                border: "1px solid #1a1a1a",
                                borderRadius: 18,
                                padding: 16,
                                boxShadow: "0 0 0 1px rgba(255,255,255,0.015)",
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#fafafa", marginBottom: 12 }}>Khả năng hỗ trợ</div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <FeatureRow title="Trend Analysis" desc="Đánh giá xu hướng ngắn hạn và vùng giá quan trọng." />
                                <FeatureRow title="Risk Management" desc="Gợi ý stoploss, risk per trade và quản trị vốn." />
                                <FeatureRow title="Grid Setup" desc="Đề xuất khoảng giá, số grid và logic phù hợp sideway." />
                                <FeatureRow title="Bot Review" desc="Diễn giải trạng thái bot, tín hiệu và hiệu suất hiện tại." />
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "14px 16px",
                                borderRadius: 14,
                                background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
                                border: "1px solid #1a1a1a",
                                display: "flex",
                                gap: 12,
                            }}
                        >
                            <span style={{ fontSize: 16, flexShrink: 0 }}>🧠</span>
                            <div style={{ fontSize: 11, color: "#8b8f97", lineHeight: 1.8 }}>
                                Trợ lí giao dịch chỉ nên đóng vai trò hỗ trợ phân tích và ra quyết định. Không nên xem đây là khuyến nghị đầu tư tuyệt đối.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

function AssistantStatusPill({ status }: { status: AssistantStatus }) {
    const config = {
        online: {
            label: "ONLINE",
            bg: "#07130b",
            border: "#16371f",
            color: "#4ade80",
            dot: "#22c55e",
        },
        thinking: {
            label: "THINKING",
            bg: "#171107",
            border: "#4a380e",
            color: "#f0b90b",
            dot: "#f0b90b",
        },
        idle: {
            label: "IDLE",
            bg: "#161616",
            border: "#2a2a2a",
            color: "#a1a1aa",
            dot: "#71717a",
        },
    }[status];

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: config.bg,
                border: `1px solid ${config.border}`,
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
                    background: config.dot,
                    boxShadow: status === "online" ? "0 0 8px rgba(34,197,94,0.65)" : "none",
                }}
            />
            <span
                style={{
                    fontSize: 10,
                    color: config.color,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    letterSpacing: 0.8,
                }}
            >
                {config.label}
            </span>
        </div>
    );
}

function MessageBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
            }}
        >
            <div
                style={{
                    maxWidth: "82%",
                    background: isUser
                        ? "linear-gradient(180deg, rgba(240,185,11,0.14) 0%, rgba(240,185,11,0.06) 100%)"
                        : "linear-gradient(180deg, #101010 0%, #070707 100%)",
                    border: isUser ? "1px solid rgba(240,185,11,0.22)" : "1px solid #1a1a1a",
                    borderRadius: 16,
                    padding: "12px 14px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 8,
                    }}
                >
                    <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: isUser ? "#f0b90b" : "#71717a", fontWeight: 700 }}>
                        {isUser ? "Bạn" : "Assistant"}
                    </div>
                    <div style={{ fontSize: 10, color: "#6b7280" }}>{message.timestamp}</div>
                </div>

                <div style={{ fontSize: 13, color: "#e5e7eb", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{message.content}</div>
            </div>
        </div>
    );
}

function StatMini({ title, value }: { title: string; value: string | number }) {
    return (
        <div style={{ background: "#050505", border: "1px solid #161616", borderRadius: 12, padding: "12px 12px" }}>
            <div style={{ fontSize: 10, color: "#6b7280", letterSpacing: 1.1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
                {title}
            </div>
            <div style={{ fontSize: 18, color: "#fafafa", fontWeight: 700 }}>{value}</div>
        </div>
    );
}

function FeatureRow({ title, desc }: { title: string; desc: string }) {
    return (
        <div style={{ background: "#070707", border: "1px solid #171717", borderRadius: 14, padding: "12px 12px" }}>
            <div style={{ fontSize: 12, color: "#f3f4f6", fontWeight: 600, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 11, color: "#8b8f97", lineHeight: 1.7 }}>{desc}</div>
        </div>
    );
}

const tagGoldStyle: React.CSSProperties = {
    fontSize: 10,
    padding: "4px 9px",
    borderRadius: 999,
    background: "#171107",
    border: "1px solid #4a380e",
    color: "#f0b90b",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    letterSpacing: 0.3,
};

function BotRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <path d="M12 4v4" />
            <path d="M9 14h.01" />
            <path d="M15 14h.01" />
            <path d="M8 2h8" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22 11 13 2 9 22 2z" />
        </svg>
    );
}
