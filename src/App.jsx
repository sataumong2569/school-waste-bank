import { Suspense, lazy } from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';

const Members = lazy(() => import('./pages/Members'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const SystemConfig = lazy(() => import('./pages/SystemConfig'));

function App() {
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

      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;