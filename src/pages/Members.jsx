import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Members() {
    // state สำหรับเก็บข้อมูลคนที่ถูกคลิก (ถ้าเป็น null คือปิดหน้าต่างอยู่)
    const [selectedMember, setSelectedMember] = useState(null);

    // จำลองข้อมูลสมาชิก 20 คน 
    const membersList = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `สมาชิกคนที่ ${i + 1}`,
        grade: `ป.${Math.floor(Math.random() * 3) + 4}/${Math.floor(Math.random() * 3) + 1}`,
        balance: Math.floor(Math.random() * 5000) + 500,
        carbonPoints: (Math.random() * 50).toFixed(2),
        image: `https://api.dicebear.com/7.x/notionists/svg?seed=User${i + 1}`,
        color: ['bg-[#ff6b9d]', 'bg-[#ffd93d]', 'bg-[#4ecdc4]', 'bg-[#a855f7]', 'bg-[#ff6b35]'][i % 5]
    }));

    return (
        // 1. เปลี่ยนเป็นหน้าเต็ม (w-full) และซ่อน Scrollbar แนวนอน (overflow-x-hidden) เพื่อไม่ให้จอกระตุกตอนสไลด์
        <div className="w-full relative overflow-x-hidden min-h-screen pb-10">

            {/* ========================================= */}
            {/* ส่วนซ้าย: รายชื่อสมาชิก (จะถูกเบียดเมื่อกด) */}
            {/* ========================================= */}
            {/* ทริค: ใช้ md:mr-[40%] เพื่อดันขอบขวาเข้ามา 40% ตอนที่หน้าต่างสไลด์เปิด (ทำเฉพาะจอคอม) */}
            <div className={`transition-all duration-300 ease-out px-4 md:px-8 pt-8 ${selectedMember ? 'md:mr-[40%]' : ''}`}>

                {/* หัวข้อหน้า */}
                <h1 className="font-['Fredoka_One'] text-4xl text-[#2d2d2d] mb-8 relative inline-block">
                    รายชื่อสมาชิกทั้งหมด
                    <div className="absolute -bottom-2 left-0 w-full h-[4px] bg-[#2d2d2d] rounded-full"></div>
                </h1>

                {/* 2. ลิสต์รายชื่อ (เปลี่ยนเป็น flex-col แถวเดียวเรียงลงมา) */}
                <div className="bg-white border-[3px] border-[#2d2d2d] rounded-2xl shadow-[6px_6px_0px_#2d2d2d] p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                        {membersList.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className="flex items-center gap-3 p-2.5 md:p-3 border-[2px] border-[#2d2d2d] rounded-xl cursor-pointer hover:bg-[#f0fffe] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2d2d2d] transition-all"                            >
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-[2px] border-[#2d2d2d] ${member.color} flex-shrink-0 overflow-hidden`}>
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        {/* ลดขนาดฟอนต์ชื่อจาก text-lg เป็น text-base */}
                                        <p className="font-bold text-[#2d2d2d] font-['Nunito'] text-base md:text-lg">{member.name}</p>
                                        {/* ลดขนาดฟอนต์ชั้นเรียนลง */}
                                        <p className="text-xs md:text-sm text-[#555] font-semibold">ชั้น {member.grade}</p>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <p className="font-['Fredoka_One'] text-[#ff6b9d] text-base">{member.balance} <span className="text-xs text-[#555] font-['Nunito']">บาท</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* ส่วนหน้าต่างสไลด์ฝั่งขวา (Right Drawer) */}
            {/* ========================================= */}

            {/* 3. ฉากหลังสีดำจางๆ (Backdrop) โชว์เฉพาะบนมือถือ (md:hidden) เพราะจอคอมเราใช้วิธีเบียดเอาแล้ว */}
            {selectedMember && (
                <div
                    className="fixed inset-0 bg-[#2d2d2d]/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setSelectedMember(null)}
                ></div>
            )}

            {/* ตัวหน้าต่างสไลด์ (กว้าง 40% ของจอคอม, หรือ 100% บนจอมือถือ) */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[40%] bg-[#fef9f0] border-l-[4px] border-[#2d2d2d] shadow-[-12px_0px_0px_rgba(45,45,45,1)] z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${selectedMember ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {selectedMember && (
                    <div className="p-8 flex flex-col items-center relative min-h-full">

                        {/* ปุ่มกากบาทปิดหน้าต่าง */}
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-6 right-6 p-2 bg-white border-[2px] border-[#2d2d2d] rounded-lg shadow-[2px_2px_0px_#2d2d2d] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2d2d2d] active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all z-10"
                        >
                            <XMarkIcon className="w-6 h-6 font-bold text-[#2d2d2d]" />
                        </button>

                        {/* ข้อมูลสมาชิก */}
                        <div className={`w-32 h-32 rounded-full border-[4px] border-[#2d2d2d] ${selectedMember.color} shadow-[6px_6px_0px_#2d2d2d] overflow-hidden mb-6 mt-12`}>
                            <img src={selectedMember.image} alt="Profile" className="w-full h-full object-cover" />
                        </div>

                        <h2 className="font-['Fredoka_One'] text-3xl text-[#2d2d2d] mb-1">{selectedMember.name}</h2>
                        <p className="font-['Nunito'] font-bold text-[#666] mb-6 text-lg">ชั้น {selectedMember.grade}</p>

                        <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full opacity-20 my-2"></div>

                        <div className="w-full py-6 flex flex-col items-center">
                            <span className="font-['Nunito'] font-bold text-[#555] mb-2 text-lg">ยอดเงินคงเหลือ</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-['Fredoka_One'] text-5xl text-[#4ecdc4] drop-shadow-[2px_2px_0px_#2d2d2d]">{selectedMember.balance}</span>
                                <span className="font-['Nunito'] font-bold text-xl text-[#2d2d2d]">บาท</span>
                            </div>
                        </div>

                        <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full opacity-20 my-2"></div>

                        <div className="w-full py-6 flex flex-col items-center">
                            <span className="font-['Nunito'] font-bold text-[#555] mb-2 text-lg">ลดการปล่อยคาร์บอน</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-['Fredoka_One'] text-5xl text-[#a855f7] drop-shadow-[2px_2px_0px_#2d2d2d]">{selectedMember.carbonPoints}</span>
                                <span className="font-['Nunito'] font-bold text-xl text-[#2d2d2d]">kgCO₂e</span>
                            </div>
                        </div>

                        <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full opacity-20 my-2"></div>

                    </div>
                )}
            </div>
        </div>
    )
}