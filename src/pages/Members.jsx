import { useState, useEffect, useRef, useMemo } from 'react';

import {
    XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon,
    UsersIcon, GiftIcon, ArrowUpTrayIcon, CalendarDaysIcon, ArrowRightIcon,
    BanknotesIcon, GlobeAmericasIcon, CheckBadgeIcon
} from '@heroicons/react/24/outline';

import { auth } from '../firebase'; // 1. นำเข้า auth เพื่อตรวจสอบสิทธิ์แอดมิน
import { useApp } from '../AppContext';
import { getOptimizedImageUrl } from '../utils/uploadImage';

export default function Members() {

    // 2. ดึง redeemReward เพิ่มเติมจาก useApp()
    const { members, duration, rewards, redeemReward } = useApp();
    const isAdmin = !!auth.currentUser;
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // 🔍 UI States
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [showRewardsModal, setShowRewardsModal] = useState(false);
    const [isRedeemMode, setIsRedeemMode] = useState(false); // 3. เพิ่ม State สลับหน้าแลกของรางวัล

    const membersSectionRef = useRef(null);
    const searchRef = useRef(null);

    // 1. ระบบค้นหา (กรองข้อมูล)
    const filteredMembers = useMemo(() => {
        return members.filter((member) =>
            member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [members, searchTerm]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const displayedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // คำนวณระยะเวลา
    const today = new Date();
    const currentDay = today.getDate();
    const round1 = Number(duration.round1) || 15;
    const round2 = Number(duration.round2) || 25;

    let progress15 = currentDay >= round1 ? 100 : (currentDay / round1) * 100;
    let status15 = currentDay >= round1 ? (currentDay === round1 ? "วันนี้" : "รับฝากแล้ว") : `อีก ${round1 - currentDay} วัน`;

    let progress25 = currentDay >= round2 ? 100 : (currentDay / round2) * 100;
    let status25 = currentDay >= round2 ? (currentDay === round2 ? "วันนี้" : "รับฝากแล้ว") : `อีก ${round2 - currentDay} วัน`;

    // 2. 🏆 ลอจิกคำนวณ Top 3 (วัดจากจำนวนครั้ง -> ถ้าเท่ากันวัดที่น้ำหนักรวม)
    const top3Ranks = useMemo(() => {
        const stats = members.map(m => {
            const historyCount = m.history ? m.history.length : 0;
            const totalWeight = m.history ? m.history.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0) : 0;
            return { id: m.id, historyCount, totalWeight };
        });

        stats.sort((a, b) => {
            if (b.historyCount !== a.historyCount) return b.historyCount - a.historyCount;
            return b.totalWeight - a.totalWeight;
        });

        const ranks = {};
        stats.slice(0, 3).forEach((stat, index) => {
            if (stat.historyCount > 0) ranks[stat.id] = index + 1;
        });
        return ranks;
    }, [members]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // จัดการบล็อกการเลื่อนจอเมื่อเปิด Pop-up ใดๆ
    useEffect(() => {
        if (selectedMember || showDurationModal || showRewardsModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedMember, showDurationModal, showRewardsModal]);

    // 🔍 ปิดช่องค้นหาเมื่อคลิกพื้นที่อื่น
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (membersSectionRef.current) {
            membersSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col pt-8 md:pt-12 pb-16 font-['Prompt']">

            <div ref={membersSectionRef} className="w-full flex-1">
                <div className="max-w-7xl mx-auto px-4 md:px-8 fade-up" style={{ animationDelay: '0.1s' }}>

                    <div className="clay-card p-4 md:p-8 flex flex-col h-full overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[32px]">

                        {/* 🌟 Header & Expandable Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-2">

                            {/* ฝั่งซ้าย: ข้อความ */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="w-2 h-7 bg-[#f59e0b] rounded-full shadow-sm"></div>
                                <h2 className="font-['Prompt'] text-2xl md:text-3xl font-bold text-[#1e1b4b]">ข้อมูลสมาชิก</h2>
                            </div>

                            {/* 🔍 ฝั่งขวา: แถบเครื่องมือ (ช่องค้นหา + ระยะเวลา + ของรางวัล) */}
                            <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">

                                {/* 1. แอนิเมชันปุ่มค้นหา */}
                                <div ref={searchRef} className={`flex items-center bg-white border rounded-full shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${isSearchExpanded ? 'w-full sm:w-64 border-[#c4b5fd] bg-[#f8fafc]' : 'w-10 sm:w-11 border-gray-200 hover:bg-gray-50'}`}>
                                    <button
                                        onClick={() => setIsSearchExpanded(true)}
                                        className={`w-10 sm:w-11 h-10 sm:h-11 shrink-0 flex items-center justify-center transition-colors bg-transparent ${isSearchExpanded ? 'text-[#7c3aed] cursor-default' : 'text-[#6d6a8a] hover:text-[#7c3aed] cursor-pointer'}`}
                                    >
                                        <MagnifyingGlassIcon className="w-5 h-5 md:w-5 md:h-5" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="ค้นหาชื่อ, ชั้นเรียน..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`flex-1 h-full bg-transparent py-2 pr-2 outline-none font-['Prompt'] text-sm md:text-base text-[#1e1b4b] transition-opacity duration-300 ${isSearchExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    />
                                    {isSearchExpanded && searchTerm && (
                                        <button onClick={() => setSearchTerm('')} className="w-8 h-full shrink-0 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                            <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    )}
                                </div>

                                {/* 2. ปุ่มระยะเวลา */}
                                <button
                                    onClick={() => setShowDurationModal(true)}
                                    className="h-10 sm:h-11 px-3 md:px-5 shrink-0 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#d97706] hover:bg-[#fde68a] shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                                >
                                    <CalendarDaysIcon className="w-5 h-5 group-hover:animate-bounce" />
                                    <span className="font-['Prompt'] font-bold text-sm hidden lg:block">ระยะเวลา</span>
                                </button>

                                {/* 3. ปุ่มของรางวัล */}
                                <button
                                    onClick={() => setShowRewardsModal(true)}
                                    className="h-10 sm:h-11 px-3 md:px-5 shrink-0 rounded-full bg-[#f3e8ff] border border-[#ddd6fe] text-[#7c3aed] hover:bg-[#e9d5ff] shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                                >
                                    <GiftIcon className="w-5 h-5 group-hover:animate-bounce" />
                                    <span className="font-['Prompt'] font-bold text-sm hidden lg:block">ของรางวัล</span>
                                </button>

                            </div>
                        </div>

                        {/* MEMBERS GRID */}
                        {displayedMembers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 relative z-10">
                                {displayedMembers.map((member) => {
                                    const rank = top3Ranks[member.id];

                                    return (
                                        <div
                                            key={member.id}
                                            onClick={() => setSelectedMember(member)}
                                            className={`relative rounded-[20px] p-4 flex items-center gap-4 border transition-all cursor-pointer group hover:-translate-y-1 
                                                ${rank === 1 ? 'bg-gradient-to-r from-[#fffbeb] to-white border-[#fde68a] shadow-[0_4px_15px_rgba(245,158,11,0.1)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.2)]' :
                                                    rank === 2 ? 'bg-gradient-to-r from-[#f8fafc] to-white border-[#e2e8f0] shadow-[0_4px_15px_rgba(148,163,184,0.1)] hover:shadow-[0_8px_25px_rgba(148,163,184,0.2)]' :
                                                        rank === 3 ? 'bg-gradient-to-r from-[#fff7ed] to-white border-[#fed7aa] shadow-[0_4px_15px_rgba(234,88,12,0.1)] hover:shadow-[0_8px_25px_rgba(234,88,12,0.2)]' :
                                                            'bg-white border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]'
                                                }`}
                                        >
                                            <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300
                                                ${rank === 1 ? 'p-1 bg-gradient-to-br from-[#fde047] via-[#f59e0b] to-[#d97706] shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]' :
                                                    rank === 2 ? 'p-1 bg-gradient-to-br from-[#e2e8f0] via-[#94a3b8] to-[#475569] shadow-[0_0_15px_rgba(148,163,184,0.3)] group-hover:shadow-[0_0_20px_rgba(148,163,184,0.5)]' :
                                                        rank === 3 ? 'p-1 bg-gradient-to-br from-[#fdba74] via-[#ea580c] to-[#c2410c] shadow-[0_0_15px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_20px_rgba(234,88,12,0.5)]' :
                                                            'p-0'
                                                }`}
                                            >
                                                {rank && (
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50 text-xs md:text-sm z-10">
                                                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                                    </div>
                                                )}

                                                <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-inner overflow-hidden border-2 border-white ${member.color || 'bg-[#7c3aed]'}`}>
                                                    {member.image ? (
                                                        <img
                                                            src={getOptimizedImageUrl(member.image, 100)}
                                                            alt="Profile"
                                                            loading="lazy"
                                                            width="100"
                                                            height="100"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        member.fullName?.split(' ')[1]?.[0] || 'U'
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col flex-1 overflow-hidden justify-center">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <p className={`font-['Prompt'] text-base md:text-lg font-bold truncate
                                                        ${rank === 1 ? 'text-[#d97706]' : rank === 2 ? 'text-[#475569]' : rank === 3 ? 'text-[#c2410c]' : 'text-gray-900'}
                                                    `}>
                                                        น้อง{member.nickname || member.fullName?.split(' ')[0]}
                                                    </p>
                                                    <span className="text-[10px] md:text-[11px] text-[#6d6a8a] font-bold">
                                                        {member.grade}
                                                    </span>
                                                </div>

                                                <p className="font-['Nunito'] text-xs text-gray-500 truncate mb-2.5">
                                                    {member.fullName}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50 text-[10px] font-bold text-purple-700">
                                                        {member.balance || 0} ฿
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700">
                                                        {member.carbonPoints || 0} kg
                                                    </span>
                                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700">
                                                        {member.rewardPoints || 0} pts
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-[#6d6a8a] bg-gray-50 rounded-[20px] border border-gray-100 mt-4">
                                <MagnifyingGlassIcon className="w-16 h-16 mb-4 opacity-30" />
                                <p className="font-bold font-['Nunito'] text-xl">ไม่พบข้อมูลสมาชิกที่ค้นหา</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-between items-center gap-2 md:gap-6 border-t-2 border-[#f8fafc] pt-6 px-2">
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

            {/* ========================================================================= */}
            {/* 1. POP-UP MODAL: ข้อมูลสมาชิก & ระบบแลกรางวัล (ดีไซน์ใหม่) */}
            {/* ========================================================================= */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-24 md:pb-4 font-['Prompt']">
                    <div
                        className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm transition-opacity"
                        onClick={() => { setSelectedMember(null); setIsRedeemMode(false); }}
                    ></div>

                    <div className="clay-card relative w-full max-w-sm md:max-w-4xl bg-white p-6 md:p-8 flex flex-col md:flex-row items-stretch animate-modal-pop shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar gap-6 md:gap-8 rounded-[32px]">

                        {/* ปุ่มปิด Modal (กากบาท) */}
                        <button
                            onClick={() => { setSelectedMember(null); setIsRedeemMode(false); }}
                            className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-[#f8fafc] rounded-full hover:bg-rose-50 hover:text-rose-500 text-[#6d6a8a] transition-colors z-20 shadow-sm border border-slate-200/60 active:scale-95"
                            aria-label="ปิดหน้าต่าง"
                        >
                            <XMarkIcon className="w-5 h-5 md:w-6 md:h-6 font-bold" />
                        </button>

                        {/* ฝั่งซ้าย: ข้อมูลโปรไฟล์นักเรียน (แก้ปัญหาภาพแนวตั้งมือถือไม่ให้ซูมชิดขอบ) */}
                        <div className="w-full md:w-5/12 flex flex-col items-center md:items-start shrink-0">
                            <div className="w-full h-64 md:h-80 rounded-[28px] overflow-hidden shadow-inner bg-slate-100/80 mb-4 flex items-center justify-center border border-slate-200/50 p-1.5 relative group">
                                {selectedMember.image ? (
                                    <img
                                        src={getOptimizedImageUrl(selectedMember.image, 500)}
                                        alt="Profile"
                                        loading="lazy"
                                        width="500"
                                        height="600"
                                        className="w-full h-full object-contain rounded-[22px] drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className={`w-full h-full rounded-[22px] flex items-center justify-center font-black text-6xl text-white shadow-inner ${selectedMember.color || 'bg-[#7c3aed]'}`}>
                                        {selectedMember.fullName?.split(' ')[1]?.[0] || 'U'}
                                    </div>
                                )}
                            </div>

                            {/* ชื่อนักเรียน + ติ๊กถูกสถานะ (Verified Status Badge) */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5 w-full">
                                <h2 className="text-xl md:text-2xl font-bold text-[#1e1b4b]">
                                    {selectedMember.fullName}
                                </h2>

                                {/* ตรวจสอบสถานะจาก member.status */}
                                {selectedMember.status === 'จบการศึกษา' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                                        🎓 จบการศึกษา
                                    </span>
                                ) : selectedMember.status === 'ย้ายโรงเรียน' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                        พ้นสภาพ
                                    </span>
                                ) : (
                                    /* ค่าเริ่มต้นหรือ 'กำลังศึกษา' = ติ๊กถูก Verified สีเขียว */
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm" title="สถานะ: กำลังศึกษา (Active)">
                                        <CheckBadgeIcon className="w-4 h-4 text-emerald-600 inline-block" />
                                        <span>กำลังศึกษา</span>
                                    </span>
                                )}
                            </div>

                            <p className="font-bold text-xs md:text-sm text-[#6d6a8a] text-center md:text-left">
                                ชั้น {selectedMember.grade} {selectedMember.nickname ? `• ชื่อเล่น: ${selectedMember.nickname}` : ''}
                            </p>
                        </div>

                        <div className="hidden md:block w-[2px] bg-slate-100 rounded-full self-stretch"></div>

                        {/* ฝั่งขวา: สลับมุมมองระหว่าง "สถิติ" กับ "ตู้แลกรางวัล" */}
                        <div className="w-full md:w-7/12 flex flex-col justify-between">

                            {!isRedeemMode ? (
                                /* =================== มุมมองที่ 1: การ์ดสถิติ 3 ช่องแบบคุมธีมเดียวกัน =================== */
                                <div className="flex flex-col gap-5 animate-fadeIn">
                                    <div className="flex flex-col gap-2.5">
                                        <h3 className="text-sm md:text-base font-bold text-[#1e1b4b] mb-0.5 pr-12">ข้อมูลบัญชีและสถิติสะสม</h3>

                                        {/* 1. ยอดเงินสะสม */}
                                        <div className="bg-purple-50/60 rounded-2xl h-14 pl-4 pr-14 flex items-center justify-between border border-purple-100/80 shadow-[0_2px_8px_rgba(124,58,237,0.03)]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-1.5 h-5 rounded-full bg-[#7c3aed] shadow-sm shrink-0"></div>
                                                <span className="font-bold text-sm md:text-[15px] text-slate-700 leading-none">ยอดเงินสะสม</span>
                                            </div>
                                            <div className="flex items-baseline justify-end gap-1.5 shrink-0">
                                                <span className="font-['Fredoka_One'] text-xl md:text-2xl text-[#7c3aed] leading-none">
                                                    {(selectedMember.balance || 0).toLocaleString()}
                                                </span>
                                                <span className="font-bold text-xs md:text-sm text-purple-700 w-14 text-left">บาท</span>
                                            </div>
                                        </div>

                                        {/* 2. ลดคาร์บอนสะสม */}
                                        <div className="bg-emerald-50/60 rounded-2xl h-14 pl-4 pr-14 flex items-center justify-between border border-emerald-100/80 shadow-[0_2px_8px_rgba(16,185,129,0.03)]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-1.5 h-5 rounded-full bg-[#10b981] shadow-sm shrink-0"></div>
                                                <span className="font-bold text-sm md:text-[15px] text-slate-700 leading-none">ลดคาร์บอนสะสม</span>
                                            </div>
                                            <div className="flex items-baseline justify-end gap-1.5 shrink-0">
                                                <span className="font-['Fredoka_One'] text-xl md:text-2xl text-[#10b981] leading-none">
                                                    {(selectedMember.carbonPoints || 0).toLocaleString()}
                                                </span>
                                                <span className="font-bold text-xs md:text-sm text-emerald-700 w-14 text-left">kgCO₂e</span>
                                            </div>
                                        </div>

                                        {/* 3. คาร์บอนเครดิต (สไลด์ขยายเป็นปุ่มข้อความโทนสีเหลืองตอน Hover) */}
                                        <div
                                            onClick={isAdmin ? () => setIsRedeemMode(true) : undefined}
                                            className={`relative overflow-hidden rounded-2xl h-14 pl-4 pr-14 flex items-center justify-between border transition-all duration-300 group ${isAdmin
                                                ? 'bg-amber-50/85 border-amber-200/90 shadow-[0_4px_12px_rgba(245,158,11,0.08)] hover:bg-amber-400 hover:border-amber-500 hover:shadow-[0_8px_20px_rgba(245,158,11,0.3)] cursor-pointer active:scale-[0.99]'
                                                : 'bg-amber-50/60 border-amber-100/80 shadow-sm'
                                                }`}
                                        >
                                            {/* ฝั่งซ้าย: แถบสีและชื่อหัวข้อ */}
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-1.5 h-5 rounded-full bg-amber-500 shadow-sm shrink-0 group-hover:bg-amber-950 transition-colors duration-300"></div>
                                                <span className="font-bold text-sm md:text-[15px] text-slate-700 group-hover:text-amber-950 transition-colors duration-300 leading-none">
                                                    คาร์บอนเครดิต
                                                </span>
                                            </div>

                                            {/* ฝั่งขวา: แสดงตัวเลขแต้ม (เมื่อ Hover จะเปลี่ยนเป็นข้อความ) */}
                                            <div className="flex items-center">
                                                <div className={`flex items-baseline justify-end gap-1.5 shrink-0 ${isAdmin ? 'group-hover:hidden' : ''}`}>
                                                    <span className="font-['Fredoka_One'] text-xl md:text-2xl text-[#b45309] leading-none">
                                                        {(selectedMember.rewardPoints || 0).toLocaleString()}
                                                    </span>
                                                    <span className="font-bold text-xs md:text-sm text-amber-800 w-14 text-left">pts</span>
                                                </div>


                                            </div>

                                            {/* แถบขอบขวา Curve แนบไปกับมุมมนของกล่อง */}
                                            {isAdmin && (
                                                <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end rounded-r-2xl pointer-events-none transition-all duration-300">
                                                    <div className="h-full flex items-center justify-center gap-1 px-3 bg-amber-200/60 rounded-l-2xl text-amber-900 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-amber-950 group-hover:px-3.5">
                                                        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 group-hover:max-w-[100px] opacity-0 group-hover:opacity-100">
                                                            แลกรางวัล
                                                        </span>
                                                        <ArrowRightIcon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ประวัติการฝากล่าสุด */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ArrowUpTrayIcon className="w-4 h-4 text-[#1e1b4b] stroke-2" />
                                            <h3 className="text-sm md:text-base font-bold text-[#1e1b4b]">ประวัติการฝากล่าสุด</h3>
                                        </div>
                                        <div className="flex flex-col gap-2 max-h-36 overflow-y-auto hide-scrollbar pr-1">
                                            {selectedMember.history && selectedMember.history.length > 0 ? (
                                                selectedMember.history.map((hist, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-[#f8fafc] px-3.5 py-2.5 rounded-xl border border-[#e2e8f0]">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-[#1e1b4b] text-xs">{hist.type}</span>
                                                            <span className="text-[9px] text-[#6d6a8a] font-medium mt-0.5">{hist.date}</span>
                                                        </div>
                                                        <span className="font-black text-[#10b981] text-sm">
                                                            {hist.weight} <span className="text-[10px] text-[#6d6a8a]">กก.</span>
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
                            ) : (
                                /* =================== มุมมองที่ 2: เมนูตู้ของรางวัล =================== */
                                <div className="flex flex-col h-full animate-fadeIn">
                                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 pr-12">
                                        <button
                                            onClick={() => setIsRedeemMode(false)}
                                            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                                        >
                                            <span>← ย้อนกลับ</span>
                                        </button>
                                        <span className="text-xs md:text-sm text-slate-500 font-bold">
                                            คลังของรางวัล
                                        </span>
                                    </div>

                                    {/* การ์ดสรุปแต้มของสมาชิก */}
                                    <div className="bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/10 border border-amber-300/70 rounded-2xl p-3.5 md:p-4 mb-3 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-inner font-bold text-lg">
                                                🪙
                                            </div>
                                            <div>
                                                <span className="text-xs text-amber-900 font-bold block">แต้มคาร์บอนเครดิตที่มี</span>
                                                <span className="text-[10px] md:text-xs text-slate-500 font-medium">ของ {selectedMember.fullName?.split(' ')[0]}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-['Fredoka_One'] text-2xl md:text-3xl text-amber-700 leading-none">
                                                {(selectedMember.rewardPoints || 0).toLocaleString()}
                                            </span>
                                            <span className="text-xs font-bold text-amber-600 ml-1">pts</span>
                                        </div>
                                    </div>

                                    {/* รายการของรางวัลที่สามารถแลกได้ */}
                                    <div className="flex flex-col gap-3 max-h-[360px] md:max-h-[400px] overflow-y-auto pr-1">
                                        {rewards && rewards.length > 0 ? (
                                            rewards.map((item) => {
                                                const memberPts = Number(selectedMember.rewardPoints) || 0;
                                                const canRedeem = memberPts >= item.points && item.stock > 0;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex items-center justify-between p-3.5 md:p-4 rounded-2xl border transition-all ${canRedeem
                                                            ? 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                                                            : 'bg-slate-50 border-slate-200/60 opacity-60'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 md:gap-3.5">
                                                            <div className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl flex items-center justify-center font-bold shrink-0 ${canRedeem ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-400'
                                                                }`}>
                                                                <GiftIcon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm md:text-base text-slate-800 leading-tight mb-1">{item.name}</p>
                                                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${item.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                                                                    }`}>
                                                                    {item.stock > 0 ? `คงเหลือ ${item.stock} ชิ้น` : 'สินค้าหมด'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                                            <div className="text-right">
                                                                <span className="block font-['Fredoka_One'] text-base md:text-xl text-[#7c3aed] leading-none">{item.points}</span>
                                                                <span className="text-[10px] text-slate-400 font-bold">แต้ม</span>
                                                            </div>
                                                            <button
                                                                disabled={!canRedeem}
                                                                onClick={async () => {
                                                                    if (confirm(`ตัดแต้ม ${item.points} pts เพื่อแลก "${item.name}" ให้นักเรียนใช่หรือไม่?`)) {
                                                                        const res = await redeemReward(selectedMember.id, item);
                                                                        alert(res.message);
                                                                    }
                                                                }}
                                                                className={`px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold min-h-[40px] flex items-center justify-center transition-all ${canRedeem
                                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md active:scale-95 cursor-pointer'
                                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                                    }`}
                                                            >
                                                                แลกรางวัล
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-12 text-slate-400 text-sm">
                                                ยังไม่มีของรางวัลในระบบ
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div >
            )
            }

            {/* ========================================================================= */}
            {/* 2. POP-UP MODAL: ระยะเวลา */}
            {/* ========================================================================= */}
            {
                showDurationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowDurationModal(false)}></div>
                        <div className="clay-card-amber relative w-full max-w-sm bg-white p-6 md:p-8 animate-modal-pop shadow-2xl z-10 rounded-[32px]">
                            <button onClick={() => setShowDurationModal(false)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40 text-white transition-colors">
                                <XMarkIcon className="w-5 h-5 font-bold" />
                            </button>

                            <div className="text-center mb-6 mt-2">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                                    <CalendarDaysIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-['Prompt'] font-bold text-lg md:text-xl text-white">ระยะเวลากิจกรรม</h3>
                            </div>

                            <div className="mb-6 bg-white/10 p-4 rounded-[20px] border border-white/20 shadow-sm">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-sm text-white">รอบวันที่ {round1}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${progress15 === 100 ? 'bg-[#10b981] text-white' : 'bg-white/90 text-[#d97706]'}`}>{status15}</span>
                                </div>
                                <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-[#10b981] transition-all duration-700 ease-out" style={{ width: `${progress15}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-[20px] border border-white/20 shadow-sm">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-sm text-white">รอบวันที่ {round2}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-sm ${progress25 === 100 ? 'bg-[#10b981] text-white' : 'bg-white/90 text-[#d97706]'}`}>{status25}</span>
                                </div>
                                <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-[#10b981] transition-all duration-700 ease-out" style={{ width: `${progress25}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ========================================================================= */}
            {/* 3. POP-UP MODAL: ร้านค้าของรางวัล */}
            {/* ========================================================================= */}
            {
                showRewardsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowRewardsModal(false)}></div>
                        <div className="clay-card-purple relative w-full max-w-sm bg-white p-6 md:p-8 animate-modal-pop shadow-2xl z-10 rounded-[32px]">
                            <button onClick={() => setShowRewardsModal(false)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/40 text-white transition-colors">
                                <XMarkIcon className="w-5 h-5 font-bold" />
                            </button>

                            <div className="text-center mb-6 mt-2">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                                    <GiftIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-['Prompt'] font-bold text-lg md:text-xl text-white">แลกของรางวัล</h3>
                                <p className="text-white/70 text-xs mt-1">ใช้คาร์บอนเครดิตแลกของสุดพิเศษ</p>
                            </div>

                            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto hide-scrollbar pr-1">
                                {rewards.length > 0 ? rewards.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between px-4 py-3.5 bg-white/10 rounded-2xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#7c3aed] shadow-md">
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
                                    <div className="text-center text-white/70 text-sm font-bold py-10 bg-white/10 rounded-2xl border border-white/20">
                                        ยังไม่มีของรางวัลเปิดให้แลก
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
}