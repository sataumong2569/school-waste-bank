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
import HeartMemberGrid from '../components/HeartMemberGrid';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    const { members, pricing, sysStats, priceUpdatedAt } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // ระบบคำนวณสัดส่วนขยะ (กราฟวงกลมและกราฟแท่ง)
    const dashboardData = useMemo(() => {
        let totalWasteWeight = 0;
        const categoryTotals = {};
        const itemTotals = {};

        // 1. สร้างค่าเริ่มต้นเป็น 0
        Object.entries(WASTE_CATEGORIES).forEach(([catKey, catVal]) => {
            categoryTotals[catKey] = 0;
            catVal.items.forEach(item => {
                itemTotals[item] = 0;
            });
        });

        // 2. คำนวณข้อมูลขยะ
        members.forEach(m => {
            if (m.history && Array.isArray(m.history)) {
                m.history.forEach(h => {
                    const weight = parseFloat(h.weight) || 0;
                    totalWasteWeight += weight;

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

        // 3. หาหมวดหมู่ที่ถูกฝากเยอะที่สุด
        let topCategoryName = '-';
        let maxCatWeight = 0;
        for (const [catKey, weight] of Object.entries(categoryTotals)) {
            if (weight > maxCatWeight) {
                maxCatWeight = weight;
                topCategoryName = WASTE_CATEGORIES[catKey].label;
            }
        }
        if (maxCatWeight === 0) topCategoryName = '-';

        // 4. สร้างข้อมูลกราฟวงกลม
        const pieData = [];
        let cumulativePercent = 0;
        let pieConicGradient = [];

        const allCatKeys = Object.keys(categoryTotals);

        if (totalWasteWeight === 0) {
            pieConicGradient.push(`#e2e8f0 0% 100%`);
            allCatKeys.forEach(key => {
                pieData.push({ label: WASTE_CATEGORIES[key].label, percent: 0, colorClass: WASTE_CATEGORIES[key].color });
            });
        } else {
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

        // 5. สร้างข้อมูลกราฟแนวนอน
        const detailedWaste = Object.keys(itemTotals).map(itemName => {
            let colorClass = 'bg-gray-400';
            for (const catVal of Object.values(WASTE_CATEGORIES)) {
                if (catVal.items.includes(itemName)) {
                    colorClass = catVal.color;
                    break;
                }
            }
            return { name: itemName, value: itemTotals[itemName], color: colorClass };
        }).sort((a, b) => b.value - a.value);

        return {
            totalWasteWeight,
            topCategoryName,
            pieData,
            pieGradientString: pieConicGradient.length > 0 ? `conic-gradient(${pieConicGradient.join(', ')})` : `conic-gradient(#e2e8f0 0% 100%)`,
            detailedWaste
        };
    }, [members]);

    const newestMembers = [...members].reverse().slice(0, 6);

    const stats = [
        { title: 'ประเภทขยะมากที่สุด', value: dashboardData.topCategoryName, unit: '', icon: StarIcon, clayClass: 'clay-card-pink' },
        { title: 'ขยะรวมทั้งหมด', value: dashboardData.totalWasteWeight.toLocaleString(undefined, { maximumFractionDigits: 1 }), unit: 'กก.', icon: TrashIcon, clayClass: 'clay-card-amber' },
        { title: 'ยอดเงินออมรวม', value: (sysStats?.totalBalance || 0).toLocaleString(), unit: 'บาท', icon: BanknotesIcon, clayClass: 'clay-card-mint' },
        { title: 'จำนวนสมาชิก', value: (sysStats?.totalMembers || 0).toString(), unit: 'คน', icon: UsersIcon, clayClass: 'clay-card-sky' },
        { title: 'ลดการปล่อยคาร์บอน', value: (sysStats?.totalCarbon || 0).toLocaleString(undefined, { maximumFractionDigits: 2 }), unit: 'kgCO₂e', icon: GlobeAsiaAustraliaIcon, clayClass: 'clay-card-purple' },
    ];

    const maxWasteValue = dashboardData.detailedWaste.length > 0 ? Math.max(...dashboardData.detailedWaste.map(item => item.value)) : 1;

    const [activeReceiptTab, setActiveReceiptTab] = useState('PL');

    const [desktopOpenCats, setDesktopOpenCats] = useState({ PL: false, P: false, ETC: false });
    const [selectedMobileCat, setSelectedMobileCat] = useState(null);

    const [selectedCategoryKey, setSelectedCategoryKey] = useState(null); // null = โหมดปกติ 3 แท่ง, 'PL'/'P'/'ETC' = โหมดขยายแท่งย่อย

    return (
        <div className="w-full overflow-hidden font-['Prompt']">

            {/* SECTION 1: HERO */}
            <div className="w-full bg-[#f0eeff] pt-8 md:pt-16 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-8">

                    <div className="flex flex-col md:flex-row items-center justify-between min-h-[50vh] mb-20 fade-up">
                        <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
                            <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_rgba(124,58,237,0.1)] backdrop-blur-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
                                <span className="font-['Prompt'] font-bold text-[#1e1b4b] text-sm md:text-base border-l-2 border-[#1e1b4b]/10 pl-3">โรงเรียนเทศบาลอุโมงค์ 1</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-['Prompt'] text-[#1e1b4b] leading-[1.1] tracking-wide">
                                เปลี่ยนขยะให้เป็น<br />
                                <span className="text-[#db2777] relative">
                                    ความสนุก!
                                    <div className="absolute -bottom-2 left-0 w-full h-[8px] bg-[#f59e0b] rounded-full opacity-60"></div>
                                </span>
                            </h1>

                            <p className="text-[#6d6a8a] font-['Prompt'] font-medium text-base md:text-lg max-w-md leading-relaxed mt-2">
                                จัดการขยะในโรงเรียนได้ง่ายกว่าที่เคย ดูยอดเงิน แลกของรางวัล และร่วมกันปกป้องสิ่งแวดล้อม
                            </p>

                            <Link to="/members" className="clay-btn-purple mt-4 w-max font-['Prompt'] font-bold">
                                ดูรายชื่อสมาชิก <span className="ml-2 text-xl font-black">➔</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex w-full md:w-1/2 justify-center mt-16 md:mt-0 relative perspective-[1000px]">
                            <div className="absolute right-10 -top-10 w-32 h-32 bg-[#f59e0b] rounded-full animate-float-3d-reverse flex items-center justify-center shadow-[10px_15px_0px_#d97706,_inset_0_-8px_16px_rgba(0,0,0,0.2),_inset_0_8px_16px_rgba(255,255,255,0.5)] z-20">
                                <span className="text-5xl font-['Prompt'] font-bold text-white drop-shadow-md">฿</span>
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
                    {/* 1. สำหรับมือถือ: เลื่อนปัดแนวนอน */}
                    <div className="flex md:hidden overflow-x-auto gap-3 pb-4 mb-8 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <div key={idx} className="min-w-[200px] w-[210px] flex-shrink-0 bg-white/50 rounded-[24px] p-5 h-32 flex flex-col justify-between animate-pulse border border-white/60">
                                    <div className="w-10 h-10 bg-gray-200/60 rounded-[12px]"></div>
                                    <div>
                                        <div className="w-20 h-3 bg-gray-200/60 rounded-full mb-2"></div>
                                        <div className="w-14 h-6 bg-gray-300/60 rounded-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`${stat.clayClass} min-w-[200px] w-[210px] flex-shrink-0 p-5 flex flex-col justify-between snap-start rounded-[24px] shadow-sm`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="p-2.5 bg-white/20 rounded-[12px] shadow-[inset_0_2px_6px_rgba(255,255,255,0.4)]">
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-['Prompt'] font-semibold text-white/90 text-xs mt-1">{stat.title}</p>
                                        <div className="flex items-baseline gap-1 mt-0.5">
                                            <span className="font-['Fredoka_One'] text-2xl text-white tracking-wide">{stat.value}</span>
                                            <span className="font-['Prompt'] font-medium text-[11px] text-white/80">{stat.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 2. สำหรับแท็บเล็ตและเดสก์ท็อป: Grid 5 ช่อง */}
                    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
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
                                    <p className="font-['Prompt'] font-semibold text-white/90 text-[13px] md:text-sm mt-2">{stat.title}</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="font-['Fredoka_One'] text-3xl md:text-4xl text-white tracking-wide">{stat.value}</span>
                                        <span className="font-['Prompt'] font-medium text-xs md:text-sm text-white/80">{stat.unit}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ข้อมูลสมาชิก & กราฟวงกลม */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                        {/* ฝั่งซ้าย: หัวใจ */}
                        <div className="fade-up" style={{ animationDelay: '0.2s' }}>
                            <HeartMemberGrid />
                        </div>

                        {/* ฝั่งขวา: กราฟวงกลม (ปรับแต่งเฉพาะ Desktop ให้ใหญ่ หนา และรายการขยะชิดล่าง) */}
                        <div className="fade-up" style={{ animationDelay: '0.3s' }}>
                            <div className="clay-card p-5 md:p-8 relative h-full flex flex-col items-center justify-between bg-white min-h-[500px]">

                                {/* Header */}
                                <div className="flex items-center gap-3 w-full text-left shrink-0">
                                    <div className="w-2 h-7 bg-[yellow] rounded-full"></div>
                                    <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">สัดส่วนขยะ</h2>
                                </div>

                                {/* กราฟวงกลม (ใหญ่และหนาขึ้นเฉพาะบน Desktop) */}
                                <div className="flex items-center justify-center my-auto shrink-0 py-2">
                                    {isLoading ? (
                                        <div className="w-36 h-36 md:w-60 md:h-60 rounded-full bg-gray-200 animate-pulse relative shrink-0 flex items-center justify-center shadow-sm">
                                            <div className="absolute inset-[18px] md:inset-[16px] bg-white rounded-full"></div>
                                        </div>
                                    ) : (
                                        <div className="w-36 h-36 md:w-60 md:h-60 rounded-full clay-pie relative shrink-0 shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:scale-105" style={{ background: dashboardData.pieGradientString }}>
                                            {/* ขยายความหนาของวงแหวนด้วยการลดขนาดขอบเขตวงกลมด้านในลง (md:inset-[16px]) */}
                                            <div className="absolute inset-[18px] md:inset-[20px] bg-white rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.08)] flex items-center justify-center flex-col z-10">
                                                <span className="font-['Fredoka_One'] text-2xl md:text-4xl text-[#1e1b4b] leading-none">{dashboardData.totalWasteWeight}</span>
                                                <span className="text-[10px] md:text-xs font-['Prompt'] font-medium text-[#64748b] mt-1">กิโลกรัม</span>
                                            </div>
                                            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.08)] pointer-events-none"></div>
                                        </div>
                                    )}
                                </div>

                                {/* รายการสัดส่วนขยะ (ถูกดันมาชิดขอบล่างด้วย justify-between ของการ์ดหลัก) */}
                                <div className="w-full grid grid-cols-2 gap-2 md:gap-2.5 font-['Prompt'] shrink-0">
                                    {isLoading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 md:p-2.5 animate-pulse bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-6"></div>
                                            </div>
                                        ))
                                    ) : (
                                        dashboardData.pieData.length > 0 ? (
                                            dashboardData.pieData.map((data, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-2 px-2.5 md:px-3 rounded-xl hover:bg-[#f8fafc] border border-[#f1f5f9] hover:border-[#e2e8f0] transition-all bg-[#fafafa]/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <span className={`w-2.5 h-2.5 md:w-3 md:h-3 ${data.colorClass} rounded-full shrink-0 shadow-inner`}></span>
                                                        <span className="text-[#475569] text-xs md:text-sm font-medium truncate">{data.label}</span>
                                                    </div>
                                                    <span className="font-['Fredoka_One'] text-xs md:text-sm text-[#1e1b4b] shrink-0 ml-1">{data.percent.toFixed(1)}%</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center text-[#94a3b8] text-xs py-4 bg-gray-50 rounded-xl border border-gray-100">
                                                ยังไม่มีข้อมูลสัดส่วนขยะ
                                            </div>
                                        )
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <svg viewBox="0 0 1440 100" className="w-full h-[60px] md:h-[100px] block scale-[1.02] -mt-[2px] bg-[#f0eeff] text-[#ecfdf5]" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,74.7C1248,64,1344,32,1392,16L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
            </svg>

            {/* SECTION 2: บิลรับซื้อขยะ */}
            <div className="w-full bg-[#ecfdf5] pt-10 pb-16 font-['Prompt']">
                <div className="max-w-7xl mx-auto px-6 md:px-8 fade-up" style={{ animationDelay: '0.2s' }}>

                    {/* หัวข้อ */}
                    <div className="flex flex-col items-center mb-8">
                        <span className="clay-pill bg-white text-[#047857] px-4 py-1.5 rounded-full font-semibold text-sm mb-3 shadow-[0_2px_8px_rgba(16,185,129,0.15)] border border-[#10b981]/10">อัปเดตล่าสุด</span>
                        <h2 className="font-['Fredoka_One'] text-3xl md:text-4xl text-[#1e1b4b] text-center tracking-wide">รายการรับซื้อ</h2>
                        <p className="text-[#64748b] text-xs md:text-sm font-medium mt-3 bg-white/60 px-4 py-1.5 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] border border-[#e2e8f0]">
                            (อัปเดตเมื่อ: {priceUpdatedAt
                                ? `${priceUpdatedAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })} เวลา ${priceUpdatedAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`
                                : 'ระบบเริ่มต้น'})
                        </p>
                    </div>

                    {/*  สำหรับมือถือ: ทำเป็นปุ่ม Tab สลับดูทีละบิล (แก้ปัญหายืดยาว) */}
                    <div className="flex md:hidden justify-center gap-2 mb-6">
                        <button
                            onClick={() => setActiveReceiptTab('PL')}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${activeReceiptTab === 'PL' ? 'bg-[#10b981] text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            พลาสติก
                        </button>
                        <button
                            onClick={() => setActiveReceiptTab('P')}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${activeReceiptTab === 'P' ? 'bg-[#10b981] text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            กระดาษ
                        </button>
                        <button
                            onClick={() => setActiveReceiptTab('ETC')}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${activeReceiptTab === 'ETC' ? 'bg-[#10b981] text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-200'}`}
                        >
                            เบ็ดเตล็ด
                        </button>
                    </div>

                    {/*  แสดงผลบนมือถือ: โชว์เฉพาะบิลที่กดเลือกจากแท็บ */}
                    <div className="flex md:hidden justify-center">
                        <div className="w-full max-w-sm">
                            {activeReceiptTab === 'PL' && (
                                <ReceiptBill category="PL" shopName="SchoolWaste" date="ล่าสุด" items={[
                                    { name: "พลาสติกรวม", price: pricing["พลาสติกรวม"]?.toFixed(2) || "0.00" },
                                    { name: "ขวดน้ำขุ่น", price: pricing["ขวดน้ำขุ่น"]?.toFixed(2) || "0.00" },
                                    { name: "ขวดน้ำใส", price: pricing["ขวดน้ำใส"]?.toFixed(2) || "0.00" },
                                    { name: "ขวดน้ำ PET สี", price: pricing["ขวดน้ำ PET สี"]?.toFixed(2) || "0.00" }
                                ]} />
                            )}
                            {activeReceiptTab === 'P' && (
                                <ReceiptBill category="P" shopName="SchoolWaste" date="ล่าสุด" items={[
                                    { name: "กระดาษขาวดำ", price: pricing["กระดาษขาวดำ"]?.toFixed(2) || "0.00" },
                                    { name: "กระดาษสีรวม", price: pricing["กระดาษสีรวม"]?.toFixed(2) || "0.00" },
                                    { name: "กระดาษลัง", price: pricing["กระดาษลัง"]?.toFixed(2) || "0.00" }
                                ]} />
                            )}
                            {activeReceiptTab === 'ETC' && (
                                <ReceiptBill category="ETC" shopName="SchoolWaste" date="ล่าสุด" items={[
                                    { name: "กระป๋องกาแฟ/นม", price: pricing["กระป๋องกาแฟ/นม"]?.toFixed(2) || "0.00" },
                                    { name: "เหล็กหนา", price: pricing["เหล็กหนา"]?.toFixed(2) || "0.00" },
                                    { name: "เหล็กบาง", price: pricing["เหล็กบาง"]?.toFixed(2) || "0.00" },
                                    { name: "สังกะสี", price: pricing["สังกะสี"]?.toFixed(2) || "0.00" }
                                ]} />
                            )}
                        </div>
                    </div>

                    {/*  แสดงผลบนคอมพิวเตอร์/Tablet: โชว์ 3 บิลเรียงกัน*/}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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

            <svg viewBox="0 0 1440 100" className="w-full h-[60px] md:h-[100px] block scale-[1.02] -mt-[2px] bg-[#ecfdf5] text-[#fff7ed]" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
            </svg>

            {/* ========================================================================= */}
            {/* SECTION 3: กราฟแท่งแนวตั้งแปลงร่างแบบ Inline (Morphing Vertical Bar Chart) */}
            {/* ========================================================================= */}
            <div className="w-full bg-[#fff7ed] pt-10 pb-24 font-['Prompt']">
                <div className="max-w-7xl mx-auto px-6 md:px-8 fade-up" style={{ animationDelay: '0.3s' }}>

                    {/* การ์ดบรรจุพื้นที่กราฟ */}
                    <div className="clay-card p-6 md:p-10 w-full bg-white shadow-xl shadow-amber-900/5 rounded-3xl">

                        {/* ส่วนหัวข้อ */}
                        <div className="flex flex-col items-center mb-8 text-center">
                            <span className="bg-[#fef3c7] text-[#b45309] text-xs font-bold px-4 py-1.5 rounded-full border border-[#fde68a] mb-2 shadow-sm">
                                {selectedCategoryKey ? 'แตะแท่งหลักเพื่อย้อนกลับ' : 'แตะแท่งกราฟเพื่อดูสัดส่วนย่อย'}
                            </span>
                            <h2 className="font-['Fredoka_One'] text-2xl md:text-3xl text-[#1e1b4b]">
                                {selectedCategoryKey ? `ขยะย่อยในหมวด: ${WASTE_CATEGORIES[selectedCategoryKey]?.label}` : 'สัดส่วนขยะรายหมวดหมู่'}
                            </h2>
                            <div className="w-20 h-[5px] bg-[#f59e0b] rounded-full mt-3 opacity-80"></div>
                        </div>

                        {(() => {
                            // จัดเตรียมข้อมูล 3 หมวดหมู่หลัก (พลาสติก, กระดาษ, อื่นๆ)
                            const categoryList = Object.entries(WASTE_CATEGORIES).map(([catKey, catVal]) => {
                                const subItems = dashboardData.detailedWaste.filter(item => catVal.items.includes(item.name));
                                const totalWeight = subItems.reduce((sum, item) => sum + item.value, 0);
                                const maxSubItemWeight = subItems.length > 0 ? Math.max(...subItems.map(i => i.value), 1) : 1;

                                return {
                                    key: catKey,
                                    label: catVal.label,
                                    color: catVal.color,
                                    totalWeight,
                                    items: subItems,
                                    maxSubItemWeight
                                };
                            });

                            const maxCategoryTotal = Math.max(...categoryList.map(c => c.totalWeight), 1);
                            const activeCategory = categoryList.find(c => c.key === selectedCategoryKey);

                            return (
                                <div className="w-full">
                                    {/* พื้นที่แสดงกราฟแท่งแนวตั้ง (ฐานวางระนาบเดียวกัน) */}
                                    <div className="w-full h-[320px] md:h-[380px] flex items-end justify-center gap-3 sm:gap-6 md:gap-8 pb-8 pt-12 border-b-2 border-slate-100 overflow-x-auto overflow-y-visible px-4">

                                        {/* วนลูป 3 หมวดหลัก */}
                                        {categoryList.map((cat) => {
                                            const isSelected = selectedCategoryKey === cat.key;
                                            const isHidden = selectedCategoryKey !== null && !isSelected;

                                            // คำนวณความสูงแท่งหลัก (ความสูงขั้นต่ำ 12% เผื่อกรณียังไม่มีข้อมูล)
                                            const barHeightPercent = cat.totalWeight > 0
                                                ? Math.max((cat.totalWeight / maxCategoryTotal) * 80, 15)
                                                : 12;

                                            return (
                                                <div
                                                    key={cat.key}
                                                    onClick={() => setSelectedCategoryKey(isSelected ? null : cat.key)}
                                                    className={`flex flex-col items-center justify-end h-full transition-all duration-500 ease-in-out cursor-pointer select-none ${isHidden
                                                        ? 'w-0 opacity-0 pointer-events-none -mx-2 scale-75'
                                                        : isSelected
                                                            ? 'w-24 sm:w-28 md:w-32 opacity-100 shrink-0'
                                                            : 'w-24 sm:w-28 md:w-32 opacity-100 hover:scale-105'
                                                        }`}
                                                >
                                                    {/* ตัวเลขบนหัวแท่งกราฟหลัก (แสดงตลอดเวลา) */}
                                                    <div className="flex flex-col items-center mb-2 transition-transform duration-300">
                                                        <span className="font-['Fredoka_One'] text-sm sm:text-base md:text-lg text-[#1e1b4b] leading-tight">
                                                            {cat.totalWeight.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                                        </span>
                                                        <span className="text-[10px] sm:text-xs text-[#64748b] font-bold">กก.</span>
                                                    </div>

                                                    {/* ตัวแท่งกราฟหลัก */}
                                                    <div
                                                        className={`w-full ${cat.color} rounded-2xl shadow-lg relative flex items-center justify-center transition-all duration-700 ${isSelected ? 'ring-4 ring-purple-400 ring-offset-2 scale-105' : 'hover:brightness-105'
                                                            }`}
                                                        style={{ height: `${barHeightPercent}%` }}
                                                    >
                                                        {isSelected && (
                                                            <span className="absolute -top-3 bg-[#1e1b4b] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
                                                                ย้อนกลับ ✕
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* ป้ายชื่อหมวดหมู่อยู่ใต้ฐาน */}
                                                    <span className="font-bold text-xs sm:text-sm text-[#1e1b4b] mt-3 whitespace-nowrap">
                                                        {cat.label}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* เส้นแบ่งคั่นระหว่างแท่งหลักกับแท่งย่อย */}
                                        {selectedCategoryKey && (
                                            <div className="h-4/5 w-[2px] bg-dashed border-r-2 border-dashed border-slate-200 mx-2 shrink-0 animate-pulse"></div>
                                        )}

                                        {/* แท่งขยะย่อยที่เฟดและสไลด์งอกออกมาทางขวา */}
                                        {activeCategory && activeCategory.items.map((item, idx) => {
                                            // คำนวณความสูงแท่งย่อยเทียบกับชิ้นที่มากที่สุดในหมวด
                                            const subHeightPercent = item.value > 0
                                                ? Math.max((item.value / activeCategory.maxSubItemWeight) * 75, 12)
                                                : 10;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="group relative flex flex-col items-center justify-end h-full w-12 sm:w-16 md:w-20 shrink-0 transition-all duration-500 animate-fadeIn"
                                                    style={{ animationDelay: `${idx * 60}ms` }}
                                                >
                                                    {/* 💬 TOOLTIP: ซ่อนไว้ แสดงตัวเลขและชื่อเมื่อ Hover เพื่อกันความยืดยาว */}
                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-center text-[10px] sm:text-xs font-bold py-1.5 px-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 shadow-xl border border-white/10">
                                                        <p className="text-slate-200">{item.name}</p>
                                                        <p className="text-[#38bdf8] font-['Fredoka_One'] text-xs mt-0.5">
                                                            {item.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} กก.
                                                        </p>
                                                    </div>

                                                    {/* ตัวแท่งกราฟย่อย */}
                                                    <div
                                                        className={`w-full ${activeCategory.color} opacity-80 group-hover:opacity-100 rounded-xl shadow-md transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg`}
                                                        style={{ height: `${subHeightPercent}%` }}
                                                    ></div>

                                                    {/* ชื่อย่อหรือชื่อเต็มใต้แท่ง */}
                                                    <span className="text-[10px] sm:text-xs font-medium text-[#64748b] group-hover:text-[#1e1b4b] mt-3 truncate max-w-full text-center px-0.5">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                    </div>

                                    {/* ข้อความแนะนำด้านล่าง */}
                                    <div className="mt-4 text-center">
                                        <p className="text-[11px] text-[#94a3b8] font-medium">
                                            {selectedCategoryKey
                                                ? '💡 นำเมาส์ไปชี้ที่แท่งขยะย่อยเพื่อดูน้ำหนักที่รับฝากจริง'
                                                : '💡 คลิกที่แท่งหมวดหมู่เพื่อดูสถิติแยกตามประเภทขยะ'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                </div>
            </div>

        </div>
    )
}