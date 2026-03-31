
import { useEffect, useState } from 'react';
import {
    TrendingUp, TrendingDown, Minus,
    Brain, ShieldAlert, History,
    BarChart2, ChevronDown, Zap
} from 'lucide-react';
import { useCoinStore } from '../store/coinStore';
import { AppLayout } from '../layout/MainLayout';
import { CoinSelector } from '../components/TabBtn';
import { predictionService } from '../services/predictionService';
import axios from 'axios';
import RiskDrawer, { type DataAnalyze } from '../components/RiskDrawer';

// ================================================================
// TYPES
// ================================================================
export type Signal = 'LONG' | 'SHORT' | 'FLAT';

export type PredictionData = {
    predictedPrice: string;
    confidence: string;
    signal: Signal;
    changePercent: string;
    directionAcc: string;
    mae: string;
    mape: string;
};
type PriceCoin = {
    symbol: string;   // Symbol
    lastPrice: number,
    priceChange: number;   // Price change
    priceChangePercent: number;   // Price change percent
    volume: number;   // Volume
};


// ================================================================
// MOCK DATA — thay bằng API thật
// ================================================================

const TIMEFRAMES = ['1h', '4h', '1d'];

// ================================================================
// HELPERS
// ================================================================
const fmt = (n?: number | null, d = 2) => {
    if (n === null || n === undefined || isNaN(n)) return '--';

    return n.toLocaleString('en-US', {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
    });
};

const SIGNAL_CONFIG: Record<Signal, {
    color: string; bg: string; border: string;
    icon: React.ReactNode; label: string;
}> = {
    LONG: { color: '#0ecb81', bg: 'rgba(14,203,129,0.08)', border: 'rgba(14,203,129,0.3)', icon: <TrendingUp size={14} />, label: 'LONG' },
    SHORT: { color: '#f6465d', bg: 'rgba(246,70,93,0.08)', border: 'rgba(246,70,93,0.3)', icon: <TrendingDown size={14} />, label: 'SHORT' },
    FLAT: { color: '#ef9f27', bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.3)', icon: <Minus size={14} />, label: 'FLAT' },
};

