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

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl); // https://api.dnse.com.vn
  const connect    = useSocketStore(s => s.connect);
  const disconnect = useSocketStore(s => s.disconnect);

  useEffect(() => {
      connect();
      return () => disconnect();
  }, []);

  
  return (
    <BrowserRouter>
      <Routes>
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

      </Routes>
      <Routes>
        <Route path='register' element={<RegisterPage/>}></Route>
      </Routes>
    </BrowserRouter>

  );

}

export default App;
