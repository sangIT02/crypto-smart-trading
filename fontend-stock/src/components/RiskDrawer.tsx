import { useEffect, useState } from "react";
import type { PredictionData, Signal } from "../pages/ai-prediction.page";
import axios from "axios";
type RiskDrawerProps = {
    open: boolean;
    onClose: () => void;
    prediction: PredictionData
    result: DataAnalyze | null;
    setResult: (data: DataAnalyze) => void;
};

const riskColors: Record<"low" | "medium" | "high", string> = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
};

type RiskResult = {
    verdict: "NÊN VÀO LỆNH" | "CẦN THẬN" | "KHÔNG NÊN";
    verdictReason: string;
    leverage: number;
    leverageReason: string;
    entryPrice: number;
    stopLoss: number;
    stopLossPercent: number;
    takeProfit1: number;
    takeProfit2: number;
    takeProfit3: number;
    tpPercent1: number;
    tpPercent2: number;
    tpPercent3: number;
    riskRewardRatio: number;
    maxLoss: number;
    positionSize: number;
    positionSizePercent: number;
    warnings: string[];
    analysis: string;
};


export type DataAnalyze = {
    verdict: string;
    verdictReason: string;

    leverage: number;
    leverageReason: string;

    entryPrice: number;
    stopLoss: number;
    stopLossPercent: number;

    takeProfit1: number;
    takeProfit2: number;
    takeProfit3: number;

    tpPercent1: number;
    tpPercent2: number;
    tpPercent3: number;

    riskRewardRatio: number;

    maxLoss: number;
    positionSize: number;
    positionSizePercent: number;

    warnings: string[];

    analysis: string;
};
export default function RiskDrawer({ open, onClose, prediction,result, setResult }: RiskDrawerProps) {
    const [capital, setCapital] = useState("1000");
    const [risk, setRisk] = useState<string>("medium");
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    // const [result, setResult] = useState<RiskResult>();
    const [analyzePredict, setAnalyzePredict] = useState<PredictionData>(prediction)
    //const [result, setResult] = useState<DataAnalyze | null>(null);
    const fetchAnalyzeData = async () => {
        try {
            setLoading(true); // 🔥 set trước khi gọi API
    
            const url = `http://localhost:8080/chat`;
    
            const body = {
                prediction: prediction,
                capital: Number(capital),
                risk: risk
            };
    
            const response = await axios.post(url, body);
            const data = response.data;
            setResult(data);    
            console.log(result)
        } catch (err) {
            console.error("API ERROR:", err);
        } finally {
            setLoading(false); // 🔥 luôn tắt loading
        }
    };

    if (!open) return null;
    const verdictStyle = result ? {
        "NÊN VÀO LỆNH": { bg: "#052e16", border: "#22c55e", color: "#4ade80", icon: "✓" },
        "CẦN THẬN": { bg: "#431407", border: "#f59e0b", color: "#fbbf24", icon: "⚠" },
        "KHÔNG NÊN": { bg: "#450a0a", border: "#ef4444", color: "#f87171", icon: "✕" },
    }[result.verdict] : null;


    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 999,
                    overflowY: "auto"
                }}
            />

            {/* Drawer */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "45vw",
                    height: "100vh",
                    background: "#0a0a0f",
                    borderLeft: "1px solid #1e293b",
                    zIndex: 1000,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    animation: "slideIn 0.25s ease",
                    overflowY: "auto"

                }}
            >
                <style>
                    {`@keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }}`}
                </style>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                            <span style={{ fontSize: 11, color: "#64748b", letterSpacing: 3, textTransform: "uppercase" }}>Risk Management AI</span>
                        </div>
                        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#f1f5f9", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            Phân tích rủi ro giao dịch
                        </h1>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff" }}>
                        ✕
                    </button>
                </div>


                {/* Signal info */}
                <div style={{
                    background: "#0f0f1a",
                    border: "1px solid #1e293b",
                    borderRadius: 10,
                    padding: "16px",
                    marginBottom: 16,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                }}>
                    <div>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: 1 }}>TÍN HIỆU</div>
                        <div style={{
                            fontSize: 20, fontWeight: 600,
                            color: analyzePredict.signal === "SHORT" ? "#f87171" : "#4ade80",
                        }}>
                            <span style={{ color: analyzePredict.signal === "SHORT" ? "#f6465d" : analyzePredict.signal === "LONG" ? "#0ecb81" : "#ef9f27" }}>
                                {analyzePredict.signal === "SHORT" ? "▼ SHORT" :
                                    analyzePredict.signal === "LONG" ? "▲ LONG" :
                                        "— FLAT"}
                            </span>                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: 1 }}>GIÁ DỰ BÁO</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>
                            ${analyzePredict.predictedPrice.toLocaleString()}
                        </div>
                        <div style={{
                            fontSize: 11,
                            color: Number(analyzePredict.changePercent) > 0 ? '#0ecb81' : Number(analyzePredict.changePercent) < 0 ? '#f6465d' : '#facc15'
                        }}>
                            {Number(analyzePredict.changePercent) > 0 ? `+${analyzePredict.changePercent}%` :
                                Number(analyzePredict.changePercent) < 0 ? `${analyzePredict.changePercent}%` :
                                    `${analyzePredict.changePercent}%`}
                        </div>                    </div>
                    <div>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: 1 }}>ĐỘ TIN CẬY</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: Number(analyzePredict.confidence) >= 65 ? "#4ade80" : "#f59e0b" }}>
                            {analyzePredict.confidence}%
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div style={{
                    background: "#0f0f1a",
                    border: "1px solid #1e293b",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 16,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                }}>
                    <div>
                        <label style={{ fontSize: 10, color: "#475569", letterSpacing: 1, display: "block", marginBottom: 6 }}>VỐN (USDT)</label>
                        <input
                            type="number"
                            value={capital}
                            onChange={e => setCapital(e.target.value)}
                            style={{
                                width: "100%", background: "#1e293b", border: "1px solid #334155",
                                borderRadius: 6, padding: "8px 10px", color: "#e2e8f0",
                                fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 10, color: "#475569", letterSpacing: 1, display: "block", marginBottom: 6 }}>RỦI RO</label>
                        <div style={{ display: "flex", gap: 6 }}>
                            {(["low", "medium", "high"] as const).map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRisk(r)}
                                    style={{
                                        flex: 1, padding: "8px 0", borderRadius: 6, cursor: "pointer",
                                        border: risk === r ? `1px solid ${riskColors[r]}` : "1px solid #1e293b",
                                        background: risk === r ? `${riskColors[r]}18` : "#1e293b",
                                        color: risk === r ? riskColors[r] : "#475569",
                                        fontSize: 11, fontFamily: "inherit", fontWeight: risk === r ? 600 : 400,
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {r === "low" ? "Thấp" : r === "medium" ? "Trung" : "Cao"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={fetchAnalyzeData}
                    disabled={loading || !capital}
                    style={{
                        width: "100%", padding: "12px", borderRadius: 8, cursor: loading ? "wait" : "pointer",
                        background: loading ? "#1e293b" : "#4f46e5",
                        border: "none", color: "#fff", fontSize: 13,
                        fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600,
                        letterSpacing: 1, transition: "all 0.2s",
                        opacity: loading ? 0.7 : 1,
                        marginBottom: 20,
                    }}
                >
                    {loading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <span style={{
                                display: "inline-block", width: 12, height: 12,
                                border: "2px solid #6366f1", borderTopColor: "#fff",
                                borderRadius: "50%", animation: "spin 0.8s linear infinite",
                            }} />
                            Đang phân tích...
                        </span>
                    ) : "PHÂN TÍCH RỦI RO →"}
                </button>

                {/* Placeholder result */}
                {result && verdictStyle && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                        {/* Verdict banner */}
                        <div style={{
                            background: verdictStyle.bg,
                            border: `1px solid ${verdictStyle.border}`,
                            borderRadius: 10, padding: "14px 16px",
                            display: "flex", alignItems: "center", gap: 12,
                        }}>
                            <span style={{ fontSize: 22, color: verdictStyle.color }}>{verdictStyle.icon}</span>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: verdictStyle.color }}>{result.verdict}</div>
                                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{result.verdictReason}</div>
                            </div>
                        </div>

                        {/* Key numbers grid */}
                        <div style={{
                            background: "#0f0f1a", border: "1px solid #1e293b",
                            borderRadius: 10, padding: 16,
                            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
                        }}>
                            <Metric label="ĐÒN BẨY" value={`${result.leverage}x`} color="#818cf8" sub={result.leverageReason} />
                            <Metric label="STOP LOSS" value={`$${result.stopLoss?.toLocaleString()}`} color="#f87171" sub={`-${result.stopLossPercent}%`} />
                            <Metric label="R/R RATIO" value={`1:${result.riskRewardRatio}`} color="#4ade80" sub="risk/reward" />
                        </div>

                        {/* TP levels */}
                        <div style={{ background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
                            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, marginBottom: 10 }}>TAKE PROFIT TARGETS</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    { label: "TP1 (50%)", price: result.takeProfit1, pct: result.tpPercent1, color: "#4ade80" },
                                    { label: "TP2 (30%)", price: result.takeProfit2, pct: result.tpPercent2, color: "#22c55e" },
                                    { label: "TP3 (20%)", price: result.takeProfit3, pct: result.tpPercent3, color: "#16a34a" },
                                ].map(tp => (
                                    <div key={tp.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 11, color: "#64748b" }}>{tp.label}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: tp.color }}>${tp.price?.toLocaleString()}</span>
                                            <span style={{ fontSize: 11, color: tp.color, minWidth: 40, textAlign: "right" }}>{tp.pct}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Position info */}
                        <div style={{
                            background: "#0f0f1a", border: "1px solid #1e293b",
                            borderRadius: 10, padding: 16,
                            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                        }}>
                            <Metric label="VỊ THẾ" value={`$${result.positionSize?.toLocaleString()}`} color="#e2e8f0" sub={`${result.positionSizePercent}% vốn`} />
                            <Metric label="MAX LOSS" value={`-$${result.maxLoss?.toLocaleString()}`} color="#f87171" sub="nếu SL chạm" />
                        </div>

                        {/* Warnings */}
                        {result.warnings?.length > 0 && (
                            <div style={{ background: "#1c1408", border: "1px solid #78350f", borderRadius: 10, padding: 14 }}>
                                <div style={{ fontSize: 10, color: "#92400e", letterSpacing: 1, marginBottom: 8 }}>CẢNH BÁO</div>
                                {result.warnings.map((w, i) => (
                                    <div key={i} style={{ fontSize: 12, color: "#fbbf24", marginBottom: 4, display: "flex", gap: 6 }}>
                                        <span>⚠</span><span>{w}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Expandable analysis */}
                        <div style={{ background: "#0f0f1a", border: "1px solid #1e293b", borderRadius: 10, overflow: "hidden" }}>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                style={{
                                    width: "100%", padding: "12px 16px", background: "transparent",
                                    border: "none", cursor: "pointer", display: "flex",
                                    justifyContent: "space-between", alignItems: "center", color: "#94a3b8",
                                    fontSize: 11, letterSpacing: 1, fontFamily: "inherit",
                                }}
                            >
                                <span>PHÂN TÍCH CHI TIẾT</span>
                                <span style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                            </button>
                            {expanded && (
                                <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e293b" }}>
                                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: "12px 0 0", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                                        {result.analysis}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

type MetricProps = {
    label: string;
    value: string;
    color: string;
    sub?: string;
};

function Metric({ label, value, color, sub }: MetricProps) {
    return (
        <div>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color }}>{value}</div>
            {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{sub}</div>}
        </div>
    );
}