import { useState, useEffect, useRef } from 'react';
import {
    XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon,
    UsersIcon, GiftIcon, ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

import { useApp } from '../AppContext';

export default function Members() {

    const { members, duration, rewards } = useApp();

    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const membersSectionRef = useRef(null);

    const filteredMembers = members.filter((member) =>
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const displayedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const today = new Date();
    const currentDay = today.getDate();
    const round1 = Number(duration.round1) || 15;
    const round2 = Number(duration.round2) || 25;

    let progress15 = currentDay >= round1 ? 100 : (currentDay / round1) * 100;
    let status15 = currentDay >= round1 ? (currentDay === round1 ? "วันนี้" : "รับฝากแล้ว") : `อีก ${round1 - currentDay} วัน`;

    let progress25 = currentDay >= round2 ? 100 : (currentDay / round2) * 100;
    let status25 = currentDay >= round2 ? (currentDay === round2 ? "วันนี้" : "รับฝากแล้ว") : `อีก ${round2 - currentDay} วัน`;

    // 🟢 5. คำนวณ Top 3 อัตโนมัติ (เรียงลำดับจากคนที่มีคาร์บอนสูงสุด)
    const top3Members = [...members]
        .sort((a, b) => parseFloat(b.carbonPoints || 0) - parseFloat(a.carbonPoints || 0))
        .slice(0, 3)
        .map((member, index) => ({
            id: member.id,
            name: member.fullName,
            consistency: member.history ? member.history.length : Math.floor(Math.random() * 10) + 1,
            carbon: parseFloat(member.carbonPoints || 0).toFixed(2),
            badge: index === 0 ? '1st' : index === 1 ? '2nd' : '3rd',
            color: index === 0 ? 'bg-[#f59e0b]' : index === 1 ? 'bg-[#94a3b8]' : 'bg-[#fcd34d]'
        }));

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    useEffect(() => {
        if (selectedMember) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedMember]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (membersSectionRef.current) {
            membersSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-full overflow-hidden min-h-screen flex flex-col">

            {/* SECTION 1: HEADER & SEARCH */}
            <div className="w-full bg-[#f0eeff] pt-8 md:pt-16 pb-14 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center text-center fade-up z-10 relative">
                    <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_rgba(124,58,237,0.1)] backdrop-blur-sm mb-4">
                        <UsersIcon className="w-4 h-4 text-[#7c3aed]" />
                        <span className="font-['Nunito'] font-bold text-[#1e1b4b] text-sm">ระบบสมาชิก</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-['Prompt'] text-[#1e1b4b] tracking-wide mb-8">
                        ค้นหาเพื่อน <span className="text-[#7c3aed]">รักษ์โลก</span>
                    </h1>

                    <div className="relative w-full max-w-2xl">
                        <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6d6a8a] font-bold z-10" />
                        <input
                            type="text"
                            placeholder="พิมพ์ชื่อ หรือ ชั้นเรียน (เช่น ป.4/1)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-3.5 md:py-4 rounded-[24px] font-bold outline-none text-[#1e1b4b] text-base md:text-lg clay-input bg-white"
                        />
                    </div>
                </div>

                {/* 🌍 องค์ประกอบโลก 3D แบบคอมโพสิต (ขนาดใหญ่ขึ้น) */}
                <div className="absolute top-4 left-[4%] md:left-[8%] w-36 h-36 md:w-44 md:h-44 hidden md:flex items-center justify-center animate-float-3d z-20 pointer-events-none" style={{ animationDelay: '0s' }}>

                    {/* วงแหวนวงโคจร (Orbit Ring ขยายตาม) */}
                    <div className="absolute w-52 h-20 border-2 border-dashed border-[#38bdf8]/40 rounded-full rotate-[-25deg]"></div>

                    {/* ลูกโลกหลัก 3D (ขยายขนาดวงกลม) */}
                    <div className="relative w-28 h-28 md:w-36 md:h-36 bg-gradient-to-tr from-[#0284c7] via-[#38bdf8] to-[#34d399] rounded-full shadow-[inset_-12px_-12px_30px_rgba(0,0,0,0.35),_0_20px_35px_rgba(56,189,248,0.4)] flex items-center justify-center overflow-hidden">

                        {/* แสงสะท้อนบนผิวน้ำ (Highlight) */}
                        <div className="absolute top-3 left-4 w-8 h-4 bg-white/40 rounded-full blur-[1px] rotate-[-30deg]"></div>

                        {/* พื้นทวีปจำลองเบลอๆ ด้านใน */}
                        <div className="absolute bottom-3 right-3 w-12 h-8 bg-[#10b981]/60 rounded-full blur-[3px]"></div>
                        <div className="absolute top-6 left-5 w-10 h-7 bg-[#10b981]/50 rounded-full blur-[3px]"></div>

                        {/* เส้นกริดแผนที่โลก (SVG ละติจูด ลองจิจูด) */}
                        <svg className="absolute inset-0 w-full h-full text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeDasharray="2 2" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                    </div>

                    {/* องค์ประกอบ 3D เล็กๆ ที่ล้อมรอบ (ขยายขนาดเล็กน้อยให้รับกัน) */}
                    <div className="absolute top-1 right-3 w-6 h-6 bg-[#f59e0b] rounded-full shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),_0_5px_10px_rgba(245,158,11,0.4)] animate-bounce"></div>
                    <div className="absolute bottom-2 -left-1 w-5 h-10 bg-[#34d399] rounded-full rotate-45 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),_0_5px_10px_rgba(52,211,153,0.4)]"></div>
                </div>

                {/* กล่องส้ม (ล่างขวา) */}
                <div className="absolute bottom-10 right-[12%] w-16 h-16 md:w-20 md:h-20 bg-[#f59e0b] rounded-[32px] animate-float-3d-reverse rotate-12 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.2),_0_10px_20px_rgba(245,158,11,0.4)] hidden md:block" style={{ animationDelay: '1s' }}></div>

                {/* ทรงแคปซูลเขียว (บนขวา) */}
                <div className="absolute top-16 right-[25%] w-8 h-16 md:w-12 md:h-24 bg-[#34d399] rounded-full animate-float-3d rotate-45 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.2),_0_10px_20px_rgba(52,211,153,0.4)] hidden md:block" style={{ animationDelay: '2s' }}></div>

                {/* ห่วงโดนัทสีชมพู (ขอบซ้ายสุด) */}
                <div className="absolute top-1/3 -left-6 w-16 h-16 rounded-full border-[12px] border-[#ec4899] animate-float-3d shadow-[0_10px_20px_rgba(236,72,153,0.3)] opacity-60 hidden lg:block" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <svg viewBox="0 0 1440 100" className="w-full h-[30px] md:h-[60px] block bg-[#f0eeff] text-[#ecfdf5] -mt-1 relative z-20" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,74.7C1248,64,1344,32,1392,16L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
            </svg>

            {/* SECTION 2: WIDGETS DASHBOARD */}
            <div className="w-full bg-[#ecfdf5] pt-4 pb-8">
                <div className="max-w-7xl mx-auto flex flex-row md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 md:px-8 fade-up pb-4 md:pb-0" style={{ animationDelay: '0.2s' }}>
                    {/* กล่องระยะเวลา */}
                    <div className="min-w-[85vw] md:min-w-0 snap-center clay-card-amber p-5 md:p-6 cursor-default">
                        <div className="text-center mb-5">
                            <h3 className="inline-block text-[13px] font-black bg-white/20 px-4 py-1.5 rounded-full text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                                ระยะเวลากิจกรรมการรับฝาก
                            </h3>
                        </div>
                        <div className="mb-5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-sm text-white">รอบวันที่ {round1}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${progress15 === 100 ? 'bg-[#10b981] text-white' : 'bg-white/90 text-[#d97706]'}`}>{status15}</span>
                            </div>
                            <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                                <div className="h-full bg-[#10b981] clay-bar shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500" style={{ width: `${progress15}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-sm text-white">รอบวันที่ {round2}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${progress25 === 100 ? 'bg-[#10b981] text-white' : 'bg-white/90 text-[#d97706]'}`}>{status25}</span>
                            </div>
                            <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                                <div className="h-full bg-[#10b981] clay-bar shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500" style={{ width: `${progress25}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* กล่อง Top 3 */}
                    <div className="min-w-[85vw] md:min-w-0 snap-center clay-card p-5 md:p-6 cursor-default">
                        <div className="text-center mb-6">
                            <h3 className="inline-block text-[13px] font-black bg-[#f0eeff] px-4 py-1.5 rounded-full text-[#7c3aed]">
                                Top 3 นำฝากยอดเยี่ยม
                            </h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {top3Members.map((member) => (
                                <div key={member.id} className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 shadow-[inset_-3px_-5px_8px_rgba(0,0,0,0.15)] text-white ${member.color}`}>
                                        {member.badge}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-black text-[14px] text-[#1e1b4b] truncate">{member.name}</p>
                                        <p className="text-[11px] font-bold text-[#6d6a8a] mt-1">ฝาก {member.consistency} ครั้ง | ลด {member.carbon} kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* กล่องของรางวัล */}
                    <div className="min-w-[85vw] md:min-w-0 snap-center clay-card-purple p-5 md:p-6 cursor-default">
                        <div className="text-center mb-6">
                            <h3 className="inline-block text-[13px] font-black bg-white/20 px-4 py-1.5 rounded-full text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                                แลกรางวัล (Item Shop)
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto hide-scrollbar">
                            {rewards.length > 0 ? rewards.map((item) => (
                                <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#7c3aed] shadow-sm">
                                            <GiftIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white leading-none mb-1.5">{item.name}</p>
                                            <p className="text-[10px] font-black text-white/70">เหลือ {item.stock} ชิ้น</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-black text-xl text-white leading-none mb-0.5">{item.points}</span>
                                        <span className="text-[10px] font-bold text-white/70">pts</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-white/70 text-xs font-bold py-6">ยังไม่มีของรางวัลเปิดให้แลก</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <svg viewBox="0 0 1440 100" className="w-full h-[30px] md:h-[60px] block bg-[#ecfdf5] text-[#fff7ed] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
            </svg>

            {/* SECTION 3: MEMBERS LIST / GRID */}
            <div ref={membersSectionRef} className="w-full bg-[#fff7ed] pt-6 pb-16 flex-1 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8 fade-up" style={{ animationDelay: '0.4s' }}>

                    <div className="clay-card p-4 md:p-8 flex flex-col h-full overflow-hidden bg-white">

                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="w-2 h-7 bg-[#f59e0b] rounded-full"></div>
                            <h2 className="font-['Prompt'] text-2xl text-[#1e1b4b]">ข้อมูลสมาชิก</h2>
                        </div>

                        {displayedMembers.length > 0 ? (
                            <>
                                {/* ========================================== */}
                                {/* 📱 รูปแบบที่ 1: LIST VIEW สำหรับมือถือ (ซ่อนบนจอคอม) */}
                                {/* ========================================== */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {displayedMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => setSelectedMember(member)}
                                            className="bg-[#fafafa] rounded-[20px] p-3.5 flex items-center gap-3.5 border border-[#f0f0f0] shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                                        >
                                            {/* รูปโปรไฟล์ */}
                                            <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-inner overflow-hidden border-2 border-white ${member.color || 'bg-[#7c3aed]'}`}>
                                                {member.image ? (
                                                    <img src={member.image} alt={member.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    member.fullName?.split(' ')[1]?.[0] || 'U'
                                                )}
                                            </div>

                                            {/* ข้อมูลด้านขวา */}
                                            <div className="flex flex-col flex-1 overflow-hidden">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <p className="font-['Prompt'] text-[#1e1b4b] text-base truncate">
                                                        น้อง{member.nickname || member.fullName?.split(' ')[0]}
                                                    </p>
                                                    <span className="text-[10px] text-[#7c3aed] font-bold bg-[#f0eeff] px-2 py-0.5 rounded-md shrink-0">
                                                        ชั้น {member.grade}
                                                    </span>
                                                </div>
                                                <p className="font-['Nunito'] text-[11px] font-bold text-[#6d6a8a] truncate mb-2">
                                                    {member.fullName}
                                                </p>

                                                {/* สถิติ 3 ช่อง (แนวนอน) */}
                                                <div className="flex items-center justify-between text-[10px] font-['Nunito'] font-bold text-[#1e1b4b]">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></div>
                                                        <span>{member.balance || 0} ฿</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></div>
                                                        <span>{member.carbonPoints || 0} kg</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
                                                        <span>{member.rewardPoints || 0} pts</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ========================================== */}
                                {/* 💻 รูปแบบที่ 2: GRID VIEW สำหรับคอมพิวเตอร์ (ซ่อนบนมือถือ) */}
                                {/* ========================================== */}
                                <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                                    {displayedMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => setSelectedMember(member)}
                                            className="relative rounded-[24px] overflow-hidden flex flex-col justify-end h-[310px] md:h-[350px] shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 transition-all cursor-pointer group"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-[#cbd5e1] flex items-center justify-center z-0">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.fullName}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center font-black text-6xl text-white ${member.color || 'bg-[#3b82f6]'}`}>
                                                        {member.fullName?.split(' ')[1]?.[0] || 'U'}
                                                    </div>
                                                )}

                                                {/* รูปภาพสำรองตอน Hover */}
                                                {member.hoverImage && (
                                                    <img
                                                        src={member.hoverImage}
                                                        alt="Hover View"
                                                        loading="lazy"
                                                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                                    />
                                                )}
                                            </div>
                                            {/* ปรับกระจก */}

                                            <div
                                                className="absolute bottom-0 left-0 w-full h-[32%] z-10 pointer-events-none bg-gradient-to-t from-black/95 via-black/55 to-transparent backdrop-blur-[5px] rounded-b-[24px]"
                                            ></div>

                                            <div className="absolute top-3 right-3 z-20 flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                                                <span className="text-white text-xs font-bold whitespace-nowrap">น้อง{member.nickname || member.fullName?.split(' ')[0]}</span>
                                            </div>

                                            <div className="relative z-20 p-4 md:p-5 flex flex-col w-full text-white mt-auto">

                                                {/* ชื่อจริง (ขนาดพอดี) */}
                                                <p className="font-['Nunito'] font-bold text-xs md:text-sm text-white/90 drop-shadow-md truncate mb-0.5">
                                                    {member.fullName}
                                                </p>

                                                {/* ➖ เส้นขีดคั่นบางๆ */}
                                                <div className="w-full h-[1px] bg-white/20 my-2.5"></div>

                                                {/* สถิติ 3 ช่อง */}
                                                <div className="flex flex-col gap-2 font-['Nunito'] text-white/90">

                                                    {/* ยอดเงิน */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]"></div>
                                                            <span className="text-white/80 text-[13px] font-semibold">ยอดเงิน</span>
                                                        </div>
                                                        <span className="font-bold text-white text-[13px]">
                                                            {member.balance || 0} <span className="text-xs font-normal text-white/70">฿</span>
                                                        </span>
                                                    </div>

                                                    {/* ลดคาร์บอน */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></div>
                                                            <span className="text-white/80 text-[13px] font-semibold">ลดคาร์บอน</span>
                                                        </div>
                                                        <span className="font-bold text-white text-[13px]">
                                                            {member.carbonPoints || 0} <span className="text-xs font-normal text-white/70">kgCO₂e</span>
                                                        </span>
                                                    </div>

                                                    {/* เครดิต */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></div>
                                                            <span className="text-white/80 text-[13px] font-semibold">เครดิต</span>
                                                        </div>
                                                        <span className="font-bold text-white text-[13px]">
                                                            {member.rewardPoints || 0} <span className="text-xs font-normal text-white/70">pts</span>
                                                        </span>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-[#6d6a8a]">
                                <MagnifyingGlassIcon className="w-16 h-16 mb-4 opacity-30" />
                                <p className="font-bold font-['Nunito'] text-xl">ไม่พบข้อมูลสมาชิกที่ค้นหา</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-between items-center gap-2 md:gap-6 border-t-2 border-[#f0eeff] pt-6 px-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="clay-btn-purple !bg-[#f0eeff] !text-[#7c3aed] !shadow-[0_4px_0px_#ddd6fe] hover:!bg-[#e9e3ff] hover:!shadow-[0_6px_0px_#ddd6fe] active:!shadow-[0_2px_0px_#ddd6fe] px-3 py-2 md:!px-5 md:!py-2.5 text-xs md:!text-sm rounded-[100px] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap flex items-center gap-1"
                                >
                                    <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
                                </button>

                                <span className="font-black font-['Nunito'] text-xs md:text-sm text-[#1e1b4b] bg-[#fafafa] border border-[#f0f0f0] px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-sm whitespace-nowrap">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="clay-btn-purple px-3 py-2 md:!px-5 md:!py-2.5 text-xs md:!text-sm rounded-[100px] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap flex items-center gap-1"
                                >
                                    <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CENTER POP-UP MODAL */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

                    <div className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMember(null)}></div>

                    <div className="clay-card relative w-full max-w-sm md:max-w-4xl bg-white p-6 md:p-8 flex flex-col md:flex-row items-stretch animate-modal-pop shadow-[0_30px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto hide-scrollbar gap-6 md:gap-8">

                        <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-[#f8f9fa] rounded-full hover:bg-[#fee2e2] hover:text-red-500 text-[#6d6a8a] transition-colors z-10">
                            <XMarkIcon className="w-6 h-6 font-bold" />
                        </button>

                        {/* 🖼️ ฝั่งซ้าย: รูปภาพและชื่อจริงใต้ภาพ */}
                        <div className="w-full md:w-5/12 flex flex-col items-center md:items-start">
                            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm bg-[#f1f5f9] mb-4 flex items-center justify-center">
                                {selectedMember.image ? (
                                    <img src={selectedMember.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center font-black text-6xl text-white ${selectedMember.color || 'bg-[#7c3aed]'}`}>
                                        {selectedMember.fullName?.split(' ')[1]?.[0] || 'U'}
                                    </div>
                                )}
                            </div>

                            <h2 className="font-['Prompt'] text-xl md:text-2xl text-[#1e1b4b] tracking-wide mb-1">
                                {selectedMember.fullName}
                            </h2>
                            <p className="font-['Nunito'] font-bold text-xs md:text-sm text-[#6d6a8a]">
                                ชั้น {selectedMember.grade} {selectedMember.nickname ? `• ชื่อเล่น: ${selectedMember.nickname}` : ''}
                            </p>
                        </div>

                        {/* 📏 เส้นขีดกั้นแนวตั้ง */}
                        <div className="hidden md:block w-[2px] bg-[#f0eeff] rounded-full self-stretch"></div>

                        {/* 📊 ฝั่งขวา: ข้อมูลบัญชี สถิติ และประวัติ */}
                        <div className="w-full md:w-7/12 flex flex-col gap-5 justify-between">
                            <div className="flex flex-col gap-2.5">
                                <h3 className="font-['Prompt'] text-base text-[#1e1b4b] mb-1">ข้อมูลบัญชีและสถิติ</h3>

                                <div className="bg-[#fafafa] rounded-xl px-4 py-3 flex items-center justify-between border border-[#f0f0f0]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></div>
                                        <span className="font-['Nunito'] font-bold text-[#6d6a8a] text-xs md:text-sm">ยอดเงินสะสม</span>
                                    </div>
                                    <span className="font-['Prompt'] text-lg md:text-xl text-[#7c3aed]">
                                        {selectedMember.balance || 0} <span className="text-xs font-['Nunito'] font-bold text-gray-500">บาท</span>
                                    </span>
                                </div>

                                <div className="bg-[#fafafa] rounded-xl px-4 py-3 flex items-center justify-between border border-[#f0f0f0]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                                        <span className="font-['Nunito'] font-bold text-[#6d6a8a] text-xs md:text-sm">ลดคาร์บอน</span>
                                    </div>
                                    <span className="font-['Prompt'] text-lg md:text-xl text-[#10b981]">
                                        {selectedMember.carbonPoints || 0} <span className="text-xs font-['Nunito'] font-bold text-gray-500">kgCO₂e</span>
                                    </span>
                                </div>

                                <div className="bg-[#fffbeb] rounded-xl px-4 py-3 flex items-center justify-between border border-[#fde68a]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                                        <span className="font-['Nunito'] font-bold text-[#d97706] text-xs md:text-sm">คาร์บอนเครดิต</span>
                                    </div>
                                    <span className="font-['Prompt'] text-lg md:text-xl text-[#f59e0b]">
                                        {selectedMember.rewardPoints || 0} <span className="text-xs font-['Nunito'] font-bold text-[#d97706]">pts</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowUpTrayIcon className="w-4 h-4 text-[#1e1b4b] stroke-2" />
                                    <h3 className="font-['Prompt'] text-sm md:text-base text-[#1e1b4b]">ประวัติการฝากล่าสุด</h3>
                                </div>

                                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto hide-scrollbar pr-1">
                                    {selectedMember.history && selectedMember.history.length > 0 ? (
                                        selectedMember.history.map((hist, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-[#f8fafc] px-3.5 py-2 rounded-xl border border-[#e2e8f0]">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#1e1b4b] text-xs">{hist.type}</span>
                                                    <span className="text-[9px] text-[#6d6a8a] font-semibold">{hist.date}</span>
                                                </div>
                                                <span className="font-black text-[#10b981] text-sm">
                                                    {hist.weight} <span className="text-[10px] font-['Nunito'] text-[#6d6a8a]">กก.</span>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-xs font-bold text-[#94a3b8] bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                                            ยังไม่มีประวัติการฝากขยะ
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}