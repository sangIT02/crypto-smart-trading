import { useState, useEffect, useRef } from "react";
import { AppLayout } from "../../layout/MainLayout";
import { StatCards } from "./stat-card";
import { AlertTriangle, Award, Gauge, Star, TrendingUp, Zap } from "lucide-react";
import { CoinSelector, MOCK_COINS } from "../TabBtn";
import DashboardChart from "../chart/price-chart";
import SignalSummary from "../chart/SignalSummary";
import MAList from "../chart/MAItem";
import {
  coinService,
  type MaSignalsResponse,
} from "../../services/coinService";
import { GaugeChart } from "../chart/GaugeChart";

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
  const [ma, setMA] = useState({
    sma7: 0,
    sma25: 0,
    sma99: 0,
    ema7: 0,
    ema25: 0,
    ema99: 0,
    sellSignal: 0,
    buySignal: 0,
    neutral: 0,
    marketPrice: 0,
  });
  const fetchSignalSummary = async (symbol: string, interval: "1d") => {
    try {
      const response = await coinService.getMaSignals(symbol, interval);
      const data = (await response.data.data) as MaSignalsResponse;
      console.log("MA: ", data);
      setMA({
        sma7: data.sma7,
        sma25: data.sma25,
        sma99: data.sma99,
        ema7: data.ema7,
        ema25: data.ema25,
        ema99: data.ema99,
        sellSignal: data.sellSignal,
        buySignal: data.buySignal,
        neutral: data.neutral,
        marketPrice: data.marketPrice,
      });
      console.log("MA state: ", ma);
    } catch (error) {}
  };
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(e.target as Node)
      ) {
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
    let isCleanedUp = false; // ← flag tránh setState sau cleanup
    fetchSignalSummary(selectedCoin.symbol.toUpperCase()+"USDT", "1d"); // ← fetch tín hiệu MA khi coin thay đổi
    ws.onopen = () => {
      if (!isCleanedUp) setConnected(true);
    };

    ws.onmessage = (event) => {
      if (isCleanedUp) return; // ← bỏ qua message nếu đã cleanup
      const data = JSON.parse(event.data);
      console.log("ticker", data);
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
      if (!isCleanedUp) setConnected(false);
    };

    ws.onclose = () => {
      if (!isCleanedUp) setConnected(false);
    };

    return () => {
      isCleanedUp = true; // ← đánh dấu đã cleanup
      ws.close(); // ← đóng đúng instance ws của effect này
    };
  }, [selectedCoin.symbol]);

  const formatPrice = (n?: number) =>
    n === undefined || n === null
      ? "--"
      : n.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const formatPercent = (n?: number) =>
    n === undefined || n === null ? "--" : n.toFixed(2);

  const isPositive = (ticker?.priceChangePercent ?? 0) >= 0;
  const changeColor = isPositive ? "#0ECB81" : "#F6465D";

  return (
    <div
      className="container-fluid py-4 pt-2"
      style={{ minHeight: "100vh", backgroundColor: "#000" }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "15px",
        marginBottom: "15px"
      }}>
        <div style={{
          backgroundColor: "#0A0A0A",
          borderRadius: "16px",
          border: "1px solid #1F1F1F",
          padding: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#888", fontSize: "14.5px", marginBottom: "8px" }}>PNL Hôm nay</p>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "#0ECB81" }}>+2,847 USDT</p>
            </div>
            <TrendingUp size={42} color="#0ECB81" />
          </div>
        </div>

        <div style={{
          backgroundColor: "#0A0A0A",
          borderRadius: "16px",
          border: "1px solid #1F1F1F",
          padding: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#888", fontSize: "14.5px", marginBottom: "8px" }}>Số lệnh hôm nay</p>
              <p style={{ fontSize: "28px", fontWeight: "700" }}>142</p>
            </div>
            <Zap size={42} color="#F0B90B" />
          </div>
        </div>

        <div style={{
          backgroundColor: "#0A0A0A",
          borderRadius: "16px",
          border: "1px solid #1F1F1F",
          padding: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#888", fontSize: "14.5px", marginBottom: "8px" }}>Win Rate</p>
              <p style={{ fontSize: "28px", fontWeight: "700", color: "#0ECB81" }}>68.4%</p>
            </div>
            <Award size={42} color="#F0B90B" />
          </div>
        </div>

        <div style={{
          backgroundColor: "#0A0A0A",
          borderRadius: "16px",
          border: "1px solid #1F1F1F",
          padding: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#888", fontSize: "14.5px", marginBottom: "8px" }}>Cảnh báo giá đang hoạt động</p>
              <p style={{ fontSize: "28px", fontWeight: "700" }}>12</p>
            </div>
            <AlertTriangle size={42} color="#F59E0B" />
          </div>
        </div>
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

                  <span
                    className="badge bg-secondary text-white-50"
                    style={{ fontSize: "10px" }}
                  >
                    10x
                  </span>

                  <Star size={16} className="text-secondary ms-1" />

                  <span
                    style={{
                      fontSize: 11,
                      color: connected ? "#0ECB81" : "#F6465D",
                    }}
                  >
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
                  {formatPrice(ticker?.priceChange)} ({isPositive ? "+" : ""}
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
                    {ticker?.volume !== undefined
                      ? ticker.volume.toFixed(2)
                      : "--"}
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
            <h5 className="text-white fw-bold mb-3 text-center">
              Tín hiệu giao dịch MA
            </h5>

            <GaugeChart sell={ma.sellSignal} neutral={ma.neutral} buy={ma.buySignal} />
            <SignalSummary sell={ma.sellSignal} neutral={ma.neutral} buy={ma.buySignal} />
            <MAList data={ma}/>
          </div>
        </div>
      </div>
    </div>
  );
}
