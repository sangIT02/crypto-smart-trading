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
    symbol: string,
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
    symbol: string;
};
// ================================================================
// COMPONENT
// ================================================================
const TradingChart: React.FC = () => {
    const [status, setStatus] = useState('Đang khởi động...');
    const [lastPrice, setLastPrice] = useState<number | null>(null);
    const [timeframe, setTimeframe] = useState('1h');
    const [isLoading, setIsLoading] = useState(false);

    const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1w', '1M'];

    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const candlesRef = useRef<CandlestickData[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const isLoadingRef = useRef(false);
    const currentTfRef = useRef(timeframe);
    const tooltipRef = useRef<HTMLDivElement>(null); // ← THÊM MỚI

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

        // ================================
        // TOOLTIP - THÊM MỚI
        // ================================
        chart.subscribeCrosshairMove((param) => {
            const tooltip = tooltipRef.current;
            if (!tooltip) return;

            if (!param.time || !param.point || param.point.x < 0 || param.point.y < 0) {
                tooltip.style.display = 'none';
                return;
            }

            const data = param.seriesData.get(series) as CandlestickData;
            if (!data) return;

            const { open, high, low, close } = data;
            const isUp = close >= open;
            const color = isUp ? '#26a69a' : '#ef5350';
            const change = ((close - open) / open * 100).toFixed(2);
            const sign = isUp ? '+' : '';

            const date = new Date((param.time as number) * 1000);
            const timeStr = date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            const fmt = (v: number) =>
                v.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                });

            tooltip.innerHTML = `
                <div style="color:#888;font-size:11px;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #2a2e39">${timeStr}</div>
                <div style="display:grid;grid-template-columns:auto auto;gap:4px 20px;font-size:12px">
                    <span style="color:#888">Mở</span>   <span style="color:${color}">${fmt(open)}</span>
                    <span style="color:#888">Đóng</span> <span style="color:${color}">${fmt(close)}</span>
                    <span style="color:#888">Cao</span>  <span style="color:#26a69a">${fmt(high)}</span>
                    <span style="color:#888">Thấp</span> <span style="color:#ef5350">${fmt(low)}</span>
                    <span style="color:#888">Thay đổi</span> <span style="color:${color}">${sign}${change}%</span>
                </div>
            `;

            tooltip.style.display = 'block';

            const containerWidth = chartContainerRef.current?.clientWidth ?? 0;
            let left = param.point.x + 16;
            if (left + 190 > containerWidth) left = param.point.x - 206;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${Math.max(0, param.point.y - 80)}px`;
        });
        // ================================
        // END TOOLTIP
        // ================================

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
            const candles = await fetchKlines(activeSymbol, tf);
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
        if (isLoadingRef.current) return;
        if (!candlesRef.current.length) return;
        if (!seriesRef.current) return;

        isLoadingRef.current = true;
        setStatus('Đang tải thêm nến cũ...');

        try {
            const oldestTime = Number(candlesRef.current[0].time) * 1000;
            const endTime    = oldestTime - 1;

            const older = await fetchKlines(activeSymbol, currentTfRef.current, endTime);
            if (!older.length) {
                setStatus('✅ Đã tải hết lịch sử');
                return;
            }

            const merged = [...older, ...candlesRef.current];

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

            const oldestTime = Number(candlesRef.current[0].time);
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
            const k    = msg.k;
            if (!k || !seriesRef.current) return;

            const newCandle: CandlestickData = {
                time:  Math.floor(k.t / 1000) as UTCTimestamp,
                open:  parseFloat(k.o),
                high:  parseFloat(k.h),
                low:   parseFloat(k.l),
                close: parseFloat(k.c),
            };

            setLastPrice(parseFloat(k.c));
            seriesRef.current.update(newCandle);

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

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        loadInitialData(timeframe);
        connectWebSocket(timeframe);

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

                            {lastPrice && (
                                <span style={{ color: '#26a69a', fontWeight: 600, fontSize: 15 }}>
                                    {lastPrice.toFixed(calcPrecision(lastPrice).precision)}
                                </span>
                            )}

                            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>
                                {isLoading ? '⏳ ' : ''}{status}
                            </span>
                        </div>

                        {/* Dropdown */}
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

                    {/* CHART ← THÊM MỚI: bọc position relative + tooltip div */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <div
                            ref={chartContainerRef}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '6px',
                                overflow: 'hidden',
                            }}
                        />
                        <div
                            ref={tooltipRef}
                            style={{
                                display: 'none',
                                position: 'absolute',
                                pointerEvents: 'none',
                                zIndex: 10,
                                background: '#0d0f1a',
                                border: '1px solid #2a2e39',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#d1d4dc',
                                minWidth: '175px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                            }}
                        />
                    </div>
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
// HELPER — Tính số giây của mỗi interval
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