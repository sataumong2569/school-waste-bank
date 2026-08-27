import { Suspense, lazy, useRef } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ScrollToTop from './components/ScrollToTop';
import PwaInstallPopup from './components/PwaInstallPopup';
import usePullToRefresh from './hooks/usePullToRefresh';
import Home from './pages/Home';

const Members = lazy(() => import('./pages/Members'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const SystemConfig = lazy(() => import('./pages/SystemConfig'));

function App() {

  // สร้าง Ref เพื่อส่งคำสั่งเปิด Modal ไปยัง PwaInstallPopup
  const pwaRef = useRef(null);

  const { spinnerRef, isRefreshing } = usePullToRefresh({ threshold: 110 });

  return (
    <div className="min-h-screen bg-white font-['Nunito'] flex flex-col relative">

      {/* ผูก ref เข้ากับ div นี้ */}
      <div
        ref={spinnerRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{
          transform: 'translateY(-60px)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-200">
          <svg
            className={`h-5 w-5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
      <ScrollToTop />
      <Navbar />

      <main className="w-full flex-1">
        <Suspense fallback={<div className="w-full min-h-[80vh] bg-white"></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/system-config" element={<SystemConfig />} />
          </Routes>
        </Suspense>
      </main>

      {/* ส่งฟังก์ชันเปิด Modal เข้าไปใน Footer */}
      <Footer onOpenInstallModal={() => pwaRef.current?.openModal()} />
      <MobileNav />

      {/* วาง PwaInstallPopup ไว้ที่ระดับ Global ของ App */}
      <PwaInstallPopup ref={pwaRef} />
    </div>
  );
}

export default App;