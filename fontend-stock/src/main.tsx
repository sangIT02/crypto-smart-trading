import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider, theme } from 'antd'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<ConfigProvider
    theme={{
        algorithm: theme.darkAlgorithm, // ← Bật dark mode toàn bộ Ant Design
        token: {
            colorBgElevated:   '#1e2329', // Nền dropdown
            colorText:         '#ffffff', // Text trắng
            colorTextSecondary:'#848e9c',
            colorBorder:       '#2a2e39',
            borderRadius:       8,
        },
    }}
>
    <App />
</ConfigProvider>  </StrictMode>,
)
