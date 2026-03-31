// import { useState } from "react";

// type AddKeyFormProps = {
//     onAdd: (item: ApiKeyItem) => void;
//     onCancel: () => void;
// };
// type ApiKeyItem = {
//     id: number;
//     exchange: ExchangeId;
//     label: string;
//     apiKey: string;
//     secretKey: string;
//     permissions: string[];
//     createdAt: string;
//     lastUsed: string;
//     active: boolean;
// };
// const EXCHANGES: Exchange[] = [
//     { id: "binance", name: "Binance", label: "Binance Futures", color: "#F0B90B", logo: "B" },
//     { id: "bybit", name: "Bybit", label: "Bybit", color: "#F7A600", logo: "By" },
//     { id: "okx", name: "OKX", label: "OKX", color: "#ffffff", logo: "O" },
// ];
// type Exchange = {
//     id: ExchangeId;
//     name: string;
//     label: string;
//     color: string;
//     logo: string;
// };

// type ExchangeId = "binance" | "bybit" | "okx";

// function AddKeyForm({ onAdd, onCancel }: AddKeyFormProps) {
//     const [exchange, setExchange] = useState<ExchangeId>("binance");
//     const [label, setLabel] = useState("");
//     const [apiKey, setApiKey] = useState("");
//     const [secretKey, setSecretKey] = useState("");
//     const [showSecret, setShowSecret] = useState(false);
//     const [agreed, setAgreed] = useState(false);
//     const [loading, setLoading] = useState(false);

//     async function submit() {
//         if (!label || !apiKey || !secretKey || !agreed) return;

//         setLoading(true);
//         await new Promise((r) => setTimeout(r, 1200));

//         onAdd({
//             id: Date.now(),
//             exchange,
//             label,
//             apiKey,
//             secretKey,
//             permissions: ["Read", "Trade"],
//             createdAt: new Date().toLocaleDateString("vi-VN"),
//             lastUsed: "Vừa xong",
//             active: true,
//         });

//         setLoading(false);
//     }

//     return (
//         <div
//             style={{
//                 background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
//                 border: "1px solid #1d1d1d",
//                 borderRadius: 16,
//                 padding: 20,
//                 marginTop: 12,
//                 boxShadow: "0 0 0 1px rgba(255,255,255,0.015), 0 12px 32px rgba(0,0,0,0.35)",
//             }}
//         >
//             <div
//                 style={{
//                     fontSize: 13,
//                     fontWeight: 600,
//                     color: "#f5f5f5",
//                     marginBottom: 16,
//                     fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
//                 }}
//             >
//                 Thêm kết nối mới
//             </div>

//             <div style={{ marginBottom: 14 }}>
//                 <label style={fieldLabel}>SÀN GIAO DỊCH</label>

//                 <div style={{ display: "flex", gap: 8 }}>
//                     {EXCHANGES.map((ex) => {
//                         const active = exchange === ex.id;
//                         const isOkx = ex.id === "okx";

//                         return (
//                             <button
//                                 key={ex.id}
//                                 type="button"
//                                 onClick={() => setExchange(ex.id)}
//                                 style={{
//                                     flex: 1,
//                                     padding: "12px 8px",
//                                     borderRadius: 12,
//                                     cursor: "pointer",
//                                     border: active
//                                         ? isOkx
//                                             ? "1px solid #3b3b3b"
//                                             : `1px solid ${ex.color}66`
//                                         : "1px solid #1a1a1a",
//                                     background: active
//                                         ? isOkx
//                                             ? "linear-gradient(180deg, #121212 0%, #080808 100%)"
//                                             : `linear-gradient(180deg, ${ex.color}14 0%, rgba(255,255,255,0.02) 100%)`
//                                         : "#050505",
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     alignItems: "center",
//                                     gap: 7,
//                                     transition: "all 0.15s",
//                                     boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.03)" : "none",
//                                 }}
//                             >
//                                 <ExchangeLogo ex={ex} size={28} />
//                                 <span
//                                     style={{
//                                         fontSize: 11,
//                                         color: active ? ex.color : "#6b7280",
//                                         fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
//                                         fontWeight: 500,
//                                     }}
//                                 >
//                                     {ex.name}
//                                 </span>
//                             </button>
//                         );
//                     })}
//                 </div>
//             </div>

//             <div style={{ marginBottom: 12 }}>
//                 <label style={fieldLabel}>TÊN GỢI NHỚ</label>
//                 <input
//                     placeholder="vd: Main account"
//                     value={label}
//                     onChange={(e) => setLabel(e.target.value)}
//                     style={inputStyle}
//                 />
//             </div>

//             <div style={{ marginBottom: 12 }}>
//                 <label style={fieldLabel}>API KEY</label>
//                 <input
//                     placeholder="Dán API key vào đây"
//                     value={apiKey}
//                     onChange={(e) => setApiKey(e.target.value)}
//                     style={{
//                         ...inputStyle,
//                         fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
//                         fontSize: 12,
//                     }}
//                 />
//             </div>

