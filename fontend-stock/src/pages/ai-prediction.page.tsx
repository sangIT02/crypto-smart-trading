import { useEffect, useState } from 'react';
import {
    TrendingUp, TrendingDown, Minus,
    Brain, History,
    BarChart2, ChevronDown
} from 'lucide-react';
import { useCoinStore } from '../store/coinStore';
import { CoinSelector } from '../components/TabBtn';
import { predictionService } from '../services/predictionService';
import axios from 'axios';
import RiskDrawer, { type DataAnalyze } from '../components/RiskDrawer';

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
    symbol: string;
    lastPrice: number,
    priceChange: number;
    priceChangePercent: number;
    volume: number;
};

const TIMEFRAMES = ['1h', '4h', '1d'];

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

const StatCard: React.FC<{
    label: string; value: React.ReactNode;
    sub?: React.ReactNode; accent?: string;
}> = ({ label, value, sub, accent }) => (
    <div style={{
        flex: 1,
        minWidth: 0,
        background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
        border: `1px solid ${accent ?? '#1a1a1a'}`,
        borderRadius: 14,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
    }}>
        <span style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}>
            {label}
        </span>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>
            {value}
        </div>
        {sub && <div style={{ fontSize: 12, marginTop: 2, color: '#8b8f97' }}>{sub}</div>}
    </div>
);

