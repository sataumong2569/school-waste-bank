import { useState } from 'react';
import {
    CurrencyDollarIcon, CalendarDaysIcon, GiftIcon, PlusIcon, TrashIcon, CheckCircleIcon,
    TrophyIcon,
    StarIcon,
    TicketIcon,
    SparklesIcon,
    HeartIcon,
    FireIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import { WASTE_CATEGORIES, DEFAULT_PRICES } from '../utils/wasteConfig';
import { useApp } from '../AppContext';

export default function SystemConfig() {
    const { pricing, updatePricing, duration, updateDuration, rewards, updateRewards } = useApp();

    const [pricingData, setPricingData] = useState(pricing);
    const [durationData, setDurationData] = useState(duration);

    const handleSavePricing = (e) => {
        e.preventDefault();
        updatePricing(pricingData);
    };

    const handleSaveDuration = (e) => {
        e.preventDefault();
        updateDuration(durationData);
    };

    const [isAddingReward, setIsAddingReward] = useState(false);
    const [newRewardForm, setNewRewardForm] = useState({ name: '', points: '', stock: '' });
    const [rewardErrors, setRewardErrors] = useState({ name: false, points: false, stock: false });

    const handleStartAddReward = () => {
        setIsAddingReward(true);
        setNewRewardForm({ name: '', points: '', stock: '' });
        setRewardErrors({ name: false, points: false, stock: false });
    };

    const handleConfirmAddReward = () => {
        const errors = {
            name: !newRewardForm.name.trim(),
            points: !newRewardForm.points || newRewardForm.points <= 0,
            stock: !newRewardForm.stock || newRewardForm.stock < 0
        };

        setRewardErrors(errors);

        if (errors.name || errors.points || errors.stock) {
            return;
        }

        // บันทึกข้อมูลลงรายชื่อรางวัล
        updateRewards([
            ...rewards,
            {
                id: Date.now(),
                name: newRewardForm.name,
                points: parseInt(newRewardForm.points),
                stock: parseInt(newRewardForm.stock)
            }
        ]);

        // เคลียร์ค่าและปิดโหมดเพิ่ม
        setIsAddingReward(false);
        setNewRewardForm({ name: '', points: '', stock: '' });
    };

    const handleCancelAddReward = () => {
        setIsAddingReward(false);
        setNewRewardForm({ name: '', points: '', stock: '' });
        setRewardErrors({ name: false, points: false, stock: false });
    };

    const handleDeleteReward = (idToRemove) => {
        if (window.confirm("คุณต้องการลบของรางวัลนี้ใช่หรือไม่?")) {
            updateRewards(rewards.filter(r => r.id !== idToRemove));
        }
    };

    const REWARD_ICONS = [
        { name: 'Gift', icon: GiftIcon, label: 'ของขวัญ' },
        { name: 'Trophy', icon: TrophyIcon, label: 'ถ้วยรางวัล' },
        { name: 'Star', icon: StarIcon, label: 'ดาว' },
        { name: 'Ticket', icon: TicketIcon, label: 'ตั๋ว/บัตรกำนัล' },
        { name: 'Sparkles', icon: SparklesIcon, label: 'พิเศษ' },
        { name: 'Heart', icon: HeartIcon, label: 'ความสุข' },
        { name: 'Fire', icon: FireIcon, label: 'ยอดฮิต' },
        { name: 'Bookmark', icon: BookmarkIcon, label: 'เครื่องเขียน' },
    ];

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen font-['Nunito'] pt-6 pb-24">
            <div className="max-w-6xl mx-auto px-4 md:px-8 fade-up">

                {/* หัวข้อหน้าจอ */}
                <div className="mb-6 bg-white border border-[#e2e8f0] px-6 py-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="font-['Fredoka_One'] text-2xl md:text-3xl text-[#1e1b4b] tracking-wide">
                                System Configuration
                            </h1>
                            <span className="bg-[#eff6ff] border border-[#dbeafe] text-[#3b82f6] text-[10px] md:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Settings
                            </span>
                        </div>
                        <p className="font-['Nunito'] text-xs font-bold text-[#64748b]">
                            ตั้งค่าระบบส่วนกลาง ราคากลาง ระยะเวลากิจกรรม และร้านค้าของรางวัล
                        </p>
                    </div>
                </div>

                {/* การแบ่ง Layout แบบ 40:60 */}
                <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8">

                    {/* ฝั่งซ้าย (40%): ระยะเวลา & ของรางวัล */}
                    <div className="flex flex-col gap-6">

                        {/* 1. กล่องตั้งค่าระยะเวลา */}
                        <form onSubmit={handleSaveDuration} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
                            {/* Header แถบสีส้ม */}
                            <div className="flex items-center gap-3 bg-[#f59e0b] text-white px-4 py-3 rounded-xl shadow-sm">
                                <CalendarDaysIcon className="w-5 h-5 stroke-2 text-white shrink-0" />
                                <div>
                                    <h2 className="font-bold text-white text-base">ระยะเวลารับฝาก</h2>
                                    <p className="text-[11px] text-amber-100 font-semibold">กำหนดวันที่เป้าหมายในแต่ละเดือน</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="flex flex-col gap-1">
                                    <label className="font-bold text-xs text-[#64748b]">รอบที่ 1 (วันที่)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={durationData.round1}
                                        onChange={(e) => setDurationData({ ...durationData, round1: e.target.value })}
                                        className="bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2.5 rounded-xl text-sm font-bold text-[#0f172a] text-center outline-none focus:border-[#f59e0b] focus:bg-white transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-bold text-xs text-[#64748b]">รอบที่ 2 (วันที่)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={durationData.round2}
                                        onChange={(e) => setDurationData({ ...durationData, round2: e.target.value })}
                                        className="bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2.5 rounded-xl text-sm font-bold text-[#0f172a] text-center outline-none focus:border-[#f59e0b] focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-[#fffbeb] hover:bg-[#f59e0b] text-[#d97706] hover:text-white border border-[#fde68a] hover:border-[#f59e0b] font-bold text-sm py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98]"
                                >
                                    <CheckCircleIcon className="w-5 h-5 stroke-2" /> บันทึกระยะเวลา
                                </button>
                            </div>
                        </form>

                        {/* 2. กล่องของรางวัล */}
                        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col flex-1">
                            {/* Header แถบสีม่วง */}
                            <div className="flex items-center justify-between bg-[#7c3aed] text-white px-4 py-3 rounded-xl shadow-sm mb-4">
                                <div className="flex items-center gap-3">
                                    <GiftIcon className="w-5 h-5 stroke-2 text-white shrink-0" />
                                    <div>
                                        <h2 className="font-bold text-white text-base">แลกรางวัล</h2>
                                        <p className="text-[11px] text-purple-100 font-semibold">จัดการของรางวัลและแต้มคาร์บอน</p>
                                    </div>
                                </div>
                                {!isAddingReward && (
                                    <button
                                        type="button"
                                        onClick={handleStartAddReward}
                                        className="bg-white/25 hover:bg-white/35 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer active:scale-95"
                                    >
                                        <PlusIcon className="w-4 h-4 stroke-2" /> เพิ่ม
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 flex-1 overflow-y-auto hide-scrollbar">
                                {/* แสดงรายการของรางวัลที่มีอยู่ */}
                                {rewards.map(item => {
                                    // 🟢 ดึงไอคอนมาแสดง ถ้าไม่มีให้ใช้รูปกล่องของขวัญเป็นค่าเริ่มต้น
                                    const SelectedIconData = REWARD_ICONS.find(icon => icon.name === item.iconName);
                                    const DisplayIcon = SelectedIconData ? SelectedIconData.icon : GiftIcon;

                                    return (
                                        <div key={item.id} className="flex justify-between items-center bg-[#f8fafc]/60 border border-[#e2e8f0] p-3.5 rounded-xl hover:border-[#c4b5fd] transition-all group">
                                            <div className="flex items-center gap-3">
                                                {/* 🟢 โชว์รูปไอคอนที่นี่ */}
                                                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center shrink-0">
                                                    <DisplayIcon className="w-5 h-5 stroke-2" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#0f172a] text-sm">{item.name}</span>
                                                    <span className="text-[10px] text-[#64748b] font-semibold">ในสต็อก: {item.stock} ชิ้น</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="bg-white text-[#7c3aed] font-bold px-3 py-1 rounded-lg text-sm border border-[#e2e8f0] shadow-sm">
                                                    {item.points} pts
                                                </span>
                                                <button type="button" onClick={() => handleDeleteReward(item.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer active:scale-95">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* 🟢 กล่องฟอร์มเพิ่มของรางวัลแบบต่อท้าย ( Inline Form ) */}
                                {isAddingReward && (
                                    <div className="bg-[#f5f3ff]/50 border-2 border-dashed border-[#7c3aed]/40 p-4 rounded-xl flex flex-col gap-3 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#7c3aed]">✨ เพิ่มของรางวัลใหม่</span>
                                            <span className="text-[10px] text-red-500 font-semibold">* กรุณากรอกข้อมูลให้ครบถ้วน</span>
                                        </div>

                                        {/* ช่องกรอกชื่อของรางวัล */}
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="text"
                                                placeholder="ชื่อของรางวัล (เช่น สมุดรีไซเคิล)"
                                                value={newRewardForm.name}
                                                onChange={(e) => {
                                                    setNewRewardForm({ ...newRewardForm, name: e.target.value });
                                                    if (e.target.value.trim()) setRewardErrors({ ...rewardErrors, name: false });
                                                }}
                                                className={`w-full bg-white border px-3.5 py-2 rounded-xl text-xs font-bold text-[#0f172a] outline-none transition-colors ${rewardErrors.name ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0] focus:border-[#7c3aed]'}`}
                                            />
                                            {rewardErrors.name && <span className="text-[10px] text-red-500 font-bold ml-1">กรุณากรอกชื่อของรางวัล</span>}
                                        </div>

                                        {/* ช่องกรอกแต้ม และ สต็อก */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col gap-1">
                                                <div className={`flex items-center bg-white border rounded-xl px-3 py-1.5 transition-colors ${rewardErrors.points ? 'border-red-500' : 'border-[#e2e8f0] focus-within:border-[#7c3aed]'}`}>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        placeholder="แต้ม (pts)"
                                                        value={newRewardForm.points}
                                                        onChange={(e) => {
                                                            setNewRewardForm({ ...newRewardForm, points: e.target.value });
                                                            if (e.target.value) setRewardErrors({ ...rewardErrors, points: false });
                                                        }}
                                                        className="w-full text-xs font-bold text-[#7c3aed] bg-transparent outline-none"
                                                    />
                                                    <span className="text-[10px] text-gray-400 font-bold ml-1">pts</span>
                                                </div>
                                                {rewardErrors.points && <span className="text-[10px] text-red-500 font-bold ml-1">กรอกจำนวนแต้ม</span>}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <div className={`flex items-center bg-white border rounded-xl px-3 py-1.5 transition-colors ${rewardErrors.stock ? 'border-red-500' : 'border-[#e2e8f0] focus-within:border-[#7c3aed]'}`}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="สต็อก (ชิ้น)"
                                                        value={newRewardForm.stock}
                                                        onChange={(e) => {
                                                            setNewRewardForm({ ...newRewardForm, stock: e.target.value });
                                                            if (e.target.value !== '') setRewardErrors({ ...rewardErrors, stock: false });
                                                        }}
                                                        className="w-full text-xs font-bold text-[#0f172a] bg-transparent outline-none"
                                                    />
                                                    <span className="text-[10px] text-gray-400 font-bold ml-1">ชิ้น</span>
                                                </div>
                                                {rewardErrors.stock && <span className="text-[10px] text-red-500 font-bold ml-1">กรอกจำนวนสต็อก</span>}
                                            </div>
                                        </div>

                                        {/* 🟢 ส่วนเลือกไอคอน (Icon Picker) */}
                                        <div className="flex flex-col gap-1.5 mt-1 border-t border-purple-100 pt-3">
                                            <label className="text-[10px] font-bold text-[#7c3aed]">เลือกไอคอนของรางวัล</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {REWARD_ICONS.map((item) => {
                                                    const IconComponent = item.icon;
                                                    // ตรวจสอบว่าไอคอนนี้ถูกเลือกอยู่หรือไม่ (ถ้ายังไม่เลือกอะไร ให้ Gift เป็นค่าเริ่มต้น)
                                                    const isSelected = (newRewardForm.iconName || 'Gift') === item.name;

                                                    return (
                                                        <button
                                                            key={item.name}
                                                            type="button"
                                                            onClick={() => setNewRewardForm({ ...newRewardForm, iconName: item.name })}
                                                            className={`py-2 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${isSelected
                                                                    ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-md scale-[1.02]'
                                                                    : 'bg-white text-[#94a3b8] border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#64748b]'
                                                                }`}
                                                            title={item.label}
                                                        >
                                                            <IconComponent className="w-5 h-5 stroke-2" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* ปุ่มยืนยัน และ ยกเลิก */}
                                        <div className="flex items-center justify-end gap-2 pt-2 mt-1">
                                            <button
                                                type="button"
                                                onClick={handleCancelAddReward}
                                                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold transition-colors cursor-pointer active:scale-95"
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleConfirmAddReward}
                                                className="px-4 py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                                            >
                                                ยืนยันเพิ่ม
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {rewards.length === 0 && !isAddingReward && (
                                    <div className="text-center text-[#94a3b8] text-xs font-bold py-6">ยังไม่มีของรางวัลในระบบ</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ฝั่งขวา (60%): ราคากลางขยะ */}
                    <form onSubmit={handleSavePricing} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col">
                        {/* Header แถบสีเขียว (แยกสีให้ต่างจากกล่องระยะเวลา) */}
                        <div className="flex items-center gap-3 bg-[#10b981] text-white px-4 py-3 rounded-xl shadow-sm mb-4">
                            <CurrencyDollarIcon className="w-5 h-5 stroke-2 text-white shrink-0" />
                            <div>
                                <h2 className="font-bold text-white text-base">ราคารับซื้อขยะ (Waste Pricing)</h2>
                                <p className="text-[11px] text-emerald-100 font-semibold">อัปเดตราคาล่าสุด ส่งผลต่อหน้า Home ทันที</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1 overflow-y-auto hide-scrollbar pr-1">
                            {Object.entries(WASTE_CATEGORIES).map(([catKey, cat]) => (
                                <div key={catKey} className="bg-[#f8fafc]/70 p-4 rounded-2xl border border-[#e2e8f0]/80 flex flex-col gap-3">
                                    <div className="flex items-center gap-2.5 px-1">
                                        <span className={`w-3.5 h-3.5 rounded-full shadow-sm ${cat.color}`}></span>
                                        <h3 className="font-bold text-[#1e1b4b] text-sm tracking-wide">{cat.label}</h3>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {cat.items.map(item => (
                                            <div key={item} className="flex justify-between items-center bg-white px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#cbd5e1] transition-all">
                                                <span className="font-bold text-[#475569] text-xs truncate w-[45%]" title={item}>{item}</span>

                                                <div className="flex items-center gap-1 w-[55%] justify-end">
                                                    <div className="relative flex items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-2.5 py-1 focus-within:border-[#10b981] focus-within:bg-white transition-all">
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            required
                                                            value={pricingData[item] ?? 0}
                                                            onChange={(e) => setPricingData({ ...pricingData, [item]: parseFloat(e.target.value) || 0 })}
                                                            className="w-12 font-bold text-right text-[#059669] text-sm bg-transparent outline-none"
                                                        />
                                                        <span className="text-[10px] font-bold text-[#94a3b8] ml-1">฿/กก.</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end border-t border-[#f1f5f9] pt-4 mt-auto">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[#10b981] text-white hover:bg-[#059669] font-bold text-sm py-3 px-8 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                            >
                                <CheckCircleIcon className="w-5 h-5 stroke-2" /> บันทึกราคากลางใหม่
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}