import React, { useState } from 'react'
import { OrderType } from './OrderType';
import { ConfigProvider, Slider, Tabs, theme } from 'antd';
import { LimitOrder } from './LimitOrder';

type OrderFormProps = {
    symbol: string;           // Mã CK (VD: VCB)
    currentPrice: number | null; // Giá thị trường hiện tại
    balance?: number;         // Sức mua (Optional)
    onSubmit: (type: 'BUY' | 'SELL', quantity: number, price: number) => void; // Hàm callback gửi lên cha
}

// function LimitOrder() {
//     const balance = 10000000000;
//     const [showSltp, setShowSltp] = useState<boolean>(false);
//     const [leverage, setLeverage] = useState<number>(10);
//     const [percent, setPersent] = useState<number>(0);
//     const [totalUsdt, setTotolUsdt] = useState<number>(0);
//     const MIN = 1;
//     const MAX = 125;
//     const inputStyle = {
//         background: '#333',
//         border: '1px solid #555',
//         color: '#fff',
//         width: '100%',
//         padding: '8px',
//         borderRadius: '4px',
//         outline: 'none'
//     };

//     const increase = () => {
//         setLeverage((prev) => Math.min(prev + 1, MAX));
//     };
//     const decrease = () => {
//         setLeverage((prev) => Math.max(prev - 1, MIN));
//     };

//     const increaseUSDT = () => {
//         setTotolUsdt((prev) => {
//             const newVal = Math.min(prev + 1, balance);
//             setPersent((newVal / balance) * 100);
//             return newVal;
//         });
//     };
    
//     const decreaseUSDT = () => {
//         setTotolUsdt((prev) => {
//             const newVal = Math.max(prev - 1, 0);
//             setPersent((newVal / balance) * 100);
//             return newVal;
//         });
//     };


//     const increasePercent = () => {
//         setPersent((prev) => {
//             const newVal = Math.min(prev + 1, 100);
//             setTotolUsdt((newVal / 100) * balance);
//             return newVal;
//         });
//     };
    
//     const decreasePercent = () => {
//         setPersent((prev) => {
//             const newVal = Math.max(prev - 1, 0);
//             setTotolUsdt((newVal / 100) * balance);
//             return newVal;
//         });
//     };

//     const handleChange = (e: any) => {
//         let value = e.target.value.replace(/\D/g, ""); // chỉ lấy số
//         if (!value) return setLeverage(1);

//         value = Number(value);
//         if (value > MAX) value = MAX;
//         if (value < MIN) value = MIN;

//         setLeverage(value);
//     };
//     const handleChangeUSDT = (e: any) => {
//         let value = Number(e.target.value) || 0;
    
//         if (value > balance) value = balance;
//         if (value < 0) value = 0;
    
//         setTotolUsdt(value);
//         setPersent((value / balance) * 100);
//     };

//     const handleChangePersent = (e: any) => {
//         let value = Number(e.target.value) || 0;
    
//         if (value > 100) value = 100;
//         if (value < 0) value = 0;
    
//         setPersent(value);
//         setTotolUsdt((value / 100) * balance);
//     };
//     const handleSliderChange = (value: number) => {
//         setPersent(value);
//         setTotolUsdt((value / 100) * balance);
//     };
//     return (
//         <div style={{ color: "#fff" }}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                 <div>
//                     <span style={{ color: "gray" }}>số dư khả dụng </span> -USDT
//                 </div>
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '15px', fontSize: '0.9em', color: "gray" }}>Chế độ kí quỹ </label>
//                     <OrderType />
//                 </div>
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: "gray" }}>Đòn bẩy</label>
//                     {/* <input type="number" placeholder="100" style={{ width: '100%', padding: '8px', background: '#333', border: '1px solid #555', color: '#fff' }} /> */}
//                     <div className='rounded-2 d-flex justify-content-between order-box' style={{ width: '100%', padding: '8px', background: '#000', border: '2px solid #555', color: '#2E2E2E' }}>
//                         <button style={{ backgroundColor: "transparent", border: 'none' }} onClick={decrease}>
//                             <i className="bi bi-dash fw-bold text-white"></i>
//                         </button>
//                         <div className='d-flex'>
//                         <input
//                             type="text"
//                             className="text-center fw-bold text-white no-spinner" // <--- Thêm class no-spinner
//                             placeholder="0"
//                             style={{
//                                 backgroundColor: "transparent",
//                                 border: 'none',
//                                 outline: 'none', // <--- Dòng này để tắt viền khi click vào
//                                 width: '100%'    // Nên thêm width 100% để full ô
//                             }}
//                             value={leverage}
//                             onChange={handleChange}

