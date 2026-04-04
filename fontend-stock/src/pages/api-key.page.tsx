import React, { useEffect, useState } from "react";
import { apiKeyService } from "../services/apiKeyService";
import { keyAccountService } from "../services/keyAccountService";

type ApiKeyItem = {
    id: string;
    nameAccount: string;
    apiKey: string;
    secretKey: string;
    isActive: boolean;
    createdAt: string;
};



type KeyCardProps = {
    keyData: ApiKeyItem;

};
type AddKeyFormProps = {
    setKeyData: (keyData: ApiKeyItem) => void;
    onCancel: () => void;
};


function maskKey(key: string) {
    if (key.length <= 10) return key;
    return key.slice(0, 6) + "••••••••••••••••" + key.slice(-4);
}


function KeyCard({ keyData }: KeyCardProps) {
    console.log(keyData)
    const [visibleApi, setVisibleApi] = useState(false);
    const [visibleSecret, setVisibleSecret] = useState(false);
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
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.borderColor = "#2a2a2a";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1a1a1a";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                    gap: 12,
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#f5f5f5",
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                        }}
                    >
                        {keyData.nameAccount}
                    </div>

                    <div
                        style={{
                            fontSize: 11,
                            color: "#71717a",
                            marginTop: 2,
                        }}
                    >
                        Tạo lúc {keyData.createdAt}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: keyData.isActive ? "#07130b" : "#151515",
                        border: keyData.isActive ? "1px solid #16371f" : "1px solid #262626",
                        borderRadius: 999,
                        padding: "4px 10px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: keyData.isActive ? "#22c55e" : "#525252",
                            boxShadow: keyData.isActive ? "0 0 8px rgba(34,197,94,0.65)" : "none",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 10,
                            color: keyData.isActive ? "#4ade80" : "#a1a1aa",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            letterSpacing: 0.8,
                        }}
                    >
                        {keyData.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                </div>
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
    <div>
        <div
            style={{
                fontSize: 10,
                color: "#6b7280",
                letterSpacing: 1.1,
                textTransform: "uppercase",
                marginBottom: 4,
            }}
        >
            API Key
        </div>
        <div
            style={{
                fontSize: 12,
                color: "#e5e7eb",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                background: "#080808",
                border: "1px solid #1f1f1f",
                borderRadius: 10,
                padding: "10px 12px",
                wordBreak: "break-all",
            }}
        >
            {visibleApi ? keyData.apiKey : maskKey(keyData.apiKey)}
        </div>
    </div>

    <div>
        <div
            style={{
                fontSize: 10,
                color: "#6b7280",
                letterSpacing: 1.1,
                textTransform: "uppercase",
                marginBottom: 4,
            }}
        >
            Secret Key
        </div>
        <div
            style={{
                fontSize: 12,
                color: "#e5e7eb",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                background: "#080808",
                border: "1px solid #1f1f1f",
                borderRadius: 10,
                padding: "10px 12px",
                wordBreak: "break-all",
            }}
        >
            {visibleSecret ? keyData.secretKey : maskKey(keyData.secretKey)}
        </div>
    </div>
</div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 12,
                    gap: 12,
                    flexWrap: "wrap",
                }}
            >

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

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
                            Xóa kết nối
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


