import { Suspense, lazy, useRef } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ScrollToTop from './components/ScrollToTop';
import PwaInstallPopup from './components/PwaInstallPopup';

import Home from './pages/Home';

const Members = lazy(() => import('./pages/Members'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const SystemConfig = lazy(() => import('./pages/SystemConfig'));

function App() {
  // สร้าง Ref เพื่อส่งคำสั่งเปิด Modal ไปยัง PwaInstallPopup
  const pwaRef = useRef(null);

  return (
    <div className="min-h-screen bg-white font-['Nunito'] flex flex-col">
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