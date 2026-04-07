import { useState, useEffect } from "react";
import { userService } from "../services";

export type OtpModalProps = {
    email: string;
    pass: string
    show: boolean;
    onClose: () => void;
};

export const OtpModal = ({ email, pass, show, onClose }: OtpModalProps) => {
    const [otp, setOtp] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(60 * 3); // Bắt đầu đếm ngược 60s ngay khi hiện form
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Thêm số '0' đằng trước nếu nhỏ hơn 10 (Ví dụ: 5 -> 05)
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const displaySeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

        return `${displayMinutes}:${displaySeconds}`;
    };
    const verifyAndCreateUser = async () => {
        // e.preventDefault();
        try {
            const response = await userService.verifyOtp(email,pass, otp);
            console.log(response)
            if (response.data?.code === 200) {
                alert("Xác thực thành công!");
                window.location.href = "/home";
            } else {
                alert("Lỗi: " + response.data?.message);
            }

        } catch (error) {
            // 3. Bắt lỗi hệ thống (Mất mạng, Server sập 500...)
            console.error("Lỗi hệ thống:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };
    // Logic đếm ngược
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;;
        if (show && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [show, countdown]);

    // Reset lại đếm ngược khi bấm gửi lại
    const handleResend = () => {
        setCountdown(60 * 3);
        alert(`Đã gửi lại mã mới tới ${email}`);
    };

    if (!show) return null; // Nếu show = false thì không render gì cả

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    {/* Header Modal */}
                    <div className="modal-header">
                        <h5 className="modal-title">Xác thực tài khoản</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* Body Modal */}
                    <div className="modal-body text-center">
                        <p>Mã OTP đã gửi về: <strong>{email}</strong></p>

                        <input
                            type="text"
                            className="form-control text-center fw-bold fs-4 mb-3"
                            placeholder="0 0 0 0 0 0"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ letterSpacing: "5px" }}
                        />

                        {/* Nút Tiếp tục (Bước cuối) */}
                        <button
                            type="button"
                            className="btn btn-primary w-100 mb-3"
                            onClick={verifyAndCreateUser}
                            disabled={otp.length < 6}
                        >
                            Xác nhận
                        </button>

                        {/* Nút Đếm ngược */}
                        <button
                            className="btn btn-link text-decoration-none"
                            onClick={handleResend}
                            disabled={countdown > 0} // Disable khi đang đếm
                            style={{ color: countdown > 0 ? '#999' : '#0d6efd' }}
                        >
                            {countdown > 0
                                ? `Gửi lại mã sau ${formatTime(countdown)}s`
                                : "Gửi lại mã ngay"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
