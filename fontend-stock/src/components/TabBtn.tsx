import { useState, useEffect, useRef } from 'react';
import { Star, Search, TrendingUp, RefreshCw } from 'lucide-react';

// ================================================================
// TYPES
// ================================================================
type Coin = {
    id:       string;
    symbol:   string;
    name:     string;
    price:    number;
    change24h: number;
    image:    string;
    hot?:     boolean;
    favorite?: boolean;
};

type Tab = 'favorite' | 'all' | 'top' | 'new';

// ================================================================
// MOCK DATA — thay bằng CoinGecko API
// ================================================================
export const MOCK_COINS: Coin[] = [
    { id: '6',      symbol: 'BTC',  name: 'Bitcoin',             price: 70712.70, change24h:  0.30, image: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',  hot: true  },
    { id: '7',     symbol: 'ETH',  name: 'Ethereum',            price:  2156.57, change24h:  0.49, image: 'https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png', hot: true  },
    { id: '8',          symbol: 'OKB',  name: 'OKB',                 price:    88.17, change24h: -0.80, image: 'https://coin-images.coingecko.com/coins/images/4463/thumb/WeChat_Image_20220118095654.png' },
    { id: '9',       symbol: 'SOL',  name: 'Solana',              price:    90.04, change24h:  0.23, image: 'https://coin-images.coingecko.com/coins/images/4128/thumb/solana.png', hot: true  },
    { id: '10',     symbol: 'DOGE', name: 'Dogecoin',            price:  0.09387, change24h: -0.30, image: 'https://coin-images.coingecko.com/coins/images/5/thumb/dogecoin.png', hot: true  },
    { id: '11',       symbol: 'XRP',  name: 'Ripple',              price:    1.4433,change24h: -0.11, image: 'https://coin-images.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png' },
    { id: '12', symbol: 'BCH',  name: 'Bitcoin Cash',        price:   468.00, change24h: -1.37, image: 'https://coin-images.coingecko.com/coins/images/780/thumb/bitcoin-cash-circle.png' },
    { id: '13',  symbol: 'BNB',  name: 'BNB',                 price:   610.00, change24h:  1.20, image: 'https://coin-images.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png' },
];

// ================================================================
// HOOK — Tìm kiếm
// ================================================================
const useCoinSearch = (coins: Coin[], query: string) => {
    if (!query) return coins;
    const q = query.toLowerCase();
    return coins.filter(c =>
        c.symbol.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
};

// ================================================================
// SUB-COMPONENTS
// ================================================================
const TabBtn: React.FC<{
    label:    string;
    active:   boolean;
    onClick:  () => void;
}> = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
        background:   'none',
        border:       'none',
        borderBottom: active ? '2px solid #e6eaf0' : '2px solid transparent',
        color:        active ? '#e6eaf0' : '#5c6478',
        fontSize:     13,
        fontWeight:   active ? 600 : 400,
        padding:      '6px 10px',
        cursor:       'pointer',
        whiteSpace:   'nowrap',
        transition:   'all 0.15s',
    }}>
        {label}
    </button>
);

