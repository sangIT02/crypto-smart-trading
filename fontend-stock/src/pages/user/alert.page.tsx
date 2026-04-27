import React, { useEffect, useMemo, useState } from "react";
import {
  alertPriceService,
  type AlertCreateRequest,
  type AlertMode,
  type AlertPriceResponse,
  type ConditionType,
} from "../../services/alertPriceService";
import { toast } from "react-toastify";
import {
  coinService,
  type CoinPairData,
  type CoinPairResponse,
} from "../../services/coinService";

const SYMBOL_OPTIONS = [
  "BTC/USDT",
  "ETH/USDT",
  "SOL/USDT",
  "BNB/USDT",
  "XRP/USDT",
  "DOGE/USDT",
  "ARB/USDT",
  "OP/USDT",
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value < 100 ? 2 : 0,
    maximumFractionDigits: value < 100 ? 4 : 2,
  }).format(value);
}

function StatusBadge({ status }: { status: number }) {
  const map = {
    1: {
      text: "ACTIVE",
      bg: "#07130b",
      border: "#16371f",
      color: "#4ade80",
      dot: "#22c55e",
    },
    0: {
      text: "PAUSED",
      bg: "#161616",
      border: "#2a2a2a",
      color: "#a1a1aa",
      dot: "#71717a",
    },
  }[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: map?.bg,
        border: `1px solid ${map?.border}`,
        borderRadius: 999,
        padding: "4px 10px",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: map?.dot,
          boxShadow: status === 1 ? "0 0 8px rgba(34,197,94,0.65)" : "none",
        }}
      />
      <span
        style={{
          fontSize: 10,
          color: map?.color,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          letterSpacing: 0.8,
        }}
      >
        {map?.text}
      </span>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
        border: "1px solid #1a1a1a",
        borderRadius: 14,
        padding: 16,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.015)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#6b7280",
          letterSpacing: 1.3,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#fafafa",
          letterSpacing: -0.4,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#71717a",
          lineHeight: 1.6,
        }}
      >
        {hint}
      </div>
    </div>
  );
}

