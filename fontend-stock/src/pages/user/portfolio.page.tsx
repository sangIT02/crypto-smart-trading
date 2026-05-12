import React, { useEffect, useMemo, useState } from 'react';
import { portfolioService, type FuturesBalanceResponse } from '../../services/portfolioService';
import axios from 'axios';
import { positionService, type PositionDTO } from '../../services/positionService';
import EquityChart from '../../components/chart/EquityChart';
import { keyAccountService } from '../../services/keyAccountService';
import { ApiKeyRequiredOverlay } from '../../components/ApiKeyRequiredOverlay ';

type EquityPoint = {
    label: string;
    value: number;
};

const EQUITY_DATA: EquityPoint[] = [
    { label: '01', value: 10120 },
    { label: '02', value: 10340 },
    { label: '03', value: 10210 },
    { label: '04', value: 10680 },
    { label: '05', value: 10540 },
    { label: '06', value: 10920 },
    { label: '07', value: 11240 },
    { label: '08', value: 11010 },
    { label: '09', value: 11450 },
    { label: '10', value: 11320 },
    { label: '11', value: 11680 },
    { label: '12', value: 11540 },
    { label: '13', value: 11820 },
    { label: '14', value: 11710 },
    { label: '15', value: 12050 },
    { label: '16', value: 11920 },
    { label: '17', value: 12240 },
    { label: '18', value: 12110 },
    { label: '19', value: 12450 },
    { label: '20', value: 12320 },
    { label: '21', value: 12680 },
    { label: '22', value: 12540 },
    { label: '23', value: 12820 },
    { label: '24', value: 12710 },
];



function formatPrice(value: number, digits = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

function formatMoney(value: number) {
    return `${value >= 0 ? '+' : ''}${formatPrice(value)} USDT`;
}

function StatCard({
    title,
    value,
    hint,
    accent,
}: {
    title: string;
    value: string;
    hint: string;
    accent?: string;
}) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: 0,
                background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
                border: `1px solid ${accent ?? '#1a1a1a'}`,
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

function SectionTitle({
    icon,
    title,
    action,
}: {
    icon: React.ReactNode;
    title: string;
    action?: React.ReactNode;
}) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 14,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: 'rgba(240,185,11,0.12)',
                        border: '1px solid rgba(240,185,11,0.22)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f0b90b',
                    }}
                >
                    {icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>{title}</span>
            </div>
            {action}
        </div>
    );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                background: '#050505',
                border: '1px solid #161616',
                borderRadius: 12,
                padding: '10px 12px',
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    color: '#6b7280',
                    letterSpacing: 1.1,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 6,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: 12,
                    color: '#ececec',
                    lineHeight: 1.6,
                    wordBreak: 'break-word',
                }}
            >
                {value}
            </div>
        </div>
    );
}