const Bar: React.FC<{ value: number; color: string }> = ({ value, color }) => (
    <div style={{ background: '#171717', borderRadius: 999, height: 5, width: '100%' }}>
        <div style={{
            width: `${Math.min(value, 100)}%`, height: '100%',
            background: color, borderRadius: 999, transition: 'width 0.5s ease',
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
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>{title}</span>
    </div>
);

const HistoryCard: React.FC<{ item: PredictHistory }> = ({ item }) => {
    const cfg = SIGNAL_CONFIG[item.signalAi];
    return (
        <div style={{
            background: '#070707', border: '1px solid #171717',
            borderRadius: 12, padding: '12px',
            display: 'flex', flexDirection: 'column', gap: 8,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#71717a' }}>{item.predictedAt}</span>
                <span style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 700,
                    padding: '3px 8px', borderRadius: 999,
                    background: cfg.bg, color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                }}>
                    {cfg.icon}{item.signalAi}
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#71717a' }}>Dự đoán</span>
                <span style={{ fontSize: 12, color: '#f3f4f6' }}>${fmt(item.predictedPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#71717a' }}>Thực tế</span>
                <span style={{ fontSize: 12, color: '#f3f4f6' }}>${fmt(item.actualPrice)}</span>
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
        const response = await predictionService.getHistoriPredict(selectedCoin.id)
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
            setOpenRisk(true);
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
    const isUp = change >= 0;

    if (loading) return (
            <div style={{ color: '#71717a', padding: 32, textAlign: 'center' }}>
                Đang tải dữ liệu...
            </div>
    );

    if (error) return (
            <div style={{ color: '#f6465d', padding: 32, textAlign: 'center' }}>
                {error}
            </div>
    );

    if (!data) return null;

    return (
        <>
            <div style={{
                minHeight: '100vh',
                background: '#000',
                color: '#e5e7eb',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            }}>

                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 16,
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <AIPredictIcon />
                            <span style={{
                                fontSize: 10,
                                color: '#6b7280',
                                letterSpacing: 3,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                            }}>
                                AI Prediction
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: 24,
                            fontWeight: 700,
                            margin: 0,
                            color: '#fafafa',
                            letterSpacing: -0.3,
                        }}>
                            AI dự đoán giá
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={fetchAiSignal}
                        style={{
                            flexShrink: 0,
                            padding: '12px 16px',
                            borderRadius: 12,
                            cursor: 'pointer',
                            background: 'linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)',
                            border: '1px solid #e0ae10',
                            color: '#111',
                            fontSize: 13,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: '0 8px 22px rgba(240,185,11,0.16)',
                            marginTop: 2,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: 1 }}>⚡</span>
                        Dự đoán ngay
                    </button>
                </div>

                <div style={{
                    background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                    border: '1px solid #1a1a1a',
                    borderRadius: 16,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    flexWrap: 'wrap',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
                }}>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsOpenSearch(o => !o)} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: isOpenSearch ? '#121212' : '#070707',
                            border: `1px solid ${isOpenSearch ? '#f0b90b55' : '#1a1a1a'}`,
                            borderRadius: 12, padding: '8px 12px',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            <img src={selectedCoin.image} width={20} height={20} style={{ borderRadius: '50%' }} />
                            <span style={{ color: '#f3f4f6', fontWeight: 700, fontSize: 14 }}>
                                {selectedCoin.symbol}
                                <span style={{ color: '#71717a', fontWeight: 400 }}>/USDT</span>
                            </span>
                            <ChevronDown size={13} color="#71717a" style={{
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

                    <div style={{ display: 'flex', gap: 6 }}>
                        {TIMEFRAMES.map(tf => (
                            <button key={tf} onClick={() => setActiveTf(tf)} style={{
                                background: activeTf === tf ? '#171107' : '#070707',
                                border: `1px solid ${activeTf === tf ? '#4a380e' : '#1a1a1a'}`,
                                color: activeTf === tf ? '#f0b90b' : '#71717a',
                                fontSize: 11, fontWeight: activeTf === tf ? 700 : 500,
                                padding: '7px 12px', borderRadius: 10, cursor: 'pointer',
                            }}>{tf}</button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {models.map(m => (
                            <button key={m.id} onClick={() => setActiveModel(m.name)} style={{
                                background: activeModel === m.name ? 'rgba(240,185,11,0.10)' : '#070707',
                                border: `1px solid ${activeModel === m.name ? '#4a380e' : '#1a1a1a'}`,
                                color: activeModel === m.name ? '#f0b90b' : '#71717a',
                                fontSize: 11, fontWeight: activeModel === m.name ? 700 : 500,
                                padding: '7px 10px', borderRadius: 10, cursor: 'pointer',
                            }}>{m.name}</button>
                        ))}
                    </div>

                    <span style={{
                        marginLeft: 'auto',
                        background: 'rgba(240,185,11,0.10)', color: '#f0b90b',
                        fontSize: 11, fontWeight: 700, padding: '6px 10px', borderRadius: 999,
                        border: '1px solid rgba(240,185,11,0.22)'
                    }}>
                        AI · Cập nhật 5 phút trước
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                    <StatCard
                        label="Giá hiện tại"
                        value={<span style={{ color: '#f3f4f6' }}>${fmt(coinPrice?.lastPrice)}</span>}
                        sub={<span style={{ color: isUp ? '#0ecb81' : '#f6465d' }}>
                            {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{coinPrice?.priceChangePercent}% (24h)
                        </span>}
                    />
                    <StatCard
                        label="Giá dự đoán"
                        value={<span style={{ color: '#60a5fa' }}>${fmt(parseFloat(data.predictedPrice))}</span>}
                        sub={<span style={{ color: '#8b8f97' }}>Target: {activeTf} tới</span>}
                        accent="rgba(96,165,250,0.22)"
                    />
                    <StatCard
                        label="Độ tin cậy"
                        value={<span style={{ color: '#f0b90b' }}>{data.confidence}%</span>}
                        sub={<Bar value={parseFloat(data.confidence)} color="#f0b90b" />}
                        accent="rgba(240,185,11,0.22)"
                    />
                    <StatCard
                        label="Tín hiệu"
                        value={
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    background: cfg.bg, color: cfg.color,
                                    border: `1px solid ${cfg.border}`,
                                    padding: '6px 12px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                                }}>
                                    {cfg.icon} {data.signal}
                                </div>
                                <button
                                    style={{
                                        background: 'linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)',
                                        color: '#111',
                                        border: '1px solid #e0ae10',
                                        padding: '8px 12px',
                                        borderRadius: 10,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleAnalyze}
                                >
                                    Phân tích rủi ro
                                </button>
                            </div>
                        }
                        sub={<span style={{ color: '#8b8f97' }}>Tín hiệu AI hiện tại</span>}
                        accent={cfg.border}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.9fr)', gap: 14 }}>
                    <div style={{
                        background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                        border: '1px solid #1a1a1a',
                        borderRadius: 16, padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
                    }}>
                        <SectionTitle
                            icon={<BarChart2 size={14} color="#fff" />}
                            title="Biểu đồ dự đoán giá"
                            dot="rgba(96,165,250,0.22)"
                        />
                        <div style={{
                            background: '#070707', border: '1px solid #171717',
                            borderRadius: 12, height: 260,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column', gap: 8,
                            color: '#71717a', fontSize: 13,
                        }}>
                            <svg width="72" height="42" viewBox="0 0 72 42" fill="none">
                                <polyline points="2,36 12,28 22,30 34,18 44,20 54,12 64,14"
                                    stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="54,12 62,8 70,4"
                                    stroke="#0ecb81" strokeWidth="1.7" strokeDasharray="3 2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Tích hợp chart tại đây
                        </div>
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                            {[
                                { color: '#60a5fa', dash: false, area: false, label: 'Giá thực tế' },
                                { color: '#0ecb81', dash: true, area: false, label: 'Dự đoán' },
                                { color: 'rgba(14,203,129,0.12)', dash: false, area: true, label: 'Khoảng tin cậy' },
                            ].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {l.area
                                        ? <div style={{ width: 20, height: 8, background: l.color, borderRadius: 2 }} />
                                        : <div style={{ width: 20, height: 0, borderTop: `2px ${l.dash ? 'dashed' : 'solid'} ${l.color}` }} />
                                    }
                                    <span style={{ fontSize: 11, color: '#71717a' }}>{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                        border: '1px solid #1a1a1a',
                        borderRadius: 16, padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
                    }}>
                        <SectionTitle
                            icon={<Brain size={14} color="#fff" />}
                            title="Chi tiết tín hiệu"
                            dot="rgba(14,203,129,0.2)"
                        />
                        {[
                            {
                                label: 'Mô hình', value: (
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        {models.map(m => (
                                            <span key={m.id} style={{
                                                background: '#111111', color: '#9ca3af',
                                                fontSize: 10, padding: '3px 7px',
                                                borderRadius: 999, border: '1px solid #262626',
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
                            { label: 'Giá dự đoán', value: <span style={{ color: '#f3f4f6' }}>${fmt(parseFloat(data.predictedPrice))}</span> },
                        ].map(row => (
                            <div key={row.label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                gap: 12, paddingBottom: 10, borderBottom: '1px solid #171717',
                            }}>
                                <span style={{ fontSize: 12, color: '#71717a' }}>{row.label}</span>
                                <span style={{ fontSize: 13, textAlign: 'right' }}>{row.value}</span>
                            </div>
                        ))}
                        <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, marginTop: 2 }}>Độ chính xác mô hình</span>
                        {[
                            { label: 'Đúng chiều', value: `${data.directionAcc}%`, pct: data.directionAcc, color: '#0ecb81' },
                            { label: 'MAE', value: `$${data.mae}`, pct: 60, color: '#60a5fa' },
                            { label: 'MAPE', value: `${data.mape}%`, pct: 45, color: '#f0b90b' },
                        ].map(m => (
                            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 11, color: '#71717a' }}>{m.label}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f3f4f6' }}>{m.value}</span>
                                </div>
                                <Bar value={Number(m.pct)} color={m.color} />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                    border: '1px solid #1a1a1a',
                    borderRadius: 16,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: 'rgba(246,70,93,0.18)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <History size={14} color="#fff" />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>Lịch sử dự đoán gần đây</span>
                        </div>
                        <span style={{
                            fontSize: 11, fontWeight: 700, color: '#0ecb81',
                            background: 'rgba(14,203,129,0.1)',
                            padding: '4px 10px', borderRadius: 999,
                            border: '1px solid rgba(14,203,129,0.2)'
                        }}>
                            Đúng {predictHistory.filter(h => h.isCorrect).length}/{predictHistory.length}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
                        {predictHistory.map((item, i) => <HistoryCard key={i} item={item} />)}
                    </div>
                </div>
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
            </>)
}

function AIPredictIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="4" />
        </svg>
    );
}
