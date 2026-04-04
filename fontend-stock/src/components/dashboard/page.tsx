import { useState, useEffect, useRef } from "react";
import { AppLayout } from "../../layout/MainLayout";
import { StatCards } from "./stat-card";
import { Star, TrendingUp } from "lucide-react";
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
};

export default function DashboardPage() {
    const [ticker, setTicker] = useState<TickerData | null>(null);
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState(MOCK_COINS[0]);
    const selectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
                setIsOpenSearch(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const stream = `${selectedCoin.symbol.toLowerCase()}usdt@ticker`;
        const ws = new WebSocket(`wss://fstream.binance.com/ws/${stream}`);
        wsRef.current = ws;

        ws.onopen = () => {
            setConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

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
            console.error("❌ Lỗi:", error);
            setConnected(false);
        };

        ws.onclose = () => {
            setConnected(false);
        };

        return () => {
            ws.close();
        };
    }, [selectedCoin.symbol]);

    const formatPrice = (n?: number) =>
        n === undefined || n === null
            ? "--"
            : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formatPercent = (n?: number) =>
        n === undefined || n === null ? "--" : n.toFixed(2);

    const isPositive = (ticker?.priceChangePercent ?? 0) >= 0;
    const changeColor = isPositive ? "#0ECB81" : "#F6465D";

    return (
            <div
                className="container-fluid py-4 pt-0"
                style={{ minHeight: "100vh", marginTop: "10px", backgroundColor: "#000" }}
            >
                <div className="mb-3">
                    <StatCards />
                </div>

                <div className="row g-4 mb-3">
                    <div className="col-12 col-lg-8">
                        <div
                            className="card p-4 h-100"
                            style={{
                                backgroundColor: "#000",
                                borderRadius: "12px",
                                border: "1px solid #1a1a1a",
                            }}
                        >
                            <div className="d-flex align-items-center flex-wrap gap-4">
                                <div ref={selectorRef} style={{ position: "relative" }}>
                                    <div
                                        className="d-flex align-items-center gap-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setIsOpenSearch((o) => !o)}
                                    >
                                        <div
                                            className="bg-warning rounded-circle d-flex align-items-center justify-content-center"
                                            style={{ width: "24px", height: "24px" }}
                                        >
                                            <TrendingUp size={14} color="#000" />
                                        </div>

                                        <h5 className="text-white fw-bold mb-0">
                                            {selectedCoin.symbol}/USDT
                                        </h5>

                                        <span
                                            style={{
                                                color: "#5c6478",
                                                fontSize: 11,
                                                transform: isOpenSearch ? "rotate(180deg)" : "rotate(0)",
                                                transition: "transform 0.2s",
                                                display: "inline-block",
                                            }}
                                        >
                                            ▼
                                        </span>

                                        <span className="badge bg-secondary text-white-50" style={{ fontSize: "10px" }}>
                                            10x
                                        </span>

                                        <Star size={16} className="text-secondary ms-1" />

                                        <span style={{ fontSize: 11, color: connected ? "#0ECB81" : "#F6465D" }}>
                                            {connected ? "● Live" : "○ Offline"}
                                        </span>
                                    </div>

                                    {isOpenSearch && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                left: 0,
                                                zIndex: 1000,
                                            }}
                                        >
                                            <CoinSelector
                                                selectedCoin={selectedCoin}
                                                onSelect={(coin) => {
                                                    setSelectedCoin(coin);
                                                    setIsOpenSearch(false);
                                                }}
                                                onClose={() => setIsOpenSearch(false)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex flex-column">
                                    <div className="fw-bold fs-5" style={{ color: changeColor }}>
                                        ${formatPrice(ticker?.lastPrice)}
                                    </div>
                                    <div style={{ color: changeColor, fontSize: "12px" }}>
                                        {isPositive ? "+" : ""}
                                        {formatPrice(ticker?.priceChange)}
                                        {" "}(
                                        {isPositive ? "+" : ""}
                                        {formatPercent(ticker?.priceChangePercent)}%)
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-4 flex-wrap">
                                    <div className="d-flex flex-column">
                                        <span className="text-secondary" style={{ fontSize: "12px" }}>
                                            Giá thấp 24h
                                        </span>
                                        <span className="text-white small">
                                            ${formatPrice(ticker?.lowPrice)}
                                        </span>
                                    </div>

                                    <div className="d-flex flex-column">
                                        <span className="text-secondary" style={{ fontSize: "12px" }}>
                                            Giá cao 24h
                                        </span>
                                        <span className="text-white small">
                                            ${formatPrice(ticker?.highPrice)}
                                        </span>
                                    </div>

                                    <div className="d-flex flex-column">
                                        <span className="text-secondary" style={{ fontSize: "12px" }}>
                                            KL 24h {selectedCoin.symbol}
                                        </span>
                                        <span className="text-white small">
                                            {ticker?.volume !== undefined ? ticker.volume.toFixed(2) : "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex mt-3">
                                <DashboardChart symbol={`${selectedCoin.symbol}USDT`} />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div
                            className="card p-4 h-100"
                            style={{
                                backgroundColor: "#000",
                                borderRadius: "12px",
                                border: "1px solid #1a1a1a",
                            }}
                        >
                            <h5 className="text-white fw-bold mb-3">Tín hiệu giao dịch (AI)</h5>

                            <div className="list-group list-group-flush">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="list-group-item bg-transparent border-secondary px-0 py-3 d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <div className="text-white small fw-bold">
                                                {selectedCoin.symbol}/USDT
                                            </div>
                                            <div className="text-success" style={{ fontSize: "11px" }}>
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
            </div>
    );
}