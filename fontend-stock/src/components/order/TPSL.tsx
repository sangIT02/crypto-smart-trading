import React, { useState } from 'react'


const inputStyle: React.CSSProperties = {
    background: '#000',
    border: '2px solid #2E2E2E',
    color: '#fff',
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    outline: 'none',
};
export const TPSL = () => {
    const [tp,setTP] = useState<number>();
    const [sl,setSL] = useState<number>();

    const handleTPChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setTP(Number(e.target.value))
    }
    const handleSLChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSL(Number(e.target.value))
    }
    return (
        <div className="d-flex gap-2">
            <div style={{ width: '50%' }}>
                <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '4px' }}>
                    Stop Loss
                </label>
                <input className='order-box' type="number" placeholder="Giá cắt lỗ" style={inputStyle} onChange={handleSLChange} />
            </div>
            <div style={{ width: '50%' }}>
                <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '4px' }}>
                    Take Profit
                </label>
                <input className='order-box' type="number" placeholder="Giá chốt lời" style={inputStyle} onChange={handleTPChange} />
            </div>
        </div>
    )
}
