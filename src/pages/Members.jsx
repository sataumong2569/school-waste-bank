import { useState, useEffect, useRef, useMemo } from 'react';
import {
    XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon,
    UsersIcon, GiftIcon, ArrowUpTrayIcon, CalendarDaysIcon
} from '@heroicons/react/24/outline';

import { useApp } from '../AppContext';
import { getOptimizedImageUrl } from '../utils/uploadImage';

export default function Members() {

    const { members, duration, rewards } = useApp();

    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // 🔍 UI States
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [showRewardsModal, setShowRewardsModal] = useState(false);

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

    // 2. 🏆 ลอจิกคำนวณ Top 3 (วัดจากจำนวนครั้ง -> ถ่าเท่ากันวัดที่น้ำหนักรวม)
    const top3Ranks = useMemo(() => {
        const stats = members.map(m => {
            const historyCount = m.history ? m.history.length : 0;
            const totalWeight = m.history ? m.history.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0) : 0;
            return { id: m.id, historyCount, totalWeight };
        });

        // เรียงลำดับ (ครั้งมากสุด -> ถ่าเท่ากันดูน้ำหนัก)
        stats.sort((a, b) => {
            if (b.historyCount !== a.historyCount) return b.historyCount - a.historyCount;
            return b.totalWeight - a.totalWeight;
        });

        // แมป ID กับอันดับ เพื่อนำไปแปะป้ายในการ์ด
        const ranks = {};
        stats.slice(0, 3).forEach((stat, index) => {
            if (stat.historyCount > 0) ranks[stat.id] = index + 1; // ต้องฝากอย่างน้อย 1 ครั้ง
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

                        {/* ========================================================================= */}
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
                                            {/* ฝั่งซ้าย: รูปภาพ Profile พร้อมวงแหวนสำหรับ Top 3 */}
                                            <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300
            ${rank === 1 ? 'p-1 bg-gradient-to-br from-[#fde047] via-[#f59e0b] to-[#d97706] shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]' :
                                                    rank === 2 ? 'p-1 bg-gradient-to-br from-[#e2e8f0] via-[#94a3b8] to-[#475569] shadow-[0_0_15px_rgba(148,163,184,0.3)] group-hover:shadow-[0_0_20px_rgba(148,163,184,0.5)]' :
                                                        rank === 3 ? 'p-1 bg-gradient-to-br from-[#fdba74] via-[#ea580c] to-[#c2410c] shadow-[0_0_15px_rgba(234,88,12,0.3)] group-hover:shadow-[0_0_20px_rgba(234,88,12,0.5)]' :
                                                            'p-0'
                                                }`}
                                            >
                                                {/* ไอคอนเหรียญแปะทับมุมล่างขวาของรูปโปรไฟล์ */}
                                                {rank && (
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50 text-xs md:text-sm z-10">
                                                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                                    </div>
                                                )}

                                                {/* ตัวรูปโปรไฟล์ */}
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

                                            {/* ฝั่งขวา: ข้อมูล และ แท็ก */}
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
            {/* 1. POP-UP MODAL: ข้อมูลสมาชิก (โค้ดเดิม) */}
            {/* ========================================================================= */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMember(null)}></div>
                    <div className="clay-card relative w-full max-w-sm md:max-w-4xl bg-white p-6 md:p-8 flex flex-col md:flex-row items-stretch animate-modal-pop shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar gap-6 md:gap-8 rounded-[32px]">
                        <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-[#f8f9fa] rounded-full hover:bg-[#fee2e2] hover:text-red-500 text-[#6d6a8a] transition-colors z-10 shadow-sm border border-gray-100">
                            <XMarkIcon className="w-6 h-6 font-bold" />
                        </button>

                        <div className="w-full md:w-5/12 flex flex-col items-center md:items-start">
                            <div className="w-full h-64 md:h-80 rounded-[24px] overflow-hidden shadow-sm bg-[#f1f5f9] mb-4 flex items-center justify-center border border-gray-100">
                                {selectedMember.image ? (
                                    <img
                                        src={getOptimizedImageUrl(selectedMember.image, 100)}
                                        alt="Profile"
                                        loading="lazy"
                                        width="100"
                                        height="100"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center font-black text-6xl text-white ${selectedMember.color || 'bg-[#7c3aed]'}`}>
                                        {selectedMember.fullName?.split(' ')[1]?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <h2 className="font-['Prompt'] text-xl md:text-2xl font-bold text-[#1e1b4b] mb-1">
                                {selectedMember.fullName}
                            </h2>
                            <p className="font-['Nunito'] font-bold text-xs md:text-sm text-[#6d6a8a]">
                                ชั้น {selectedMember.grade} {selectedMember.nickname ? `• ชื่อเล่น: ${selectedMember.nickname}` : ''}
                            </p>
                        </div>

                        <div className="hidden md:block w-[2px] bg-gray-100 rounded-full self-stretch"></div>

                        <div className="w-full md:w-7/12 flex flex-col gap-5 justify-between">
                            <div className="flex flex-col gap-2.5">
                                <h3 className="font-['Prompt'] text-base font-bold text-[#1e1b4b] mb-1">ข้อมูลบัญชีและสถิติ</h3>
                                <div className="bg-[#fafafa] rounded-xl px-4 py-3 flex items-center justify-between border border-[#f0f0f0]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></div>
                                        <span className="font-['Nunito'] font-bold text-[#6d6a8a] text-xs md:text-sm">ยอดเงินสะสม</span>
                                    </div>
                                    <span className="font-['Prompt'] text-lg md:text-xl font-bold text-[#7c3aed]">
                                        {selectedMember.balance || 0} <span className="text-xs font-['Nunito'] text-gray-500">บาท</span>
                                    </span>
                                </div>
                                <div className="bg-[#fafafa] rounded-xl px-4 py-3 flex items-center justify-between border border-[#f0f0f0]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                                        <span className="font-['Nunito'] font-bold text-[#6d6a8a] text-xs md:text-sm">ลดคาร์บอน</span>
                                    </div>
                                    <span className="font-['Prompt'] text-lg md:text-xl font-bold text-[#10b981]">
                                        {selectedMember.carbonPoints || 0} <span className="text-xs font-['Nunito'] text-gray-500">kgCO₂e</span>
                                    </span>
                                </div>
                                <div className="bg-[#fffbeb] rounded-xl px-4 py-3 flex items-center justify-between border border-[#fde68a]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                                        <span className="font-['Nunito'] font-bold text-[#d97706] text-xs md:text-sm">คาร์บอนเครดิต</span>
                                    </div>
                                    <span className="font-['Prompt'] text-lg md:text-xl font-bold text-[#f59e0b]">
                                        {selectedMember.rewardPoints || 0} <span className="text-xs font-['Nunito'] text-[#d97706]">pts</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowUpTrayIcon className="w-4 h-4 text-[#1e1b4b] stroke-2" />
                                    <h3 className="font-['Prompt'] text-sm md:text-base font-bold text-[#1e1b4b]">ประวัติการฝากล่าสุด</h3>
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

            {/* ========================================================================= */}
            {/* 2. POP-UP MODAL: ระยะเวลา */}
            {/* ========================================================================= */}
            {showDurationModal && (
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
            )}

            {/* ========================================================================= */}
            {/* 3. POP-UP MODAL: ร้านค้าของรางวัล */}
            {/* ========================================================================= */}
            {showRewardsModal && (
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
            )}

        </div>
    )
}