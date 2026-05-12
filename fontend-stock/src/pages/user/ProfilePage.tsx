import React, { useEffect, useState } from 'react';
import { ConfigProvider, Pagination } from 'antd';
import type { PageData } from '../../services/userService';
import { userService } from '../../services';
import { formatDate } from '../../helper/FormatDateTime';

type UserProfile = {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: 'ADMIN' | 'USER';
  authProvider: 'LOCAL' | 'GOOGLE';
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type LoginHistoryItem = {
  id: number;
  ipAddress: string;
  device: string;
  location: string;
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
};

const MOCK_USER: UserProfile = {
  id: 12,
  email: 'trader@cryptomind.ai',
  username: 'future_master',
  fullName: 'Nguyen Van A',
  phone: '+84 912 345 678',
  avatarUrl: 'https://i.pravatar.cc/120?img=12',
  role: 'USER',
  authProvider: 'GOOGLE',
  emailVerified: true,
  isActive: true,
  createdAt: '20/03/2026 10:20',
  updatedAt: '31/03/2026 09:05',
};

function SectionTitle({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'rgba(240,185,11,0.12)',
            border: '1px solid rgba(240,185,11,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f0b90b',
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f3f4f6' }}>{title}</span>
      </div>
      {action}
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#050505', border: '1px solid #161616', borderRadius: 12, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#ececec', lineHeight: 1.6, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}

function LoginHistoryCard({ item }: { item: LoginHistoryItem }) {
  const success = item.status === 'SUCCESS';
  return (
    <div style={{ background: '#070707', border: '2px solid #2e2e2e', borderRadius: 14, padding: 14 }} className='login-history-card'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: '#f3f4f6', fontWeight: 600 }}>{item.device}</div>
        <span
          style={{
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 999,
            background: success ? 'rgba(14,203,129,0.08)' : 'rgba(246,70,93,0.08)',
            border: `1px solid ${success ? 'rgba(14,203,129,0.22)' : 'rgba(246,70,93,0.22)'}`,
            color: success ? '#0ecb81' : '#f6465d',
            fontWeight: 700,
          }}
        >
          {item.status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={rowStyle}>
          <span style={labelStyle}>IP</span>
          <span style={valueStyle}>{item.ipAddress}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Location</span>
          <span style={valueStyle}>{item.location || "Ha Noi Viet Nam"}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Time</span>
          <span style={valueStyle}>{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [user] = useState<UserProfile>(MOCK_USER);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [pageData, setPageData] = useState<PageData<LoginHistoryItem> | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(9); // Mặc định 9 items/trang

  const fetchLoginHistory = async (page: number, size: number) => {
    try {
      const response = await userService.getLoginHistory(page, size);
      const data: PageData<LoginHistoryItem> = response.data.data;
      
      setPageData(data);
      setLoginHistory(data.content || []);
    } catch (error) {
      console.error('Failed to fetch login history:', error);
    }
  };

  useEffect(() => {
    fetchLoginHistory(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const totalItems = pageData?.totalElements || 0;
  const startIndex = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalItems);

  const handlePaginationChange = (page: number, newPageSize: number) => {
    setCurrentPage(page - 1);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(0);
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        background: '#000',
        minHeight: '100vh',
        color: '#e5e7eb',
        padding: '28px 24px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <ProfileRoundIcon />
            <span style={{ fontSize: 10, color: '#6b7280', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600 }}>
              Profile & Security
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#fafafa', letterSpacing: -0.3 }}>
            Hồ sơ cá nhân
          </h1>
        </div>

        <button
          type="button"
          style={{
            flexShrink: 0,
            padding: '12px 16px',
            borderRadius: 12,
            cursor: 'pointer',
            background: 'linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)',
            border: '1px solid #e0ae10',
            color: '#111',
            fontSize: 13,
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 8px 22px rgba(240,185,11,0.16)',
            marginTop: 2,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>✎</span>
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Profile Information */}
      <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
        <div
          style={{
            background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
            border: '1px solid #1a1a1a',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              width={72}
              height={72}
              style={{ borderRadius: '50%', border: '2px solid #1f1f1f', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: 18, color: '#fafafa', fontWeight: 700, marginBottom: 6 }}>{user.fullName}</div>
              <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 4 }}>@{user.username}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={rolePill}>{user.role}</span>
                <span style={user.emailVerified ? verifiedPill : unverifiedPill}>
                  {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <MiniInfo label="Email" value={user.email} />
            <MiniInfo label="Phone" value={user.phone || '--'} />
            <MiniInfo label="Auth Provider" value={user.authProvider} />
            <MiniInfo label="Updated At" value={user.updatedAt} />
            <MiniInfo label="Created At" value={user.createdAt} />
            <MiniInfo label="User ID" value={`${user.id}`} />
          </div>
        </div>
      </div>

      {/* Login History Section */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
          border: '1px solid #1a1a1a',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
        }}
      >
        <SectionTitle 
          icon={<HistoryIcon />} 
          title="Lịch sử đăng nhập" 
          action={<span style={{ fontSize: 11, color: '#71717a' }}>{totalItems} records</span>} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
          {loginHistory.map((item) => (
            <LoginHistoryCard key={item.id} item={item} />
          ))}

          {loginHistory.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              Chưa có lịch sử đăng nhập
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div style={{ 
            marginTop: 24, 
            paddingTop: 20, 
            borderTop: '1px solid #1F1F1F', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16 
          }}>
            <div style={{ color: '#888' }}>
              Hiển thị {startIndex} - {endIndex} trong tổng {totalItems} lịch sử
            </div>

            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#F0B90B",
                  colorBgContainer: "#111",
                  colorText: "#fff",
                  colorBorder: "#1F1F1F",
                  borderRadius: 8,
                },
              }}
            >
              <Pagination
                current={currentPage + 1}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePaginationChange}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={["6", "9", "18", "27"]}
                showTotal={(total) => `Tổng ${total} records`}
                locale={{
                  items_per_page: "/ trang",
                  jump_to: "Đến trang",
                  page: "",
                }}
              />
            </ConfigProvider>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== STYLES ==================== */
const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#71717a',
};

const valueStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#f3f4f6',
  fontWeight: 600,
  textAlign: 'right',
};

const rolePill: React.CSSProperties = {
  fontSize: 10,
  padding: '4px 8px',
  borderRadius: 999,
  background: '#171107',
  border: '1px solid #4a380e',
  color: '#f0b90b',
  fontWeight: 700,
};

const verifiedPill: React.CSSProperties = {
  fontSize: 10,
  padding: '4px 8px',
  borderRadius: 999,
  background: 'rgba(14,203,129,0.08)',
  border: '1px solid rgba(14,203,129,0.22)',
  color: '#0ecb81',
  fontWeight: 700,
};

const unverifiedPill: React.CSSProperties = {
  fontSize: 10,
  padding: '4px 8px',
  borderRadius: 999,
  background: 'rgba(246,70,93,0.08)',
  border: '1px solid rgba(246,70,93,0.22)',
  color: '#f6465d',
  fontWeight: 700,
};

function ProfileRoundIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

export default ProfilePage;