function PositionCard({ item }: { item: PositionDTO }) {
    // 1. Ép kiểu và tính toán các giá trị cơ bản
    const unRealizedProfit = Number(item.unRealizedProfit);
    const positive = unRealizedProfit >= 0;
    
    // Binance One-way mode trả về "BOTH", nên check Long/Short qua positionAmt sẽ chuẩn nhất
    const isLong = Number(item.positionAmt) > 0; 
    
    const leverage = Number(item.leverage);
    const notionalSize = Math.abs(Number(item.notional)); // Notional của lệnh Short bị âm, cần lấy trị tuyệt đối
    const liqPrice = Number(item.liquidationPrice);

    // 2. Tính Margin đã sử dụng (Giống logic bảng Table)
    const marginUsed = item.marginType === 'isolated' 
        ? Number(item.isolatedMargin) 
        : notionalSize / leverage;

    // 3. Tính ROE %
    const roe = marginUsed > 0 ? (unRealizedProfit / marginUsed) * 100 : 0;

    return (
        <div
            style={{
                background: '#070707',
                border: '1px solid #171717',
                borderRadius: 14,
                padding: 14,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 12,
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fafafa' }}>{item.symbol}</div>
                        <span
                            style={{
                                fontSize: 10,
                                padding: '4px 8px',
                                borderRadius: 999,
                                background: isLong ? 'rgba(14,203,129,0.08)' : 'rgba(246,70,93,0.08)',
                                border: `1px solid ${isLong ? 'rgba(14,203,129,0.22)' : 'rgba(246,70,93,0.22)'}`,
                                color: isLong ? '#0ecb81' : '#f6465d',
                                fontWeight: 700,
                            }}
                        >
                            {isLong ? 'LONG' : 'SHORT'}
                        </span>
                        <span
                            style={{
                                fontSize: 10,
                                padding: '4px 8px',
                                borderRadius: 999,
                                background: '#171107',
                                border: '1px solid #4a380e',
                                color: '#f0b90b',
                                fontWeight: 700,
                            }}
                        >
                            {item.leverage}x
                        </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#71717a' }}>
                        Size: {formatPrice(notionalSize, 2)}
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: positive ? '#0ecb81' : '#f6465d' }}>
                        {positive ? '' : ''}{formatMoney(unRealizedProfit)}
                    </div>
                    <div style={{ fontSize: 11, color: positive ? '#0ecb81' : '#f6465d', marginTop: 4 }}>
                        ROE {roe >= 0 ? '+' : ''}{formatPrice(roe)}%
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                <MiniInfo label="Entry Price" value={`$${formatPrice(Number(item.entryPrice))}`} />
                <MiniInfo label="Mark Price" value={`$${formatPrice(Number(item.markPrice))}`} />
                {/* Nếu giá thanh lý = 0 thì hiển thị '--' cho giống UI Binance */}
                <MiniInfo 
                    label="Liquidation" 
                    value={liqPrice > 0 ? `$${formatPrice(Number(liqPrice))}` : '--'} 
                />
                <MiniInfo label="Margin" value={`${formatPrice(marginUsed)} USDT`} />
                <MiniInfo 
                    label="PnL" 
                    value={`${positive ? '' : ''}${formatMoney(unRealizedProfit)}`} 
                />
                <MiniInfo 
                    label="ROE" 
                    value={`${roe >= 0 ? '+' : ''}${formatPrice(roe)}%`} 
                />
            </div>
        </div>
    );
}


function AllocationBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>{label}</span>
                <span style={{ fontSize: 11, color: '#71717a' }}>{formatPrice(value)}%</span>
            </div>
            <div style={{ height: 6, background: '#171717', borderRadius: 999 }}>
                <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 999 }} />
            </div>
        </div>
    );
}


