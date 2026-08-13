
import umonglogo from './assets/umong1municipal_icon_notra.png'
import './App.css'

import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Members from './pages/Members';
import Login from './pages/Login';
import Settings from './pages/Settings';
import SystemConfig from './pages/SystemConfig';
import ScrollToTop from './components/ScrollToTop';


function App() {
  return (
    <div className="min-h-screen bg-white font-['Nunito'] flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="w-full flex-1">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/system-config" element={<SystemConfig />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;