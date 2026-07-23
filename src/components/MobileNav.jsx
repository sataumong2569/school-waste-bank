import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, UsersIcon as UsersSolid, Cog8ToothIcon as Cog8ToothSolid } from '@heroicons/react/24/solid';

export default function MobileNav() {
    const location = useLocation();

    // 🟢 สถานะแอดมิน (เปลี่ยนเป็น true เมื่อทำระบบ Login เสร็จ)
    const isAdmin = false;

    // รายการเมนูพื้นฐาน
    const baseNavItems = [
        { path: '/', label: 'หน้าหลัก', iconOutline: HomeIcon, iconSolid: HomeSolid, activeColor: 'bg-[#ff6b9d]' },
        { path: '/members', label: 'สมาชิก', iconOutline: UsersIcon, iconSolid: UsersSolid, activeColor: 'bg-[#ffd93d]' },
    ];

    // เพิ่มเมนูจัดการถ้าเป็นแอดมิน
    const navItems = isAdmin
        ? [...baseNavItems, { path: '/settings', label: 'จัดการ', iconOutline: Cog8ToothIcon, iconSolid: Cog8ToothSolid, activeColor: 'bg-[#4ecdc4]' }]
        : baseNavItems;

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4">
            {/* 
              เปลี่ยนจาก grid มาเป็น flex justify-center 
              เพื่อให้กล่องมารวมกันอยู่ตรงกลางและมีขนาดพอดี ไม่ยืดเต็มจอ
            */}
            <div className="flex items-center gap-3">

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = isActive ? item.iconSolid : item.iconOutline;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            // กำหนดความกว้าง (w-24 หรือประมาณ 96px) และความสูง (h-12) ให้เป็นกล่องสี่เหลี่ยมขอบมนกะทัดรัด
                            className={`flex flex-col items-center justify-center w-24 h-12 rounded-xl border-[2.5px] border-[#2d2d2d] transition-all duration-200 ${isActive
                                    ? `${item.activeColor} text-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d] -translate-y-0.5`
                                    : 'bg-white text-[#555] shadow-[2px_2px_0px_#2d2d2d] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#2d2d2d]'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-black mt-0.5 tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

            </div>
        </div>
    );
}