//             <div style={{ marginBottom: 16 }}>
//                 <label style={fieldLabel}>SECRET KEY</label>
//                 <div style={{ position: "relative" }}>
//                     <input
//                         type={showSecret ? "text" : "password"}
//                         placeholder="Dán Secret key vào đây"
//                         value={secretKey}
//                         onChange={(e) => setSecretKey(e.target.value)}
//                         style={{
//                             ...inputStyle,
//                             fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
//                             fontSize: 12,
//                             paddingRight: 42,
//                         }}
//                     />
//                     <button
//                         type="button"
//                         onClick={() => setShowSecret((v) => !v)}
//                         style={{
//                             position: "absolute",
//                             right: 10,
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             color: "#6b7280",
//                             padding: 2,
//                         }}
//                     >
//                         {showSecret ? <EyeOff /> : <Eye />}
//                     </button>
//                 </div>
//             </div>

//             <div
//                 style={{
//                     background: "linear-gradient(180deg, rgba(240,185,11,0.10) 0%, rgba(240,185,11,0.04) 100%)",
//                     border: "1px solid rgba(240,185,11,0.22)",
//                     borderRadius: 12,
//                     padding: "12px 14px",
//                     marginBottom: 14,
//                     display: "flex",
//                     gap: 10,
//                 }}
//             >
//                 <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
//                 <div
//                     style={{
//                         fontSize: 11,
//                         color: "#d6a728",
//                         lineHeight: 1.7,
//                         fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
//                     }}
//                 >
//                     Chỉ cấp quyền <strong style={{ color: "#f0b90b" }}>Read + Trade</strong>. Tuyệt đối{" "}
//                     <strong style={{ color: "#f0b90b" }}>không cấp quyền Withdraw</strong> — chúng tôi không cần và không bao giờ yêu cầu quyền rút tiền.
//                 </div>
//             </div>

//             <label
//                 style={{
//                     display: "flex",
//                     alignItems: "flex-start",
//                     gap: 10,
//                     marginBottom: 16,
//                     cursor: "pointer",
//                 }}
//             >
//                 <input
//                     type="checkbox"
//                     checked={agreed}
//                     onChange={(e) => setAgreed(e.target.checked)}
//                     style={{ marginTop: 2, accentColor: "#f0b90b" }}
//                 />
//                 <span
//                     style={{
//                         fontSize: 12,
//                         color: "#9ca3af",
//                         lineHeight: 1.7,
//                         fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
//                     }}
//                 >
//                     Tôi hiểu rằng API key được mã hóa và lưu trữ an toàn. Tôi chịu trách nhiệm về quyền truy cập của key này.
//                 </span>
//             </label>

//             <div style={{ display: "flex", gap: 8 }}>
//                 <button
//                     type="button"
//                     onClick={onCancel}
//                     style={{
//                         ...smallBtn,
//                         flex: 1,
//                         padding: "11px 0",
//                         justifyContent: "center",
//                         color: "#a1a1aa",
//                         borderColor: "#222",
//                         background: "#080808",
//                     }}
//                 >
//                     Hủy
//                 </button>

//                 <button
//                     type="button"
//                     onClick={submit}
//                     disabled={!label || !apiKey || !secretKey || !agreed || loading}
//                     style={{
//                         flex: 2,
//                         padding: "11px 0",
//                         borderRadius: 10,
//                         cursor: !label || !apiKey || !secretKey || !agreed || loading ? "not-allowed" : "pointer",
//                         background:
//                             !label || !apiKey || !secretKey || !agreed || loading
//                                 ? "#1a1a1a"
//                                 : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
//                         border: !label || !apiKey || !secretKey || !agreed || loading
//                             ? "1px solid #242424"
//                             : "1px solid #e0ae10",
//                         color: !label || !apiKey || !secretKey || !agreed || loading ? "#666" : "#111",
//                         fontSize: 13,
//                         fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
//                         fontWeight: 700,
//                         opacity: !label || !apiKey || !secretKey || !agreed ? 0.7 : 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 8,
//                         boxShadow:
//                             !label || !apiKey || !secretKey || !agreed || loading
//                                 ? "none"
//                                 : "0 8px 22px rgba(240,185,11,0.16)",
//                     }}
//                 >
//                     {loading ? (
//                         <>
//                             <span
//                                 style={{
//                                     display: "inline-block",
//                                     width: 12,
//                                     height: 12,
//                                     border: "2px solid rgba(0,0,0,0.2)",
//                                     borderTopColor: "#111",
//                                     borderRadius: "50%",
//                                     animation: "spin 0.8s linear infinite",
//                                 }}
//                             />
//                             Đang xác minh...
//                         </>
//                     ) : (
//                         "Xác minh & Lưu →"
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// }