import React, { useState } from "react";
import { userService } from "../services";
import { authService, setTokens } from "../services/auth";
import { GoogleLogin } from "@react-oauth/google";

export type LoginModalProps = {
  show: boolean;
  onClose: () => void;
};

interface UserInfo {
  id: number;
  fullname: string | null;
  email: string;
  auth_provider: "LOCAL" | "GOOGLE" | null;
  role: string;
}

// Cấu trúc phản hồi từ API (LoginResponse)
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_infor: UserInfo;
    expires_in: number;
  };
}

export const LoginFormModal = ({ show, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Ngăn chặn reload trang mặc định của form

    try {
      const res = await authService.login(email, password);
      const apiData = res.data;
      console.log(apiData);
      if (apiData.code === 200 && apiData.data) {
        setTokens({
          accessToken: apiData.data.access_token,
          refreshToken: apiData.data.refresh_token,
        });
        if(apiData.data.user_infor.role === "ADMIN") {
          window.location.href = "/dashboard";
        } else {  
        window.location.href = "/home";
        }
      }
    } catch (error: any) {
      // TypeScript thường coi error là 'unknown', nên cần ép kiểu hoặc dùng any
      console.error("Lỗi:", error);
      alert(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message),
      );
    }
  };

  const handleLogout = () => {
    
    authService.logout();
  };

  if (!show) return null;
  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg overflow-hidden"
          style={{ borderRadius: "20px" }}
        >
          {/* Header: Nút tắt đặt absolute gọn gàng */}
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3 z-3"
            onClick={onClose}
          ></button>

          <div className="modal-body p-0">
            <div className="row g-0 h-100">
              {/* CỘT TRÁI: HÌNH ẢNH */}
              <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light">
                <img
                  src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=740&t=st=1708400000~exp=1708400600~hmac=a1b2c3d4"
                  alt="Login Illustration"
                  className="img-fluid p-4"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
                {/* Gợi ý ảnh khác:
                                    1. https://img.freepik.com/free-vector/computer-login-concept-illustration_114360-3892.jpg
                                    2. https://img.freepik.com/free-vector/secure-login-concept-illustration_114360-4582.jpg
                                */}
              </div>

              {/* CỘT PHẢI: FORM NHẬP LIỆU */}
              <div className="col-lg-6 d-flex flex-column justify-content-center p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-1">Chào mừng trở lại!</h3>
                  <p className="text-muted">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                <form>
                  {/* Email INPUT */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-phone text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0 shadow-none"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary small">
                      Mật khẩu
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        autoComplete="new-password"

                        type={showPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0 ps-0 shadow-none"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className="input-group-text bg-white border-start-0 cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye text-primary"></i>
                        ) : (
                          <i className="bi bi-eye-slash text-muted"></i>
                        )}
                      </span>
                    </div>
                    <div className="text-end mt-2">
                      <a
                        href="#"
                        className="text-decoration-none small text-primary"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill mb-3"
                    onClick={handleLogin}
                  >
                    ĐĂNG NHẬP
                  </button>

                  {/* Divider */}
                  <div className="d-flex align-items-center my-3">
                    <hr className="flex-grow-1" />
                    <span className="mx-2 text-muted small">Hoặc</span>
                    <hr className="flex-grow-1" />
                  </div>

                  {/* --- Nút Google --- */}
                  <div className="d-grid gap-2">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          const token = credentialResponse.credential;

                          const res = await authService.loginGoogle(token!);
                          const loginData: LoginResponse = res.data;
                          console.log(res.data);
                          if (loginData.code === 200 && loginData.data) {
                            setTokens({
                              accessToken: loginData.data.access_token,
                              refreshToken: loginData.data.refresh_token,
                            });
                            if (loginData.data.user_infor.role === "ADMIN") {
                              window.location.href = "/dashboard";
                            } else {
                              window.location.href = "/home";
                            }
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
