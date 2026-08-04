
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


function App() {
  return (
    <div className="min-h-screen bg-[#fef9f0] font-['Nunito'] pb-12">
      <Navbar />

      <main className="p-8">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/members" element={<Members />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default App;