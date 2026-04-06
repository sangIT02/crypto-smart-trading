import axios from "axios";
import React, { use, useEffect } from "react";
import { orderService, type BinanceOrder } from "../../services/orderService";

export const formatBinanceTime = (timestamp: number) => {
  const dateObj = new Date(timestamp);

  // Lấy Ngày - Tháng - Năm
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
  const day = String(dateObj.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  // Lấy Giờ - Phút - Giây
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
};

export const OpenOrder = () => {
  const [orders, setOrders] = React.useState<BinanceOrder[]>([]);
  const fetchOpenOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      const ordersData = response.data as BinanceOrder[];
      console.log("Fetched open orders:", ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching open orders:", error);
    }
  };
  useEffect(() => {
    fetchOpenOrders();
  }, []);

  const handleCancelOrder = async (
    orderId: number,
    symbol: string,
  ): Promise<void> => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn hủy lệnh ${orderId} cho mã ${symbol} không?`,
    );

    if (!confirmed) return;

    try {
      await orderService.cancelOrder(symbol, orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId),
      );
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };
  return (
    <div className="table-responsive order-table-wrap">
      <table className="table order-table align-middle mb-0">
        <thead>
          <tr>
            <th className="text-start">Giờ</th>
            <th className="text-start">Mã</th>
            <th className="text-start">Loại</th>
            <th className="text-start">Bên</th>
            <th className="text-start">Giá</th>
            <th className="text-start">Số lượng</th>
            <th className="text-start">Đã khớp</th>
            <th className="text-start">Lệnh chỉ giảm</th>
            <th className="text-start">Post Only</th>
            <th className="text-center">TIF</th>
            <th className="text-end sticky-col-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td className="text-start">
                <div>{formatBinanceTime(order.time).date}</div>
                <div className="text-secondary-custom">
                  {formatBinanceTime(order.time).time}
                </div>
              </td>

              <td className="text-start">
                <div className="symbol-name">{order.symbol}</div>
                <span className="order-tag">Vĩnh cửu</span>
              </td>

              <td className="text-start">
                {order.type === "LIMIT" ? "Giới hạn" : "Thị trường"}
              </td>

              <td className="text-start">
                <span className={`side-text side-${order.side.toLowerCase()}`}>
                  {order.side === "BUY" ? "Mua" : "Bán"}
                </span>
              </td>

              <td className="text-start">{order.price}</td>
              <td className="text-start">{order.origQty}</td>
              <td className="text-start">{order.executedQty}</td>

              <td className="text-start">Không</td>
              <td className="text-start">Không</td>
              <td className="text-center">{order.timeInForce}</td>

              <td className="text-end sticky-col-right">
                <button
                  type="button"
                  className="btn btn-link btn-order-delete p-0"
                  onClick={() => handleCancelOrder(order.orderId, order.symbol)}
                >
                  <i className="bi bi-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
