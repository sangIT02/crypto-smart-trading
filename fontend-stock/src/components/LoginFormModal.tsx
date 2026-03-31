import React, { useState } from 'react'
import { userService } from '../services';

export type LoginModalProps = {
    show: boolean;
    onClose: () => void;
};

interface UserInfo {
    id: number;
    fullname: string | null;
    email: string;
    auth_provider: 'LOCAL' | 'GOOGLE' | null;
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
            debugger
            const res = await userService.login(email, password);
            const apiData = res.data as LoginResponse; // Ép kiểu để TS hiểu
            console.log(apiData)
            if (apiData.code === 200 && apiData.data) {
                localStorage.setItem("accessToken", apiData.data.access_token);
                localStorage.setItem("refreshToken", apiData.data.refresh_token);

                localStorage.setItem("user", JSON.stringify(apiData.data.user_infor));

                // 2. Chuyển trang (window.location hợp lệ hoàn toàn trong TS)
                window.location.href = "/home";
            } else {
                alert("Đăng nhập thất bại: " + apiData.message);
            }

        } catch (error: any) {
            // TypeScript thường coi error là 'unknown', nên cần ép kiểu hoặc dùng any
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
    };

    if (!show) return null;
    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>

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
                                    {/* PHONE INPUT */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small">Số điện thoại</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="bi bi-phone text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0 shadow-none"
                                                placeholder="Nhập số điện thoại"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* PASSWORD INPUT */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-secondary small">Mật khẩu</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="bi bi-lock text-muted"></i>
                                            </span>
                                            <input
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
                                                {showPassword ? <i className="bi bi-eye text-primary"></i> : <i className="bi bi-eye-slash text-muted"></i>}
                                            </span>
                                        </div>
                                        <div className="text-end mt-2">
                                            <a href="#" className="text-decoration-none small text-primary">Quên mật khẩu?</a>
                                        </div>
                                    </div>

                                    {/* BUTTON */}
                                    <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill mb-3"
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
                                        <button
                                            type="button" // Quan trọng: Để không bị submit form nhầm
                                            className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                                            onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                                        >
                                            {/* Icon Google SVG chuẩn (đỡ phải cài thư viện icon) */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352-2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                            </svg>
                                            Đăng nhập bằng Google
                                        </button>
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