//                         />
//                         <span style={{color:"white"}}>x</span>
//                         </div>
//                         <button style={{ backgroundColor: "transparent", border: 'none' }} onClick={increase}>
//                             <i className="bi bi-plus text-white fw-bold"></i>
//                         </button>
//                     </div>
//                     <Slider
//                         min={1}
//                         max={125}
//                         value={leverage}
//                         onChange={(value) => setLeverage(value)}
//                         marks={{
//                             1: "1x",
//                             25: "25x",
//                             50: "50x",
//                             75: "75x",
//                             100: "100x",
//                             125: "125x"
//                         }}
//                     />
//                 </div>

//                 <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: 'gray' }}>Giá đặt</label>
//                     <div className='d-flex'>
//                         <div className='rounded-2 d-flex justify-content-between order-box' style={{ width: '80%', padding: '8px', background: '#000', border: '2px solid #2E2E2E', color: '#fff' }}>
//                             <input
//                                 type="number"
//                                 className="text-left fw-bold text-white no-spinner" // <--- Thêm class no-spinner
//                                 placeholder=""
//                                 style={{
//                                     backgroundColor: "transparent",
//                                     border: 'none',
//                                     outline: 'none', // <--- Dòng này để tắt viền khi click vào
//                                     width: '100%'    // Nên thêm width 100% để full ô
//                                 }}
//                             />
//                             <span>USDT</span>
//                         </div>
//                         <div className='rounded-3 ms-3 fw-bold text-white text-center order-box' style={{ width: '15%', backgroundColor: "#000", border: '2px solid #2E2E2E', alignContent: "center" }}>BBO</div>
//                     </div>
//                 </div>

//                 <div>
//                     <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: "gray" }}>Số lượng</label>
//                     {/* <input type="number" placeholder="100" style={{ width: '100%', padding: '8px', background: '#333', border: '1px solid #555', color: '#fff' }} /> */}
//                     <div className='d-flex'>
//                         <div className='rounded-2 d-flex justify-content-between order-box me-auto' style={{ width: '65%', padding: '8px', background: '#000', border: '2px solid #555', color: '#2E2E2E' }}>
//                             <button style={{ backgroundColor: "transparent", border: 'none' }} onClick={decreaseUSDT}>
//                                 <i className="bi bi-dash fw-bold text-white"></i>
//                             </button>
//                             <input
//                                 type="number"
//                                 className="text-center fw-bold text-white no-spinner" // <--- Thêm class no-spinner
//                                 placeholder="0"
//                                 style={{
//                                     backgroundColor: "transparent",
//                                     border: 'none',
//                                     outline: 'none', // <--- Dòng này để tắt viền khi click vào
//                                     width: '100%'    // Nên thêm width 100% để full ô
//                                 }}
//                                 value={totalUsdt.toFixed(2)}
//                                 onChange={handleChangeUSDT}