function AlertCard({
  alert,
  onToggleStatus,
  onDelete,
}: {
  alert: AlertPriceResponse;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const distance = useMemo(() => {
    const diff = alert.targetPrice;
    const pct = Math.abs(diff) * 100;
    return { diff, pct };
  }, [alert.targetPrice]);

  const directionText = useMemo(() => {
    return "";
  }, [distance]);
  return (
    <div
      style={{
        background: "#000",
        border: "2px solid #1a1a1a",
        borderRadius: 16,
        padding: 18,
        transition: "all 0.2s ease",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.015), 0 10px 30px rgba(0,0,0,0.35)",
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#F0B90B";
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.backgroundColor = "#1e2026";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1a1a1a";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.backgroundColor = "#000";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#f5f5f5",
              }}
            >
              {alert.symbol}
            </div>
            <StatusBadge status={alert.isActive} />
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#71717a",
              lineHeight: 1.7,
            }}
          >
            Tạo lúc {alert.createdAt}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <MiniInfo
          label="Điều kiện"
          value={`${directionText} ${formatPrice(alert.targetPrice)}`}
        />
        <MiniInfo label="Giá hiện tại" value={formatPrice(100)} />
        <MiniInfo
          label="Khoảng cách"
          value={`${distance.diff > 0 ? "+" : ""}${formatPrice(distance.diff)} (${distance.pct.toFixed(2)}%)`}
        />
        <MiniInfo
          label="Lặp lại"
          value={alert.alertMode === "RECURRING" ? "Bật" : "Tắt"}
        />
      </div>

      {
        <div
          style={{
            marginBottom: 12,
            background: "#070707",
            border: "2px solid #2e2e2e",
            borderRadius: 12,
            padding: "10px 12px",
            minHeight: "100px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#6b7280",
              letterSpacing: 1.1,
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Ghi chú
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#b4b8c0",
              lineHeight: 1.7,
            }}
          >
            {alert.note}
          </div>
        </div>
      }

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={tagStyle}>{alert.conditionType}</span>
          <span style={tagStyle}>{alert.symbol}</span>
          <span
            style={alert.alertMode === "RECURRING" ? tagGoldStyle : tagStyle}
          >
            {alert.alertMode === "RECURRING" ? "Repeat On" : "One-time"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => onToggleStatus(alert.id)}
            style={{
              ...smallBtn,
              color: alert.isActive === 1 ? "#a1a1aa" : "#f0b90b",
              borderColor: alert.isActive === 1 ? "#242424" : "#4a380e",
              background: alert.isActive === 1 ? "#0a0a0a" : "#171107",
            }}
          >
            {alert.isActive === 1 ? "Tạm dừng" : "Bật lại"}
          </button>

          {confirmDelete ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                style={{
                  ...smallBtn,
                  color: "#9ca3af",
                  borderColor: "#242424",
                  background: "#0a0a0a",
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                style={{
                  ...smallBtn,
                  color: "#fca5a5",
                  borderColor: "#4c1010",
                  background: "#190707",
                }}
                onClick={() => onDelete(alert.id)}
              >
                Xóa
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                ...smallBtn,
                color: "#8b8f97",
                borderColor: "#222",
                background: "#0a0a0a",
              }}
            >
              Xóa cảnh báo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#050505",
        border: "2px solid #2e2e2e",
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#6b7280",
          letterSpacing: 1.1,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#ececec",
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function AddAlertForm({
  onCancel,
  handleAddAlert,
}: {
  onCancel: () => void;
  handleAddAlert: (newAlert: AlertPriceResponse) => void;
}) {
  const [symbol, setSymbol] = useState<string>("BTC/USDT");
  const [condition, setCondition] = useState<ConditionType>("PRICE_ABOVE");
  const [targetPrice, setTargetPrice] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMode, setAlertMode] = useState<AlertMode>("ONCE");
  // --- STATE CHO PHÂN TRANG (PAGINATION) ---
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Cờ kiểm tra xem còn data ở Backend không
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Cờ hiện loading khi cuộn
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Trạng thái mở/đóng của menu tự chế
  const [listCoins, setListCoins] = useState<CoinPairData[]>([]);
  const fetchCoinPairs = async (pageNumber: number) => {
    if (!hasMore && pageNumber > 0) return; // Nếu hết data rồi thì không gọi nữa

    setIsFetchingMore(true);
    try {
      // Gọi API với size = 20 để cuộn cho sướng
      const response = await coinService.getCoinPairs(pageNumber, 20);
      const dataResponse: CoinPairResponse = await response.data; // Giả sử API trả về đúng kiểu này
      const dataArray = await dataResponse.data; // Giả sử API trả về mảng data trong trường 'data'
      const isLast = await !dataResponse.hasMore; // Spring Slice thường có cờ 'last' (true nếu là trang cuối)
      console.log("✅ API coin trả về:", { isLast });
      if (pageNumber === 0) {
        // Lần đầu mở: Lưu đè
        setListCoins(dataArray);
        setHasMore(isLast);
        if (dataArray && dataArray.length > 0) {
          setSymbol(dataArray[0].symbol);
        }
      } else {
        // Cuộn trang 2, 3...: Nối mảng mới vào mảng cũ
        setListCoins((prevCoins) => [...(prevCoins || []), ...dataArray]);
      }

      setHasMore(!isLast); // Nếu isLast = true -> hasMore = false
    } catch (error) {
      console.error("❌ Lỗi gọi API coin:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Gọi lần đầu khi mở Modal
  useEffect(() => {
    fetchCoinPairs(0);
  }, []);

  // Gọi API mỗi khi biến `page` thay đổi (do người dùng cuộn)
  useEffect(() => {
    if (page > 0) {
      fetchCoinPairs(page);
    }
  }, [page]);

  // Hàm xử lý sự kiện khi cuộn
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // Dùng Math.ceil để làm tròn lên, và tăng vùng bù trừ lên 20px
    if (
      Math.ceil(target.scrollTop) + target.clientHeight >=
      target.scrollHeight - 20
    ) {
      console.log("👇 Đã chạm đáy! Trạng thái hiện tại:", {
        isFetchingMore,
        hasMore,
        page,
      });

      if (!isFetchingMore && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };
  const fetchAlerts = async (body: AlertCreateRequest) => {
    try {
      const response = await alertPriceService.CreateAlertsPrice(body);
      console.log(response.data.data);
      toast.success(response.data.message);
      const newAlert: AlertPriceResponse = response.data.data;
      handleAddAlert(newAlert);
      onCancel();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Đã tồn tại cảnh báo giá tương tự!");
    }
  };
  async function submit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const body: AlertCreateRequest = {
      symbol: symbol,
      conditionType: condition,
      targetPrice: Number(targetPrice),
      note: note,
      alertMode: alertMode,
    };

    fetchAlerts(body);
  }
  // useEffect(() => {
  //   fetchCoinPairs();
  //   console.log("listCoins");
  // }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          background: "linear-gradient(180deg, #0b0b0b 0%, #050505 100%)",
          border: "2px solid #2e2e2e",
          borderRadius: 18,
          padding: 20,
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.015), 0 12px 32px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#f5f5f5",
                fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
              }}
            >
              Thêm cảnh báo mới
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            style={{
              ...iconBtn,
              width: 32,
              height: 32,
              color: "#9ca3af",
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ position: "relative" }}>
            <label style={fieldLabel}>CẶP GIAO DỊCH</label>

            {/* Nút bấm giả làm thẻ select */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                ...inputStyle,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>{symbol ? symbol + "/USDT" : "Đang tải..."}</span>
              <span style={{ fontSize: "10px", color: "#666" }}>▼</span>
            </div>

            {/* Menu xổ xuống (Chỉ hiện khi isDropdownOpen = true) */}
            {isDropdownOpen && (
              <div
                onScroll={handleScroll} // Bắt sự kiện cuộn ở đây!
                style={{
                  position: "absolute",
                  top: "100%", // Nằm ngay dưới nút bấm
                  left: 0,
                  right: 0,
                  marginTop: "4px",
                  background: "#050505", // Màu nền menu
                  border: "2px solid #2e2e2e",
                  borderRadius: "8px",
                  maxHeight: "300px", // Giới hạn chiều cao để sinh ra thanh cuộn
                  overflowY: "auto", // Bật thanh cuộn dọc
                  zIndex: 9999,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                }}
              >
                {listCoins?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSymbol(item.symbol); // Cập nhật state
                      setIsDropdownOpen(false); // Chọn xong thì đóng menu
                    }}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      color: symbol === item.symbol ? "#f0b90b" : "#fff", // Đổi màu vàng nếu đang chọn
                      background:
                        symbol === item.symbol
                          ? "rgba(240,185,11,0.05)"
                          : "transparent",
                      borderBottom: "1px solid #111", // Dòng kẻ mờ giữa các item
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#1a1a1a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        symbol === item.symbol
                          ? "rgba(240,185,11,0.05)"
                          : "transparent")
                    }
                  >
                    {item.symbol + "/USDT"}
                  </div>
                ))}

                {/* Dòng chữ loading hiện ra ở cuối khi đang tải thêm */}
                {isFetchingMore && (
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      color: "#888",
                      fontSize: "12px",
                    }}
                  >
                    Đang tải thêm...
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={fieldLabel}>ĐIỀU KIỆN</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ConditionType)}
              style={inputStyle}
            >
              {/* Chú ý: Value phải khớp chính xác với Enum ở Backend Java */}

              <option
                value="PRICE_ABOVE"
                style={{ background: "#050505", color: "#fff" }}
              >
                Giá tăng trên (Price Rises Above)
              </option>

              <option
                value="PRICE_BELOW"
                style={{ background: "#050505", color: "#fff" }}
              >
                Giá giảm dưới (Price Drops Below)
              </option>

              <option
                value="MA_CROSS_UP"
                style={{ background: "#050505", color: "#fff" }}
              >
                Cắt lên đường MA (MA Cross Up)
              </option>

              <option
                value="MA_CROSS_DOWN"
                style={{ background: "#050505", color: "#fff" }}
              >
                Cắt xuống đường MA (MA Cross Down)
              </option>

              {/* Nếu bạn vẫn muốn giữ "Giá đạt đến", hãy map nó về một logic chung 
      ví dụ như PRICE_REACHES nếu BE có hỗ trợ, hoặc dùng tạm PRICE_ABOVE */}
              <option
                value="PRICE_ABOVE"
                style={{ background: "#050505", color: "#fff" }}
              >
                Giá chạm mốc
              </option>
            </select>
          </div>
        </div>

        {/* Hàng 2: Giá mục tiêu và Chế độ thông báo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <label style={fieldLabel}>GIÁ MỤC TIÊU</label>
            <input
              type="number"
              placeholder="Ví dụ: 72000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={fieldLabel}>CHẾ ĐỘ THÔNG BÁO</label>
            <select
              value={alertMode}
              onChange={(e) => setAlertMode(e.target.value as AlertMode)}
              style={inputStyle}
            >
              <option
                value="ONCE"
                style={{ background: "#050505", color: "#fff" }}
              >
                Chỉ báo 1 lần
              </option>
              <option
                value="RECURRING"
                style={{ background: "#050505", color: "#fff" }}
              >
                Lặp lại (Liên tục)
              </option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={fieldLabel}>GHI CHÚ</label>
          <textarea
            placeholder="Ví dụ: cảnh báo breakout, vào lệnh, chốt lời..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical",
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            }}
          />
        </div>
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(240,185,11,0.10) 0%, rgba(240,185,11,0.04) 100%)",
            border: "1px solid rgba(240,185,11,0.22)",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 14,
            display: "flex",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>🔔</span>
          <div
            style={{
              fontSize: 11,
              color: "#d6a728",
              lineHeight: 1.7,
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Cảnh báo giá chỉ là tín hiệu nhắc nhở. Không đảm bảo khớp đúng thời
            điểm biến động mạnh hoặc chênh lệch giá cực nhanh.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              ...smallBtn,
              flex: 1,
              padding: "11px 0",
              justifyContent: "center",
              color: "#a1a1aa",
              borderColor: "#222",
              background: "#080808",
            }}
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!targetPrice || loading}
            style={{
              flex: 2,
              padding: "11px 0",
              borderRadius: 10,
              cursor: !targetPrice || loading ? "not-allowed" : "pointer",
              background:
                !targetPrice || loading
                  ? "#1a1a1a"
                  : "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
              border:
                !targetPrice || loading
                  ? "1px solid #242424"
                  : "1px solid #e0ae10",
              color: !targetPrice || loading ? "#666" : "#111",
              fontSize: 13,
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
              fontWeight: 700,
              opacity: !targetPrice || loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow:
                !targetPrice || loading
                  ? "none"
                  : "0 8px 22px rgba(240,185,11,0.16)",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#111",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Đang tạo...
              </>
            ) : (
              "Tạo cảnh báo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<AlertPriceResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const fetchAlerts = async () => {
    try {
      const response = await alertPriceService.GetAlertsPrice();
      const listAlerts: AlertPriceResponse[] = response.data.data;
      console.log(listAlerts);
      setAlerts(listAlerts);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách cảnh báo.");
    }
  };
  function handleToggleStatus(id: number) {
    try {
      const response = alertPriceService.PauseAlertPrice(id);
      toast.success("Cập nhật trạng thái thành công!");
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id
            ? { ...alert, isActive: alert.isActive === 1 ? 0 : 1 }
            : alert,
        ),
      );
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái cảnh báo.");
    }
  }
  async function handleDeleteAlert(id: number) {
    try {
      const response = await alertPriceService.DeleteAlertPrice(id);
      toast.success("Xóa cảnh báo thành công!");
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (error) {
      toast.error("Lỗi khi xóa cảnh báo.");
    }
  }

  const handleAddAlert = (newAlert: AlertPriceResponse) => {
    setAlerts((prev) => [...prev, newAlert]);
  };
  useEffect(() => {
    fetchAlerts();
  }, []);
  return (
    <div
      style={{
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        background: "#000",
        minHeight: "100vh",
        color: "#e5e7eb",
        padding: "28px 24px",
        margin: "0 auto",
      }}
    >
      <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          input, select, textarea { outline: none; }
          input:focus, select:focus, textarea:focus {
            border-color: #f0b90b !important;
            box-shadow: 0 0 0 3px rgba(240,185,11,0.08);
          }
        `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <BellRoundIcon />
            <span
              style={{
                fontSize: 10,
                color: "#6b7280",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Price Alerts
            </span>
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              color: "#fafafa",
              letterSpacing: -0.3,
            }}
          >
            Quản lí cảnh báo giá
          </h1>

          <p
            style={{
              fontSize: 13,
              color: "#8b8f97",
              marginTop: 8,
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            Theo dõi các mức giá quan trọng để nhận cảnh báo breakout, pullback
            hoặc vùng chốt lời.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          style={{
            flexShrink: 0,
            padding: "12px 16px",
            borderRadius: 12,
            cursor: "pointer",
            background: "linear-gradient(180deg, #f0b90b 0%, #c9920a 100%)",
            border: "1px solid #e0ae10",
            color: "#111",
            fontSize: 13,
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 8px 22px rgba(240,185,11,0.16)",
            marginTop: 2,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          Thêm cảnh báo mới
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard
          title="Tổng cảnh báo"
          value={alerts.length}
          hint="Tất cả alerts đã tạo"
        />
        <StatCard
          title="Đang bật"
          value={alerts.filter((a) => a.isActive).length}
          hint="Đang theo dõi realtime"
        />
        <StatCard
          title="Tạm dừng"
          value={alerts.filter((a) => !a.isActive).length}
          hint="Chưa nhận thông báo"
        />
        <StatCard
          title="Đã kích hoạt"
          value={alerts.filter((a) => a.isTriggered).length}
          hint="Đã chạm điều kiện"
        />
      </div>

      {alerts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "56px 24px",
            color: "#3f3f46",
            border: "1px dashed #1a1a1a",
            borderRadius: 16,
            background: "#050505",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
          <div style={{ fontSize: 14, color: "#71717a" }}>
            Chưa có cảnh báo nào
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
            alignItems: "start",
          }}
        >
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteAlert}
            />
          ))}
        </div>
      )}

      {showForm && (
        <AddAlertForm
          onCancel={() => setShowForm(false)}
          handleAddAlert={handleAddAlert}
        />
      )}
    </div>
  );
}

const tagStyle: React.CSSProperties = {
  fontSize: 10,
  padding: "4px 9px",
  borderRadius: 999,
  background: "#0d0d0d",
  border: "1px solid #232323",
  color: "#a1a1aa",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  letterSpacing: 0.3,
};

const tagGoldStyle: React.CSSProperties = {
  ...tagStyle,
  background: "#171107",
  border: "1px solid #4a380e",
  color: "#f0b90b",
};

const smallBtn: React.CSSProperties = {
  background: "transparent",
  borderRadius: 8,
  cursor: "pointer",
  padding: "6px 10px",
  fontSize: 11,
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  display: "flex",
  alignItems: "center",
  gap: 4,
  border: "1px solid",
  transition: "all 0.15s",
};

const iconBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #202020",
  cursor: "pointer",
  color: "#7c828d",
  padding: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  transition: "all 0.15s",
};

const fieldLabel: React.CSSProperties = {
  fontSize: 10,
  color: "#6b7280",
  letterSpacing: 1.2,
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#050505",
  border: "1px solid #1a1a1a",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#f3f4f6",
  fontSize: 13,
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

function BellRoundIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
