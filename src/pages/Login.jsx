import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, EnvelopeIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
// 🟢 นำเข้า auth จากไฟล์ตั้งค่า Firebase ของคุณ (ปรับ path ตามโครงสร้างโฟลเดอร์จริง เช่น '../firebase' หรือ './firebase')
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // 🟢 ฟังก์ชันล็อกอินเชื่อมต่อ Firebase Auth จริง
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // ล็อกอินสำเร็จ พาไปยังหน้าจัดการระบบ
            navigate('/settings');
        } catch (error) {
            console.error("Login Error:", error.message);
            setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง');
        }
    };

    return (
        <div className="min-h-screen bg-[#f0eeff] flex items-center justify-center p-6 relative overflow-hidden">

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#e9e3ff] rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#fff7ed] rounded-full blur-3xl opacity-60"></div>

            <div className="clay-card w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative z-10 fade-up">

                {/* ฝั่งซ้าย: ฟอร์ม Login */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f59e0b] text-white shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.15)] mb-4">
                            <LockClosedIcon className="w-6 h-6" />
                        </div>
                        <h1 className="font-['Fredoka_One'] text-3xl text-[#1e1b4b] mb-2">Admin Login</h1>
                        <p className="font-['Nunito'] font-bold text-[#6d6a8a] text-sm">เข้าสู่ระบบการจัดการ SchoolWaste</p>
                    </div>

                    {/* แสดงข้อความแจ้งเตือนเมื่อล็อกอินไม่ผ่าน */}
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded-xl text-xs font-bold font-['Nunito']">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d6a8a] font-bold" />
                            <input
                                type="email"
                                placeholder="Admin Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]"
                            />
                        </div>

                        <div className="relative">
                            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d6a8a] font-bold" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]"
                            />
                        </div>

                        <button type="submit" className="clay-btn-purple w-full mt-2 py-3.5 text-base">
                            เข้าสู่ระบบ <ArrowRightEndOnRectangleIcon className="w-5 h-5 ml-1 stroke-2" />
                        </button>
                    </form>
                </div>

                {/* ฝั่งขวา: 3D Animation */}
                <div className="hidden md:flex w-1/2 bg-[#7c3aed] p-12 flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] to-[#5b21b6]"></div>

                    <div className="relative z-10 w-48 h-48 bg-[#34d399] rounded-[40px] animate-float-3d shadow-[15px_25px_0px_#047857,_inset_0_-10px_20px_rgba(0,0,0,0.2),_inset_0_10px_20px_rgba(255,255,255,0.4)] border-4 border-[#6ee7b7] flex items-center justify-center rotate-12">
                        <LockClosedIcon className="w-20 h-20 text-white drop-shadow-md" />
                    </div>

                    <h2 className="relative z-10 font-['Fredoka_One'] text-3xl text-white mt-12 text-center drop-shadow-md">
                        Secure<br />Management
                    </h2>
                </div>

            </div>
        </div>
    );
}