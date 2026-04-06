import React from "react";
import { OpenOrder } from "./OpenOrder";
import { OrderHistory } from "./OrderHistory";
import { PositionHistory } from "./PositionHistory";
import { Tabs } from "antd";
import {OpenPosition} from "./OpenPosition";

const items = [
  {
    key: "position",
    label: "Vị thế mở",
    children: <OpenPosition />,
  },
  {
    key: "order",
    label: "lệnh chờ khớp",
    children: <OpenOrder />,
  },
  {
    key: "order-history",
    label: "Lịch sử lệnh",
    children: <OrderHistory />,
  },
  {
    key: "position-history",
    label: "Lịch sử vị thế",
    children: <PositionHistory />,
  },
];

export const PositionContainer = () => {
  return (
    <div
      style={{
        flex: 1, // Chiếm phần còn lại (25%)
        backgroundColor: "#000",
        borderRadius: "4px",
        padding: "15px",
        border: "1px solid #333",
        height: "100%",
      }}
    >
      {/* Form giả lập */}
      <Tabs defaultActiveKey="position" items={items} />
    </div>
  );
};
