import React, { useState } from 'react'
import { OrderType } from './OrderType';
import { Slider } from 'antd';
import { TPSL } from './TPSL';

export const LimitOrder = () => {
    const balance = 10000000000;

    const [showSltp, setShowSltp] = useState(false);
    const [leverage, setLeverage] = useState(10);
    const [percent, setPercent] = useState(0); // ← CHỈ 1 STATE

    // Tính totalUsdt từ percent — không cần state riêng
    const totalUsdt = (percent / 100) * balance;

    const MIN_LEV = 1;
    const MAX_LEV = 125;



    // ── Leverage handlers ──────────────────────────────
    const increaseLev = () => setLeverage(p => Math.min(p + 1, MAX_LEV));
    const decreaseLev = () => setLeverage(p => Math.max(p - 1, MIN_LEV));

    const handleLevInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = Number(e.target.value.replace(/\D/g, '')) || MIN_LEV;
        v = Math.min(Math.max(v, MIN_LEV), MAX_LEV);
        setLeverage(v);
    };

    // ── Percent handlers ────────────────────────────────
    const clampPct = (v: number) => Math.min(Math.max(v, 0), 100);

    const increasePct = () => setPercent(p => clampPct(p + 1));
    const decreasePct = () => setPercent(p => clampPct(p - 1));

    const handlePctInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPercent(clampPct(Number(e.target.value) || 0));
    };

    // ── TotalUsdt handlers (đổi sang percent) ──────────
    const increaseUsdt = () =>
        setPercent(p => clampPct(((totalUsdt + 1) / balance) * 100));

    const decreaseUsdt = () =>
        setPercent(p => clampPct(((totalUsdt - 1) / balance) * 100));

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
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: 'gray' }}>
                        Chế độ ký quỹ
                    </label>
                    <OrderType />
                </div>

                {/* Đòn bẩy */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: 'gray' }}>
                        Đòn bẩy
                    </label>
                    <div className='rounded-2 d-flex justify-content-between order-box'
                        style={{ padding: '8px', background: '#000', border: '2px solid #555' }}>
                        <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={decreaseLev}>
                            <i className="bi bi-dash fw-bold text-white" />
                        </button>
                        <div className='d-flex'>
                            <input
                                type="text"
                                className="text-center fw-bold text-white no-spinner"
                                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                                value={leverage}
                                onChange={handleLevInput}
                            />
                            <span style={{ color: 'white' }}>x</span>
                        </div>
                        <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={increaseLev}>
                            <i className="bi bi-plus text-white fw-bold" />
                        </button>
                    </div>
                    <Slider
                        min={MIN_LEV} max={MAX_LEV}
                        value={leverage}
                        onChange={setLeverage}
                        tooltip={{ formatter: null }} // ← thêm dòng này
                        marks={{ 1: '1x', 25: '25x', 50: '50x', 75: '75x', 100: '100x', 125: '125x' }}
                    />
                </div>

                {/* Giá đặt */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: 'gray' }}>
                        Giá đặt
                    </label>
                    <div className='d-flex'>
                        <div className='rounded-2 d-flex justify-content-between order-box'
                            style={{ width: '80%', padding: '8px', background: '#000', border: '2px solid #2E2E2E' }}>
                            <input
                                type="number"
                                className="text-left fw-bold text-white no-spinner"
                                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                            />
                            <span style={{ color: 'white' }}>USDT</span>
                        </div>
                        <div className='rounded-3 ms-3 fw-bold text-white text-center order-box'
                            style={{ width: '15%', backgroundColor: '#000', border: '2px solid #2E2E2E', alignContent: 'center' }}>
                            BBO
                        </div>
                    </div>
                </div>

                {/* Số lượng */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: 'gray' }}>
                        Số lượng
                    </label>
                    <div className='d-flex'>

                        {/* USDT input — hiển thị totalUsdt nhưng thực ra đang set percent */}
                        <div className='rounded-2 d-flex justify-content-between order-box me-auto'
                            style={{ width: '65%', padding: '8px', background: '#000', border: '2px solid #555' }}>
                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={decreaseUsdt}>
                                <i className="bi bi-dash fw-bold text-white" />
                            </button>
                            <input
                                type="number"
                                className="text-center fw-bold text-white no-spinner"
                                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                                value={totalUsdt.toFixed(2)}
                                onChange={handleUsdtInput}
                            />
                            <span style={{ color: 'white', marginRight: '5px' }}>USDT</span>
                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={increaseUsdt}>
                                <i className="bi bi-plus text-white fw-bold" />
                            </button>
                        </div>

                        {/* Percent input */}
                        <div className='rounded-2 d-flex justify-content-between order-box'
                            style={{ width: '33%', padding: '8px', background: '#000', border: '2px solid #555' }}>
                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={decreasePct}>
                                <i className="bi bi-dash fw-bold text-white" />
                            </button>
                            <input
                                type="number"
                                className="text-center fw-bold text-white no-spinner"
                                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                                value={percent.toFixed(2)}
                                onChange={handlePctInput}
                            />
                            <span style={{ color: 'white' }}>%</span>
                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={increasePct}>
                                <i className="bi bi-plus text-white fw-bold" />
                            </button>
                        </div>
                    </div>

                    <Slider
                        min={0} max={100}
                        value={percent}
                        onChange={setPercent}
                        tooltip={{ formatter: null }} // ← thêm dòng này
                        styles={{
                            track: { backgroundColor: '#F0B90B' },
                            rail: { backgroundColor: '#333' },
                            handle: { borderColor: '#F0B90B', backgroundColor: '#F0B90B' },
                        }}
                        marks={{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }}
                    />
                </div>

                {/* SL/TP */}
                <div className='d-flex align-items-center'>
                    <input
                        type="checkbox"
                        id="sltp-checkbox"
                        checked={showSltp}
                        onChange={e => setShowSltp(e.target.checked)}
                    />
                    <p className="m-0 ms-2">SL/TP</p>
                </div>
                {showSltp && (
                    <TPSL />
                )}

                {/* Buttons */}
                <div className='d-flex gap-2'>
                    <div style={{ display: 'flex', width: "50%" }}>
                        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Giá thanh lý</span>
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Chi phí</span>
                        </div>
                        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>-- USDT</span>
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>0 USDT</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', width: "50%" }}>
                        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Giá thanh lý</span>
                            <span style={{ fontSize: '12px', color: '#5c6478' }}>Chi phí</span>
                        </div>
                        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>-- USDT</span>
                            <span style={{ fontSize: '12px', color: '#e6eaf0', fontWeight: 500 }}>0 USDT</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button style={{
                        flex: 1, padding: '10px',
                        backgroundColor: '#089981', color: '#fff',
                        border: 'none', borderRadius: '4px',
                        cursor: 'pointer', fontWeight: 'bold',
                    }}>
                        Mua/Long
                    </button>
                    <button style={{
                        flex: 1, padding: '10px',
                        backgroundColor: '#f23645', color: '#fff',
                        border: 'none', borderRadius: '4px',
                        cursor: 'pointer', fontWeight: 'bold',
                    }}>
                        Bán/Short
                    </button>
                </div>

            </div>
        </div>
    );
}