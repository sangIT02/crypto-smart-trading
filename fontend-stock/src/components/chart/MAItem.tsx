import type { MaSignalsResponse } from "../../services/coinService";

export type MASignal = "strong-buy" | "buy" | "neutral" | "sell" | "strong-sell";

export function getMASignal(price: number, ma: number): MASignal {
  if (!Number.isFinite(price) || !Number.isFinite(ma) || ma <= 0) {
    return "neutral";
  }

  const diff = (price - ma) / ma;

  if (diff > 0.01) return "strong-buy";
  if (diff > 0.002) return "buy";
  if (diff < -0.01) return "strong-sell";
  if (diff < -0.002) return "sell";
  return "neutral";
}

export function getMASignalSummary(data: MaSignalsResponse) {
  const signals = [
    getMASignal(data.marketPrice, data.ema7),
    getMASignal(data.marketPrice, data.sma7),
    getMASignal(data.marketPrice, data.ema25),
    getMASignal(data.marketPrice, data.sma25),
    getMASignal(data.marketPrice, data.sma99),
    getMASignal(data.marketPrice, data.ema99),
  ];

  return signals.reduce(
    (summary, signal) => {
      if (signal === "buy" || signal === "strong-buy") summary.buy += 1;
      else if (signal === "sell" || signal === "strong-sell") summary.sell += 1;
      else summary.neutral += 1;

      return summary;
    },
    { sell: 0, neutral: 0, buy: 0 }
  );
}

function getMASignalLabel(signal: MASignal) {
  switch (signal) {
    case "strong-buy":
      return "Mua Mạnh";
    case "buy":
      return "Mua";
    case "strong-sell":
      return "Bán Mạnh";
    case "sell":
      return "Bán";
    default:
      return "Trung lập";
  }
}

function MAItem({
  name,
  maPrice,
  marketPrice,
}: {
  name: string;
  maPrice: number;
  marketPrice: number;
}) {
  const signal = getMASignal(marketPrice, maPrice);
  const getColor = () => {
    if (signal === "strong-buy") return "#00c087";
    if (signal === "buy") return "#2ecc71";
    if (signal === "strong-sell" || signal === "sell") return "#ff4d4f";
    return "#999";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <div style={{ color: "#fff", fontWeight: 500, fontSize: "14px" }}>{name}</div>

      <div style={{ textAlign: "right" }}>
        <div style={{ color: "#fff", marginBottom: "5px", fontSize: "13px" }}>
          ${maPrice.toLocaleString()}
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "5px",
            borderRadius: "5px",
            color: getColor(),
            fontSize: "14px",
            display: "inline-block",
          }}
        >
          {getMASignalLabel(signal)}
        </div>
      </div>
    </div>
  );
}

export default function MAList({ data }: { data: MaSignalsResponse }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h5 style={{ color: "#aaa", textAlign: "center" }}>
        ĐƯỜNG TRUNG BÌNH ĐỘNG
      </h5>
      <MAItem name="EMA7" maPrice={data.ema7} marketPrice={data.marketPrice} />
      <MAItem name="SMA7" maPrice={data.sma7} marketPrice={data.marketPrice} />
      <MAItem name="EMA25" maPrice={data.ema25} marketPrice={data.marketPrice} />
      <MAItem name="SMA25" maPrice={data.sma25} marketPrice={data.marketPrice} />
      <MAItem name="SMA99" maPrice={data.sma99} marketPrice={data.marketPrice} />
      <MAItem name="EMA99" maPrice={data.ema99} marketPrice={data.marketPrice} />
    </div>
  );
}
