export default function SignalSummary({ sell = 0, neutral = 0, buy = 0 }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "10px",
        color: "#fff",
      }}
    >
      {/* BÁN */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "gray", fontSize: "14px" }}>Bán</div>
        <div style={{ fontSize: "28px", fontWeight: "bold" }}>{sell}</div>
      </div>

      {/* TRUNG LẬP */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "gray", fontSize: "14px" }}>Trung lập</div>
        <div style={{ fontSize: "28px", fontWeight: "bold" }}>{neutral}</div>
      </div>

      {/* MUA */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "gray", fontSize: "14px" }}>Mua</div>
        <div style={{ fontSize: "28px", fontWeight: "bold" }}>{buy}</div>
      </div>
    </div>
  );
}