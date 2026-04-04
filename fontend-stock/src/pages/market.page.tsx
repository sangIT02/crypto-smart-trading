import React, { useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import coinDataService from '../services/coinDataService';
import MarketTable from '../components/MarketTable';

type CoinProp = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    last_updated: '2026-03-19T14:51:00.903Z';
};

function formatNumber(value?: number, digits = 2) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return value.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

function formatCompact(value?: number) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
    }).format(value);
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
                background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                border: '1px solid #1a1a1a',
                borderRadius: 14,
                padding: 16,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    color: '#6b7280',
                    letterSpacing: 1.3,
                    textTransform: 'uppercase',
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
                    color: '#fafafa',
                    letterSpacing: -0.4,
                    marginBottom: 6,
                }}
            >
                {value}
            </div>
            <div
                style={{
                    fontSize: 12,
                    color: '#71717a',
                    lineHeight: 1.6,
                }}
            >
                {hint}
            </div>
        </div>
    );
}

export const Market = () => {
    const [page, setPage] = useState<number>(1);
    const [coins, setCoins] = useState<CoinProp[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await coinDataService.getAllTopCoinMarket(page);
                console.log(res);
                setCoins(res.data);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const stats = useMemo(() => {
        const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
        const totalVolume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
        const gainers = coins.filter((coin) => (coin.price_change_percentage_24h || 0) > 0).length;
        const leaders = [...coins]
            .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
            .slice(0, 3)
            .map((coin) => coin.symbol.toUpperCase())
            .join(', ');

        return {
            total: coins.length,
            totalMarketCap,
            totalVolume,
            gainers,
            leaders: leaders || '--',
        };
    }, [coins]);

    const items = [
        {
            key: 'overview',
            label: 'Tổng quan',
            children: <OverviewTab coindata={coins} loading={loading} page={page} setPage={setPage} />,
        },
        {
            key: 'trade',
            label: 'Dữ liệu giao dịch',
            children: <TradeDataTab coindata={coins} />,
        },
    ];

    return (
            <div
                style={{
                    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                    background: '#000',
                    minHeight: '100vh',
                    color: '#e5e7eb',
                    padding: '28px 24px',
                    margin: '0 auto',
                }}
            >
                <style>{`
          .market-tabs .ant-tabs-nav::before {
            border-bottom: 1px solid #171717 !important;
          }
          .market-tabs .ant-tabs-tab {
            color: #71717a !important;
            padding: 10px 0 !important;
            margin-right: 24px !important;
          }
          .market-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #f0b90b !important;
            font-weight: 700;
          }
          .market-tabs .ant-tabs-ink-bar {
            background: #f0b90b !important;
          }
        `}</style>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 16,
                        marginBottom: 20,
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <MarketRoundIcon />
                            <span
                                style={{
                                    fontSize: 10,
                                    color: '#6b7280',
                                    letterSpacing: 3,
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}
                            >
                                Market Overview
                            </span>
                        </div>

                        <h1
                            style={{
                                fontSize: 24,
                                fontWeight: 700,
                                margin: 0,
                                color: '#fafafa',
                                letterSpacing: -0.3,
                            }}
                        >
                            Thị trường crypto
                        </h1>

                    </div>

                    <button
                        type="button"
                        onClick={() => setPage(1)}
                        style={{
                            flexShrink: 0,
                            padding: '12px 16px',
                            borderRadius: 12,
                            cursor: 'pointer',
                            background: 'linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)',
                            border: '1px solid #e0ae10',
                            color: '#111',
                            fontSize: 13,
                            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: '0 8px 22px rgba(240,185,11,0.16)',
                            marginTop: 2,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: 1 }}>↺</span>
                        Làm mới dữ liệu
                    </button>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                        gap: 12,
                        marginBottom: 18,
                    }}
                >
                    <StatCard title="Top token" value={stats.total} hint="Số coin đang hiển thị" />
                    <StatCard title="Gainers" value={stats.gainers} hint="Coin tăng giá 24h" />
                    <StatCard title="Market Cap" value={`$${formatCompact(stats.totalMarketCap)}`} hint="Tổng vốn hóa nhóm hiện tại" />
                    <StatCard title="24H Volume" value={`$${formatCompact(stats.totalVolume)}`} hint="Khối lượng giao dịch" />
                    <StatCard title="Leaders" value={stats.leaders} hint="Top tăng giá nổi bật" />
                </div>

                <div
                    style={{
                        background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                        border: '1px solid #1a1a1a',
                        borderRadius: 16,
                        padding: '8px 16px 16px',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
                    }}
                >
                    <div className="market-tabs">
                        <Tabs defaultActiveKey="overview" items={items} />
                    </div>
                </div>
            </div>
    );
};

