import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import DashboardPage from './components/dashboard/page';
import { Market } from './pages/market.page';
import { Trading } from './pages/trading.page';
import { GridTrading } from './pages/grid-trading.page';
import { BotTrade } from './pages/bot-trade.page';
import { Portfolio } from './pages/portfolio.page';
import { ChatBot } from './pages/chat.page';
import { RegisterPage } from './pages/user/register/Register.page';
import { useSocketStore } from './services/useSocketStore';
import { useEffect } from 'react';
import AIPredictionPage from './pages/ai-prediction.page';
import ProfilePage from './pages/ProfilePage';
import ApiKeyPage from './pages/api-key.page';
import PriceAlertsPage from './pages/alert.page';
import { AppLayout } from './layout/MainLayout';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </BrowserRouter>

  );

}

export default App;
