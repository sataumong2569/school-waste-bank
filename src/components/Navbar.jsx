import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, InboxIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import DropdownMenu from './DropdownMenu'
import umonglogo from '../assets/umong1municipal_icon_notra.png'

// 🟢 Import Firebase Auth เข้ามาเพื่อเช็คสถานะการล็อกอิน
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const location = useLocation()

    // 🟢 เปลี่ยนจาก const ธรรมดา มาใช้ State เพื่อเก็บสถานะล็อกอิน
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // 🟢 ใช้ useEffect วิ่งไปเช็คกับ Firebase ทุกครั้งที่เปิดเว็บหรือรีเฟรชหน้า
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true); // ถ้ามี user ล็อกอินค้างไว้ ให้แสดงเมนู
            } else {
                setIsLoggedIn(false); // ถ้าไม่มี ให้ซ่อนเมนู
            }
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const baseNavItems = [
        {
            label: 'Home',
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

    // ถ้า isLoggedIn เป็น true (ล็อกอินแล้ว) ให้โชว์ปุ่มจัดการระบบ
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

            {/* ส่วนขวา: ไอคอน + โปรไฟล์ (แสดงเมื่อ Logged In เท่านั้น) */}
            <div className="flex items-center justify-end gap-3 w-1/3 relative">
                {isLoggedIn && (
                    <>
                        <button className="p-2 rounded-full bg-white text-[#1e1b4b] shadow-[0_4px_10px_rgba(0,0,0,0.05),_inset_0_-3px_0_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08),_inset_0_-3px_0_rgba(0,0,0,0.04)] active:translate-y-0.5 active:shadow-[0_2px_4px_rgba(0,0,0,0.05),_inset_0_-1px_0_rgba(0,0,0,0.04)] transition-all">
                            <InboxIcon className="w-5 h-5 font-bold" />
                        </button>

                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.05),_inset_0_-3px_0_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.08),_inset_0_-3px_0_rgba(0,0,0,0.04)] active:translate-y-0.5 active:shadow-[0_2px_4px_rgba(0,0,0,0.05),_inset_0_-1px_0_rgba(0,0,0,0.04)] transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center overflow-hidden shadow-[inset_-2px_-3px_5px_rgba(0,0,0,0.08)]">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Nong" alt="User" className="opacity-90 mix-blend-multiply" />
                            </div>
                            <span className="font-bold text-sm text-[#1e1b4b] font-['Nunito'] hidden md:block">Profile</span>
                            <ChevronDownIcon className="w-3.5 h-3.5 text-[#6d6a8a]" />
                        </button>

                        {/* โชว์ Dropdown เมนู */}
                        {isDropdownOpen && <DropdownMenu />}
                    </>
                )}
            </div>
        </nav>
    )
}