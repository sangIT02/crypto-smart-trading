import { useState, useEffect, useRef } from "react";
import { AppLayout } from "../../layout/MainLayout";
import { StatCards } from "./stat-card";
import { Star, ExternalLink, TrendingUp } from 'lucide-react';
import { CoinSelector, MOCK_COINS } from "../TabBtn";
import DashboardChart from "../chart/price-chart";

type TickerData = {
    symbol: string;
    lastPrice: number;
    priceChange: number;
    priceChangePercent: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
}

export default function DashboardPage() {

    const [ticker, setTicker] = useState<TickerData | null>(null);
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState(MOCK_COINS[0]); // BTC mặc định
    const selectorRef = useRef<HTMLDivElement>(null);

    // Đóng khi click ngoài
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
                setIsOpenSearch(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    // ✅ WebSocket phải nằm trong useEffect
    useEffect(() => {
        const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('✅ Đã kết nối');
            setConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Map data từ Binance vào state
            setTicker({
                symbol: data.s,
                lastPrice: parseFloat(data.c),
                priceChange: parseFloat(data.p),
                priceChangePercent: parseFloat(data.P),
                highPrice: parseFloat(data.h),
                lowPrice: parseFloat(data.l),
                volume: parseFloat(data.v),
            });
        };

        ws.onerror = (error) => {
            console.error('❌ Lỗi:', error);
            setConnected(false);
        };

        ws.onclose = () => {
            console.log('🔌 Ngắt kết nối');
            setConnected(false);
        };

        // ✅ Đóng WebSocket khi component unmount
        return () => {
            ws.close();
        };
    }, []); // [] = chỉ chạy 1 lần

    // Helper format số
    const formatPrice = (n?: number) =>
        n ? n.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '--';

    const isPositive = (ticker?.priceChangePercent ?? 0) >= 0;
    const changeColor = isPositive ? '#0ECB81' : '#F6465D';

    return (
        <AppLayout>
            <div className="container-fluid py-4 pt-0" style={{ minHeight: '100vh', marginTop: '10px', backgroundColor: "#000" }}>

                <div className="mb-3">
                    <StatCards />
                </div>

                <div className="row g-4 mb-3">
                    <div className="col-12 col-lg-8">
                        <div className="card p-4 h-100"
                            style={{
                                backgroundColor: '#000', borderRadius: '12px', border: "3px solid #2E2E2E"
                            }}>

                            {/* HEADER — giờ dùng data thật */}
                            <div className="d-flex align-items-center flex-wrap gap-4">

                                {/* Tên cặp */}
                                {/* Tên cặp — thêm position: relative vào đây */}
                                <div style={{ position: 'relative' }}>

                                    {/* Trigger click */}
                                    <div
                                        className="d-flex align-items-center gap-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setIsOpenSearch(o => !o)}
                                    >
                                        <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: '24px', height: '24px' }}>
                                            <TrendingUp size={14} color="#000" />
                                        </div>
                                        <h5 className="text-white fw-bold mb-0">
                                            {selectedCoin.symbol}/USDT
                                        </h5>
                                        <span style={{
                                            color: '#5c6478',
                                            fontSize: 11,
                                            transform: isOpenSearch ? 'rotate(180deg)' : 'rotate(0)',
                                            transition: 'transform 0.2s',
                                            display: 'inline-block',
                                        }}>
                                            ▼
                                        </span>
                                        <span className="badge bg-secondary text-white-50" style={{ fontSize: '10px' }}>10x</span>
                                        <Star size={16} className="text-secondary ms-1" />
                                        <span style={{ fontSize: 11, color: connected ? '#0ECB81' : '#F6465D' }}>
                                            {connected ? '● Live' : '○ Offline'}
                                        </span>
                                    </div>

                                    {/* Dropdown — nằm NGOÀI trigger, cùng cấp */}
                                    {isOpenSearch && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            left: 0,
                                            zIndex: 1000,
                                        }}>
                                            <CoinSelector
                                                selectedCoin={selectedCoin}
                                                onSelect={(coin) => {
                                                    setSelectedCoin(coin);
                                                    setIsOpenSearch(false);
                                                    
                                                }}
                                                onClose={() => setIsOpenSearch(false)} // ← truyền onClose

                                            />
                                        </div>
                                    )}
                                </div>


                                {/* Giá & % thay đổi — data thật */}
                                <div className="d-flex flex-column">
                                    <div className="fw-bold fs-5" style={{ color: changeColor }}>
                                        ${formatPrice(ticker?.lastPrice)}
                                    </div>
                                    <div style={{ color: changeColor, fontSize: '12px' }}>
                                        {isPositive ? '+' : ''}{formatPrice(ticker?.priceChange)}
                                        {' '}({isPositive ? '+' : ''}{ticker?.priceChangePercent.toFixed(2) ?? '--'}%)
                                    </div>
                                </div>

                                {/* Thông số phụ — data thật */}
                                <div className="d-flex align-items-center gap-4 flex-wrap">
                                    <div className="d-flex flex-column">
                                        <span className="text-secondary" style={{ fontSize: '12px' }}>
                                            Giá thấp 24h
                                        </span>
                                        <span className="text-white small">
                                            ${formatPrice(ticker?.lowPrice)}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="text-secondary" style={{ fontSize: '12px' }}>
                                            Giá cao 24h
                                        </span>
                                        <span className="text-white small">
                                            ${formatPrice(ticker?.highPrice)}
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="text-secondary" style={{ fontSize: '12px' }}>
                                            KL 24h {ticker?.symbol.split("USDT")}
                                        </span>
                                        <span className="text-white small">
                                            {ticker?.volume.toFixed(2) ?? '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex">
                                <DashboardChart  symbol={`${selectedCoin.symbol}USDT`}/>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải giữ nguyên */}
                    <div className="col-12 col-lg-4">
                        <div className="card p-4 h-100"
                            style={{ backgroundColor: '#000', borderRadius: '12px', border: "3px solid #2E2E2E", }}>
                            <h5 className="text-white fw-bold mb-3">Tín hiệu giao dịch (AI)</h5>
                            <div className="list-group list-group-flush">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i}
                                        className="list-group-item bg-transparent border-secondary px-0 py-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="text-white small fw-bold">BTC/USDT</div>
                                            <div className="text-success" style={{ fontSize: '11px' }}>
                                                STRONG BUY
                                            </div>
                                        </div>
                                        <div className="text-end text-white-50 small">
                                            ${formatPrice(ticker?.lastPrice)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table giữ nguyên */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 p-4"
                            style={{ backgroundColor: '#181A20', borderRadius: '12px' }}>
                            <h5 className="text-white fw-bold mb-3">Thị trường</h5>
                            <div className="table-responsive text-white">
                                <table className="table table-dark table-hover mb-0"
                                    style={{ backgroundColor: '#181A20' }}>
                                    <thead className="text-secondary">
                                        <tr>
                                            <th>Tên</th>
                                            <th>Giá</th>
                                            <th>Thay đổi 24h</th>
                                            <th>Khối lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold">
                                                <span style={{ color: '#F0B90B' }}>BTC</span> Bitcoin
                                            </td>
                                            <td>${formatPrice(ticker?.lastPrice)}</td>
                                            <td style={{ color: changeColor }}>
                                                {isPositive ? '+' : ''}
                                                {ticker?.priceChangePercent.toFixed(2) ?? '--'}%
                                            </td>
                                            <td>{ticker?.volume.toFixed(2) ?? '--'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}