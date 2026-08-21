import { useState, useEffect } from 'react'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import umonglogo from '../assets/umong1municipal_icon_notra.png'
import school1weblogo_192 from '../assets/school1weblogo_192.png'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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
        ? [
            ...baseNavItems,
            {
                label: 'จัดการระบบ',
                url: '/settings',
                activeColor: 'text-[#10b981] after:bg-[#10b981] after:shadow-[0_2px_6px_rgba(16,185,129,0.3)]',
                hoverColor: 'text-[#6d6a8a] hover:text-[#10b981] after:bg-[#a7f3d0]'
            }
        ]
        : baseNavItems;

    return (
        <nav
            className={`bg-white/90 backdrop-blur-md shadow-[0_2px_20px_rgba(124,58,237,0.08)] sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-2.5 md:py-3 transition-transform duration-300 font-['Prompt'] ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
                }`}
        >
            {/* ส่วนซ้าย: โลโก้ */}
            <div className="flex items-center gap-2.5 md:gap-3 w-1/2 md:w-1/3">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <img
                        src={umonglogo}
                        alt="Logo"
                        className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                    />
                    <span className="font-['Fredoka_One'] text-lg md:text-xl text-[#1e1b4b] hidden sm:block tracking-wide">
                        Umong Municipal School
                    </span>
                </Link>
            </div>

            {/* ส่วนกลาง: เมนูนำทาง */}
            <div className="hidden md:flex justify-center gap-6 w-1/3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.url;

                    return (
                        <Link
                            key={item.label}
                            to={item.url}
                            className={`relative px-1 py-1.5 font-bold text-[15px] transition-all duration-300
                                after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-[110%] after:h-[4px] after:rounded-full after:transition-all after:duration-300 origin-center
                                ${isActive
                                    ? item.activeColor + ' after:scale-x-100 after:opacity-100'
                                    : item.hoverColor + ' after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-100'
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* ส่วนขวา: เข้าสู่ระบบ / ออกจากระบบ */}
            <div className="flex items-center justify-end gap-2 md:gap-3 w-1/2 md:w-1/3">
                {!isLoggedIn ? (
                    <Link
                        to="/login"
                        className="px-4 py-1.5 md:px-5 md:py-2 bg-[#7c3aed] text-white rounded-full font-bold text-xs md:text-sm shadow-[0_3px_8px_rgba(124,58,237,0.25)] hover:bg-[#6d28d9] active:scale-95 transition-all whitespace-nowrap"
                    >
                        เข้าสู่ระบบ
                    </Link>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-red-50 text-red-500 border border-red-100 rounded-full font-bold text-xs md:text-sm shadow-sm hover:bg-red-100 active:scale-95 transition-all whitespace-nowrap"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5 stroke-2" />
                        <span>ออกจากระบบ</span>
                    </button>
                )}
            </div>
        </nav>
    )
}