import type { MaSignalsResponse } from "../../services/coinService";

function MAItem({ name, maPrice, marketPrice }: { name: string; maPrice: number, marketPrice: number} ) {
  function getMASignal(price: number, ma: number) {
  const diff = (price - ma) / ma;

  if (diff > 0.01) return "Mua Mạnh";
  if (diff > 0.002) return "Mua";
  if (diff < -0.01) return "Bán Mạnh";
  if (diff < -0.002) return "Bán";
  return "Trung lập";
}
  const signal = getMASignal(marketPrice, maPrice);
  const getColor = () => {
    if (signal === "Mua Mạnh") return "#00c087";
    if (signal === "Mua") return "#2ecc71";
    if (signal === "Bán Mạnh" || signal === "Bán") return "#ff4d4f";
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
      <div style={{ color: "#fff", fontWeight: 500, fontSize:"14px"}}>{name}</div>

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
          {signal}
        </div>
      </div>
    </div>
  );
}

export default function MAList({ data }: { data: MaSignalsResponse }) {
  

  return (
    <div style={{ marginTop: "20px" }}>
      <h5 style={{ color: "#aaa", textAlign: "center"}}>
        ĐƯỜNG TRUNG BÌNH ĐỘNG
      </h5>
        <MAItem name={"EMA7"} maPrice={data.ema7} marketPrice={data.marketPrice} />
        <MAItem name={"SMA7"} maPrice={data.sma7} marketPrice={data.marketPrice}/>
        <MAItem name={"EMA25"} maPrice={data.ema25} marketPrice={data.marketPrice}/>
        <MAItem name={"SMA25"} maPrice={data.sma25} marketPrice={data.marketPrice}/>
        <MAItem name={"SMA99"} maPrice={data.sma99} marketPrice={data.marketPrice}/>
        <MAItem name={"EMA99"} maPrice={data.ema99} marketPrice={data.marketPrice}/>

    </div>
  );
}