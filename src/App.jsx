import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Members from './pages/Members';

function App() {
  return (
    <div className="min-h-screen bg-[#fef9f0] font-['Nunito'] pb-12">
      <Navbar />

      <main className="p-8">
        <Routes>

          <Route path="/" element={<Home />} />

          {/* สร้าง Route เปล่าๆ มารองรับหน้าอื่นๆ เวลากดคลิกจะได้ไม่ Error */}
          <Route path="/members" element={<Members />} />
          <Route path="/orders" element={<h1 className="text-center font-['Fredoka_One'] text-3xl mt-10">นี่คือหน้า รายการรับซื้อ</h1>} />
          <Route path="/settings" element={<h1 className="text-center font-['Fredoka_One'] text-3xl mt-10">นี่คือหน้า ตั้งค่า</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;