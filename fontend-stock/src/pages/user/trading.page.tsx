import { AppLayout } from '../../layout/MainLayout';
import TradingChart from '../../components/chart/trading.chart';
import { useEffect, useRef, useState } from 'react';
import { MOCK_COINS } from '../../components/TabBtn';
import { PositionContainer } from '../../components/position/PositionContainer';

export const Trading = () => {
    return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '160%', gap: '2px' }}>
                <div style={{ flex: 2 }}>
                    <TradingChart/>
                </div>
                <div style={{ flex: 1,}}>
                    <PositionContainer/>
                </div>
            </div>
    );
}