//                             />
//                             <span style={{color: 'white', marginRight:"5px"}}>USDT</span>
//                             <button style={{ backgroundColor: "transparent", border: 'none' }} onClick={increaseUSDT}>
//                                 <i className="bi bi-plus text-white fw-bold"></i>
//                             </button>
//                         </div>
//                         <div className='rounded-2 d-flex justify-content-between order-box' style={{ width: '33%', padding: '8px', background: '#000', border: '2px solid #555', color: '#2E2E2E' }}>
//                             <button style={{ backgroundColor: "transparent", border: 'none' }} onClick={decreasePercent}>
//                                 <i className="bi bi-dash fw-bold text-white"></i>
//                             </button>
//                             <input
//                                 type="number"
//                                 className="text-center fw-bold text-white no-spinner" // <--- Thêm class no-spinner
//                                 placeholder="0"
//                                 style={{
//                                     backgroundColor: "transparent",
//                                     border: 'none',
//                                     outline: 'none', // <--- Dòng này để tắt viền khi click vào
//                                     width: '100%'    // Nên thêm width 100% để full ô
//                                 }}
//                                 value={percent.toFixed(2)}
//                                 onChange={handleChangePersent}

//                             />
//                             <span style={{color: 'white'}}>%</span>
//                             <button style={{ backgroundColor: "transparent", border: 'none' }} onClick={increasePercent}>
//                                 <i className="bi bi-plus text-white fw-bold"></i>
//                             </button>
//                         </div>
//                     </div>
//                     <Slider
//                         min={0}
//                         max={100}
//                         value={percent}
//                         onChange={handleSliderChange}
//                         styles={{
//                             track: { backgroundColor: '#F0B90B' },   // thanh đã kéo
//                             rail: { backgroundColor: '#333' },       // thanh nền
//                             handle: {
//                                 borderColor: '#F0B90B',
//                                 backgroundColor: '#F0B90B'
//                             }
//                         }}
//                         marks={{
//                             0: "0%",
//                             25: "25%",
//                             50: "50%",
//                             75: "75%",
//                             100: "100%",
//                         }}
//                     />
//                 </div>
//                 <div className='d-flex align-items-center'>
//                     <input type="checkbox" name="" id="sltp-checkbox" checked={showSltp}
//                         onChange={(e) => setShowSltp(e.target.checked)} />
//                     <p className="m-0 ms-2">SL/TP</p>
//                 </div>
//                 {showSltp && (
//                     <div className="d-flex gap-2 animate-fade-in">

//                         {/* Ô Stop Loss (SL) */}
//                         <div style={{ width: '50%' }}>
//                             <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '4px' }}>
//                                 Stop Loss
//                             </label>
//                             <input
//                                 type="number"
//                                 placeholder="Giá cắt lỗ"
//                                 style={inputStyle}
//                             />
//                         </div>

//                         {/* Ô Take Profit (TP) */}
//                         <div style={{ width: '50%' }}>
//                             <label style={{ fontSize: '0.8em', color: '#aaa', display: 'block', marginBottom: '4px' }}>
//                                 Take Profit
//                             </label>
//                             <input
//                                 type="number"
//                                 placeholder="Giá chốt lời"
//                                 style={inputStyle}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//                     <button style={{ flex: 1, padding: '10px', backgroundColor: '#089981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
//                         MUA
//                     </button>
//                     <button style={{ flex: 1, padding: '10px', backgroundColor: '#f23645', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
//                         BÁN
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

function MarketOrder() {
    return (
        <div style={{ color: "#fff" }}>
            <h3>Dữ liệu giao dịch</h3>
            <p>Order book, trades, lịch sử...</p>
        </div>
    );
}
export const OrderForm = ({ symbol, currentPrice, onSubmit }: OrderFormProps) => {
    const [price, setPrice] = useState<number>(currentPrice || 0);
    const items = [
        {
            key: "limit",
            label: "Giới hạn",
            children: <LimitOrder />,
        },
        {
            key: "market",
            label: "Thị trường",
            children: <MarketOrder />,
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
            <h4 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px', textAlign: 'center' }}>Đặt lệnh</h4>

            {/* Form giả lập */}
            <Tabs defaultActiveKey="overview" items={items} />


        </div>
    )
}
