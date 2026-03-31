import React, { useEffect, useState } from 'react'
import { AppLayout } from '../layout/MainLayout';
import { Tabs } from "antd";
import coinDataService from '../services/coinDataService';
import MarketTable from '../components/MarketTable';



type CoinProp = {
    "id": string,
    "symbol": string,
    "name": string,
    "image": string,
    "current_price": number,
    "market_cap": number,
    "market_cap_rank": number,
    "fully_diluted_valuation": number,
    "total_volume": number,
    "high_24h": number,
    "low_24h": number,
    "price_change_24h": number,
    "price_change_percentage_24h": number,
    "market_cap_change_24h": number,
    "market_cap_change_percentage_24h": number,
    "circulating_supply": number,
    "total_supply": number,
    "max_supply": number,
    "ath": number,
    "ath_change_percentage": number,
    "last_updated": "2026-03-19T14:51:00.903Z"
}
export const Market = () => {
    const [page, setPage] = useState<number>(1)
    const [coins, setCoins] = useState<CoinProp[]>([]);
    const items = [
        {
            key: "overview",
            label: "Tổng quan",
            children: <OverviewTab coindata={coins}/>,
        },
        {
            key: "trade",
            label: "Dữ liệu giao dịch",
            children: <TradeDataTab />,
        },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await coinDataService.getAllTopCoinMarket(page);
                console.log(res);
                setCoins(res.data)
                console.log(res.data)
                // ví dụ:
                // setCoins(res.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchData(); // 👈 QUAN TRỌNG: phải gọi
    }, [page]); // 👈 gọi lại khi page thay đổi
    return (
        <AppLayout>
            <div style={{ padding: 16, backgroundColor: '#000' }}>
                <Tabs defaultActiveKey="overview" items={items} />
            </div>
        </AppLayout>
    );
}

function OverviewTab({ coindata }: { coindata: CoinProp[] }) {
    return (
        <div style={{ color: "#fff" }}>
            <h4 style={{padding: '10px'}}>Top token theo vốn hóa thị trường</h4>
            <MarketTable data={coindata}/>
        </div>
    );
}

function TradeDataTab() {
    return (
        <div style={{ color: "#fff" }}>
            <h3>Dữ liệu giao dịch</h3>
            <p>Order book, trades, lịch sử...</p>
        </div>
    );
}