import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { Blocks } from "lucide-react";

export interface DataType {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
}

// ✅ columns chuẩn crypto
const columns: TableColumnsType<DataType> = [
    {
        title: "Tên",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (_, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img className="rounded-4" src={record.image} width={35} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                        {record.symbol.toUpperCase()}
                    </span>
                    {
                        record.name.length < 15 &&
                        <span style={{ color: "#848e9c", fontSize: 12 }}>
                            {record.name}
                        </span>

                    }
                </div>
            </div>
        ),
        width: 200
    },
    {
        title: "Giá",
        dataIndex: "current_price",
        sorter: (a, b) => a.current_price - b.current_price,
        render: (price) => <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>
            {formatPrice(price)} $
        </span>,
        width: 150

    },
    {
        title: "Thay đổi 24h",
        dataIndex: "price_change_percentage_24h",
        sorter: (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h,
        render: (value) => (
            <span style={{ color: value >= 0 ? "#0ecb81" : "#f6465d" }}>
                {value?.toFixed(2)}%
            </span>
        ),
    },
    {
        title: "Vốn hoá",
        dataIndex: "market_cap",
        sorter: (a, b) => a.market_cap - b.market_cap,
        render: (value) => `${formatMarketCap(value)}`,
    },
];

// ✅ nhận data từ props
type Props = {
    data: DataType[];
};
const formatPrice = (price: number) => {
    if (!price) return "-";

    if (price >= 1) {
        return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    if (price >= 0.01) {
        return price.toFixed(4);
    }

    if (price >= 0.0001) {
        return price.toFixed(6);
    }

    return price.toFixed(8); // coin siêu nhỏ kiểu SHIB
};
const formatMarketCap = (value: number) => {
    if (!value) return "-";

    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)} T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)} B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)} M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)} K`;

    return `$${value}`;
};
const MarketTable: React.FC<Props> = ({ data }) => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{
                position: ["bottomCenter"], // 👈 nằm giữa
            }} />
    );
};

export default MarketTable;