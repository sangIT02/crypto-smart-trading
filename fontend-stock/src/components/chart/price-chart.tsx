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
// ================================================================
// CONFIG
// ================================================================
const BINANCE_REST = 'https://api.binance.com/api/v3/klines';
const BINANCE_WS = 'wss://stream.binance.com:9443/ws';
const BATCH_SIZE = 500;

// ================================================================
// TYPES
// ================================================================
type BinanceKline = [
    number,  // open time
    string,  // open
    string,  // high
    string,  // low
    string,  // close
    string,  // volume
    number,  // close time
    string,  // quote asset volume
    number,  // number of trades
    string,  // taker buy base asset volume
    string,  // taker buy quote asset volume
    string   // ignore
];

type Props = {
    symbol: string;
};

// ================================================================
// HELPERS
// ================================================================
function calcPrecision(price: number): { precision: number; minMove: number } {
    if (price >= 1000) return { precision: 2, minMove: 0.01 };
    if (price >= 100) return { precision: 2, minMove: 0.01 };
    if (price >= 1) return { precision: 4, minMove: 0.0001 };
    if (price >= 0.01) return { precision: 5, minMove: 0.00001 };
    if (price >= 0.001) return { precision: 6, minMove: 0.000001 };
    return { precision: 8, minMove: 0.00000001 };
}

function parseCandles(raw: BinanceKline[]): CandlestickData[] {
    return raw.map((k) => ({
        time: Math.floor(Number(k[0]) / 1000) as UTCTimestamp,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
    }));
}

