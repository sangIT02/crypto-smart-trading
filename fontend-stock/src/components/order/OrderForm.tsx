import React, { useState } from 'react'
import { OrderType } from './OrderType';
import { ConfigProvider, Slider, Tabs, theme } from 'antd';
import { LimitOrder } from './LimitOrder';
import { MarketOrder } from './MarketOrder';

type OrderFormProps = {
    symbol: string;           // Mã CK (VD: VCB)
    currentPrice: number | null; // Giá thị trường hiện tại
    balance?: number;         // Sức mua (Optional)
    onSubmit: (type: 'BUY' | 'SELL', quantity: number, price: number) => void; // Hàm callback gửi lên cha
}
export type MarginMode = "Cross" | "Isolated";


export const OrderForm = ({ symbol, currentPrice, onSubmit }: OrderFormProps) => {
    const [leverage, setLeverage] = useState<number>(1); // Mặc định 1x
    const [marginMode, setMarginMode] = useState<MarginMode>('Cross'); // Mặc định Cross

    const items = [
        {
            key: "limit",
            label: "Giới hạn",
            children: (
                <LimitOrder 
                    symbol={symbol} 
                    // 2. Truyền state và hàm set state xuống LimitOrder
                    leverage={leverage}
                    setLeverage={setLeverage}
                    marginMode={marginMode}
                    setMarginMode={setMarginMode}
                />
            ),
        },
        {
            key: "market",
            label: "Thị trường",
            children: (
                <MarketOrder 
                    symbol={symbol} 
                    marketPrice={currentPrice} 
                    // 3. Truyền state và hàm set state xuống MarketOrder
                    leverage={leverage}
                    setLeverage={setLeverage}
                    marginMode={marginMode}
                    setMarginMode={setMarginMode}
                />
            ),
        },
    ];
    return (
        <div style={{
            flex: 1, // Chiếm phần còn lại (25%)
            backgroundColor: '#000',
            borderRadius: '4px',
            padding: '15px',
            border: '1px solid #333'
        }}>
            {/* Form giả lập */}
            <Tabs defaultActiveKey="overview" items={items} />
        </div>
    )
}