function OverviewTab({
    coindata,
    loading,
    page,
    setPage,
}: {
    coindata: CoinProp[];
    loading: boolean;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
    const top3 = [...coindata].slice(0, 3);

    return (
        <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                    <h4 style={{ padding: 0, margin: 0, fontSize: 16, color: '#fafafa' }}>Top token theo vốn hóa thị trường</h4>
                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 6 }}>Dữ liệu market cap, giá và biến động 24h.</div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        style={ghostBtn}
                    >
                        ← Trang trước
                    </button>
                    <div
                        style={{
                            minWidth: 88,
                            textAlign: 'center',
                            padding: '10px 12px',
                            borderRadius: 10,
                            border: '1px solid #1f1f1f',
                            background: '#070707',
                            color: '#f3f4f6',
                            fontSize: 12,
                            fontWeight: 700,
                        }}
                    >
                        Page {page}
                    </div>
                    <button type="button" onClick={() => setPage((prev) => prev + 1)} style={ghostBtn}>
                        Trang sau →
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                {top3.map((coin) => {
                    const positive = (coin.price_change_percentage_24h || 0) >= 0;
                    return (
                        <div
                            key={coin.id}
                            style={{
                                background: '#070707',
                                border: '1px solid #171717',
                                borderRadius: 14,
                                padding: 14,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <img src={coin.image} alt={coin.name} width={28} height={28} style={{ borderRadius: '50%' }} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{coin.symbol.toUpperCase()}</div>
                                        <div style={{ fontSize: 11, color: '#71717a' }}>{coin.name}</div>
                                    </div>
                                </div>
                                <span
                                    style={{
                                        fontSize: 10,
                                        padding: '4px 8px',
                                        borderRadius: 999,
                                        background: positive ? 'rgba(14,203,129,0.08)' : 'rgba(246,70,93,0.08)',
                                        border: `1px solid ${positive ? 'rgba(14,203,129,0.22)' : 'rgba(246,70,93,0.22)'}`,
                                        color: positive ? '#0ecb81' : '#f6465d',
                                        fontWeight: 700,
                                    }}
                                >
                                    {positive ? '+' : ''}{formatNumber(coin.price_change_percentage_24h)}%
                                </span>
                            </div>

                            <div style={{ fontSize: 18, fontWeight: 700, color: '#fafafa', marginBottom: 8 }}>
                                ${formatNumber(coin.current_price)}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={miniRow}>
                                    <span style={miniLabel}>Market Cap</span>
                                    <span style={miniValue}>${formatCompact(coin.market_cap)}</span>
                                </div>
                                <div style={miniRow}>
                                    <span style={miniLabel}>Volume</span>
                                    <span style={miniValue}>${formatCompact(coin.total_volume)}</span>
                                </div>
                                <div style={miniRow}>
                                    <span style={miniLabel}>24H Range</span>
                                    <span style={miniValue}>${formatNumber(coin.low_24h)} - ${formatNumber(coin.high_24h)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    background: '#050505',
                    border: '1px solid #171717',
                    borderRadius: 14,
                    padding: 12,
                }}
            >
                {loading ? (
                    <div style={{ color: '#71717a', padding: '20px 8px', textAlign: 'center' }}>Đang tải dữ liệu thị trường...</div>
                ) : (
                    <MarketTable data={coindata} />
                )}
            </div>
        </div>
    );
}

function TradeDataTab({ coindata }: { coindata: CoinProp[] }) {
    const topVolume = [...coindata]
        .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
        .slice(0, 6);

    return (
        <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <h3 style={{ margin: 0, fontSize: 16, color: '#fafafa' }}>Dữ liệu giao dịch</h3>
                <p style={{ marginTop: 8, color: '#71717a', fontSize: 12, lineHeight: 1.7 }}>
                    Khu vực này có thể mở rộng thêm order book, trade history, heatmap hoặc volume analysis. Mình đã thêm block volume leaders để trang đỡ trống hơn.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                {topVolume.map((coin) => {
                    const positive = (coin.price_change_percentage_24h || 0) >= 0;
                    return (
                        <div
                            key={coin.id}
                            style={{
                                background: '#070707',
                                border: '1px solid #171717',
                                borderRadius: 14,
                                padding: 14,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <img src={coin.image} alt={coin.name} width={26} height={26} style={{ borderRadius: '50%' }} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{coin.symbol.toUpperCase()}</div>
                                    <div style={{ fontSize: 11, color: '#71717a' }}>#{coin.market_cap_rank}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={miniRow}>
                                    <span style={miniLabel}>Price</span>
                                    <span style={miniValue}>${formatNumber(coin.current_price)}</span>
                                </div>
                                <div style={miniRow}>
                                    <span style={miniLabel}>24H Volume</span>
                                    <span style={miniValue}>${formatCompact(coin.total_volume)}</span>
                                </div>
                                <div style={miniRow}>
                                    <span style={miniLabel}>24H Change</span>
                                    <span style={{ ...miniValue, color: positive ? '#0ecb81' : '#f6465d' }}>
                                        {positive ? '+' : ''}{formatNumber(coin.price_change_percentage_24h)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 4,
                    padding: '14px 16px',
                    borderRadius: 14,
                    background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
                    border: '1px solid #1a1a1a',
                    display: 'flex',
                    gap: 12,
                }}
            >
                <span style={{ fontSize: 16, flexShrink: 0 }}>📊</span>
                <div style={{ fontSize: 11, color: '#8b8f97', lineHeight: 1.8 }}>
                    Khi bạn có thêm API backend cho trade history hoặc order book, có thể thay block này bằng bảng giao dịch thời gian thực, lệnh mua/bán và heatmap thanh khoản.
                </div>
            </div>
        </div>
    );
}

const ghostBtn: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #232323',
    background: '#070707',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
};

const miniRow: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
};

const miniLabel: React.CSSProperties = {
    fontSize: 11,
    color: '#71717a',
};

const miniValue: React.CSSProperties = {
    fontSize: 11,
    color: '#f3f4f6',
    fontWeight: 600,
    textAlign: 'right',
};

function MarketRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}