async function fetchKlines(
    symbol: string,
    interval: string,
    endTime?: number,
    startTime?: number
): Promise<CandlestickData[]> {
    let url = `${BINANCE_REST}?symbol=${symbol}&interval=${interval}&limit=${BATCH_SIZE}`;
    if (endTime) url += `&endTime=${endTime}`;
    if (startTime) url += `&startTime=${startTime}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

    const json: BinanceKline[] = await res.json();
    return parseCandles(json);
}

function getIntervalSeconds(tf: string): number {
    const map: Record<string, number> = {
        '1m': 60,
        '3m': 180,
        '5m': 300,
        '15m': 900,
        '30m': 1800,
        '1h': 3600,
        '2h': 7200,
        '4h': 14400,
        '6h': 21600,
        '12h': 43200,
        '1d': 86400,
        '1w': 604800,
        '1M': 2592000,
    };
    return map[tf] ?? 3600;
}

function formatNumber(value: number | null, digits = 2) {
    if (value === null || Number.isNaN(value)) return '--';
    return value.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

// ================================================================
// COMPONENT
// ================================================================
const DashboardChart: React.FC<Props> = ({ symbol }) => {
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
    const requestIdRef = useRef(0);
    const tooltipRef = useRef<HTMLDivElement>(null); // ← THÊM MỚI
    
const handleDownloadChart = async () => {
    if (!chartRef.current || !chartContainerRef.current) return;

    try {
        setStatus('Đang chụp chart...');
        
        // Lấy canvas từ chart container
        const canvasElement = chartContainerRef.current.querySelector('canvas') as HTMLCanvasElement;
        if (!canvasElement) {
            setStatus('Không tìm thấy canvas');
            return;
        }

        // Tạo canvas mới với độ phân giải cao hơn
        const scale = 2;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvasElement.width * scale;
        newCanvas.height = canvasElement.height * scale + 100; // Thêm không gian cho metadata
        
        const ctx = newCanvas.getContext('2d');
        if (!ctx) {
            setStatus('Lỗi tạo canvas context');
            return;
        }

        // Vẽ nền đen
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Vẽ canvas gốc lên canvas mới với scale
        ctx.scale(scale, scale);
        ctx.drawImage(canvasElement, 0, 0);

        // Reset scale để vẽ text
        ctx.resetTransform();

        // Thêm metadata lên ảnh
        const now = new Date();
        const timeStr = now.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const metadataText = `${symbol} | ${timeframe} | Price: ${lastPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} | ${timeStr}`;

        ctx.fillStyle = '#888888';
        ctx.font = '24px Arial';
        ctx.fillText(metadataText, 20, newCanvas.height - 30);

        // Tải xuống
        newCanvas.toBlob((blob) => {
            if (!blob) {
                setStatus('Lỗi tạo blob');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `trading_chart_${symbol}_${timeframe}_${new Date().getTime()}.png`;
            link.click();
            
            URL.revokeObjectURL(url);
            setStatus('✓ Đã tải ảnh');
            
            setTimeout(() => {
                setStatus('Realtime ' + symbol + ' - ' + timeframe);
            }, 2000);
        }, 'image/png');
        
    } catch (error) {
        console.error('Lỗi khi chụp ảnh biểu đồ:', error);
        setStatus('Lỗi: ' + (error as any).message);
    }
};
    const closeSocket = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    
    // ================================
    // 1. TẠO CHART
    // ================================
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' },
                textColor: '#B2B5BE',
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
                timeVisible: true,
                borderColor: '#2a2e39',
                rightOffset: 10,
                barSpacing: 8,
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        chartRef.current = chart;
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

        const handleResize = () => {
            if (!chartContainerRef.current || !chartRef.current) return;
            chartRef.current.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            closeSocket();
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, [closeSocket]);

    // ================================
    // 2. LOAD DỮ LIỆU BAN ĐẦU
    // ================================
    const loadInitialData = useCallback(async (tf: string) => {
        if (!seriesRef.current) return;

        const requestId = ++requestIdRef.current;
        setIsLoading(true);
        setStatus(`Đang tải dữ liệu ${symbol} - ${tf}...`);

        try {
            closeSocket();

            const candles = await fetchKlines(symbol, tf);

            if (requestId !== requestIdRef.current) return;
            if (!candles.length) {
                setStatus('Không có dữ liệu');
                return;
            }

            candlesRef.current = candles;
            seriesRef.current.setData(candles);

            const latest = candles[candles.length - 1];
            setLastPrice(latest.close);

            const { precision, minMove } = calcPrecision(latest.close);
            seriesRef.current.applyOptions({
                priceFormat: {
                    type: 'price',
                    precision,
                    minMove,
                },
            });

            chartRef.current?.timeScale().fitContent();
            setStatus(`Đã tải ${candles.length} nến`);
        } catch (err) {
            console.error(err);
            if (requestId === requestIdRef.current) {
                setStatus('Lỗi tải dữ liệu');
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [symbol, closeSocket]);

    // ================================
    // 3. LOAD THÊM KHI KÉO VỀ TRÁI
    // ================================
    const loadMoreHistory = useCallback(async () => {
        if (!seriesRef.current || !candlesRef.current.length || isLoadingRef.current) return;

        isLoadingRef.current = true;
        setStatus('Đang tải thêm lịch sử...');

        try {
            const oldest = candlesRef.current[0];
            const endTime = Number(oldest.time) * 1000 - 1;

            const olderCandles = await fetchKlines(symbol, currentTfRef.current, endTime);

            if (!olderCandles.length) {
                setStatus('Không còn dữ liệu cũ hơn');
                return;
            }

            const merged = [...olderCandles, ...candlesRef.current];
            const uniqueMap = new Map<number, CandlestickData>();

            merged.forEach((c) => {
                uniqueMap.set(Number(c.time), c);
            });

            const uniqueSorted = Array.from(uniqueMap.values()).sort(
                (a, b) => Number(a.time) - Number(b.time)
            );

            candlesRef.current = uniqueSorted;
            seriesRef.current.setData(uniqueSorted);
            setStatus(`Đã tải thêm ${olderCandles.length} nến`);
        } catch (err) {
            console.error(err);
            setStatus('Lỗi tải lịch sử');
        } finally {
            isLoadingRef.current = false;
        }
    }, [symbol]);

    // ================================
    // 4. BẮT SỰ KIỆN KÉO TRÁI
    // ================================
    useEffect(() => {
        if (!chartRef.current) return;

        const timeScale = chartRef.current.timeScale();

        const handler = () => {
            const range = timeScale.getVisibleLogicalRange();
            if (!range || !candlesRef.current.length) return;

            const oldestTime = Number(candlesRef.current[0].time);
            const threshold = oldestTime + 50 * getIntervalSeconds(currentTfRef.current);

            if (Number(range.from) < threshold) {
                loadMoreHistory();
            }
        };

        timeScale.subscribeVisibleLogicalRangeChange(handler);

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler);
        };
    }, [loadMoreHistory]);

    // ================================
    // 5. WEBSOCKET REALTIME
    // ================================
    const connectWebSocket = useCallback(() => {
        if (!seriesRef.current) return;

        closeSocket();

        const streamName = `${symbol.toLowerCase()}@kline_${timeframe}`;
        const ws = new WebSocket(`${BINANCE_WS}/${streamName}`);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus(`Realtime ${symbol} - ${timeframe}`);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                const k = message.k;

                if (!k) return;

                const candle: CandlestickData = {
                    time: Math.floor(Number(k.t) / 1000) as UTCTimestamp,
                    open: parseFloat(k.o),
                    high: parseFloat(k.h),
                    low: parseFloat(k.l),
                    close: parseFloat(k.c),
                };

                setLastPrice(candle.close);

                const current = candlesRef.current;
                if (!current.length) return;

                const last = current[current.length - 1];

                if (Number(last.time) === Number(candle.time)) {
                    const updated = [...current];
                    updated[updated.length - 1] = candle;
                    candlesRef.current = updated;
                } else if (Number(candle.time) > Number(last.time)) {
                    candlesRef.current = [...current, candle];
                }

                seriesRef.current?.update(candle);
            } catch (err) {
                console.error('WebSocket parse error:', err);
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            setStatus('Lỗi kết nối realtime');
        };

        ws.onclose = () => {
            setStatus('Đã ngắt realtime');
        };
    }, [symbol, timeframe, closeSocket]);

    // ================================
    // 6. KHI ĐỔI SYMBOL / TIMEFRAME
    // ================================
    useEffect(() => {
        currentTfRef.current = timeframe;
        loadInitialData(timeframe);
    }, [timeframe, symbol, loadInitialData]);

    useEffect(() => {
        if (!candlesRef.current.length) return;
        connectWebSocket();

        return () => {
            closeSocket();
        };
    }, [connectWebSocket, closeSocket]);

    const priceColor =
        lastPrice === null
            ? '#B2B5BE'
            : candlesRef.current.length > 1 &&
            lastPrice >= candlesRef.current[candlesRef.current.length - 1]?.open
            ? '#26a69a'
            : '#ef5350';

    return (
        <div
            style={{
                width: '100%',
                background: '#000',
                border: '1px solid #1a1d26',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    flexWrap: 'wrap',
                }}
            >

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            type="button"
                            onClick={() => setTimeframe(tf)}
                            style={{
                                background: timeframe === tf ? '#171107' : '#070707',
                                border: `1px solid ${timeframe === tf ? '#4a380e' : '#1a1d26'}`,
                                color: timeframe === tf ? '#f0b90b' : '#B2B5BE',
                                fontSize: 12,
                                fontWeight: timeframe === tf ? 700 : 500,
                                padding: '8px 12px',
                                borderRadius: 10,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* ← THÊM MỚI: bọc position relative + div tooltip */}
            <div style={{ position: 'relative' }}>
                <button onClick={handleDownloadChart}>
        Chụp chart
      </button>
                <div
                    ref={chartContainerRef}
                    style={{
                        width: '100%',
                        height: 520,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: '#000',
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
    );
};

export default DashboardChart;