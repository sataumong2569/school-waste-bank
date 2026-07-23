import { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Members() {
    // state สำหรับเก็บข้อมูลคนที่ถูกคลิก (ถ้าเป็น null คือปิดหน้าต่างอยู่)
    const [selectedMember, setSelectedMember] = useState(null);

    // 1. State สำหรับระบบค้นหาและแบ่งหน้า
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // จำลองข้อมูลสมาชิก (ผมปรับเป็น 45 คนเพื่อให้คุณเทสระบบปุ่มกดเปลี่ยนหน้าได้)
    const membersList = Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        name: `สมาชิกคนที่ ${i + 1}`,
        grade: `ป.${Math.floor(Math.random() * 3) + 4}/${Math.floor(Math.random() * 3) + 1}`,
        balance: Math.floor(Math.random() * 5000) + 500,
        carbonPoints: (Math.random() * 50).toFixed(2),
        image: `https://api.dicebear.com/7.x/notionists/svg?seed=User${i + 1}`,
        color: ['bg-[#ff6b9d]', 'bg-[#ffd93d]', 'bg-[#4ecdc4]', 'bg-[#a855f7]', 'bg-[#ff6b35]'][i % 5]
    }));

    // 2. Logic การค้นหา: กรองจากข้อมูลทั้งหมด
    const filteredMembers = membersList.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Logic การแบ่งหน้า: คำนวณหน้า และหั่นข้อมูลมาแสดงเฉพาะหน้าที่เลือก
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const displayedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 5. คำนวณวันที่สำหรับ Progress Bar 2 รอบ (วันที่ 15 และ 25)
    const today = new Date();
    const currentDay = today.getDate();

    // เป้าหมายรอบที่ 1: วันที่ 15
    let progress15 = 0;
    let status15 = "";
    if (currentDay >= 15) {
        progress15 = 100;
        status15 = currentDay === 15 ? "วันนี้" : "รับฝากแล้ว";
    } else {
        // คำนวณเปอร์เซ็นต์แบบ 1-15 วัน
        progress15 = (currentDay / 15) * 100;
        status15 = `อีก ${15 - currentDay} วัน`;
    }

    // เป้าหมายรอบที่ 2: วันที่ 25
    let progress25 = 0;
    let status25 = "";
    if (currentDay >= 25) {
        progress25 = 100;
        status25 = currentDay === 25 ? "วันนี้" : "รับฝากแล้ว";
    } else {
        // คำนวณเปอร์เซ็นต์แบบ 1-25 วัน
        progress25 = (currentDay / 25) * 100;
        status25 = `อีก ${25 - currentDay} วัน`;
    }

    // ข้อมูลจำลอง Top 3
    const top3Members = [
        { id: 1, name: 'ด.ญ. รักษ์โลก เสมอมา', consistency: 24, carbon: '45.10', medal: '🥇', color: 'bg-[#ffd93d]' },
        { id: 2, name: 'ด.ช. เรียนดี ขยันยิ่ง', consistency: 22, carbon: '38.50', medal: '🥈', color: 'bg-[#e5e7eb]' },
        { id: 3, name: 'นาย ประหยัด อดออม', consistency: 19, carbon: '30.20', medal: '🥉', color: 'bg-[#fcd34d]' },
    ];

    // 4. Reset กลับไปหน้า 1 เสมอเวลาพิมพ์ค้นหาใหม่
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="w-full relative overflow-x-hidden min-h-screen pb-10 flex">

            {/* ========================================= */}
            {/* ส่วนซ้าย: รายชื่อสมาชิก */}
            {/* ========================================= */}
            <div className={`transition-all duration-300 ease-out px-4 md:pl-8 md:pr-4 pt-8 w-full ${selectedMember ? 'md:w-[60%]' : 'md:w-[75%]'}`}>

                {/* ส่วนหัวและช่องค้นหา */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="font-black text-4xl text-[#2d2d2d] tracking-wide relative inline-block pb-2">
                        รายชื่อสมาชิกทั้งหมด
                        {/* ปรับตำแหน่งเส้นใต้ให้สมดุลกับความสูงของตัวอักษรไทย */}
                        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#2d2d2d] rounded-full"></div>
                        <div className="absolute -bottom-2 left-4 w-3/4 h-[4px] bg-[#ff6b9d] rounded-full"></div>
                    </h1>

                    <div className="relative w-full md:w-72 mt-2 md:mt-0">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 font-bold" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ หรือ ชั้นเรียน..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-[3px] border-[#2d2d2d] rounded-xl font-bold outline-none focus:bg-[#f0fffe] focus:-translate-y-1 shadow-[4px_4px_0px_#2d2d2d] focus:shadow-[6px_6px_0px_#2d2d2d] transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white border-[3px] border-[#2d2d2d] rounded-2xl shadow-[6px_6px_0px_#2d2d2d] p-4 md:p-6">
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr_1fr] gap-4 px-3 pb-4 border-b-[3px] border-[#2d2d2d] mb-4 font-['Fredoka_One'] text-[#2d2d2d] text-lg">
                        <div className="text-left">ชื่อ - นามสกุล</div>
                        <div className="text-center">ยอดเงิน (บาท)</div>
                        <div className="text-center">ลดคาร์บอน (kgCO2e)</div>
                        <div className="text-center">สถานะ</div>
                    </div>

                    <div className="flex flex-col gap-4 min-h-[300px]">
                        {displayedMembers.length > 0 ? (
                            displayedMembers.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => setSelectedMember(member)}
                                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.5fr_1fr] gap-3 md:gap-4 items-center p-3 md:p-2.5 border-[2px] border-[#2d2d2d] rounded-xl cursor-pointer hover:bg-[#f0fffe] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2d2d2d] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full border-[2px] border-[#2d2d2d] ${member.color || 'bg-[#ffd93d]'} flex-shrink-0 overflow-hidden`}>

                                            <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#2d2d2d] font-['Nunito'] text-base line-clamp-1">{member.name}</p>
                                            <p className="text-xs text-[#555] font-semibold">ชั้น {member.grade}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between md:justify-center items-center">
                                        <span className="md:hidden text-xs font-bold text-[#555]">ยอดเงิน:</span>
                                        <p className="font-['Fredoka_One'] text-[#ff6b9d] text-base md:text-lg">{member.balance || 0}</p>
                                    </div>
                                    <div className="flex justify-between md:justify-center items-center">
                                        <span className="md:hidden text-xs font-bold text-[#555]">ลดคาร์บอน:</span>

                                        <p className="font-['Fredoka_One'] text-[#0d9488] text-base md:text-lg">{member.carbonPoints}</p>
                                    </div>
                                    <div className="flex justify-between md:justify-center items-center">
                                        <span className="md:hidden text-xs font-bold text-[#555]">สถานะ:</span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold border-2 border-[#2d2d2d] bg-[#95e1d3] text-[#2d2d2d]">กำลังศึกษา</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-[#555]">
                                <MagnifyingGlassIcon className="w-10 h-10 mb-2 opacity-50" />
                                <p className="font-bold font-['Nunito']">ไม่พบข้อมูลที่ค้นหา</p>
                            </div>
                        )}
                    </div>

                    {/* ระบบปุ่มกดแบ่งหน้า (Pagination) */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-between items-center border-t-[3px] border-[#2d2d2d] pt-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border-[3px] border-[#2d2d2d] rounded-xl font-bold font-['Nunito'] shadow-[4px_4px_0px_#2d2d2d] disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <ChevronLeftIcon className="w-4 h-4 font-bold" /> ก่อนหน้า
                            </button>

                            <span className="font-bold font-['Nunito'] text-[#555]">
                                หน้า {currentPage} จาก {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border-[3px] border-[#2d2d2d] rounded-xl font-bold font-['Nunito'] shadow-[4px_4px_0px_#2d2d2d] disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                ถัดไป <ChevronRightIcon className="w-4 h-4 font-bold" />
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <div className={`hidden md:flex flex-col gap-6 pt-8 pr-8 transition-all duration-300 ease-out overflow-hidden ${selectedMember ? 'w-0 opacity-0' : 'w-[25%] opacity-100'}`}>

                <div className="bg-[#ffd93d] border-[3px] border-[#2d2d2d] rounded-2xl p-5 shadow-[6px_6px_0px_#2d2d2d]">
                    <div className="text-center mb-5">
                        <h3 className="inline-block text-sm font-black bg-white px-3 py-1.5 rounded-full border-[2px] border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] text-[#ff6b9d] tracking-wide">
                            ระยะเวลากิจกรรมการรับฝาก
                        </h3>
                    </div>

                    {/* รอบที่ 1: วันที่ 15 */}
                    <div className="mb-5">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-[#2d2d2d]">รอบวันที่ 15</span>
                            <span className={`px-2 py-0.5 rounded-md border-[2px] border-[#2d2d2d] text-xs font-black tracking-wide ${progress15 === 100 ? 'bg-[#95e1d3] text-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]' : 'bg-white text-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]'}`}>
                                {status15}
                            </span>
                        </div>
                        <div className="w-full h-4 bg-white border-[3px] border-[#2d2d2d] rounded-full overflow-hidden shadow-[2px_2px_0px_#2d2d2d]">
                            <div
                                className="h-full bg-[#ff6b9d] transition-all duration-500 ease-out"
                                style={{ width: `${progress15}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* รอบที่ 2: วันที่ 25 */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-[#2d2d2d]">รอบวันที่ 25</span>
                            <span className={`px-2 py-0.5 rounded-md border-[2px] border-[#2d2d2d] text-xs font-black tracking-wide ${progress25 === 100 ? 'bg-[#95e1d3] text-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]' : 'bg-white text-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d]'}`}>
                                {status25}
                            </span>
                        </div>
                        <div className="w-full h-4 bg-white border-[3px] border-[#2d2d2d] rounded-full overflow-hidden shadow-[2px_2px_0px_#2d2d2d]">
                            <div
                                className="h-full bg-[#4ecdc4] transition-all duration-500 ease-out"
                                style={{ width: `${progress25}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                {/* Widget 2: Top 3 สม่ำเสมอ */}
                <div className="bg-white border-[3px] border-[#2d2d2d] rounded-2xl p-5 shadow-[6px_6px_0px_#2d2d2d]">
                    <div className="text-center mb-5">
                        <h3 className="inline-block text-sm font-black bg-[#f0fffe] px-3 py-1.5 rounded-full border-[2px] border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] text-[#0d9488]">
                            🏆 Top 3 นำฝากยอดเยี่ยม
                        </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        {top3Members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3">
                                {/* เหรียญรางวัล */}
                                <div className={`w-12 h-12 rounded-full border-[3px] border-[#2d2d2d] flex items-center justify-center text-2xl shadow-[3px_3px_0px_#2d2d2d] flex-shrink-0 ${member.color}`}>
                                    {member.medal}
                                </div>
                                {/* ข้อมูล */}
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-black text-sm text-[#2d2d2d] truncate">{member.name}</p>
                                    <p className="text-[11px] font-bold text-[#0d9488] mt-0.5">
                                        ฝาก {member.consistency} ครั้ง | ลด {member.carbon} kgCO₂e
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Widget 3: แลกรางวัลรักษ์โลก (Carbon Rewards) */}
                <div className="bg-[#f3e8ff] border-[3px] border-[#2d2d2d] rounded-2xl p-5 shadow-[6px_6px_0px_#2d2d2d]">
                    <div className="text-center mb-5">
                        <h3 className="inline-block text-sm font-black bg-white px-3 py-1.5 rounded-full border-[2px] border-[#2d2d2d] shadow-[2px_2px_0px_#2d2d2d] text-[#a855f7]">
                            🎁 แลกรางวัล
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Item 1 */}
                        <div className="flex items-center justify-between p-3 bg-white border-[2px] border-[#2d2d2d] rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_#2d2d2d] transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#ffd93d] rounded-lg border-[2px] border-[#2d2d2d] flex items-center justify-center text-xl shadow-[2px_2px_0px_#2d2d2d]">
                                    📓
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#2d2d2d] leading-none mb-1">สมุดรีไซเคิล</p>
                                    <p className="text-[10px] font-black text-[#ff6b9d]">เหลือ 15 ชิ้น</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-black text-lg text-[#0d9488] leading-none">20</span>
                                <span className="text-[10px] font-bold text-[#555]">kgCO₂e</span>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-center justify-between p-3 bg-white border-[2px] border-[#2d2d2d] rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_#2d2d2d] transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#4ecdc4] rounded-lg border-[2px] border-[#2d2d2d] flex items-center justify-center text-xl shadow-[2px_2px_0px_#2d2d2d]">
                                    🥤
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-[#2d2d2d] leading-none mb-1">แก้วน้ำพกพา</p>
                                    <p className="text-[10px] font-black text-[#ff6b9d]">เหลือ 3 ชิ้น</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-black text-lg text-[#0d9488] leading-none">50</span>
                                <span className="text-[10px] font-bold text-[#555]">kgCO₂e</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-5 py-2.5 bg-[#95e1d3] border-[3px] border-[#2d2d2d] rounded-xl font-black text-[#2d2d2d] text-sm shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2d2d2d] active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all">
                        ดูของรางวัลทั้งหมด ✨
                    </button>
                </div>
            </div>

            {/* ========================================= */}
            {/* ส่วนขวาที่ 2 (Drawer): หน้าต่างสไลด์ */}
            {/* ========================================= */}
            {selectedMember && (
                <div className="fixed inset-0 bg-[#2d2d2d]/40 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setSelectedMember(null)}></div>
            )}

            <div className={`fixed top-0 right-0 h-full w-full md:w-[40%] bg-[#fef9f0] border-l-[4px] border-[#2d2d2d] shadow-[-12px_0px_0px_rgba(45,45,45,1)] z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${selectedMember ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedMember && (
                    <div className="p-8 flex flex-col items-center relative min-h-full">
                        <button onClick={() => setSelectedMember(null)} className="absolute top-6 right-6 p-2 bg-white border-[2px] border-[#2d2d2d] rounded-lg shadow-[2px_2px_0px_#2d2d2d] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2d2d2d] active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all z-10">
                            <XMarkIcon className="w-6 h-6 font-bold text-[#2d2d2d]" />
                        </button>

                        <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-[4px] border-[#2d2d2d] ${selectedMember.color || 'bg-[#ff6b9d]'} shadow-[6px_6px_0px_#2d2d2d] overflow-hidden mb-4 mt-8`}>
                            <img src={selectedMember.image} alt="Profile" className="w-full h-full object-cover" />
                        </div>

                        <h2 className="font-['Fredoka_One'] text-2xl md:text-3xl text-[#2d2d2d] mb-1 text-center">{selectedMember.name}</h2>
                        <p className="font-['Nunito'] font-bold text-[#666] mb-6 text-base md:text-lg">ชั้น {selectedMember.grade}</p>

                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white border-[3px] border-[#2d2d2d] rounded-2xl p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 transition-transform">
                                <span className="font-['Nunito'] font-bold text-[#555] mb-1 text-xs md:text-sm">ยอดเงินคงเหลือ</span>
                                <span className="font-['Fredoka_One'] text-2xl md:text-4xl text-[#ff6b9d]">{selectedMember.balance}</span>
                                <span className="font-['Nunito'] font-bold text-sm text-[#2d2d2d] mt-1">บาท</span>
                            </div>

                            <div className="bg-white border-[3px] border-[#2d2d2d] rounded-2xl p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 transition-transform">
                                <span className="font-['Nunito'] font-bold text-[#555] mb-1 text-xs md:text-sm">ลดคาร์บอน</span>
                                {/* แก้ตัวแปรเป็น carbonPoints */}
                                <span className="font-['Fredoka_One'] text-2xl md:text-4xl text-[#0d9488]">{selectedMember.carbonPoints}</span>
                                <span className="font-['Nunito'] font-bold text-sm text-[#2d2d2d] mt-1">kgCO₂e</span>
                            </div>
                        </div>

                        {/* เปลี่ยนปุ่มเป็นแบบที่ยังไม่ได้ Login */}
                        <button className="w-full bg-[#ffd93d] border-[3px] border-[#2d2d2d] rounded-xl py-3 font-['Fredoka_One'] text-[#2d2d2d] text-lg shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2d2d2d] active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all mb-4">
                            📷 บันทึก E-Card ประจำตัว
                        </button>
                        <button className="w-full bg-white border-[3px] border-[#2d2d2d] rounded-xl py-3 font-['Fredoka_One'] text-[#2d2d2d] text-lg shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2d2d2d] active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all">
                            📌 แชร์ความสำเร็จ
                        </button>

                    </div>
                )}
            </div>

        </div>
    )
}