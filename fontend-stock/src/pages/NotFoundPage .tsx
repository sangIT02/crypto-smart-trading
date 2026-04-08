import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center text-white"
      style={{ minHeight: "100vh", backgroundColor: "#000" }}
    >
      <h1 className="fw-bold mb-2" style={{ fontSize: "72px", color: "#F0B90B" }}>
        404
      </h1>
      <h4 className="mb-2">Page not found</h4>
      <p className="text-secondary mb-4">Trang bạn tìm không tồn tại.</p>

      <Link
        to="/"
        className="btn fw-semibold"
        style={{ backgroundColor: "#F0B90B", color: "#000", border: "none" }}
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};