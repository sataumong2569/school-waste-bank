import { MagnifyingGlassIcon, InboxIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import DropdownMenu from './DropdownMenu'
import umonglogo from '../assets/umong1municipal_icon_notra.png'
import { useState } from 'react'

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const location = useLocation() // ตัวนี้จะคอยเช็คว่าเราอยู่หน้าไหน เพื่อทำไฮไลต์ปุ่ม

    // รายการเมนูบน Navbar 
    const navItems = [
        { label: 'Home', url: '/', hoverColor: 'hover:bg-[#fffde7]', activeColor: 'bg-[#ffd93d]' },
        { label: 'ข้อมูลสมาชิก', url: '/members', hoverColor: 'hover:bg-[#fff0f5]', activeColor: 'bg-[#ff6b9d] text-white' },
        // { label: 'รายการรับซื้อ', url: '/orders', hoverColor: 'hover:bg-[#f0fffe]', activeColor: 'bg-[#4ecdc4]' },
        // { label: 'ตั้งค่า', url: '/settings', hoverColor: 'hover:bg-[#fff5f0]', activeColor: 'bg-[#ff6b35] text-white' },//
    ]

    return (
        <nav className="bg-[#fef9f0] border-b-[3px] border-[#2d2d2d] sticky top-0 z-40 flex items-center justify-between px-6 py-3">

            {/* 1. ส่วนซ้าย: โลโก้  */}
            <div className="flex items-center gap-3 w-1/3">
                <div className="w-9 h-9 bg-[#ffd93d] border-[2px] border-[#2d2d2d] rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#2d2d2d] overflow-hidden p-1">
                    <img src={umonglogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-['Fredoka_One'] text-xl text-[#2d2d2d] hidden sm:block">Umong Municipal School</span>
            </div>

            {/* 2. ส่วนกลาง: เมนูนำทาง  */}
            <div className="hidden md:flex justify-center gap-1.5 w-1/3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                        <Link
                            key={item.label}
                            to={item.url}

                            className={`px-3 py-1.5 border-[2px] rounded-lg font-['Nunito'] font-bold text-sm transition-all
                ${isActive ? `${item.activeColor} border-[#2d2d2d] shadow-[3px_3px_0px_#2d2d2d]` : 'border-transparent text-[#555] hover:border-[#2d2d2d] hover:text-[#2d2d2d] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#2d2d2d] ' + item.hoverColor}
              `}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* 3. ส่วนขวา: ไอคอน + โปรไฟล์  */}
            <div className="flex items-center justify-end gap-3 w-1/3 relative">

                <button className="p-1.5 border-[2px] border-[#2d2d2d] rounded-lg bg-[#fff0f5] text-[#2d2d2d] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#2d2d2d] transition-all">
                    <InboxIcon className="w-4 h-4 font-bold" />
                </button>

                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-[#ffd93d] border-[2px] border-[#2d2d2d] rounded-full shadow-[3px_3px_0px_#2d2d2d] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2d2d2d] transition-all"
                >
                    <div className="w-7 h-7 rounded-full border-[2px] border-[#2d2d2d] bg-white flex items-center justify-center overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Nong" alt="User" />
                    </div>
                    <span className="font-bold text-xs text-[#2d2d2d] font-['Nunito'] hidden md:block">Profile</span>
                    <ChevronDownIcon className="w-3 h-3 text-[#2d2d2d]" />
                </button>

                {isDropdownOpen && <DropdownMenu />}
            </div>
        </nav>
    )
}