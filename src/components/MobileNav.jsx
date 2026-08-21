import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, UsersIcon as UsersSolid, Cog8ToothIcon as Cog8ToothSolid } from '@heroicons/react/24/solid';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function MobileNav() {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    // รายการเมนูพื้นฐาน (ปรับเงาและขนาดให้กะทัดรัดขึ้น)
    const baseNavItems = [
        {
            path: '/',
            label: 'หน้าหลัก',
            iconOutline: HomeIcon,
            iconSolid: HomeSolid,
            activeClass: 'bg-[#7c3aed] text-white shadow-[0_2px_8px_rgba(124,58,237,0.35)] -translate-y-0.5'
        },
        {
            path: '/members',
            label: 'สมาชิก',
            iconOutline: UsersIcon,
            iconSolid: UsersSolid,
            activeClass: 'bg-[#f59e0b] text-white shadow-[0_2px_8px_rgba(245,158,11,0.35)] -translate-y-0.5'
        },
    ];

    const navItems = isLoggedIn
        ? [...baseNavItems, {
            path: '/settings',
            label: 'จัดการ',
            iconOutline: Cog8ToothIcon,
            iconSolid: Cog8ToothSolid,
            activeClass: 'bg-[#10b981] text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)] -translate-y-0.5'
        }]
        : baseNavItems;

    return (
        // ปรับระยะห่างจากขอบล่างจอลงมา (bottom-3)
        <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 flex justify-center items-center px-4 fade-up" style={{ animationDelay: '0.2s' }}>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up {
                    animation: fadeUp 0.4s ease-out forwards;
                }
            `}</style>

            {/* กรอบ Glassmorphism ขนาดกะทัดรัด (p-1.5 gap-1.5) */}
            <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-md p-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/80">

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = isActive ? item.iconSolid : item.iconOutline;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 h-11 rounded-full transition-all duration-200 font-['Prompt'] ${isActive
                                    ? item.activeClass
                                    : 'bg-transparent text-slate-500 hover:bg-white/60 hover:text-slate-700 active:scale-95'
                                }`}
                        >
                            <Icon className="w-4 h-4 mb-0.5 transition-transform" />
                            <span className="text-[10px] font-semibold leading-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

            </div>
        </div>
    );
}