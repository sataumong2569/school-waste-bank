import { Suspense, lazy } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ScrollToTop from './components/ScrollToTop';

// 🚀 ทำ Code Splitting โดยใช้ React.lazy
// หน้าไหนที่ยังไม่ได้เปิด ผู้ใช้ก็จะไม่ต้องดาวน์โหลดโค้ดส่วนนั้น
const Home = lazy(() => import('./pages/Home'));
const Members = lazy(() => import('./pages/Members'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const SystemConfig = lazy(() => import('./pages/SystemConfig'));

// 🌀 หน้าจอ Loading คั่นกลางตอนเปลี่ยนหน้า
const PageLoader = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
    <div className="w-12 h-12 border-4 border-[#e2e8f0] border-t-[#3b82f6] rounded-full animate-spin"></div>
    <p className="mt-4 text-[#64748b] font-['Prompt'] font-bold text-sm animate-pulse">กำลังเตรียมหน้าต่าง...</p>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-white font-['Nunito'] flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="w-full flex-1">
        {/* ครอบ Routes ด้วย Suspense เพื่อดักรอไฟล์ที่กำลังโหลดแบบ Lazy */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/system-config" element={<SystemConfig />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;