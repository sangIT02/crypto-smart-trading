import React, { useMemo, useState } from 'react';
import { AppLayout } from '../layout/MainLayout';

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

type ConnectedAccount = {
  apiConnected: boolean;
  oauthConnected: boolean;
  provider: 'GOOGLE' | null;
  apiCreatedAt: string | null;
  oauthExpiredAt: string | null;
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

const MOCK_CONNECTED: ConnectedAccount = {
  apiConnected: true,
  oauthConnected: true,
  provider: 'GOOGLE',
  apiCreatedAt: '24/03/2026 14:12',
  oauthExpiredAt: '05/04/2026 23:59',
};

const MOCK_LOGIN_HISTORY: LoginHistoryItem[] = [
  {
    id: 1,
    ipAddress: '171.244.12.98',
    device: 'Chrome / Windows 11',
    location: 'Ho Chi Minh City, Vietnam',
    status: 'SUCCESS',
    createdAt: '31/03/2026 09:01',
  },
  {
    id: 2,
    ipAddress: '171.244.12.98',
    device: 'Chrome / Windows 11',
    location: 'Ho Chi Minh City, Vietnam',
    status: 'SUCCESS',
    createdAt: '30/03/2026 22:14',
  },
  {
    id: 3,
    ipAddress: '103.21.148.42',
    device: 'Safari / iPhone',
    location: 'Ho Chi Minh City, Vietnam',
    status: 'FAILED',
    createdAt: '29/03/2026 18:43',
  },
  {
    id: 4,
    ipAddress: '171.244.12.98',
    device: 'Chrome / Windows 11',
    location: 'Ho Chi Minh City, Vietnam',
    status: 'SUCCESS',
    createdAt: '28/03/2026 08:17',
  },
];

function StatCard({ title, value, hint, accent }: { title: string; value: string; hint: string; accent?: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
        border: `1px solid ${accent ?? '#1a1a1a'}`,
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
      }}
    >
      <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fafafa', letterSpacing: -0.4, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6 }}>{hint}</div>
    </div>
  );
}

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

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        borderRadius: 999,
        background: active ? '#07130b' : '#190707',
        border: active ? '1px solid #16371f' : '1px solid #4c1010',
        color: active ? '#4ade80' : '#fca5a5',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.8,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: active ? '#22c55e' : '#ef4444',
          boxShadow: active ? '0 0 8px rgba(34,197,94,0.65)' : 'none',
        }}
      />
      {active ? 'ACTIVE' : 'INACTIVE'}
    </span>
  );
}

function LoginHistoryCard({ item }: { item: LoginHistoryItem }) {
  const success = item.status === 'SUCCESS';
  return (
    <div style={{ background: '#070707', border: '1px solid #171717', borderRadius: 14, padding: 14 }}>
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
          <span style={valueStyle}>{item.location}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Time</span>
          <span style={valueStyle}>{item.createdAt}</span>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [user] = useState<UserProfile>(MOCK_USER);
  const [loginHistory] = useState<LoginHistoryItem[]>(MOCK_LOGIN_HISTORY);
  const [connected] = useState<ConnectedAccount>(MOCK_CONNECTED);

  const stats = useMemo(() => {
    const successCount = loginHistory.filter((item) => item.status === 'SUCCESS').length;
    const failedCount = loginHistory.filter((item) => item.status === 'FAILED').length;
    return {
      successCount,
      failedCount,
      activeSessions: 2,
      securityScore: connected.apiConnected && user.emailVerified ? 92 : 68,
    };
  }, [connected.apiConnected, loginHistory, user.emailVerified]);

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
                  <span style={user.emailVerified ? verifiedPill : unverifiedPill}>{user.emailVerified ? 'Email Verified' : 'Email Unverified'}</span>
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

        <div
          style={{
            background: 'linear-gradient(180deg, #0b0b0b 0%, #050505 100%)',
            border: '1px solid #1a1a1a',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.015)',
            marginBottom: 16,
          }}
        >
          <SectionTitle icon={<HistoryIcon />} title="Lịch sử đăng nhập" action={<span style={{ fontSize: 11, color: '#71717a' }}>{loginHistory.length} records</span>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            {loginHistory.map((item) => (
              <LoginHistoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
  );
}

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

const securityCard: React.CSSProperties = {
  background: '#070707',
  border: '1px solid #171717',
  borderRadius: 14,
  padding: 14,
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

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" />
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