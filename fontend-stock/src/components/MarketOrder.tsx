import React, { useMemo, useState } from 'react';
import { Slider } from 'antd';
import { OrderType } from './OrderType';
import { TPSL } from './TPSL';

export const MarketOrder = ({ symbol }: { symbol: string }) => {
    const balance = 5000;
    const markPrice = 66000; // giá market hiện tại, sau này thay bằng data từ BE / websocket

    const [showSltp, setShowSltp] = useState(false);
    const [leverage, setLeverage] = useState(10);
    const [percent, setPercent] = useState(0);

    const MIN_LEV = 1;
    const MAX_LEV = 125;

    const clampPct = (v: number) => Math.min(Math.max(v, 0), 100);

    const totalUsdt = useMemo(() => {
        return (percent / 100) * balance;
    }, [percent, balance]);

    const quantity = useMemo(() => {
        if (!markPrice || markPrice <= 0) return 0;
        return (totalUsdt * leverage) / markPrice;
    }, [totalUsdt, leverage, markPrice]);

    const estimatedCost = useMemo(() => {
        return totalUsdt;
    }, [totalUsdt]);

    // ── Leverage handlers ──────────────────────────────
    const increaseLev = () => setLeverage((p) => Math.min(p + 1, MAX_LEV));
    const decreaseLev = () => setLeverage((p) => Math.max(p - 1, MIN_LEV));

    const handleLevInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = Number(e.target.value.replace(/\D/g, '')) || MIN_LEV;
        v = Math.min(Math.max(v, MIN_LEV), MAX_LEV);
        setLeverage(v);
    };

    // ── Percent handlers ───────────────────────────────
    const increasePct = () => setPercent((p) => clampPct(p + 1));
    const decreasePct = () => setPercent((p) => clampPct(p - 1));

    const handlePctInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPercent(clampPct(Number(e.target.value) || 0));
    };

    // ── TotalUsdt handlers ─────────────────────────────
    const increaseUsdt = () =>
        setPercent((p) => clampPct(((totalUsdt + 1) / balance) * 100));

    const decreaseUsdt = () =>
        setPercent((p) => clampPct(((Math.max(totalUsdt - 1, 0)) / balance) * 100));

    const handleUsdtInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Math.min(Math.max(Number(e.target.value) || 0, 0), balance);
        setPercent((v / balance) * 100);
    };

    return (
        <div style={{ color: '#fff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Số dư */}
                <div>
                    <span style={{ color: 'gray' }}>Số dư khả dụng </span>
                    <span>{balance.toLocaleString()} USDT</span>
                </div>

                {/* Chế độ ký quỹ */}
                <div>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '0.9em',
                            color: 'gray',
                        }}
                    >
                        Chế độ ký quỹ
                    </label>
                    <OrderType />
                </div>

                {/* Đòn bẩy */}
                <div>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '0.9em',
                            color: 'gray',
                        }}
                    >
                        Đòn bẩy
                    </label>
                    <div
                        className="rounded-2 d-flex justify-content-between order-box"
                        style={{ padding: '8px', background: '#000', border: '2px solid #555' }}
                    >
                        <button
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={decreaseLev}
                        >
                            <i className="bi bi-dash fw-bold text-white" />
                        </button>
                        <div className="d-flex">
                            <input
                                type="text"
                                className="text-center fw-bold text-white no-spinner"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                }}
                                value={leverage}
                                onChange={handleLevInput}
                            />
                            <span style={{ color: 'white' }}>x</span>
                        </div>
                        <button
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={increaseLev}
                        >
                            <i className="bi bi-plus text-white fw-bold" />
                        </button>
                    </div>

                    <Slider
                        min={MIN_LEV}
                        max={MAX_LEV}
                        value={leverage}
                        onChange={(value) => setLeverage(value as number)}
                        tooltip={{ formatter: null }}
                        marks={{ 1: '1x', 25: '25x', 50: '50x', 75: '75x', 100: '100x', 125: '125x' }}
                    />
                </div>

                {/* Giá thị trường */}
                <div>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '0.9em',
                            color: 'gray',
                        }}
                    >
                        Giá thị trường
                    </label>
                    <div className="d-flex">
                        <div
                            className="rounded-2 d-flex justify-content-between order-box"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                background: '#000',
                                border: '2px solid #2E2E2E',
                            }}
                        >
                            <span style={{ color: '#9ca3af' }}>Giá tốt nhất hiện tại</span>
                            <span style={{ color: '#fff', fontWeight: 700 }}>
                                {markPrice.toLocaleString()} USDT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Số lượng */}
                <div>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontSize: '0.9em',
                            color: 'gray',
                        }}
                    >
                        Số lượng
                    </label>

                    <div className="d-flex">
                        {/* USDT input */}
                        <div
                            className="rounded-2 d-flex justify-content-between order-box me-auto"
                            style={{
                                width: '65%',
                                padding: '8px',
                                background: '#000',
                                border: '2px solid #555',
                            }}
                        >
                            <button
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                                onClick={decreaseUsdt}
                            >
                                <i className="bi bi-dash fw-bold text-white" />
                            </button>
                            <input
                                type="number"
                                className="text-center fw-bold text-white no-spinner"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                }}
                                value={totalUsdt.toFixed(2)}
                                onChange={handleUsdtInput}
                            />
                            <span style={{ color: 'white', marginRight: '5px' }}>USDT</span>
                            <button
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                                onClick={increaseUsdt}
                            >
                                <i className="bi bi-plus text-white fw-bold" />
                            </button>
                        </div>

                        {/* Percent input */}
                        <div
                            className="rounded-2 d-flex justify-content-between order-box"
                            style={{
                                width: '33%',
                                padding: '8px',
                                background: '#000',
                                border: '2px solid #555',
                            }}
                        >
                            <button
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                                onClick={decreasePct}
                            >
                                <i className="bi bi-dash fw-bold text-white" />
                            </button>
                            <input
                                type="number"
                                className="text-center fw-bold text-white no-spinner"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                }}
                                value={percent.toFixed(2)}
                                onChange={handlePctInput}
                            />
                            <span style={{ color: 'white' }}>%</span>
                            <button
                                style={{ backgroundColor: 'transparent', border: 'none' }}
                                onClick={increasePct}
                            >
                                <i className="bi bi-plus text-white fw-bold" />
                            </button>
                        </div>
                    </div>

                    <Slider
                        min={0}
                        max={100}
                        value={percent}
                        onChange={(value) => setPercent(value as number)}
                        tooltip={{ formatter: null }}
                        styles={{
                            track: { backgroundColor: '#F0B90B' },
                            rail: { backgroundColor: '#333' },
                            handle: { borderColor: '#F0B90B', backgroundColor: '#F0B90B' },
                        }}
                        marks={{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }}
                    />
                </div>

                {/* Thông tin quy đổi */}
                <div
                    className="rounded-3"
                    style={{
                        background: '#0b0b0b',
                        border: '1px solid #2E2E2E',
                        padding: '12px',
                    }}
                >
                    <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: '#5c6478', fontSize: '12px' }}>Giá trị vị thế</span>
                        <span style={{ color: '#e6eaf0', fontSize: '12px', fontWeight: 500 }}>
                            {(totalUsdt * leverage).toFixed(2)} USDT
                        </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: '#5c6478', fontSize: '12px' }}>Khối lượng ước tính</span>
                        <span style={{ color: '#e6eaf0', fontSize: '12px', fontWeight: 500 }}>
                            {quantity.toFixed(6)} BTC
                        </span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span style={{ color: '#5c6478', fontSize: '12px' }}>Chi phí</span>
                        <span style={{ color: '#e6eaf0', fontSize: '12px', fontWeight: 500 }}>
                            {estimatedCost.toFixed(2)} USDT
                        </span>
                    </div>
                </div>

                {/* SL/TP */}
                <div className="d-flex align-items-center">
                    <input
                        type="checkbox"
                        id="sltp-checkbox-market"
                        checked={showSltp}
                        onChange={(e) => setShowSltp(e.target.checked)}
                    />
                    <p className="m-0 ms-2">SL/TP</p>
                </div>

                {showSltp && <TPSL />}

                {/* Thông tin dưới nút */}
                <div className="d-flex gap-2">
                    <div style={{ display: 'flex', width: '50%' }}>
                        <div
                            style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                            }}
                        >
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Giá thị trường</span>
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Chi phí</span>
                        </div>
                        <div
                            style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                alignItems: 'flex-end',
                            }}
                        >
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>
                                {markPrice.toLocaleString()} USDT
                            </span>
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>
                                {estimatedCost.toFixed(2)} USDT
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', width: '50%' }}>
                        <div
                            style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                            }}
                        >
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Đòn bẩy</span>
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Khối lượng</span>
                        </div>
                        <div
                            style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                alignItems: 'flex-end',
                            }}
                        >
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>
                                {leverage}x
                            </span>
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>
                                {quantity.toFixed(6)} BTC
                            </span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#089981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Mua/Long
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#f23645',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Bán/Short
                    </button>
                </div>
            </div>
        </div>
    );
};