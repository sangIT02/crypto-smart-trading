import { Bell, Search } from "lucide-react";

export function AdminHeader() {
  return (
    <header
      className="border-bottom px-3 px-md-4"
      style={{
        height: "64px",
        backgroundColor: "#111418",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="h-100 d-flex align-items-center justify-content-between gap-3">
        <div>
          <div className="fw-semibold text-white">Admin Console</div>
          <small style={{ color: "#8A8F98" }}>System Control Center</small>
        </div>

        <div className="d-none d-md-flex align-items-center flex-grow-1 justify-content-center">
          <div className="position-relative" style={{ width: "100%", maxWidth: "420px" }}>
            <Search
              size={16}
              className="position-absolute top-50 translate-middle-y"
              style={{ left: "12px", color: "#8A8F98" }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Tìm người dùng, coin, giao dịch..."
              style={{
                backgroundColor: "#1A1D22",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
              }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn position-relative d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#1A1D22",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
            }}
          >
            <Bell size={18} />
            <span
              className="position-absolute rounded-circle"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#f5a623",
                top: "10px",
                right: "10px",
              }}
            />
          </button>

          <div className="d-none d-md-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#f5a623",
                color: "#111",
              }}
            >
              A
            </div>
            <div>
              <div className="small text-white fw-semibold">Admin</div>
              <small style={{ color: "#8A8F98" }}>Super Admin</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}