import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    createChart,
    ColorType,
    type IChartApi,
    type ISeriesApi,
    CandlestickSeries,
    type CandlestickData,
    type UTCTimestamp
} from 'lightweight-charts';
import { OrderForm } from '../order/OrderForm';
import { CoinSelector, MOCK_COINS } from '../TabBtn';
import { useCoinStore } from '../../store/coinStore';
import { PositionContainer } from '../position/PositionContainer';

// ================================================================
// CONFIG
// ================================================================
const BINANCE_REST = 'https://api.binance.com/api/v3/klines';
const BINANCE_WS = 'wss://stream.binance.com:9443/ws';
const BATCH_SIZE = 500; // Số nến mỗi lần load

// ================================================================
// HELPER
// ================================================================
function calcPrecision(price: number): { precision: number; minMove: number } {
    if (price >= 1000) return { precision: 2, minMove: 0.01 };
    if (price >= 100) return { precision: 2, minMove: 0.01 };
    if (price >= 1) return { precision: 4, minMove: 0.0001 };
    if (price >= 0.01) return { precision: 5, minMove: 0.00001 };
    if (price >= 0.001) return { precision: 6, minMove: 0.000001 };
    return { precision: 8, minMove: 0.00000001 };
}
const parseCandles = (raw: any[][]): CandlestickData[] =>
    raw.map(k => ({
        time: Math.floor(Number(k[0]) / 1000) as UTCTimestamp,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
    }));

