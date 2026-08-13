import { useState, useEffect } from 'react'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// ลบการ import DropdownMenu ออกไปเลยครับ
import umonglogo from '../assets/umong1municipal_icon_notra.png'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export default function Navbar() {
    // 🟢 ลบ state isDropdownOpen ทิ้งไปเลย เพราะไม่ได้ใช้แล้ว
    const location = useLocation()
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const baseNavItems = [
        {
            label: 'หน้าหลัก',
            url: '/',
            activeColor: 'text-[#7c3aed] after:bg-[#7c3aed] after:shadow-[0_2px_6px_rgba(124,58,237,0.3)]',
            hoverColor: 'text-[#6d6a8a] hover:text-[#7c3aed] after:bg-[#ddd6fe]'
        },
        {
            label: 'ข้อมูลสมาชิก',
            url: '/members',
            activeColor: 'text-[#db2777] after:bg-[#db2777] after:shadow-[0_2px_6px_rgba(219,39,119,0.3)]',
            hoverColor: 'text-[#6d6a8a] hover:text-[#db2777] after:bg-[#fbcfe8]'
        },
    ]

    const navItems = isLoggedIn
        ? [...baseNavItems, { label: 'จัดการระบบ', url: '/settings', isSpecial: true }]
        : baseNavItems;

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-[0_2px_20px_rgba(124,58,237,0.08)] sticky top-0 z-40 flex items-center justify-between px-6 py-3 transition-all">

            {/* ส่วนซ้าย: โลโก้ */}
            <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 bg-[#f59e0b] rounded-[14px] flex items-center justify-center shadow-[inset_-2px_-3px_6px_rgba(0,0,0,0.15),_0_4px_10px_rgba(245,158,11,0.25)] overflow-hidden p-1.5 transition-transform hover:-translate-y-0.5">
                    <img src={umonglogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-['Fredoka_One'] text-xl text-[#1e1b4b] hidden sm:block tracking-wide">
                    Umong Municipal School
                </span>
            </div>

            {/* ส่วนกลาง: เมนูนำทาง */}
            <div className="hidden md:flex justify-center gap-6 w-1/3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.url;

                    if (item.isSpecial) {
                        return (
                            <Link
                                key={item.label}
                                to={item.url}
                                className={`px-4 py-1.5 rounded-full font-['Nunito'] font-bold text-sm transition-all duration-200 flex items-center
                                    ${isActive
                                        ? 'bg-[#10b981] text-white shadow-[0_4px_0px_#047857,_inset_0_-2px_0_rgba(0,0,0,0.1),_0_6px_10px_rgba(16,185,129,0.3)] -translate-y-0.5'
                                        : 'bg-[#d1fae5] text-[#047857] hover:bg-[#10b981] hover:text-white hover:shadow-[0_4px_0px_#047857,_inset_0_-2px_0_rgba(0,0,0,0.1),_0_6px_10px_rgba(16,185,129,0.3)] hover:-translate-y-0.5'
                                    }
                                `}
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.url}
                            className={`relative px-1 py-1.5 font-['Nunito'] font-black text-[15px] transition-all duration-300
                                after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-[110%] after:h-[5px] after:rounded-full after:transition-all after:duration-300 origin-center
                                ${isActive
                                    ? item.activeColor + ' after:scale-x-100 after:opacity-100'
                                    : item.hoverColor + ' after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-100'
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* ส่วนขวา: ฝั่งเข้าสู่ระบบ / ออกจากระบบแบบมินิมอล */}
            <div className="flex items-center justify-end gap-3 w-max md:w-1/3 relative">
                {!isLoggedIn ? (
                    <Link
                        to="/login"
                        className="px-4 py-2 md:px-6 md:py-2.5 bg-[#7c3aed] text-white rounded-full font-['Nunito'] font-bold text-xs md:text-sm shadow-[0_4px_10px_rgba(124,58,237,0.3),_inset_0_-2px_4px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(124,58,237,0.4),_inset_0_-2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-sm transition-all whitespace-nowrap"
                    >
                        เข้าสู่ระบบ
                    </Link>
                ) : (
                    /* 🟢 ปุ่มออกจากระบบ (แสดงทั้งคอมและมือถือแบบคลีนๆ) */
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2 bg-red-50 text-red-500 border border-red-100 rounded-full font-['Nunito'] font-bold text-xs md:text-sm shadow-sm hover:bg-red-100 active:scale-95 transition-all whitespace-nowrap"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5 stroke-2" />
                        ออกจากระบบ
                    </button>
                )}
            </div>
        </nav>
    )
}