const CoinRow: React.FC<{
    coin:     Coin;
    selected: boolean;
    onSelect: (coin: Coin) => void;
    onFav:    (id: string) => void;
}> = ({ coin, selected, onSelect, onFav }) => {
    const isUp = coin.change24h >= 0;

    return (
        <div
            onClick={() => onSelect(coin)}
            style={{
                display:         'flex',
                alignItems:      'center',
                gap:             10,
                padding:         '10px 16px',
                cursor:          'pointer',
                backgroundColor: selected ? 'rgba(56,97,251,0.08)' : 'transparent',
                borderLeft:      selected ? '2px solid #3861fb' : '2px solid transparent',
                transition:      'background 0.1s',
            }}
            onMouseEnter={e =>
                !selected && ((e.currentTarget as HTMLElement).style.backgroundColor = '#1a1d26')}
            onMouseLeave={e =>
                !selected && ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
        >
            {/* Star */}
            <Star
                size={13}
                color={coin.favorite ? '#f0b90b' : '#3a3f4e'}
                fill={coin.favorite ? '#f0b90b' : 'none'}
                style={{ flexShrink: 0, cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); onFav(coin.id); }}
            />

            {/* Logo */}
            <img
                src={coin.image}
                width={26} height={26}
                style={{ borderRadius: '50%', flexShrink: 0 }}
                onError={e => (e.currentTarget.src = 'https://via.placeholder.com/26')}
                alt={coin.symbol}
            />

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#e6eaf0', fontSize: 13, fontWeight: 600 }}>
                        {coin.symbol}
                    </span>
                    {coin.hot && (
                        <span style={{ fontSize: 11 }}>🔥</span>
                    )}
                </div>
                <div style={{ color: '#5c6478', fontSize: 11 }}>{coin.name}</div>
            </div>

            {/* Price */}
            <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#e6eaf0', fontSize: 13 }}>
                    ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: 12, color: isUp ? '#0ecb81' : '#f6465d', fontWeight: 500 }}>
                    {isUp ? '+' : ''}{coin.change24h.toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

// ================================================================
// MAIN COMPONENT
// ================================================================
type CoinSelectorProps = {
    selectedCoin: Coin;
    onSelect:     (coin: Coin) => void;
    onClose:      () => void; // ← thêm prop này
};

export const CoinSelector: React.FC<CoinSelectorProps> = ({
    selectedCoin,
    onSelect,
    onClose, // ← nhận từ cha
}) => {
    const [query,      setQuery]      = useState('');
    const [activeTab,  setActiveTab]  = useState<Tab>('all');
    const [coins,      setCoins]      = useState<Coin[]>(MOCK_COINS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useCoinSearch(
        activeTab === 'favorite' ? coins.filter(c => c.favorite) : coins,
        query
    );

    // Focus input khi mount
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const toggleFavorite = (id: string) => {
        setCoins(prev => prev.map(c =>
            c.id === id ? { ...c, favorite: !c.favorite } : c
        ));
    };

    const handleSelect = (coin: Coin) => {
        onSelect(coin);
        onClose(); // ← đóng từ cha
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 800));
        setIsRefreshing(false);
    };

    const tabs: { key: Tab; label: string }[] = [
        { key: 'favorite', label: 'Mục yêu thích' },
        { key: 'all',      label: 'Tất cả'        },
        { key: 'top',      label: 'Hàng đầu'      },
        { key: 'new',      label: 'Mới'            },
    ];

    // ✅ Chỉ render popup, không có trigger button
    return (
        <div style={{
            width:        360,
            background:   '#0d0f14',
            border:       '1px solid #1a1d26',
            borderRadius: 10,
            boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
            overflow:     'hidden',
        }}>
            {/* Search */}
            <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #1a1d26' }}>
                <div style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          8,
                    background:   '#1a1d26',
                    border:       '1px solid #2a2e39',
                    borderRadius: 8,
                    padding:      '7px 12px',
                }}>
                    <Search size={14} color="#5c6478" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm tiền mã hóa"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{
                            flex:       1,
                            background: 'none',
                            border:     'none',
                            outline:    'none',
                            color:      '#e6eaf0',
                            fontSize:   13,
                        }}
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            style={{ background: 'none', border: 'none', color: '#5c6478', cursor: 'pointer', padding: 0 }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display:      'flex',
                alignItems:   'center',
                padding:      '0 16px',
                borderBottom: '1px solid #1a1d26',
                overflowX:    'auto',
            }}>
                {tabs.map(t => (
                    <TabBtn
                        key={t.key}
                        label={t.label}
                        active={activeTab === t.key}
                        onClick={() => setActiveTab(t.key)}
                    />
                ))}
                <button
                    onClick={handleRefresh}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px', color: '#5c6478' }}
                >
                    <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                </button>
            </div>

            {/* Column header */}
            <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                padding:        '6px 16px 6px 56px',
                borderBottom:   '1px solid #1a1d26',
            }}>
                <span style={{ fontSize: 11, color: '#5c6478' }}>Tên</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#5c6478' }}>Giá gần nhất</span>
                    <span style={{ fontSize: 10, color: '#3a3f4e' }}>⇅</span>
                    <span style={{ fontSize: 11, color: '#5c6478' }}>Thay đổi</span>
                    <span style={{ fontSize: 10, color: '#3a3f4e' }}>⇅</span>
                </div>
            </div>

            {/* Coin list */}
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#5c6478', fontSize: 13 }}>
                        {activeTab === 'favorite' ? 'Chưa có coin yêu thích' : 'Không tìm thấy kết quả'}
                    </div>
                ) : (
                    filtered.map(coin => (
                        <CoinRow
                            key={coin.id}
                            coin={coin}
                            selected={selectedCoin.id === coin.id}
                            onSelect={handleSelect}
                            onFav={toggleFavorite}
                        />
                    ))
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};