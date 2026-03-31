import { AppLayout } from '../layout/MainLayout';
import TradingChart from '../components/chart/trading.chart';
import { useEffect, useRef, useState } from 'react';
import { MOCK_COINS } from '../components/TabBtn';

export const Trading = () => {
    return (
        <AppLayout>
            <div>
                <TradingChart/>
            </div>
        </AppLayout>
    );
}
