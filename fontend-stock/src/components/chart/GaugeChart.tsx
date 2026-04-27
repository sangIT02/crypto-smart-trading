import GaugeComponent from "react-gauge-component";

type GaugeProps = {
  buy: number;
  sell: number;
  neutral: number;
};

export function GaugeChart({ buy, sell, neutral }: GaugeProps) {
  function getSignal(buy: number, sell: number, neutral: number) {
    const total = buy + sell + neutral;

    if (total === 0) return "Trung lập";

    const buyRatio = buy / total;
    const sellRatio = sell / total;

    if (buyRatio >= 0.7) return "Mua Mạnh";
    if (buyRatio >= 0.55) return "Mua";

    if (sellRatio >= 0.7) return "Bán Mạnh";
    if (sellRatio >= 0.55) return "Bán";

    return "Trung lập";
  }

  const signal = getSignal(buy, sell, neutral);

  // 🔥 mapping value cho gauge
  const total = buy + sell + neutral;
  let value = 50;

  if (total > 0) {
    value = ((buy - sell) / total) * 50 + 50;
  }

  return (
    <div
      style={{
        width: 250,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <GaugeComponent
        type="semicircle"
        value={value}
        arc={{
          gradient: true,
          subArcs: [
            { limit: 33, color: "#EA4228" },
            { limit: 66, color: "#F5CD19" },
            { limit: 100, color: "#5BE12C" },
          ],
        }}
        pointer={{ type: "arrow"
}}
        labels={{
          tickLabels: {
            hideMinMax: true,
          },
          valueLabel: {
            style: { display: "none" },
          },
        }}
      />

      {/* TEXT GIỮA */}
      <div
        style={{
          position: "absolute",
          top: "90%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#fff",
          
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: 600 }}>
          {signal}
        </div>
      </div>
    </div>
  );
}