function AddKeyForm({ setKeyData, onCancel }: AddKeyFormProps) {
    const [label, setLabel] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [secretKey, setSecretKey] = useState<string>("");

    const [showSecret, setShowSecret] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!label || !apiKey || !secretKey || !agreed) return;

        setLoading(true);
        const response = await apiKeyService.addKey( label, apiKey, secretKey );
        console.log(response.data.data);
        const key:ApiKeyItem = await response.data.data
        setKeyData({
            id :key.id,
            apiKey: key.apiKey,
            secretKey: key.secretKey,
            nameAccount: key.nameAccount,
            isActive: key.isActive,
            createdAt: key.createdAt,
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
                    maxWidth: 560,
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
                            Thêm kết nối mới
                        </div>
                        <div
                            style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: "#71717a",
                                lineHeight: 1.6,
                            }}
                        >
                            Nhập API key để kết nối tài khoản với hệ thống.
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

                <div style={{ marginBottom: 12 }}>
                    <label style={fieldLabel}>TÊN GỢI NHỚ</label>
                    <input
                        placeholder="vd: Main account"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={fieldLabel}>API KEY</label>
                    <input
                        placeholder="Dán API key vào đây"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        style={{
                            ...inputStyle,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            fontSize: 12,
                        }}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={fieldLabel}>SECRET KEY</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showSecret ? "text" : "password"}
                            placeholder="Dán Secret key vào đây"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            style={{
                                ...inputStyle,
                                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                fontSize: 12,
                                paddingRight: 42,
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowSecret((v) => !v)}
                            style={{
                                position: "absolute",
                                right: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#6b7280",
                                padding: 2,
                            }}
                        >
                            {showSecret ? <EyeOff /> : <Eye />}
                        </button>
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
                    <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                    <div
                        style={{
                            fontSize: 11,
                            color: "#d6a728",
                            lineHeight: 1.7,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                        }}
                    >
                        Chỉ cấp quyền <strong style={{ color: "#f0b90b" }}>Read + Trade</strong>. Tuyệt đối <strong style={{ color: "#f0b90b" }}>không cấp quyền Withdraw</strong>.
                    </div>
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
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
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
                        Tôi hiểu rằng API key được mã hóa và lưu trữ an toàn. Tôi chịu trách nhiệm về quyền truy cập của key này.
                    </span>
                </label>

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
                        disabled={!label || !apiKey || !secretKey || !agreed || loading}
                        style={{
                            flex: 2,
                            padding: "11px 0",
                            borderRadius: 10,
                            cursor: !label || !apiKey || !secretKey || !agreed || loading ? "not-allowed" : "pointer",
                            background: !label || !apiKey || !secretKey || !agreed || loading ? "#1a1a1a" : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
                            border: !label || !apiKey || !secretKey || !agreed || loading ? "1px solid #242424" : "1px solid #e0ae10",
                            color: !label || !apiKey || !secretKey || !agreed || loading ? "#666" : "#111",
                            fontSize: 13,
                            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                            fontWeight: 700,
                            opacity: !label || !apiKey || !secretKey || !agreed ? 0.7 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow: !label || !apiKey || !secretKey || !agreed || loading ? "none" : "0 8px 22px rgba(240,185,11,0.16)",
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
                                Đang xác minh...
                            </>
                        ) : (
                            "Xác minh & Lưu"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ApiKeyPage() {
    const [key, setKeyData] = useState<ApiKeyItem>();
    const [showForm, setShowForm] = useState(false);

    const fetchKeyItem = async () => {
        const response = await apiKeyService.getKeys()
        const data:ApiKeyItem = await response.data.data
        setKeyData({
            id: data.id,
            apiKey: data.apiKey,
            secretKey: data.secretKey,
            nameAccount: data.nameAccount,
            isActive: data.isActive,
            createdAt: data.createdAt,
        })
    }
    useEffect(() => {
        fetchKeyItem()
    },[])


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
            input { outline: none; }
            input:focus {
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
                        marginBottom: 24,
                    }}
                >
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <KeyRoundIcon />
                            <span
                                style={{
                                    fontSize: 10,
                                    color: "#6b7280",
                                    letterSpacing: 3,
                                    textTransform: "uppercase",
                                    fontWeight: 600,
                                }}
                            >
                                API Keys
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
                            Quản lý API Keys
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
                            Quản lý API key kết nối với hệ thống. Keys được mã hóa AES-256.
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
                        Thêm kết nối mới
                    </button>
                </div>

                {key === null ? (
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
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔑</div>
                        <div style={{ fontSize: 14, color: "#71717a" }}>Chưa có kết nối nào</div>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: 16,
                        }}
                    >
                        {key && (
                            <KeyCard  key={key.nameAccount} keyData={key} />
                        )}
                    </div>
                )}


                {showForm && <AddKeyForm setKeyData={setKeyData} onCancel={() => setShowForm(false)} />}
            </div>
    );
}

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

function Eye() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOff() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

function Copy() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function Check() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function KeyRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="m21 2-9.6 9.6" />
            <path d="m15.5 7.5 3 3L22 7l-3-3" />
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
