import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './AppContext.jsx'

// 1. ลงทะเบียนและสั่งอัปเดต PWA Service Worker ทันที
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

// 2. ดักจับจังหวะที่ Service Worker เปลี่ยนเวอร์ชันใหม่ แล้วรีเฟรชหน้าจออัตโนมัติ
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)