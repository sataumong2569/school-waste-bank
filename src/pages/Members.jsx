import { useState, useEffect, useRef } from 'react';
import {
    XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon,
    BookOpenIcon, BeakerIcon, ArrowUpTrayIcon, UsersIcon
} from '@heroicons/react/24/outline';

export default function Members() {
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const membersSectionRef = useRef(null);

    // =========================================
    // 🟢 เตรียมพร้อมสำหรับเชื่อมต่อ Firebase Database & Cloudinary
    // =========================================
    // const [membersList, setMembersList] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // useEffect(() => {
    //     const fetchMembers = async () => {
    //         try {
    //             const snapshot = await getDocs(collection(db, 'members'));
    //             const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //             setMembersList(data);
    //         } catch (error) { console.error("Error fetching members:", error); }
    //     };
    //     fetchMembers();
    // }, []);

    // 🔴 ข้อมูลจำลอง (Mock-up) 
    const membersList = Array.from({ length: 45 }, (_, i) => {
        const mockNames = ['สมชาย รักดี', 'สมหญิง ใจบุญ', 'มานะ ขยันเรียน', 'ปิติ ยินดี', 'ชูใจ ไชโย'];
        const mockNicknames = ['เอ', 'บี', 'ซี', 'ดี', 'อี'];
        const nameIndex = i % 5;
        return {
            id: `uid_${i + 1}`,
            fullName: `ด.ช. ${mockNames[nameIndex]} ${i + 1}`,
            nickname: `น้อง${mockNicknames[nameIndex]}`,
            grade: `ป.${Math.floor(Math.random() * 3) + 4}/${Math.floor(Math.random() * 3) + 1}`,
            balance: Math.floor(Math.random() * 5000) + 500,
            carbonPoints: (Math.random() * 50).toFixed(2),
            color: ['bg-[#f472b6]', 'bg-[#f59e0b]', 'bg-[#34d399]', 'bg-[#7c3aed]', 'bg-[#38bdf8]'][nameIndex],
            shadow: ['shadow-[0_8px_16px_rgba(244,114,182,0.3)]', 'shadow-[0_8px_16px_rgba(245,158,11,0.3)]', 'shadow-[0_8px_16px_rgba(52,211,153,0.3)]', 'shadow-[0_8px_16px_rgba(124,58,237,0.3)]', 'shadow-[0_8px_16px_rgba(56,189,248,0.3)]'][nameIndex],
            image: `https://api.dicebear.com/7.x/notionists/svg?seed=User${i + 1}`,
            history: [
                { type: 'พลาสติกรวม', weight: (Math.random() * 5).toFixed(1), date: '2026-08-01' },
                { type: 'กระดาษลัง', weight: (Math.random() * 10).toFixed(1), date: '2026-07-28' },
                { type: 'กระป๋องอลูมิเนียม', weight: (Math.random() * 2).toFixed(1), date: '2026-07-15' },
            ]
        }
    });

    const filteredMembers = membersList.filter((member) =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const displayedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const today = new Date();
    const currentDay = today.getDate();
    let progress15 = currentDay >= 15 ? 100 : (currentDay / 15) * 100;
    let status15 = currentDay >= 15 ? (currentDay === 15 ? "วันนี้" : "รับฝากแล้ว") : `อีก ${15 - currentDay} วัน`;
    let progress25 = currentDay >= 25 ? 100 : (currentDay / 25) * 100;
    let status25 = currentDay >= 25 ? (currentDay === 25 ? "วันนี้" : "รับฝากแล้ว") : `อีก ${25 - currentDay} วัน`;

    const top3Members = [
        { id: 1, name: 'ด.ญ. รักษ์โลก เสมอมา', consistency: 24, carbon: '45.10', badge: '1st', color: 'bg-[#f59e0b]' },
        { id: 2, name: 'ด.ช. เรียนดี ขยันยิ่ง', consistency: 22, carbon: '38.50', badge: '2nd', color: 'bg-[#94a3b8]' },
        { id: 3, name: 'นาย ประหยัด อดออม', consistency: 19, carbon: '30.20', badge: '3rd', color: 'bg-[#fcd34d]' },
    ];

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
        // 🟢 เปลี่ยนคลาสครอบนอกสุด ลบสีพื้นหลังออก เพื่อให้ก้อนข้างในกำหนดสีเองได้เต็มจอ
        <div className="w-full overflow-hidden min-h-screen flex flex-col">

            {/* ========================================= */}
            {/* SECTION 1: HEADER & SEARCH (สีม่วงอ่อน กางเต็มจอ) */}
            {/* ========================================= */}
            <div className="w-full bg-[#f0eeff] pt-8 md:pt-12 pb-10 relative">
                <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center text-center fade-up z-10 relative">

                    <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_rgba(124,58,237,0.1)] backdrop-blur-sm mb-4">
                        <UsersIcon className="w-4 h-4 text-[#7c3aed]" />
                        <span className="font-['Nunito'] font-bold text-[#1e1b4b] text-sm">ระบบสมาชิก</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-['Fredoka_One'] text-[#1e1b4b] tracking-wide mb-8">
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

                {/* 3D Decorator */}
                <div className="absolute top-8 left-10 w-12 h-12 md:w-16 md:h-16 bg-[#38bdf8] rounded-full animate-float-3d shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.2),_0_10px_20px_rgba(56,189,248,0.4)] hidden md:block"></div>
                <div className="absolute bottom-8 right-20 w-16 h-16 md:w-24 md:h-24 bg-[#f59e0b] rounded-[32px] animate-float-3d-reverse rotate-12 shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.2),_0_10px_20px_rgba(245,158,11,0.4)] hidden md:block"></div>
            </div>

            {/* 🌊 เส้นคลื่นคั่นระหว่าง สีม่วงอ่อน (บน) และ สีมิ้นต์อ่อน (ล่าง) */}
            <svg viewBox="0 0 1440 100" className="w-full h-[30px] md:h-[60px] block bg-[#f0eeff] text-[#ecfdf5] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,74.7C1248,64,1344,32,1392,16L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
            </svg>

            {/* ========================================= */}
            {/* SECTION 2: WIDGETS DASHBOARD (สีมิ้นต์อ่อน กางเต็มจอ) */}
            {/* ========================================= */}
            <div className="w-full bg-[#ecfdf5] pt-4 pb-8">
                <div className="max-w-7xl mx-auto flex flex-row md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 md:px-8 fade-up pb-4 md:pb-0" style={{ animationDelay: '0.2s' }}>

                    <div className="min-w-[85vw] md:min-w-0 snap-center clay-card-amber p-5 md:p-6 cursor-default">
                        <div className="text-center mb-5">
                            <h3 className="inline-block text-[13px] font-black bg-white/20 px-4 py-1.5 rounded-full text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                                ระยะเวลากิจกรรมการรับฝาก
                            </h3>
                        </div>
                        <div className="mb-5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-sm text-white">รอบวันที่ 15</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${progress15 === 100 ? 'bg-[#10b981] text-white' : 'bg-white/90 text-[#d97706]'}`}>{status15}</span>
                            </div>
                            <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                                <div className="h-full bg-[#10b981] clay-bar shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500" style={{ width: `${progress15}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="font-bold text-sm text-white">รอบวันที่ 25</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${progress25 === 100 ? 'bg-[#10b981] text-white' : 'bg-white/90 text-[#d97706]'}`}>{status25}</span>
                            </div>
                            <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                                <div className="h-full bg-[#10b981] clay-bar shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-500" style={{ width: `${progress25}%` }}></div>
                            </div>
                        </div>
                    </div>

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

                    <div className="min-w-[85vw] md:min-w-0 snap-center clay-card-purple p-5 md:p-6 cursor-default">
                        <div className="text-center mb-6">
                            <h3 className="inline-block text-[13px] font-black bg-white/20 px-4 py-1.5 rounded-full text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]">
                                แลกรางวัล (Item Shop)
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#7c3aed] shadow-sm"><BookOpenIcon className="w-5 h-5" /></div>
                                    <div>
                                        <p className="font-bold text-sm text-white leading-none mb-1.5">สมุดรีไซเคิล</p>
                                        <p className="text-[10px] font-black text-white/70">เหลือ 15 ชิ้น</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-black text-xl text-white leading-none mb-0.5">20</span>
                                    <span className="text-[10px] font-bold text-white/70">kgCO₂</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#7c3aed] shadow-sm"><BeakerIcon className="w-5 h-5" /></div>
                                    <div>
                                        <p className="font-bold text-sm text-white leading-none mb-1.5">แก้วน้ำพกพา</p>
                                        <p className="text-[10px] font-black text-white/70">เหลือ 3 ชิ้น</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-black text-xl text-white leading-none mb-0.5">50</span>
                                    <span className="text-[10px] font-bold text-white/70">kgCO₂</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 🌊 เส้นคลื่นคั่นระหว่าง สีมิ้นต์อ่อน (บน) และ สีพีชอ่อน (ล่าง) */}
            <svg viewBox="0 0 1440 100" className="w-full h-[30px] md:h-[60px] block bg-[#ecfdf5] text-[#fff7ed] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
            </svg>

            {/* ========================================= */}
            {/* SECTION 3: MEMBERS LIST / GRID (สีพีชอ่อน กางเต็มจอ) */}
            {/* ========================================= */}
            <div ref={membersSectionRef} className="w-full bg-[#fff7ed] pt-6 pb-16 flex-1 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 md:px-8 fade-up" style={{ animationDelay: '0.4s' }}>

                    <div className="clay-card p-4 md:p-8 flex flex-col h-full overflow-hidden bg-white">

                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="w-2 h-7 bg-[#f59e0b] rounded-full"></div>
                            <h2 className="font-['Fredoka_One'] text-2xl text-[#1e1b4b]">ข้อมูลสมาชิก</h2>
                        </div>

                        {displayedMembers.length > 0 ? (
                            <>
                                {/* 📱 รูปแบบ LIST: แสดงเฉพาะในมือถือ (md:hidden) */}
                                <div className="flex flex-col gap-3 md:hidden">
                                    {displayedMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => setSelectedMember(member)}
                                            className="flex flex-col p-3 bg-[#fafafa] rounded-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] active:bg-[#f0eeff] transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-white flex-shrink-0 clay-sphere ${member.color} overflow-hidden`}>
                                                    <img src={member.image} alt={member.fullName} loading="lazy" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-[#1e1b4b] font-['Nunito'] text-sm truncate">{member.fullName}</p>
                                                    <p className="text-[11px] text-[#6d6a8a] font-bold mt-0.5">ชั้น {member.grade} • {member.nickname}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[10px] font-bold text-[#6d6a8a]">ยอดเงิน:</span>
                                                <p className="font-['Fredoka_One'] text-[#7c3aed] text-lg">{member.balance} บ.</p>
                                            </div>
                                            <div className="flex justify-between items-center px-1 mt-1">
                                                <span className="text-[10px] font-bold text-[#6d6a8a]">คาร์บอน:</span>
                                                <p className="font-['Fredoka_One'] text-[#10b981] text-lg">{member.carbonPoints} kg</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 💻 รูปแบบ GRID: แสดงเฉพาะในคอมพิวเตอร์ (hidden md:grid) */}
                                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {displayedMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => setSelectedMember(member)}
                                            className="bg-[#fafafa] border border-[#f0f0f0] rounded-[24px] p-5 flex flex-col items-center text-center cursor-pointer hover-bouncy group shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                                        >
                                            <div className={`w-24 h-24 rounded-full mb-4 overflow-hidden clay-sphere ${member.color} ${member.shadow} transition-transform group-hover:scale-105 border-[4px] border-white`}>
                                                <img src={member.image} alt={member.fullName} loading="lazy" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
                                            </div>
                                            <p className="font-bold text-[#1e1b4b] font-['Nunito'] text-[15px] mb-1 truncate w-full">{member.fullName}</p>
                                            <p className="text-xs text-[#6d6a8a] font-bold bg-white border border-[#f0eeff] px-3 py-1 rounded-full shadow-sm mb-4">
                                                ชั้น {member.grade} • {member.nickname}
                                            </p>
                                            <div className="w-full flex justify-between items-center bg-[#f0eeff] rounded-2xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                                                <div className="flex flex-col items-start w-1/2">
                                                    <span className="text-[10px] font-bold text-[#6d6a8a]">ยอดเงิน</span>
                                                    <span className="font-['Fredoka_One'] text-[#7c3aed] text-lg truncate w-full text-left">{member.balance}</span>
                                                </div>
                                                <div className="h-8 w-[2px] bg-white rounded-full"></div>
                                                <div className="flex flex-col items-end w-1/2">
                                                    <span className="text-[10px] font-bold text-[#6d6a8a]">คาร์บอน</span>
                                                    <span className="font-['Fredoka_One'] text-[#10b981] text-lg truncate w-full text-right">{member.carbonPoints}</span>
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

                        {/* Pagination  */}
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

            {/* ========================================= */}
            {/* CENTER POP-UP MODAL */}
            {/* ========================================= */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

                    <div className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMember(null)}></div>

                    <div className="clay-card relative w-full max-w-sm md:max-w-4xl bg-white p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch animate-modal-pop shadow-[0_30px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto hide-scrollbar gap-6 md:gap-8">

                        <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-[#f8f9fa] rounded-full hover:bg-[#fee2e2] hover:text-red-500 text-[#6d6a8a] transition-colors z-10">
                            <XMarkIcon className="w-6 h-6 font-bold" />
                        </button>

                        <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center">
                            <div className={`w-28 h-28 md:w-40 md:h-40 rounded-full mb-4 border-[6px] border-white shadow-[0_8px_16px_rgba(0,0,0,0.15),_inset_-4px_-6px_10px_rgba(0,0,0,0.2)] overflow-hidden ${selectedMember.color || 'bg-[#7c3aed]'}`}>
                                <img src={selectedMember.image} alt="Profile" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
                            </div>
                            <h2 className="font-['Fredoka_One'] text-3xl md:text-4xl text-[#1e1b4b] mb-1">{selectedMember.nickname}</h2>
                            <p className="font-['Nunito'] font-bold text-[#6d6a8a] mb-4 text-sm md:text-base">{selectedMember.fullName}</p>
                            <div className="bg-[#f0eeff] px-4 py-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
                                <span className="font-['Nunito'] font-bold text-[#7c3aed] text-xs md:text-sm">ชั้น {selectedMember.grade}</span>
                            </div>
                        </div>

                        <div className="hidden md:block w-[2px] bg-[#f0eeff] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"></div>

                        <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-3 justify-center">
                            <div className="flex-1 bg-[#fafafa] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.04)] border border-[#f0f0f0]">
                                <span className="font-['Nunito'] font-bold text-[#6d6a8a] mb-1 md:mb-2 text-[10px] md:text-sm">ยอดเงินสะสม</span>
                                <span className="font-['Fredoka_One'] text-2xl md:text-5xl text-[#7c3aed]">{selectedMember.balance}</span>
                                <span className="font-['Nunito'] font-bold text-[10px] md:text-sm text-[#1e1b4b] mt-1">บาท</span>
                            </div>

                            <div className="flex-1 bg-[#fafafa] rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.04)] border border-[#f0f0f0]">
                                <span className="font-['Nunito'] font-bold text-[#6d6a8a] mb-1 md:mb-2 text-[10px] md:text-sm">ลดคาร์บอน</span>
                                <span className="font-['Fredoka_One'] text-2xl md:text-5xl text-[#10b981]">{selectedMember.carbonPoints}</span>
                                <span className="font-['Nunito'] font-bold text-[10px] md:text-sm text-[#1e1b4b] mt-1">kgCO₂e</span>
                            </div>
                        </div>

                        <div className="hidden md:block w-[2px] bg-[#f0eeff] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"></div>

                        <div className="w-full md:w-1/3 flex flex-col bg-[#e2e8f0] rounded-[24px] p-4 md:p-5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] border border-[#cbd5e1]/50">
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <ArrowUpTrayIcon className="w-4 h-4 md:w-5 md:h-5 text-[#1e1b4b] stroke-2" />
                                <h3 className="font-['Fredoka_One'] text-sm md:text-lg text-[#1e1b4b]">ประวัติการฝากล่าสุด</h3>
                            </div>

                            <div className="flex flex-col gap-2 max-h-40 md:max-h-full overflow-y-auto hide-scrollbar pr-1 flex-1">
                                {selectedMember.history.map((hist, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-4 py-3 rounded-xl shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1e1b4b] text-xs md:text-sm">{hist.type}</span>
                                            <span className="text-[9px] md:text-[10px] text-[#6d6a8a] font-semibold">{hist.date}</span>
                                        </div>
                                        <span className="font-black text-[#10b981] text-sm md:text-lg">{hist.weight} <span className="text-[10px] md:text-xs font-['Nunito'] text-[#6d6a8a]">กก.</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}