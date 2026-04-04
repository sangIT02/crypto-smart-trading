import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, ConfigProvider } from 'antd';

const items: MenuProps['items'] = [
    { label: (
        <div  style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
        }}>
            <div style={{ fontWeight: 500 }}>Chéo (Cross)</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>
                <p>Mức kí quỹ và PNL được chia sẻ giữa các vị thế. Bạn có thể mất tất cả vị thế nếu việc thanh lí xảy ra
                </p>
            </div>
        </div>
    ),
    key: 'Cross' },
    { label: (
        <div  style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
        }}>
            <div style={{ fontWeight: 500 }}>Cô lập (Isolated)</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>
                <p>Mức kí quỹ và PNL không được chia sẻ giữa các vị thế. Bạn sẽ chỉ mất vị thế hiện tại nếu việc thanh lý xảy ra
                </p>
            </div>
        </div>
    ),
    key: 'Isolated' },
];

export const OrderType = () => {
    const [selectedType, setSelectedType] = useState<string>('Chéo (Cross)');

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        const item = items?.find((i) => i && 'key' in i && i.key === e.key);
        if (item && 'label' in item) {
            setSelectedType(item.key as string);
        }
        
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
        selectable: true,
        defaultSelectedKeys: ['Cross'],
        // 1. Thêm chiều rộng tối thiểu cho Menu xổ xuống để không bị quá bé
        style: {
            width: '330px',
            whiteSpace: 'normal',
            border: '2px solid #2E2E2E'
        }        
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Dropdown: {
                        colorBgElevated: '#000',
                        controlItemBgHover: '#333333',
                        colorText: '#ffffff',
                    },
                },
            }}
        >
            <Dropdown menu={menuProps} trigger={['click']}>
                {/* 2. Sửa style của nút bấm cho giống hệt ô Input số lượng */}
                <div 
                    style={{ 
                        background: '#000',       // Nền tối
                        border: '2px solid #2E2E2E', // Viền xám nhạt
                        color: '#fff',            // Chữ trắng
                        padding: '8px 12px',      // Khoảng cách đệm
                        cursor: 'pointer',
                        display: 'flex',          // Dùng Flex để căn chỉnh
                        justifyContent: 'space-between', // Đẩy chữ sang trái, mũi tên sang phải
                        alignItems: 'center',
                        minWidth: '220px'         // Cố định chiều rộng nút để không bị nhảy khi đổi lệnh
                    }}
                    className='rounded-2 order-box'
                >
                    <span style={{ fontWeight: 500 }}>{selectedType}</span>
                    <DownOutlined style={{ fontSize: '12px', color: '#aaa' }} />
                </div>
            </Dropdown>
        </ConfigProvider>
    );
};