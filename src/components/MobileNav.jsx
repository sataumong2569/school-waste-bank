import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, UsersIcon as UsersSolid, Cog8ToothIcon as Cog8ToothSolid } from '@heroicons/react/24/solid';

export default function MobileNav() {
    const location = useLocation();

    // 🟢 สถานะแอดมิน (เปลี่ยนเป็น true เมื่อทำระบบ Login เสร็จ)
    const isAdmin = false;

    // รายการเมนูพื้นฐาน (เปลี่ยนสีและสไตล์เงาให้เป็นแบบ Clay 3D)
    const baseNavItems = [
        {
            path: '/',
            label: 'หน้าหลัก',
            iconOutline: HomeIcon,
            iconSolid: HomeSolid,
            // สไตล์เมื่อ Active (สีม่วง Clay)
            activeClass: 'bg-[#7c3aed] text-white shadow-[0_4px_0px_#5b21b6,_inset_0_-3px_0_rgba(0,0,0,0.15),_0_8px_16px_rgba(124,58,237,0.3)] -translate-y-1'
        },
        {
            path: '/members',
            label: 'สมาชิก',
            iconOutline: UsersIcon,
            iconSolid: UsersSolid,
            // สไตล์เมื่อ Active (สีเหลืองอำพัน Clay)
            activeClass: 'bg-[#f59e0b] text-white shadow-[0_4px_0px_#d97706,_inset_0_-3px_0_rgba(0,0,0,0.15),_0_8px_16px_rgba(245,158,11,0.3)] -translate-y-1'
        },
    ];

    // เพิ่มเมนูจัดการถ้าเป็นแอดมิน
    const navItems = isAdmin
        ? [...baseNavItems, {
            path: '/settings',
            label: 'จัดการ',
            iconOutline: Cog8ToothIcon,
            iconSolid: Cog8ToothSolid,
            // สไตล์เมื่อ Active (สีเขียวมิ้นต์ Clay)
            activeClass: 'bg-[#10b981] text-white shadow-[0_4px_0px_#047857,_inset_0_-3px_0_rgba(0,0,0,0.15),_0_8px_16px_rgba(16,185,129,0.3)] -translate-y-1'
        }]
        : baseNavItems;

    return (
        <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center items-center px-4 fade-up" style={{ animationDelay: '0.2s' }}>

            {/* 🎬 อนิเมชั่นเลื่อนขึ้นตอนโหลดหน้าเว็บ */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up {
                    animation: fadeUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>

            {/* 
              ฐานรองเมนู: ใช้พื้นหลังกึ่งโปร่งแสงขอบมน (Glassmorphism) 
              เพื่อให้ปุ่มดินปั้นดูลอยเด่นขึ้นมาจากพื้นหลังเว็บไซต์
            */}
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-2 rounded-[28px] shadow-[0_8px_32px_rgba(124,58,237,0.1)] border border-white/60">

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = isActive ? item.iconSolid : item.iconOutline;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            // ปรับเป็น rounded-2xl (โค้งมนพิเศษ) ขจัดเส้นขอบดำ
                            className={`flex flex-col items-center justify-center w-20 h-[52px] rounded-2xl transition-all duration-300 font-['Nunito'] ${isActive
                                    ? item.activeClass
                                    : 'bg-white text-[#6d6a8a] shadow-[0_4px_10px_rgba(0,0,0,0.04),_inset_0_-3px_0_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.06),_inset_0_-3px_0_rgba(0,0,0,0.03)] active:translate-y-0.5 active:shadow-[0_2px_4px_rgba(0,0,0,0.04),_inset_0_-1px_0_rgba(0,0,0,0.03)]'
                                }`}
                        >
                            <Icon className="w-6 h-6 mb-0.5" />
                            <span className="text-[10px] font-black tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

            </div>
        </div>
    );
}