const fetchKlines = async (
    symbol: string, // ← thêm vào
    interval: string,
    endTime?: number,
    startTime?: number
): Promise<CandlestickData[]> => {
    let url = `${BINANCE_REST}?symbol=${symbol}&interval=${interval}&limit=${BATCH_SIZE}`;
    if (endTime) url += `&endTime=${endTime}`;
    if (startTime) url += `&startTime=${startTime}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
    const json = await res.json();
    return parseCandles(json);
};

type Props = {
    symbol: string; // "BTCUSDT", "ETHUSDT"...
};
// ================================================================
// COMPONENT
// ================================================================
const TradingChart: React.FC= () => {
    const [status, setStatus] = useState('Đang khởi động...');
    const [lastPrice, setLastPrice] = useState<number | null>(null);
    const [timeframe, setTimeframe] = useState('1h');
    const [isLoading, setIsLoading] = useState(false);

    const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1w', '1M'];

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const candlesRef = useRef<CandlestickData[]>([]);   // Cache toàn bộ nến
    const wsRef = useRef<WebSocket | null>(null);
    const isLoadingRef = useRef(false);                   // Tránh load 2 lần cùng lúc
    const currentTfRef = useRef(timeframe);               // Ref để dùng trong closure
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const selectedCoin    = useCoinStore(s => s.selectedCoin);
    const setSelectedCoin = useCoinStore(s => s.setSelectedCoin);
    const activeSymbol  = `${selectedCoin.symbol}USDT`;
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
    // ================================
    // 1. TẠO CHART
    // ================================
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' },
                textColor:  '#B2B5BE',
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            grid: {
                vertLines: { color: '#1e222d' },
                horzLines: { color: '#1e222d' },
            },
            crosshair: { mode: 1 },
            rightPriceScale: { borderColor: '#2a2e39' },
            timeScale: {
                timeVisible:   true,
                borderColor:   '#2a2e39',
                rightOffset:   10,
                barSpacing:    8,
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor:      '#26a69a',
            downColor:    '#ef5350',
            borderVisible: false,
            wickUpColor:   '#26a69a',
            wickDownColor: '#ef5350',
        });

        chartRef.current  = chart;
        seriesRef.current = series;

        // Resize
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries.length) return;
            chart.applyOptions({ width: entries[0].contentRect.width });
        });
        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
        };
    }, []);

    // ================================
    // 2. LOAD LỊCH SỬ BAN ĐẦU
    // ================================
    const loadInitialData = useCallback(async (tf: string) => {
        if (!seriesRef.current) return;

        setStatus('Đang tải...');
        setIsLoading(true);
        candlesRef.current = [];

        try {
            const candles = await fetchKlines(activeSymbol, tf); // ← thêm symbol
            if (!candles.length) { setStatus('Không có dữ liệu'); return; }

            candlesRef.current = candles;
            seriesRef.current.setData(candles);
            const lastPrice = candles[candles.length - 1].close;
            const { precision, minMove } = calcPrecision(lastPrice);
            seriesRef.current.applyOptions({
                priceFormat: { type: 'price', precision, minMove }
            });
            setLastPrice(candles[candles.length - 1].close);
            chartRef.current?.timeScale().fitContent();
            setStatus(`✅ ${candles.length} nến`);
        } catch (err) {
            console.error(err);
            setStatus('❌ Lỗi tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    }, [activeSymbol]);

    // ================================
    // 3. LOAD THÊM NẾN CŨ (kéo trái)
    // ================================
    const loadMoreHistory = useCallback(async () => {
        if (isLoadingRef.current) return;           // Đang load rồi → bỏ qua
        if (!candlesRef.current.length) return;
        if (!seriesRef.current) return;

        isLoadingRef.current = true;
        setStatus('Đang tải thêm nến cũ...');

        try {
            // endTime = openTime của nến cũ nhất hiện tại - 1ms
            const oldestTime = Number(candlesRef.current[0].time) * 1000;
            const endTime    = oldestTime - 1;

            const older = await fetchKlines(activeSymbol,currentTfRef.current, endTime);
            if (!older.length) {
                setStatus('✅ Đã tải hết lịch sử');
                return;
            }

            // Gộp nến cũ vào đầu
            const merged = [...older, ...candlesRef.current];

            // Loại bỏ duplicate theo time
            const seen = new Set<number>();
            const unique = merged.filter(c => {
                const t = Number(c.time);
                if (seen.has(t)) return false;
                seen.add(t);
                return true;
            });

            unique.sort((a, b) => Number(a.time) - Number(b.time));
            candlesRef.current = unique;

            seriesRef.current.setData(unique);
            setStatus(`✅ ${unique.length} nến`);
        } catch (err) {
            console.error(err);
            setStatus('❌ Lỗi tải thêm');
        } finally {
            isLoadingRef.current = false;
        }
    }, [activeSymbol]);

    // ================================
    // 4. ĐĂNG KÝ SỰ KIỆN KÉO TRÁI
    // ================================
    useEffect(() => {
        if (!chartRef.current) return;

        const handleVisibleRangeChange = () => {
            if (!chartRef.current || !candlesRef.current.length) return;

            const range = chartRef.current.timeScale().getVisibleRange();
            if (!range) return;

            // Lấy thời gian nến cũ nhất đang có
            const oldestTime = Number(candlesRef.current[0].time);

            // Nếu đang xem gần tới nến cũ nhất → load thêm
            // (khi visible range từ nến đầu tiên còn < 50 nến)
            const threshold = oldestTime + 50 * getIntervalSeconds(currentTfRef.current);
            if (Number(range.from) < threshold) {
                loadMoreHistory();
            }
        };

        chartRef.current.timeScale().subscribeVisibleTimeRangeChange(handleVisibleRangeChange);

        return () => {
            chartRef.current?.timeScale().unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange);
        };
    }, [loadMoreHistory]);

    // ================================
    // 5. WEBSOCKET — NẾN REALTIME
    // ================================
    const connectWebSocket = useCallback((tf: string) => {
        // Đóng kết nối cũ
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const stream = `${activeSymbol.toLowerCase()}@kline_${tf}`;
        const ws = new WebSocket(`${BINANCE_WS}/${stream}`);

        ws.onopen = () => {
            console.log(`✅ WebSocket connected: ${stream}`);
        };

        ws.onmessage = (event) => {
            const msg  = JSON.parse(event.data);
            const k    = msg.k; // kline data
            if (!k || !seriesRef.current) return;

            const newCandle: CandlestickData = {
                time:  Math.floor(k.t / 1000) as UTCTimestamp,
                open:  parseFloat(k.o),
                high:  parseFloat(k.h),
                low:   parseFloat(k.l),
                close: parseFloat(k.c),
            };

            // Update giá hiển thị
            setLastPrice(parseFloat(k.c));

            // Cập nhật nến trên chart (update nến hiện tại hoặc thêm nến mới)
            seriesRef.current.update(newCandle);

            // Nến đóng (k.x = true) → thêm vào cache
            if (k.x) {
                const last = candlesRef.current[candlesRef.current.length - 1];
                if (!last || Number(last.time) !== Number(newCandle.time)) {
                    candlesRef.current.push(newCandle);
                }
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };

        wsRef.current = ws;
    }, [activeSymbol]);

    // ================================
    // 6. KHI ĐỔI TIMEFRAME
    // ================================
    useEffect(() => {
        currentTfRef.current = timeframe;

        candlesRef.current = [];
        seriesRef.current?.setData([]);
        setLastPrice(null);
    
        // Đóng socket cũ
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    
        // Load data mới + mở socket mới
        loadInitialData(timeframe);
        connectWebSocket(timeframe);

        // Cleanup khi đổi timeframe hoặc unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [timeframe, activeSymbol]);

    // ================================
    // UI
    // ================================
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                display: 'flex',
                flex: 1,
                width: '100%',
                padding: '10px',
                gap: '10px',
            }}>

                {/* CHART PANEL */}
                <div style={{ flex: '0 0 75%', display: 'flex', flexDirection: 'column' }}>

                    {/* HEADER */}
                    <div ref={selectorRef} style={{ position: 'relative' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '8px',
                            backgroundColor: '#000',
                            padding: '8px 12px',
                            border: '1px solid #2E2E2E',
                            borderRadius: '6px',
                        }}>
                            {/* Symbol — click để mở selector */}
                            <div
                                onClick={() => setIsOpenSearch(o => !o)}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                            >
                                <img
                                    src={selectedCoin.image}
                                    width={20} height={20}
                                    style={{ borderRadius: '50%' }}
                                />
                                {/* ✅ Bỏ USDT */}
                                <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>
                                    {selectedCoin.symbol}
                                    <span style={{ color: '#5c6478', fontWeight: 400 }}>/USDT</span>
                                </span>
                                <span style={{
                                    fontSize: 11,
                                    color: '#5c6478',
                                    transform: isOpenSearch ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.2s',
                                    display: 'inline-block',
                                }}>▼</span>
                            </div>

                            {/* ✅ Giá đúng precision */}
                            {lastPrice && (
                                <span style={{ color: '#26a69a', fontWeight: 600, fontSize: 15 }}>
                                    {lastPrice.toFixed(calcPrecision(lastPrice).precision)}
                                </span>
                            )}

                            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>
                                {isLoading ? '⏳ ' : ''}{status}
                            </span>
                        </div>

                        {/* Dropdown — nằm ngoài header div */}
                        {isOpenSearch && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% - 4px)',
                                left: 0,
                                zIndex: 1000,
                            }}>
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


                    {/* TIMEFRAME BUTTONS */}
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '8px',
                        backgroundColor: '#000',
                        padding: '6px',
                        borderRadius: '6px',
                        flexWrap: 'wrap',
                        border: "1px solid #2E2E2E",

                    }}>
                        {timeframes.map(tf => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                style={{
                                    background: timeframe === tf ? '#2962ff' : 'transparent',
                                    color: timeframe === tf ? '#fff' : '#666',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 10px',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: timeframe === tf ? 600 : 400,
                                    transition: 'all 0.15s',
                                }}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    {/* CHART */}
                    <div
                        ref={chartContainerRef}
                        style={{
                            flex: 1,
                            width: '100%',
                            borderRadius: '6px',
                            overflow: 'hidden',
                        }}
                    />
                </div>

                {/* ORDER FORM */}
                <OrderForm
                    symbol={`${activeSymbol}`}
                    currentPrice={lastPrice}
                    balance={0}
                    onSubmit={() => { }}
                />
            </div>
        </div>
    );
};

export default TradingChart;

// ================================================================
// HELPER — Tính số giây của mỗi interval (dùng để tính threshold)
// ================================================================
function getIntervalSeconds(interval: string): number {
    const map: Record<string, number> = {
        '1s': 1, '1m': 60, '3m': 180,
        '5m': 300, '15m': 900, '30m': 1800,
        '1h': 3600, '2h': 7200, '4h': 14400,
        '6h': 21600, '8h': 28800, '12h': 43200,
        '1d': 86400, '3d': 259200, '1w': 604800,
        '1M': 2592000,
    };
    return map[interval] ?? 3600;
}