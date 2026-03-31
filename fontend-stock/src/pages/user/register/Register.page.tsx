import { useEffect, useState } from "react";
import logo from "../../../assets/user/233242295.png";
import { userService } from "../../../services";
import { OtpModal } from "../../../components/OtpModal";
import { LoginFormModal } from "../../../components/LoginFormModal";
/* ================= REGEX ================= */



const phoneRegex = /^(0|\+84)[0-9]{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;


const validateEmail = (value: string) => {
    if (!value) return "Vui lòng nhập email";
    if (!emailRegex.test(value)) return "Email không hợp lệ";
    return "";
};

const validatePassword = (value: string): string => {
    if (!value) return "Mật khẩu không được để trống";
    if (!PASSWORD_REGEX.test(value)) {
        return "Mật khẩu chưa đủ mạnh";
    }
    return "";
};



export const RegisterPage = () => {
    /* ================= STATE ================= */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
    const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);



    // --- XỬ LÝ SỰ KIỆN NÚT "TIẾP TỤC" ---
    const handleContinueClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(email)
        setShowOtpModal(true);
        userService.sentOtp(email).then((response) => {
            if (response.status === 200) {
                setShowOtpModal(true);
            } else {
                setShowOtpModal(false);
            }
        });
    };

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setShowLoginModal(true);
    }


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        const error = validatePassword(value);
        setPasswordError(error);

        // check luôn confirm password
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError("Mật khẩu nhập lại không khớp");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (value !== password) {
            setConfirmPasswordError("Mật khẩu nhập lại không khớp");
        } else {
            setConfirmPasswordError("");
        }
    };

    const isFormValid =
        email &&
        !emailError &&
        !passwordError &&
        !confirmPasswordError &&
        emailRegex.test(email) &&
        PASSWORD_REGEX.test(password) &&
        password === confirmPassword;


    return (
        <div className="container-fluid m-0 p-0">
            <div className="row">
                {/* LEFT */}
                <div className="col-12 col-lg-8 d-flex flex-column align-items-center">
                    {/* Logo */}
                    <img
                        src={logo}
                        alt="Logo"
                        className="img-fluid mb-4"
                        style={{ width: 96, height: 96, objectFit: "contain" }}
                    />

                    {/* Form */}
                    <div className="w-100 p-4" style={{ maxWidth: 420 }}>
                        <h2 className="text-center mb-4">Thông tin đăng ký</h2>

                        <form>

                            {/* EMAIL */}
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                {emailError && (
                                    <div className="invalid-feedback">{emailError}</div>
                                )}
                            </div>

                            {/* REFERRAL */}


                            <div className="mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <div className="input-group has-validation"> {/* Thêm input-group */}
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control ${passwordError ? "is-invalid" : password ? "is-valid" : ""}`} // Bỏ pe-5 vì không cần nữa
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />

                                    {/* Icon mắt nằm trong span input-group-text */}
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                                    </span>

                                    {/* Hiển thị lỗi */}
                                    {passwordError && (
                                        <div className="invalid-feedback">
                                            {passwordError}
                                        </div>
                                    )}

                                    {/* <span
                                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                                </span> */}
                                </div>

                                <p className="text-muted" style={{ fontSize: 12 }}>
                                    Vui lòng nhập mật khẩu tối thiểu 8 ký tự, bao gồm chữ số, chữ thường,
                                    chữ in hoa, ký tự đặc biệt và không chứa dấu cách
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nhập lại mật khẩu</label>
                                <div className="input-group has-validation"> {/* Thêm input-group */}
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`form-control ${confirmPasswordError ? "is-invalid" : confirmPassword ? "is-valid" : ""}`} // Bỏ pe-5 vì không cần nữa
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />

                                    {/* Icon mắt nằm trong span input-group-text */}
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                                    </span>

                                    {/* Hiển thị lỗi */}
                                    {confirmPasswordError && (
                                        <div className="invalid-feedback">
                                            {confirmPasswordError}
                                        </div>
                                    )}

                                    {/* <span
                                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                                </span> */}
                                </div>
                            </div>
                            {/* BUTTON */}
                            <button
                                type="submit"
                                className="btn btn-dark w-100 py-2 my-2"
                                disabled={!isFormValid}
                                onClick={handleContinueClick}
                            >
                                Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                            <OtpModal
                                show={showOtpModal}
                                email={email}
                                pass={password}
                                onClose={() => setShowOtpModal(false)} // Tắt khi bấm X

                            />
                            <button
                                className="btn btn-dark w-100 py-2"
                                onClick={handleLogin}
                            >
                                Đăng nhập
                            </button>

                        </form>
                        <LoginFormModal
                            show={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                        />
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="col-lg-4 d-none d-lg-block p-0"> {/* Thêm p-0 để bỏ padding nếu cần sát lề */}
                    <img
                        // Chọn 1 trong 3 link ở trên dán vào đây
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"

                        alt="Register Illustration"

                        className="img-fluid vh-100 w-100 object-fit-cover"
                    />
                </div>
            </div >
        </div >
    );
};