export const Portfolio = () => {
    const [activeRange, setActiveRange] = useState<'1D' | '7D' | '30D' | 'ALL'>('7D');
    const [data,setData] = useState<FuturesBalanceResponse>()
    const [positionData, setPositionData] = useState<PositionDTO[]>([]);
    const [keyStatus, setKeyStatus] = useState<boolean | null>(null);
    const fetchKeyStatus = async () => {
    try {
        const response = await keyAccountService.getKeyStatus();
        setKeyStatus(response.data.data.connected);
    } catch (error) {
        setKeyStatus(false);
    }
};

    const fetchPositions = async () => {
        try {
            const response = await positionService.getPositions();
            const data:PositionDTO[] = await response.data;
            console.log("", data);
            setPositionData(data);
        } catch (error) {
            console.error('Error fetching positions:', error);
        }
    }
    useEffect(() => {
        fetchKeyStatus();
        fetchPositions();
        const fetchBalance = async () => {
            const response = await portfolioService.getBalance()
            const rs = await response.data.data
            console.log(rs)
            setData(rs)
        }
        fetchBalance()
    },[])


    const exposure = useMemo(() => {
        const total = positionData.reduce((sum, p) => sum + Math.abs(Number(p.positionAmt)), 0) || 1;
        const bySymbol = positionData.map((p) => ({
            label: p.symbol,
            value: 99,
        }));
        const longValue = positionData.filter((p) => p.positionSide === 'LONG').reduce((sum, p) => sum + Number(p.positionAmt), 0);
        const shortValue = positionData.filter((p) => p.positionSide === 'SHORT').reduce((sum, p) => sum + Number(p.positionAmt), 0);
        return { bySymbol, longPct: (longValue / total) * 100, shortPct: (shortValue / total) * 100 };
    }, [positionData]);

    return (
        <div
    style={{
        position: "relative",
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        background: '#000',
        minHeight: '100vh',
        color: '#e5e7eb',
        padding: '28px 24px',
        margin: '0 auto',
    }}
>
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
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <PortfolioRoundIcon />
                        <span style={{ fontSize: 10, color: '#6b7280', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>
                            Futures Portfolio
                        </span>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#fafafa', letterSpacing: -0.3 }}>
                        Portfolio Futures
                    </h1>
                </div>
            </div>

<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: 12,
    marginBottom: 18,
  }}
>
  {/* Wallet Balance */}
  <StatCard
    title="Wallet Balance"
    value={`${formatPrice(Number(data?.totalWalletBalance))} USDT`}
    hint="Số dư ví futures"
  />

  {/* Equity */}
  <StatCard
    title="Total Equity"
    value={`${formatPrice(Number(data?.totalMarginBalance))} USDT`}
    hint="Tổng tài sản thực tế"
    accent="rgba(240,185,11,0.22)"
  />

  {/* Available */}
  <StatCard
    title="Available Balance"
    value={`${formatPrice(Number(data?.availableBalance))} USDT`}
    hint="Số dư khả dụng"
  />

  {/* Used Margin */}
  <StatCard
    title="Used Margin"
    value={`${formatPrice(Number(data?.totalInitialMargin))} USDT`}
    hint="Ký quỹ đang sử dụng"
    accent="rgba(96,165,250,0.22)"
  />

  {/* PnL */}
  <StatCard
    title="Unrealized PnL"
    value={formatMoney(Number(data?.totalUnrealizedProfit))}
    hint="Lãi/lỗ chưa chốt"
    accent={
      Number(data?.totalUnrealizedProfit) >= 0
        ? 'rgba(14,203,129,0.22)'
        : 'rgba(246,70,93,0.22)'
    }
  />
</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.9fr)', gap: 16, marginBottom: 16 }}>
                <div style={{ background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)', border: '1px solid #1a1a1a', borderRadius: 16, padding: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.015)' }}>
                    <SectionTitle
                        icon={<ChartIcon />}
                        title="Equity / PnL"
                        action={
                            <div style={{ display: 'flex', gap: 6 }}>
                                {(['1D', '7D', '30D', 'ALL'] as const).map((range) => (
                                    <button
                                        key={range}
                                        type="button"
                                        onClick={() => setActiveRange(range)}
                                        style={{
                                            background: activeRange === range ? '#171107' : '#070707',
                                            border: `1px solid ${activeRange === range ? '#4a380e' : '#1a1a1a'}`,
                                            color: activeRange === range ? '#f0b90b' : '#71717a',
                                            fontSize: 11,
                                            fontWeight: activeRange === range ? 700 : 500,
                                            padding: '7px 10px',
                                            borderRadius: 10,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        }
                    />
                <EquityChart data={EQUITY_DATA} />
                </div>

                <div style={{ background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)', border: '1px solid #1a1a1a', borderRadius: 16, padding: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.015)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <SectionTitle icon={<RiskIcon />} title="Thường giao dịch" />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {exposure.bySymbol.map((item, index) => (
                            <AllocationBar key={item.label} label={item.label} value={item.value} color={['#f0b90b', '#60a5fa', '#0ecb81', '#f6465d'][index % 4]} />
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginTop: 4 }}>
                        <MiniInfo label="Long Exposure" value={`${formatPrice(Number(exposure.longPct))}%`} />
                        <MiniInfo label="Short Exposure" value={`${formatPrice(Number(exposure.shortPct))}%`} />
                    </div>
                </div>
            </div>

            <div style={{ background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)', border: '1px solid #1a1a1a', borderRadius: 16, padding: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.015)', marginBottom: 16 }}>
                <SectionTitle icon={<PositionIcon />} title="Open Positions" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                    {positionData.map((item) => (
                        <PositionCard key={item.symbol} item={item} />
                    ))}
                </div>
            </div>


        </div>
        {keyStatus === false && <ApiKeyRequiredOverlay />}
        </div>
        
    );
};


function PortfolioRoundIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h18" /><path d="M3 17h18" /><path d="M7 3v18" /><path d="M17 3v18" />
        </svg>
    );
}
function ChartIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" /><path d="m7 14 3-3 3 2 4-5" />
        </svg>
    );
}
function RiskIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" />
        </svg>
    );
}
function PositionIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10" /><path d="M7 12h6" /><path d="M7 16h8" />
        </svg>
    );
}

