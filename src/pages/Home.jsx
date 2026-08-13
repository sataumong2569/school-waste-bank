import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    PlusIcon, QrCodeIcon, TrashIcon,
    UsersIcon, BanknotesIcon, GlobeAsiaAustraliaIcon,
    CalendarDaysIcon, ChartBarIcon, ArrowTrendingUpIcon, StarIcon
} from '@heroicons/react/24/outline'
import ReceiptBill from '../components/ReceiptBill'

import { useApp } from '../AppContext';
import { WASTE_CATEGORIES } from '../utils/wasteConfig';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    const { members, pricing, sysStats, priceUpdatedAt } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    //  ระบบคำนวณสัดส่วนขยะ (กราฟวงกลมและกราฟแท่ง) โชว์ทุกรายการแม้เป็น 0
    const dashboardData = useMemo(() => {
        let totalWasteWeight = 0;
        const categoryTotals = {};
        const itemTotals = {};

        // 1. สร้างค่าเริ่มต้นเป็น 0 ให้ "ทุกหมวดหมู่" และ "ขยะทุกชิ้น"
        Object.entries(WASTE_CATEGORIES).forEach(([catKey, catVal]) => {
            categoryTotals[catKey] = 0;
            catVal.items.forEach(item => {
                itemTotals[item] = 0; // สร้างรายการขยะเตรียมรอไว้เลย
            });
        });

        // 2. เอาข้อมูลขยะมาบวกลงในหมวดหมู่
        members.forEach(m => {
            if (m.history && Array.isArray(m.history)) {
                m.history.forEach(h => {
                    const weight = parseFloat(h.weight) || 0;
                    totalWasteWeight += weight;

                    // ถ้าขยะชื่อนี้มีในระบบ ให้บวกน้ำหนักเพิ่มเข้าไป
                    if (itemTotals[h.type] !== undefined) {
                        itemTotals[h.type] += weight;
                    }

                    for (const [catKey, catVal] of Object.entries(WASTE_CATEGORIES)) {
                        if (catVal.items.includes(h.type)) {
                            categoryTotals[catKey] += weight;
                            break;
                        }
                    }
                });
            }
        });

        // 3. หาหมวดหมู่ที่ถูกฝากเยอะที่สุด (ถ้าขยะเป็น 0 ให้ขึ้นว่า '-')
        let topCategoryName = '-';
        let maxCatWeight = 0;
        for (const [catKey, weight] of Object.entries(categoryTotals)) {
            if (weight > maxCatWeight) {
                maxCatWeight = weight;
                topCategoryName = WASTE_CATEGORIES[catKey].label;
            }
        }
        if (maxCatWeight === 0) topCategoryName = '-';

        // 4. สร้างข้อมูลกราฟวงกลม (โชว์ทุกอัน แม้จะเป็น 0%)
        const pieData = [];
        let cumulativePercent = 0;
        let pieConicGradient = [];

        const allCatKeys = Object.keys(categoryTotals);

        if (totalWasteWeight === 0) {
            // กรณีที่ยังไม่มีใครฝากขยะเลย (กราฟวงกลมสีเทา)
            pieConicGradient.push(`#e2e8f0 0% 100%`);
            allCatKeys.forEach(key => {
                pieData.push({ label: WASTE_CATEGORIES[key].label, percent: 0, colorClass: WASTE_CATEGORIES[key].color });
            });
        } else {
            // กรณีมีขยะแล้ว
            allCatKeys.forEach(key => {
                const percent = (categoryTotals[key] / totalWasteWeight) * 100;
                const hexColor = WASTE_CATEGORIES[key].color.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/)?.[0] || '#ccc';

                pieData.push({ label: WASTE_CATEGORIES[key].label, percent: percent, colorClass: WASTE_CATEGORIES[key].color });

                if (percent > 0) {
                    pieConicGradient.push(`${hexColor} ${cumulativePercent}% ${cumulativePercent + percent}%`);
                    cumulativePercent += percent;
                }
            });
        }

        // 5. สร้างข้อมูลกราฟแนวนอน (โชว์ขยะทุกชิ้น แม้เป็น 0 กก.)
        const detailedWaste = Object.keys(itemTotals).map(itemName => {
            let colorClass = 'bg-gray-400';
            for (const catVal of Object.values(WASTE_CATEGORIES)) {
                if (catVal.items.includes(itemName)) {
                    colorClass = catVal.color;
                    break;
                }
            }
            return { name: itemName, value: itemTotals[itemName], color: colorClass };
        }).sort((a, b) => b.value - a.value); // เรียงจากมากไปน้อย (พวก 0 กก. จะอยู่ล่างสุด)

        return {
            totalWasteWeight,
            topCategoryName,
            pieData,
            pieGradientString: pieConicGradient.length > 0 ? `conic-gradient(${pieConicGradient.join(', ')})` : `conic-gradient(#e2e8f0 0% 100%)`,
            detailedWaste
        };
    }, [members]);

    const newestMembers = [...members].reverse().slice(0, 6);

    // 🟢 ดึงตัวเลขจากบิลรวม (sysStats) มาใส่โดยตรง
    const stats = [
        { title: 'ประเภทขยะมากที่สุด', value: dashboardData.topCategoryName, unit: '', icon: StarIcon, clayClass: 'clay-card-pink' },
        { title: 'ขยะรวมทั้งหมด', value: dashboardData.totalWasteWeight.toLocaleString(undefined, { maximumFractionDigits: 1 }), unit: 'กก.', icon: TrashIcon, clayClass: 'clay-card-amber' },
        { title: 'ยอดเงินออมรวม', value: (sysStats?.totalBalance || 0).toLocaleString(), unit: 'บาท', icon: BanknotesIcon, clayClass: 'clay-card-mint' },
        { title: 'จำนวนสมาชิก', value: (sysStats?.totalMembers || 0).toString(), unit: 'คน', icon: UsersIcon, clayClass: 'clay-card-sky' },
        { title: 'ลดการปล่อยคาร์บอน', value: (sysStats?.totalCarbon || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }), unit: 'kgCO₂e', icon: GlobeAsiaAustraliaIcon, clayClass: 'clay-card-purple' },
    ];

    const maxWasteValue = dashboardData.detailedWaste.length > 0 ? Math.max(...dashboardData.detailedWaste.map(item => item.value)) : 1;

    return (
        <div className="w-full overflow-hidden">

            {/* SECTION 1: HERO */}
            <div className="w-full bg-[#f0eeff] pt-8 md:pt-16 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-8">

                    <div className="flex flex-col md:flex-row items-center justify-between min-h-[50vh] mb-20 fade-up">
                        <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
                            <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_rgba(124,58,237,0.1)] backdrop-blur-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
                                <span className="font-['Nunito'] font-bold text-[#1e1b4b] text-sm md:text-base border-l-2 border-[#1e1b4b]/10 pl-3">โรงเรียนเทศบาลอุโมงค์ 1</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-['Fredoka_One'] text-[#1e1b4b] leading-[1.1] tracking-wide">
                                เปลี่ยนขยะให้เป็น<br />
                                <span className="text-[#db2777] relative">
                                    ความสนุก!
                                    <div className="absolute -bottom-2 left-0 w-full h-[8px] bg-[#f59e0b] rounded-full opacity-60"></div>
                                </span>
                            </h1>

                            <p className="text-[#6d6a8a] font-['Nunito'] font-bold text-lg md:text-xl max-w-md leading-relaxed mt-2">
                                จัดการขยะในโรงเรียนได้ง่ายกว่าที่เคย ดูยอดเงิน แลกของรางวัล และร่วมกันปกป้องสิ่งแวดล้อม
                            </p>

                            <Link to="/members" className="clay-btn-purple mt-4 w-max">
                                ดูรายชื่อสมาชิก <span className="ml-2 text-xl font-black">➔</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex w-full md:w-1/2 justify-center mt-16 md:mt-0 relative perspective-[1000px]">
                            <div className="absolute right-10 -top-10 w-32 h-32 bg-[#f59e0b] rounded-full animate-float-3d-reverse flex items-center justify-center shadow-[10px_15px_0px_#d97706,_inset_0_-8px_16px_rgba(0,0,0,0.2),_inset_0_8px_16px_rgba(255,255,255,0.5)] z-20">
                                <span className="text-5xl font-['Fredoka_One'] text-white drop-shadow-md">฿</span>
                            </div>
                            <div className="w-56 h-64 md:w-72 md:h-80 bg-[#7c3aed] rounded-3xl animate-float-3d flex flex-col items-center justify-center gap-4 shadow-[15px_25px_0px_#5b21b6,_inset_0_-10px_20px_rgba(0,0,0,0.25),_inset_0_10px_20px_rgba(255,255,255,0.3)] border-4 border-[#8b5cf6]">
                                <TrashIcon className="w-24 h-24 text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.2)]" />
                                <div className="bg-white/20 w-2/3 h-4 rounded-full shadow-inner mt-4"></div>
                                <div className="bg-white/20 w-1/2 h-4 rounded-full shadow-inner"></div>
                            </div>
                            <div className="absolute left-10 bottom-0 w-8 h-8 bg-[#38bdf8] rounded-full animate-bounce shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]" style={{ animationDuration: '3s' }}></div>
                        </div>
                    </div>

                    {/* กล่องสถิติ 5 กล่อง */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-[24px] p-5 md:p-6 h-36 flex flex-col justify-between animate-pulse shadow-[inset_0_2px_10px_rgba(255,255,255,0.5)] border border-white/60">
                                    <div className="w-12 h-12 bg-gray-200/60 rounded-[14px]"></div>
                                    <div>
                                        <div className="w-20 h-3 bg-gray-200/60 rounded-full mb-2"></div>
                                        <div className="w-16 h-8 bg-gray-300/60 rounded-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            stats.map((stat, index) => (

                                <div key={index} className={`${stat.clayClass} p-5 md:p-6 flex flex-col fade-up hover-bouncy cursor-pointer`} style={{ animationDelay: `${index * 0.03}s` }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-3 bg-white/20 rounded-[14px] shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
                                            <stat.icon className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                    <p className="font-['Nunito'] font-bold text-white/90 text-[13px] md:text-sm mt-2">{stat.title}</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="font-['Fredoka_One'] text-3xl md:text-4xl text-white tracking-wide">{stat.value}</span>
                                        <span className="font-bold font-['Nunito'] text-xs md:text-sm text-white/80">{stat.unit}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ข้อมูลสมาชิก & กราฟวงกลม */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="clay-card p-6 md:p-8 relative h-full flex flex-col bg-white">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-7 bg-[#f59e0b] rounded-full"></div>
                                    <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">สมาชิกใหม่ล่าสุด</h2>
                                </div>
                                <div className="flex flex-col gap-3 flex-1">
                                    {isLoading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-2xl animate-pulse">
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                                    <div className="flex flex-col gap-2 w-1/3">
                                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        newestMembers.length > 0 ? (
                                            newestMembers.map((member, index) => (
                                                <div key={member.id} className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#f0eeff] transition-colors cursor-default">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base text-white ${member.color || 'bg-[#3b82f6]'}`}>
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#1e1b4b] font-['Nunito'] text-sm md:text-base">{member.fullName}</p>
                                                            <p className="text-xs md:text-sm text-[#6d6a8a] font-semibold">ชั้น {member.grade}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end">
                                                        <p className="font-['Fredoka_One'] text-[#7c3aed] text-xl">{member.balance}</p>
                                                        <span className="text-[10px] md:text-xs font-bold text-[#6d6a8a] bg-white px-2 py-0.5 rounded-full shadow-sm mt-1">บาท</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center text-[#94a3b8] font-bold text-sm">ยังไม่มีสมาชิกในระบบ</div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 fade-up" style={{ animationDelay: '0.3s' }}>
                            <div className="clay-card p-6 md:p-8 relative h-full flex flex-col items-center justify-start bg-white">
                                <div className="flex items-center gap-3 w-full text-left mb-5">
                                    <div className="w-2 h-7 bg-[#db2777] rounded-full"></div>
                                    <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">สัดส่วนขยะ</h2>
                                </div>
                                {isLoading ? (
                                    <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gray-200 animate-pulse mb-6 relative flex-shrink-0 flex items-center justify-center">
                                        <div className="absolute inset-[26px] md:inset-[30px] bg-white rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="w-56 h-56 md:w-64 md:h-64 rounded-full clay-pie mb-6 relative flex-shrink-0" style={{ background: dashboardData.pieGradientString }}>
                                        <div className="absolute inset-[26px] md:inset-[30px] bg-white rounded-full shadow-[inset_0_6px_12px_rgba(0,0,0,0.1)] flex items-center justify-center flex-col">
                                            <span className="font-['Fredoka_One'] text-2xl text-[#1e1b4b]">{dashboardData.totalWasteWeight}</span>
                                            <span className="text-[10px] font-bold text-[#64748b]">กก.</span>
                                        </div>
                                    </div>
                                )}
                                <div className="w-full flex flex-col gap-2 font-['Nunito'] font-bold text-sm md:text-base text-[#1e1b4b]">
                                    {isLoading ? (
                                        Array.from({ length: 4 }).map((_, idx) => (
                                            <div key={idx} className="flex justify-between items-center px-3 py-2 animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                <div className="h-5 bg-gray-200 rounded w-8"></div>
                                            </div>
                                        ))
                                    ) : (
                                        dashboardData.pieData.length > 0 ? (
                                            dashboardData.pieData.map((data, idx) => (
                                                <div key={idx}>
                                                    <div className="flex justify-between items-center px-3 py-1.5 rounded-xl hover:bg-[#f0eeff] transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-4 h-4 ${data.colorClass} rounded-full shadow-inner`}></span>
                                                            {data.label}
                                                        </div>
                                                        <span className="font-['Fredoka_One'] text-lg">{data.percent.toFixed(1)}%</span>
                                                    </div>
                                                    {idx !== dashboardData.pieData.length - 1 && <div className="h-[2px] bg-[#f0eeff] mx-2 rounded-full"></div>}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-[#94a3b8] text-xs py-4">ยังไม่มีข้อมูลสัดส่วนขยะ</div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <svg viewBox="0 0 1440 100" className="w-full h-[60px] md:h-[100px] block scale-[1.02] -mt-[2px] bg-[#f0eeff] text-[#ecfdf5] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,74.7C1248,64,1344,32,1392,16L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
            </svg>

            {/* SECTION 2: บิลรับซื้อขยะ */}
            <div className="w-full bg-[#ecfdf5] pt-10 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-8 fade-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex flex-col items-center mb-10">
                        <span className="clay-pill bg-white text-[#047857] px-4 py-1.5 rounded-full font-bold text-sm mb-3 shadow-[0_2px_8px_rgba(16,185,129,0.15)] border border-[#10b981]/10">อัปเดตล่าสุด</span>
                        <h2 className="font-black text-3xl md:text-4xl text-[#1e1b4b] text-center tracking-wide">รายการรับซื้อ</h2>
                        <p className="text-[#64748b] text-xs md:text-sm font-bold mt-3 bg-white/60 px-4 py-1.5 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
                            (อัปเดตเมื่อ: {priceUpdatedAt
                                ? `${priceUpdatedAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })} เวลา ${priceUpdatedAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`
                                : 'ระบบเริ่มต้น'})
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <ReceiptBill category="PL" shopName="SchoolWaste" date="ล่าสุด" items={[
                            { name: "พลาสติกรวม", price: pricing["พลาสติกรวม"]?.toFixed(2) || "0.00" },
                            { name: "ขวดน้ำขุ่น", price: pricing["ขวดน้ำขุ่น"]?.toFixed(2) || "0.00" },
                            { name: "ขวดน้ำใส", price: pricing["ขวดน้ำใส"]?.toFixed(2) || "0.00" },
                            { name: "ขวดน้ำ PET สี", price: pricing["ขวดน้ำ PET สี"]?.toFixed(2) || "0.00" }
                        ]} />
                        <ReceiptBill category="P" shopName="SchoolWaste" date="ล่าสุด" items={[
                            { name: "กระดาษขาวดำ", price: pricing["กระดาษขาวดำ"]?.toFixed(2) || "0.00" },
                            { name: "กระดาษสีรวม", price: pricing["กระดาษสีรวม"]?.toFixed(2) || "0.00" },
                            { name: "กระดาษลัง", price: pricing["กระดาษลัง"]?.toFixed(2) || "0.00" }
                        ]} />
                        <ReceiptBill category="ETC" shopName="SchoolWaste" date="ล่าสุด" items={[
                            { name: "กระป๋องกาแฟ/นม", price: pricing["กระป๋องกาแฟ/นม"]?.toFixed(2) || "0.00" },
                            { name: "เหล็กหนา", price: pricing["เหล็กหนา"]?.toFixed(2) || "0.00" },
                            { name: "เหล็กบาง", price: pricing["เหล็กบาง"]?.toFixed(2) || "0.00" },
                            { name: "สังกะสี", price: pricing["สังกะสี"]?.toFixed(2) || "0.00" }
                        ]} />
                    </div>
                </div>
            </div>

            <svg viewBox="0 0 1440 100" className="w-full h-[60px] md:h-[100px] block scale-[1.02] -mt-[2px] bg-[#ecfdf5] text-[#fff7ed] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
            </svg>

            {/* SECTION 3: กราฟแท่ง */}
            <div className="w-full bg-[#fff7ed] pt-10 pb-24">
                <div className="max-w-7xl mx-auto px-6 md:px-8 fade-up" style={{ animationDelay: '0.3s' }}>
                    <div className="clay-card p-8 md:p-12 w-full bg-white shadow-xl shadow-purple-900/5">
                        <div className="flex flex-col items-center mb-10">
                            <h2 className="font-['Fredoka_One'] text-2xl md:text-3xl text-[#1e1b4b]">รายละเอียดขยะทุกประเภท</h2>
                            <div className="w-24 h-[6px] bg-[#f59e0b] rounded-full mt-4 opacity-80"></div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {dashboardData.detailedWaste.length > 0 ? dashboardData.detailedWaste.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 md:gap-5 hover:bg-[#f8fafc] p-3 rounded-2xl transition-colors cursor-default">
                                    <div className="w-1/3 md:w-1/4 text-right font-['Nunito'] font-bold text-sm md:text-base text-[#1e1b4b] truncate">
                                        {item.name}
                                    </div>
                                    <div className="flex-1 h-6 md:h-8 bg-[#f1f5f9] rounded-full overflow-hidden shadow-[inset_0_3px_8px_rgba(0,0,0,0.06)]">
                                        <div
                                            className={`h-full ${item.color} clay-bar transition-all duration-1000 ease-out`}
                                            style={{ width: '0%', animation: `fillBar${index} 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.1 + (index * 0.05)}s forwards` }} // ⚡ ปรับกราฟแท่งให้วิ่งไวขึ้น
                                        ></div>
                                    </div>
                                    <style>{`@keyframes fillBar${index} { to { width: ${(item.value / maxWasteValue) * 100}%; } }`}</style>
                                    <div className="w-16 md:w-24 font-['Fredoka_One'] text-[#1e1b4b] text-right text-base md:text-lg">
                                        {item.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs md:text-sm font-['Nunito'] text-[#6d6a8a]">กก.</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-[#94a3b8] font-bold text-sm py-10">ยังไม่มีข้อมูลขยะในระบบ</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}