// ================================================================
// SUB-COMPONENTS
// ================================================================
const StatCard: React.FC<{
    label: string; value: React.ReactNode;
    sub?: React.ReactNode; accent?: string;
}> = ({ label, value, sub, accent }) => (
    <div style={{
        flex: 1, background: '#0d0f14',
        border: `1px solid ${accent ?? '#1a1d26'}`,
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0,
    }}>
        <span style={{ fontSize: 11, color: '#5c6478', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
        </span>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#e6eaf0', fontVariantNumeric: 'tabular-nums' }}>
            {value}
        </div>
        {sub && <div style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>}
    </div>
);

const Bar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
    <div style={{ background: '#1a1d26', borderRadius: 4, height: 4, width: '100%' }}>
        <div style={{
            width: `${Math.min(value, 100)}%`, height: '100%',
            background: color, borderRadius: 4, transition: 'width 0.5s ease',
        }} />
    </div>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; dot: string }> = ({ icon, title, dot }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{
            width: 28, height: 28, borderRadius: 8, background: dot,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#e6eaf0' }}>{title}</span>
    </div>
);

const HistoryCard: React.FC<{ item: PredictHistory }> = ({ item }) => {
    const cfg = SIGNAL_CONFIG[item.signalAi];
    return (
        <div style={{
            background: '#080a0e', border: '1px solid #1a1d26',
            borderRadius: 8, padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 6,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#5c6478' }}>{item.predictedAt}</span>
                <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 11, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 4,
                    background: cfg.bg, color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                }}>
                    {cfg.icon}{item.signalAi}
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#5c6478' }}>Dự đoán</span>
                <span style={{ fontSize: 12, color: '#e6eaf0' }}>${fmt(item.predictedPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#5c6478' }}>Thực tế</span>
                <span style={{ fontSize: 12, color: '#e6eaf0' }}>${fmt(item.actualPrice)}</span>
            </div>
            <div style={{
                fontSize: 11,
                fontWeight: 700,
                color:
                    item.isCorrect === 1 ? '#0ecb81' :
                        item.isCorrect === -1 ? '#f6465d' :
                            '#ef9f27'
            }}>
                {
                    item.isCorrect === 1 ? '✓ Đúng chiều' :
                        item.isCorrect === -1 ? '✗ Sai chiều' :
                            '… Chờ kết quả'
                }
            </div>
        </div>
    );
};

type model = {
    id: string;
    name: string;
}
type PredictHistory = {
    predictedPrice: number,
    actualPrice: number,
    signalAi: Signal,
    isCorrect: number,
    predictedAt: string
}
// ================================================================
// MAIN PAGE
// ================================================================
export default function AIPredictionPage() {
    const selectedCoin = useCoinStore(s => s.selectedCoin);
    const setSelectedCoin = useCoinStore(s => s.setSelectedCoin);
    const [data, setData] = useState<PredictionData | null>({
        predictedPrice: "--",
        confidence: "--",
        signal: "FLAT",
        changePercent: "--",
        directionAcc: "--",
        mae: "--",
        mape: "--",
    });
    const [openRisk, setOpenRisk] = useState(false);
    const [activeTf, setActiveTf] = useState('1d');
    const [activeModel, setActiveModel] = useState('LSTM');
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [models, setModels] = useState<model[]>([]);
    const [coinPrice, setCoinPrice] = useState<PriceCoin>({
        symbol: "BTC",
        lastPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        volume: 0,
    });
    const [analyzeResult, setAnalyzeResult] = useState<DataAnalyze | null>(null);
    const [predictHistory, setPredictHistory] = useState<PredictHistory[]>([])
    const fetchPredictHistory = async () => {
        const response = await axios.get(`http://localhost:8080/api/prediction/history?coinId=${Number(selectedCoin.id)}&page=${0}&size=${8}`)
        const history: PredictHistory[] = await response.data.content
        console.log(history)
        setPredictHistory(history)
    }


    const connectSocket = (symbol: string) => {
        const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol.toLocaleLowerCase()}usdt@ticker`);
        ws.onopen = () => {
            console.log('✅ Đã kết nối tới socket', symbol);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setCoinPrice({
                symbol: data.s,
                lastPrice: parseFloat(data.c),
                priceChange: parseFloat(data.p),
                priceChangePercent: parseFloat(data.P),
                volume: parseFloat(data.v),
            })
        };

        ws.onerror = (error) => {
            console.error('❌ Lỗi:', error);
        };

        ws.onclose = () => {
            console.log('🔌 Ngắt kết nối');
        };

        // ✅ Đóng WebSocket khi component unmount
        return () => {
            ws.close();
        };
    };
    const fetchAllModels = async () => {
        const response = await predictionService.getAllModels()
        const models = await response.data;
        console.log(models.data)
        setModels(models.data)
    }

    const fetchAiSignal = async () => {
        try {
            const response = await predictionService.getAiSignal(selectedCoin.symbol + 'USDT', activeTf, activeModel, coinPrice.lastPrice);
            console.log(coinPrice.lastPrice)
            const signal = await response.data;
            console.log(signal)
            setData(signal)
        } catch (error) {
            console.error(error);
        }
    }


    const handleAnalyze = () => {
        setLoading(true);
        try {
            console.log("handle", data)
            setOpenRisk(true); // mở SAU khi có data
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchAllModels()
        fetchPredictHistory()
        const cleanup = connectSocket(selectedCoin.symbol);
        return () => {
            cleanup && cleanup();
        };
    }, [selectedCoin]);

    const cfg = SIGNAL_CONFIG[data?.signal ?? 'FLAT'];
    const change = parseFloat(data?.changePercent ?? "0");
    const isUp = change >= 0; if (loading) return (
        <AppLayout>
            <div style={{ color: '#5c6478', padding: 32, textAlign: 'center' }}>
                Đang tải dữ liệu...
            </div>
        </AppLayout>
    );

    if (error) return (
        <AppLayout>
            <div style={{ color: '#f6465d', padding: 32, textAlign: 'center' }}>
                {error}
            </div>
        </AppLayout>
    );

    if (!data) return null; // ← sau dòng này, TypeScript hiểu data chắc chắn không null

    return (
        <AppLayout>
            <div style={{
                minHeight: '100vh', backgroundColor: '#080a0e',
                padding: '16px', display: 'flex', flexDirection: 'column', gap: 14,
            }}>

                {/* ── Row 1: Selector bar ── */}
                <div style={{
                    background: '#0d0f14', border: '1px solid #1a1d26',
                    borderRadius: 10, padding: '10px 16px',
                    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                }}>
                    {/* Coin */}
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsOpenSearch(o => !o)} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: isOpenSearch ? '#1a1d26' : 'transparent',
                            border: `1px solid ${isOpenSearch ? '#3861fb' : '#1a1d26'}`,
                            borderRadius: 8, padding: '6px 12px',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            <img src={selectedCoin.image} width={20} height={20} style={{ borderRadius: '50%' }} />
                            <span style={{ color: '#e6eaf0', fontWeight: 700, fontSize: 15 }}>
                                {selectedCoin.symbol}
                                <span style={{ color: '#5c6478', fontWeight: 400 }}>/USDT</span>
                            </span>
                            <ChevronDown size={13} color="#5c6478" style={{
                                transform: isOpenSearch ? 'rotate(180deg)' : 'rotate(0)',
                                transition: 'transform 0.2s',
                            }} />
                        </button>
                        {isOpenSearch && (
                            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 1000 }}>
                                <CoinSelector
                                    selectedCoin={selectedCoin}
                                    onSelect={coin => { setSelectedCoin(coin); setIsOpenSearch(false); }}
                                    onClose={() => setIsOpenSearch(false)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Timeframe */}
                    <div style={{ display: 'flex', gap: 4 }}>
                        {TIMEFRAMES.map(tf => (
                            <button key={tf} onClick={() => setActiveTf(tf)} style={{
                                background: activeTf === tf ? '#1a1d26' : 'transparent',
                                border: `1px solid ${activeTf === tf ? '#3a3f4e' : '#1a1d26'}`,
                                color: activeTf === tf ? '#e6eaf0' : '#5c6478',
                                fontSize: 12, fontWeight: activeTf === tf ? 700 : 400,
                                padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                            }}>{tf}</button>
                        ))}
                    </div>

                    {/* Model */}
                    <div style={{ display: 'flex', gap: 4 }}>
                        {models.map(m => (
                            <button key={m.id} onClick={() => setActiveModel(m.name)} style={{
                                background: activeModel === m.name ? 'rgba(56,97,251,0.15)' : 'transparent',
                                border: `1px solid ${activeModel === m.name ? '#3861fb' : '#1a1d26'}`,
                                color: activeModel === m.name ? '#3861fb' : '#5c6478',
                                fontSize: 11, fontWeight: activeModel === m.name ? 700 : 400,
                                padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                            }}>{m.name}</button>
                        ))}
                    </div>

                    <span style={{
                        marginLeft: 'auto',
                        background: 'rgba(56,97,251,0.12)', color: '#3861fb',
                        fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                    }}>
                        AI · Cập nhật 5 phút trước
                    </span>
                    <button type="button" className="btn btn-warning fw-bold text-wg" onClick={fetchAiSignal}>Dự đoán ngay</button>
                </div>

                {/* ── Row 2: Stat cards ── */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <StatCard
                        label="Giá hiện tại"
                        value={<span style={{ color: '#e6eaf0' }}>${fmt(coinPrice?.lastPrice)}</span>}
                        sub={<span style={{ color: isUp ? '#0ecb81' : '#f6465d' }}>
                            {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{coinPrice?.priceChangePercent}% (24h)
                        </span>}
                    />
                    <StatCard
                        label="Giá dự đoán"
                        value={<span style={{ color: '#378add' }}>${fmt(parseFloat(data.predictedPrice))}</span>}
                        sub={<span style={{ color: '#5c6478' }}>Target: {activeTf} tới</span>}
                        accent="rgba(55,138,221,0.2)"
                    />
                    <StatCard
                        label="Độ tin cậy"
                        value={<span style={{ color: '#ef9f27' }}>{data.confidence}%</span>}
                        sub={<Bar value={parseFloat(data.confidence)} color="#ef9f27" />}
                        accent="rgba(239,159,39,0.2)"
                    />
                    <StatCard
                        label="Tín hiệu"
                        value={
                            <div className='d-flex justify-content-evenly'>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    background: cfg.bg, color: cfg.color,
                                    border: `1px solid ${cfg.border}`,
                                    padding: '4px 14px', borderRadius: 8, fontSize: 18,
                                }}>
                                    {cfg.icon} {data.signal}
                                </div>
                                <div>
                                    <button style={{
                                        marginLeft: 8,
                                        background: '#fcd535',          // vàng Binance
                                        color: '#0b0e11',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: 6,
                                        fontSize: 15,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                        onClick={handleAnalyze}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f0b90b';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fcd535';
                                        }}>Phân tích rủi ro </button>
                                </div>
                            </div>
                        }
                        sub={<span style={{ color: '#5c6478' }}></span>}
                        accent={cfg.border}
                    />
                </div>

                {/* ── Row 3: Chart + Signal detail ── */}
                <div style={{ display: 'flex', gap: 14 }}>
                    {/* Chart */}
                    <div style={{
                        flex: 2, background: '#0d0f14', border: '1px solid #1a1d26',
                        borderRadius: 10, padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        width: "65%"
                    }}>
                        <SectionTitle
                            icon={<BarChart2 size={14} color="#fff" />}
                            title="Biểu đồ dự đoán giá"
                            dot="rgba(55,138,221,0.3)"
                        />
                        <div style={{
                            background: '#080a0e', border: '1px solid #1a1d26',
                            borderRadius: 8, height: 220,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: 8,
                            color: '#5c6478', fontSize: 13,
                        }}>
                            {/* TODO: Thay bằng <PriceChart /> + đường dự đoán */}
                            <svg width="60" height="36" viewBox="0 0 60 36" fill="none">
                                <polyline points="2,32 10,24 18,26 28,16 36,18 44,10 52,12"
                                    stroke="#378add" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="44,10 52,6 58,2"
                                    stroke="#0ecb81" strokeWidth="1.5" strokeDasharray="3 2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Tích hợp chart tại đây
                        </div>
                        <div style={{ display: 'flex', gap: 20 }}>
                            {[
                                { color: '#378add', dash: false, area: false, label: 'Giá thực tế' },
                                { color: '#0ecb81', dash: true, area: false, label: 'Dự đoán' },
                                { color: 'rgba(14,203,129,0.12)', dash: false, area: true, label: 'Khoảng tin cậy' },
                            ].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {l.area
                                        ? <div style={{ width: 20, height: 8, background: l.color, borderRadius: 2 }} />
                                        : <div style={{ width: 20, height: 0, borderTop: `2px ${l.dash ? 'dashed' : 'solid'} ${l.color}` }} />
                                    }
                                    <span style={{ fontSize: 11, color: '#5c6478' }}>{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Signal detail */}
                    <div style={{
                        width: "35%", flexShrink: 0,
                        background: '#0d0f14', border: '1px solid #1a1d26',
                        borderRadius: 10, padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                    }}>
                        <SectionTitle
                            icon={<Brain size={14} color="#fff" />}
                            title="Chi tiết tín hiệu"
                            dot="rgba(14,203,129,0.25)"
                        />
                        {[
                            {
                                label: 'Mô hình', value: (
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {models.map(m => (
                                            <span key={m.id} style={{
                                                background: '#1a1d26', color: '#848e9c',
                                                fontSize: 10, padding: '2px 6px',
                                                borderRadius: 4, border: '1px solid #2a2e39',
                                            }}>{m.name}</span>
                                        ))}
                                    </div>
                                )
                            },
                            {
                                label: 'Khuyến nghị', value: (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: cfg.color, fontWeight: 700, fontSize: 13 }}>
                                        {cfg.icon} {data.signal}
                                    </span>
                                )
                            },
                            { label: '% thay đổi dự đoán', value: <span style={{ color: '#0ecb81', fontWeight: 700 }}>+{data.changePercent}%</span> },
                            { label: 'Giá dự đoán', value: <span style={{ color: '#e6eaf0' }}>${fmt(parseFloat(data.predictedPrice))}</span> },
                        ].map(row => (
                            <div key={row.label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                paddingBottom: 8, borderBottom: '1px solid #1a1d26',
                            }}>
                                <span style={{ fontSize: 12, color: '#5c6478' }}>{row.label}</span>
                                <span style={{ fontSize: 13 }}>{row.value}</span>
                            </div>
                        ))}
                        <span style={{ fontSize: 12, color: '#5c6478', fontWeight: 600 }}>Độ chính xác mô hình</span>
                        {[
                            { label: 'Đúng chiều', value: `${data.directionAcc}%`, pct: data.directionAcc, color: '#0ecb81' },
                            { label: 'MAE', value: `$${data.mae}`, pct: 60, color: '#378add' },
                            { label: 'MAPE', value: `${data.mape}%`, pct: 45, color: '#ef9f27' },
                        ].map(m => (
                            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 11, color: '#5c6478' }}>{m.label}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#e6eaf0' }}>{m.value}</span>
                                </div>
                                <Bar value={Number(m.pct)} color={m.color} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Row 4: Risk + History ── */}
                <div style={{ display: 'flex', gap: 14 }}>


                    {/* History */}
                    <div style={{
                        flex: 1, background: '#0d0f14', border: '1px solid #1a1d26',
                        borderRadius: 10, padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    background: 'rgba(246,70,93,0.25)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <History size={14} color="#fff" />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#e6eaf0' }}>Lịch sử dự đoán gần đây</span>
                            </div>
                            <span style={{
                                fontSize: 11, fontWeight: 700, color: '#0ecb81',
                                background: 'rgba(14,203,129,0.1)',
                                padding: '2px 8px', borderRadius: 4,
                            }}>
                                Đúng {predictHistory.filter(h => h.isCorrect).length}/{predictHistory.length}
                            </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                            {predictHistory.map((item, i) => <HistoryCard key={i} item={item} />)}
                        </div>
                    </div>
                </div>

                {/* ── Row 5: Model performance ── */}
                {/* <div style={{
                    background: '#0d0f14', border: '1px solid #1a1d26',
                    borderRadius: 10, padding: '16px',
                    display: 'flex', flexDirection: 'column', gap: 14,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <SectionTitle
                            icon={<Zap size={14} color="#fff" />}
                            title="Hiệu suất mô hình theo thời gian"
                            dot="rgba(56,97,251,0.3)"
                        />
                        <span style={{ fontSize: 12, color: '#5c6478' }}>30 ngày gần nhất</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {[
                            { name: 'XGBOOST', winrate: 76, mae: 214, color: '#3861fb' },
                            { name: 'LSTM', winrate: 71, mae: 280, color: '#0ecb81' },
                            { name: 'GRU', winrate: 68, mae: 310, color: '#ef9f27' },
                        ].map(m => (
                            <div key={m.name}
                                onClick={() => setActiveModel(m.name)}
                                style={{
                                    flex: 1, background: '#080a0e', cursor: 'pointer',
                                    border: `1px solid ${activeModel === m.name ? m.color : '#1a1d26'}`,
                                    borderRadius: 8, padding: '12px 14px',
                                    display: 'flex', flexDirection: 'column', gap: 8,
                                    transition: 'border-color 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.name}</span>
                                    {activeModel === m.name && (
                                        <span style={{
                                            fontSize: 10, fontWeight: 700,
                                            background: `${m.color}22`, color: m.color,
                                            padding: '1px 6px', borderRadius: 4,
                                        }}>Đang dùng</span>
                                    )}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 11, color: '#5c6478' }}>Winrate</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#e6eaf0' }}>{m.winrate}%</span>
                                    </div>
                                    <Bar value={m.winrate} color={m.color} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 11, color: '#5c6478' }}>MAE trung bình</span>
                                    <span style={{ fontSize: 11, color: '#e6eaf0' }}>${m.mae}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

            </div>
            {openRisk && (
                <RiskDrawer
                    open={openRisk}
                    onClose={() => setOpenRisk(false)}
                    prediction={data}
                    result={analyzeResult}
                    setResult={setAnalyzeResult}
                />
            )}
        </AppLayout>
    );
}