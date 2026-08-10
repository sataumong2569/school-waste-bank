import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    PlusIcon, QrCodeIcon, TrashIcon,
    UsersIcon, BanknotesIcon, GlobeAsiaAustraliaIcon,
    CalendarDaysIcon, ChartBarIcon, ArrowTrendingUpIcon, StarIcon
} from '@heroicons/react/24/outline'
import ReceiptBill from '../components/ReceiptBill'

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const membersList = [
        { id: 1, name: 'ด.ช. สมชาย รักดี', grade: 'ป.4/1', points: 1250 },
        { id: 2, name: 'ด.ญ. สมหญิง ใจบุญ', grade: 'ป.5/2', points: 980 },
        { id: 3, name: 'ด.ช. มานะ ขยันเรียน', grade: 'ป.6/1', points: 840 },
        { id: 4, name: 'ด.ญ. ปิติ ยินดี', grade: 'ป.3/3', points: 720 },
        { id: 5, name: 'ด.ช. ชูใจ ไชโย', grade: 'ป.4/2', points: 650 },
        { id: 6, name: 'ด.ญ. วีณา นารี', grade: 'ป.5/1', points: 500 },
    ];

    const stats = [
        { title: 'ประเภทขยะมากที่สุด', value: 'พลาสติก', unit: '', icon: StarIcon, clayClass: 'clay-card-pink' },
        { title: 'ขยะรวมทั้งหมด', value: '450', unit: 'กก.', icon: TrashIcon, clayClass: 'clay-card-amber' },
        { title: 'ยอดเงินออมรวม', value: '400', unit: 'บาท', icon: BanknotesIcon, clayClass: 'clay-card-mint' },
        { title: 'จำนวนสมาชิก', value: '170', unit: 'คน', icon: UsersIcon, clayClass: 'clay-card-sky' },
        { title: 'ลดการปล่อยคาร์บอน', value: '155.53', unit: 'kgCO₂e', icon: GlobeAsiaAustraliaIcon, clayClass: 'clay-card-purple' },
    ];

    const detailedWaste = [
        { name: 'พลาสติกรวม', value: 850, color: 'bg-[#f472b6]' },
        { name: 'ขวดน้ำขุ่น', value: 420, color: 'bg-[#f59e0b]' },
        { name: 'ขวดน้ำใส', value: 380, color: 'bg-[#34d399]' },
        { name: 'ขวดน้ำ PET สี', value: 310, color: 'bg-[#7c3aed]' },
        { name: 'LDPE', value: 290, color: 'bg-[#38bdf8]' },
        { name: 'กระดาษขาวดำ', value: 650, color: 'bg-[#f472b6]' },
        { name: 'กระดาษลัง', value: 890, color: 'bg-[#34d399]' },
        { name: 'กระป๋องกาแฟ/นม', value: 220, color: 'bg-[#7c3aed]' },
        { name: 'เหล็กหนา', value: 150, color: 'bg-[#38bdf8]' },
        { name: 'สังกะสี', value: 90, color: 'bg-[#f59e0b]' },
    ];

    const maxWasteValue = Math.max(...detailedWaste.map(item => item.value));

    return (
        <div className="w-full overflow-hidden">

            {/* ========================================= */}
            {/* SECTION 1: พื้นหลังสีม่วงอ่อน กางเต็ม w-full */}
            {/* ========================================= */}
            <div className="w-full bg-[#f0eeff] pt-8 md:pt-16 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-8">

                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between min-h-[50vh] mb-20 fade-up">
                        <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
                            <div className="inline-flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,1),_0_4px_10px_rgba(124,58,237,0.1)] backdrop-blur-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
                                <span className="font-['Nunito'] font-black text-[#7c3aed] text-sm md:text-base tracking-wider uppercase pr-1">New Platform</span>
                                <span className="font-['Nunito'] font-bold text-[#1e1b4b] text-sm md:text-base border-l-2 border-[#1e1b4b]/10 pl-3">ระบบธนาคารขยะยุคใหม่</span>
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

                        <div className="w-full md:w-1/2 flex justify-center mt-16 md:mt-0 relative perspective-[1000px]">
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
                                <div key={index} className={`${stat.clayClass} p-5 md:p-6 flex flex-col fade-up hover-bouncy cursor-pointer`} style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}>
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
                        <div className="lg:col-span-2 fade-up" style={{ animationDelay: '0.6s' }}>
                            <div className="clay-card p-6 md:p-8 relative h-full flex flex-col bg-white">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-7 bg-[#f59e0b] rounded-full"></div>
                                    <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">สมาชิกยอดเยี่ยม (Top 6)</h2>
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
                                        membersList.map((member, index) => (
                                            <div key={member.id} className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:bg-[#f0eeff] transition-colors cursor-default">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm md:text-base ${index === 0 ? 'bg-[#f59e0b] text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)]' : index === 1 ? 'bg-[#94a3b8] text-white' : index === 2 ? 'bg-[#fcd34d] text-[#92400e]' : 'bg-white shadow-sm text-[#6d6a8a]'}`}>
                                                        {index === 0 ? <span className="text-[12px] tracking-tighter">1st</span> : index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#1e1b4b] font-['Nunito'] text-sm md:text-base">{member.name}</p>
                                                        <p className="text-xs md:text-sm text-[#6d6a8a] font-semibold">ชั้น {member.grade}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="font-['Fredoka_One'] text-[#7c3aed] text-xl">{member.points}</p>
                                                    <span className="text-[10px] md:text-xs font-bold text-[#6d6a8a] bg-white px-2 py-0.5 rounded-full shadow-sm mt-1">แต้ม</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 fade-up" style={{ animationDelay: '0.7s' }}>
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
                                    <div className="w-56 h-56 md:w-64 md:h-64 rounded-full clay-pie mb-6 relative flex-shrink-0" style={{ background: `conic-gradient(#db2777 0% 30%, #f59e0b 30% 55%, #10b981 55% 75%, #7c3aed 75% 85%, #0ea5e9 85% 95%, #94a3b8 95% 100%)` }}>
                                        <div className="absolute inset-[26px] md:inset-[30px] bg-white rounded-full shadow-[inset_0_6px_12px_rgba(0,0,0,0.1)]"></div>
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
                                        <>
                                            <div className="flex justify-between items-center px-3 py-1.5 rounded-xl hover:bg-[#f0eeff] transition-colors"><div className="flex items-center gap-3"><span className="w-4 h-4 bg-[#db2777] rounded-full shadow-inner"></span>พลาสติก</div><span className="font-['Fredoka_One'] text-lg">30%</span></div>
                                            <div className="h-[2px] bg-[#f0eeff] mx-2 rounded-full"></div>
                                            <div className="flex justify-between items-center px-3 py-1.5 rounded-xl hover:bg-[#f0eeff] transition-colors"><div className="flex items-center gap-3"><span className="w-4 h-4 bg-[#f59e0b] rounded-full shadow-inner"></span>กระดาษ</div><span className="font-['Fredoka_One'] text-lg">25%</span></div>
                                            <div className="h-[2px] bg-[#f0eeff] mx-2 rounded-full"></div>
                                            <div className="flex justify-between items-center px-3 py-1.5 rounded-xl hover:bg-[#f0eeff] transition-colors"><div className="flex items-center gap-3"><span className="w-4 h-4 bg-[#10b981] rounded-full shadow-inner"></span>แก้ว</div><span className="font-['Fredoka_One'] text-lg">20%</span></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌊 SVG Wave Divider 1 */}
            <svg viewBox="0 0 1440 100" className="w-full h-[60px] md:h-[100px] block bg-[#f0eeff] text-[#ecfdf5] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,74.7C1248,64,1344,32,1392,16L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
            </svg>

            {/* ========================================= */}
            {/* SECTION 2: พื้นหลังสีมิ้นต์อ่อน กางเต็ม w-full */}
            {/* ========================================= */}
            <div className="w-full bg-[#ecfdf5] pt-10 pb-16">
                <div className="max-w-7xl mx-auto px-6 md:px-8 fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex flex-col items-center mb-10">
                        <span className="clay-pill bg-white text-[#047857] px-4 py-1.5 rounded-full font-bold text-sm mb-3 shadow-[0_2px_8px_rgba(16,185,129,0.15)] border border-[#10b981]/10">อัปเดตล่าสุด</span>
                        <h2 className="font-black text-3xl md:text-4xl text-[#1e1b4b] text-center tracking-wide">รายการรับซื้อ</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <ReceiptBill category="PL" shopName="SchoolWaste" date="23/07/26" items={[{ name: "พลาสติกรวม", price: "5.00" }, { name: "ขวดน้ำขุ่น", price: "10.00" }, { name: "ขวดน้ำใส", price: "8.50" }, { name: "ขวดน้ำ PET สี", price: "4.00" }]} />
                        <ReceiptBill category="P" shopName="SchoolWaste" date="23/07/26" items={[{ name: "กระดาษขาวดำ", price: "5.00" }, { name: "กระดาษสีรวม", price: "1.00" }, { name: "กระดาษลัง", price: "5.50" }]} />
                        <ReceiptBill category="ETC" shopName="SchoolWaste" date="23/07/26" items={[{ name: "กระป๋องกาแฟ/นม", price: "5.00" }, { name: "เหล็กหนา", price: "1.00" }, { name: "เหล็กบาง", price: "5.50" }, { name: "สังกะสี", price: "5.50" }]} />
                    </div>
                </div>
            </div>

            {/* 🌊 SVG Wave Divider 2 */}
            <svg viewBox="0 0 1440 100" className="w-full h-[60px] md:h-[100px] block bg-[#ecfdf5] text-[#fff7ed] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,64L60,74.7C120,85,240,107,360,101.3C480,96,600,64,720,58.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
            </svg>

            {/* ========================================= */}
            {/* SECTION 3: พื้นหลังสีพีชอ่อน กางเต็ม w-full */}
            {/* ========================================= */}
            <div className="w-full bg-[#fff7ed] pt-10 pb-24">
                <div className="max-w-7xl mx-auto px-6 md:px-8 fade-up" style={{ animationDelay: '0.6s' }}>
                    <div className="clay-card p-8 md:p-12 w-full bg-white shadow-xl shadow-purple-900/5">
                        <div className="flex flex-col items-center mb-10">
                            <h2 className="font-['Fredoka_One'] text-2xl md:text-3xl text-[#1e1b4b]">รายละเอียดขยะทุกประเภท</h2>
                            <div className="w-24 h-[6px] bg-[#f59e0b] rounded-full mt-4 opacity-80"></div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {detailedWaste.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 md:gap-5 hover:bg-[#f8fafc] p-3 rounded-2xl transition-colors cursor-default">
                                    <div className="w-1/3 md:w-1/4 text-right font-['Nunito'] font-bold text-sm md:text-base text-[#1e1b4b] truncate">
                                        {item.name}
                                    </div>
                                    <div className="flex-1 h-6 md:h-8 bg-[#f1f5f9] rounded-full overflow-hidden shadow-[inset_0_3px_8px_rgba(0,0,0,0.06)]">
                                        <div
                                            className={`h-full ${item.color} clay-bar transition-all duration-[2s] ease-out`}
                                            style={{ width: '0%', animation: `fillBar 2s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards` }}
                                        ></div>
                                    </div>
                                    <style>{`@keyframes fillBar { to { width: ${(item.value / maxWasteValue) * 100}%; } }`}</style>
                                    <div className="w-16 md:w-24 font-['Fredoka_One'] text-[#1e1b4b] text-right text-base md:text-lg">
                                        {item.value} <span className="text-xs md:text-sm font-['Nunito'] text-[#6d6a8a]">กก.</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}