import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import DashboardPage from "./components/dashboard/page";
import { Market } from "./pages/user/market.page";
import { Trading } from "./pages/user/trading.page";
import { GridTrading } from "./pages/user/grid-trading.page";
import { BotTrade } from "./pages/user/bot-trade.page";
import { Portfolio } from "./pages/user/portfolio.page";
import { ChatBot } from "./pages/user/chat.page";
import { RegisterPage } from "./pages/user/Register.page";
import ProfilePage from "./pages/user/ProfilePage";
import ApiKeyPage from "./pages/user/api-key.page";
import PriceAlertsPage from "./pages/user/alert.page";
import { AppLayout } from "./layout/MainLayout";
import AIPredictionPage from "./pages/user/ai-prediction.page";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import { MonitoringPage } from "./pages/admin/monitoring.page";
import { NotificationPage } from "./pages/admin/notification.page";
import { AiModelPage } from "./pages/admin/aimodel.page";
import { UserPage } from "./pages/admin/user.page";
import { NotFoundPage } from "./pages/NotFoundPage ";
import { SecurityPage } from "./pages/admin/security.page";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect từ "/" sang "/home" để tránh trang trắng */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Nhóm Route dành cho User */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/market" element={<Market />} />
          <Route path="/ai-prediction" element={<AIPredictionPage />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/grid-trading" element={<GridTrading />} />
          <Route path="/bot-trade" element={<BotTrade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/chat-bot" element={<ChatBot />} />
          <Route path="/alert" element={<PriceAlertsPage />} />
          <Route path="/apikey" element={<ApiKeyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

          <Route path="/register" element={<RegisterPage />} />

        {/* Nhóm Route dành cho Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/ai-models" element={<AiModelPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/security" element={<SecurityPage />} />
        </Route>

        {/* Trang 404 - Nếu người dùng nhập sai URL */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
