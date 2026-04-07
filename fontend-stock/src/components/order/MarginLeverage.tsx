import React from "react";

// export const MarginLeverage = () => {
//   return (
//     <>
//       {/* Cross + Leverage */}
//       <div style={{ display: "flex", gap: "10px" }}>
//         <button
//           type="button"
//           style={topButtonStyle}
//           onClick={() => {
//             setTempMarginMode(marginMode);
//             setShowMarginModal(true);
//           }}
//         >
//           {marginMode}
//         </button>

//         <button
//           type="button"
//           style={topButtonStyle}
//           onClick={() => {
//             setTempLeverage(leverage);
//             setShowLeverageModal(true);
//           }}
//         >
//           {leverage}x
//         </button>
//       </div>
//     </>
//   );
// };

const topButtonStyle: React.CSSProperties = {
  flex: 1,
  height: "42px",
  background: "#11161F",
  border: "1px solid #1E2329",
  color: "#B7BDC6",
  fontWeight: 600,
  borderRadius: "8px",
  cursor: "pointer",
};
