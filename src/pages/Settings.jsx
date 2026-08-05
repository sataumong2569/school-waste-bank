import { useState } from 'react';
import {
    MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, XMarkIcon,
    UserIcon, UsersIcon, BanknotesIcon, GlobeAsiaAustraliaIcon,
    ArrowDownTrayIcon, Cog8ToothIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
    // States สำหรับจัดการ Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // ข้อมูลสมาชิก Mock-up
    const mockMembers = [
        { id: '1', fullName: 'ด.ช. สมชาย รักดี', nickname: 'น้องเอ', grade: 'ป.4/1', balance: 1250, carbonPoints: 45.10, color: 'bg-[#f472b6]' },
        { id: '2', fullName: 'ด.ญ. สมหญิง ใจบุญ', nickname: 'น้องบี', grade: 'ป.5/2', balance: 980, carbonPoints: 38.50, color: 'bg-[#f59e0b]' },
        { id: '3', fullName: 'ด.ช. มานะ ขยันเรียน', nickname: 'น้องซี', grade: 'ป.6/1', balance: 840, carbonPoints: 30.20, color: 'bg-[#34d399]' },
        { id: '4', fullName: 'ด.ญ. ปิติ ยินดี', nickname: 'น้องดี', grade: 'ป.3/3', balance: 720, carbonPoints: 22.40, color: 'bg-[#7c3aed]' },
        { id: '5', fullName: 'นาย ประหยัด อดออม', nickname: 'น้องอี', grade: 'ม.1/1', balance: 2100, carbonPoints: 85.00, color: 'bg-[#38bdf8]' },
    ];

    const filteredMembers = mockMembers.filter(member =>
        member.fullName.includes(searchTerm) || member.grade.includes(searchTerm)
    );

    const openModal = (mode, memberData = null) => {
        setModalMode(mode);
        if (mode === 'edit' && memberData) {
            setFormData(memberData);
        } else {
            setFormData({ fullName: '', nickname: '', grade: '', balance: '', carbonPoints: '' });
        }
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log(`บันทึกข้อมูลโหมด ${modalMode}:`, formData);
        closeModal();
    };

    return (
        <div className="w-full bg-[#fafafa] min-h-screen pb-20 pt-8 font-['Nunito']">
            <div className="max-w-6xl mx-auto px-4 md:px-8 fade-up">
                {/* =================================================== */}
                {/* 1. ส่วนบน: 2 กล่อง (อ้างอิงสไตล์จากภาพ Per-Style Spec Layers / How to Use) */}
                {/* =================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* กล่องซ้าย: ข้อมูลภาพรวม (Overview Layers) */}
                    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                        <h2 className="font-bold text-[#0f172a] text-lg mb-1">System Overview Layers</h2>
                        <p className="text-[#64748b] text-xs mb-6 font-semibold">Everything you need to monitor production-ready stats</p>

                        <div className="flex flex-col gap-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center flex-shrink-0">
                                    <UsersIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-sm mb-0.5">Total Members</h3>
                                    <p className="text-xs text-[#64748b] font-semibold">สมาชิกทั้งหมดในระบบจำนวน 170 คน</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center flex-shrink-0">
                                    <BanknotesIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-sm mb-0.5">Total Balance</h3>
                                    <p className="text-xs text-[#64748b] font-semibold">ยอดเงินฝากหมุนเวียนรวม 14,500 บาท</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#10b981] flex items-center justify-center flex-shrink-0">
                                    <GlobeAsiaAustraliaIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-sm mb-0.5">Carbon Reduction</h3>
                                    <p className="text-xs text-[#64748b] font-semibold">ลดการปล่อยก๊าซคาร์บอน 155.53 kgCO₂e</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* กล่องขวา: เมนูจัดการด่วน (Quick Actions / How to Use) */}
                    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col">
                        <h2 className="font-bold text-[#0f172a] text-lg mb-1">Quick Actions</h2>
                        <p className="text-[#64748b] text-xs mb-6 font-semibold">Three workflows — pick what fits your task</p>

                        <div className="flex flex-col gap-3 flex-1 justify-between">
                            {/* ปุ่ม 01: เพิ่มสมาชิก (กดแล้วเปิด Modal ได้เลย) */}
                            <div onClick={() => openModal('add')} className="border border-[#e2e8f0] rounded-xl p-4 flex gap-4 cursor-pointer hover:border-[#3b82f6] hover:shadow-sm transition-all group">
                                <div className="w-7 h-7 rounded bg-[#3b82f6] text-white flex items-center justify-center text-xs font-black shrink-0">01</div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-sm group-hover:text-[#3b82f6] transition-colors">Add New Member</h3>
                                    <p className="text-xs text-[#64748b] mt-0.5 font-semibold">เพิ่มรายชื่อนักเรียนใหม่เข้าสู่ระบบธนาคารขยะ</p>
                                </div>
                            </div>

                            {/* ปุ่ม 02: ส่งออกข้อมูล */}
                            <div className="border border-[#e2e8f0] rounded-xl p-4 flex gap-4 cursor-pointer hover:border-[#8b5cf6] hover:shadow-sm transition-all group">
                                <div className="w-7 h-7 rounded border-2 border-[#8b5cf6] text-[#8b5cf6] flex items-center justify-center text-xs font-black shrink-0">02</div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-sm group-hover:text-[#8b5cf6] transition-colors">Export Database</h3>
                                    <p className="text-xs text-[#64748b] mt-0.5 font-semibold">ดาวน์โหลดข้อมูลสมาชิกเป็นไฟล์ Excel (.csv)</p>
                                </div>
                            </div>

                            {/* ปุ่ม 03: ตั้งค่า */}
                            <div className="border border-[#e2e8f0] rounded-xl p-4 flex gap-4 cursor-pointer hover:border-[#10b981] hover:shadow-sm transition-all group">
                                <div className="w-7 h-7 rounded bg-[#10b981] text-white flex items-center justify-center text-xs font-black shrink-0">03</div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-sm group-hover:text-[#10b981] transition-colors">System Settings</h3>
                                    <p className="text-xs text-[#64748b] mt-0.5 font-semibold">ตั้งค่าราคาขยะ รางวัล และระบบร้านค้า</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================== */}
                {/* 2. ส่วนล่าง: ตารางรายชื่อ (อ้างอิงสไตล์ Style Directory) */}
                {/* =================================================== */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">

                    {/* Header ของตาราง & ค้นหา */}
                    <div className="p-5 border-b border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="font-bold text-[#0f172a] text-lg">Member Directory</h2>
                            <p className="text-xs text-[#64748b] font-semibold mt-0.5">All available members — ready to manage</p>
                        </div>

                        <div className="relative w-full md:w-64">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] font-bold" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] transition-all bg-[#f8fafc]"
                            />
                        </div>
                    </div>

                    {/* ตารางแสดงผล (ในคอมพิวเตอร์เป็น Grid แบนๆ) */}
                    <div className="hidden md:grid grid-cols-[2.5fr_1fr_1.5fr_1fr_1fr] px-6 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]/50 text-[11px] font-black text-[#94a3b8] uppercase tracking-wider">
                        <div>STUDENT NAME</div>
                        <div>GRADE</div>
                        <div>BALANCE (THB)</div>
                        <div>CARBON (KG)</div>
                        <div className="text-right">ACTION</div>
                    </div>

                    {/* รายชื่อสมาชิก */}
                    <div className="flex flex-col">
                        {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                            <div key={member.id} className="flex flex-col md:grid md:grid-cols-[2.5fr_1fr_1.5fr_1fr_1fr] md:items-center px-5 py-4 border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors gap-3 md:gap-0">

                                {/* 1. รูป + ชื่อ */}
                                <div className="flex items-center gap-3">
                                    {/* รูป Avatar ขนาดเล็กกะทัดรัด */}
                                    <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center overflow-hidden border border-[#e2e8f0] shrink-0">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=User${member.id}`} alt="avatar" className="w-full h-full opacity-80" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#0f172a] text-sm">{member.fullName}</span>
                                        <span className="text-[11px] text-[#64748b] font-semibold md:hidden">ชั้น {member.grade} • ยอดเงิน {member.balance} บ.</span>
                                    </div>
                                </div>

                                {/* 2. ชั้นเรียน (Style Pill) */}
                                <div className="hidden md:flex">
                                    <span className="bg-[#f1f5f9] text-[#475569] px-2.5 py-1 rounded-md text-xs font-bold border border-[#e2e8f0]">
                                        {member.grade}
                                    </span>
                                </div>

                                {/* 3. ยอดเงิน (สีม่วงเหมือนฟอนต์ในรูป) */}
                                <div className="hidden md:flex font-mono text-[#8b5cf6] text-sm font-semibold">
                                    ฿ {member.balance.toLocaleString()}
                                </div>

                                {/* 4. คาร์บอน */}
                                <div className="hidden md:flex text-[#64748b] text-sm font-semibold">
                                    {member.carbonPoints} kg
                                </div>

                                {/* 5. ปุ่ม Action (เหมือนปุ่ม Status สีเขียวในรูป) */}
                                <div className="flex md:justify-end">
                                    <button
                                        onClick={() => openModal('edit', member)}
                                        className="bg-[#ecfdf5] text-[#10b981] hover:bg-[#d1fae5] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#a7f3d0]"
                                    >
                                        <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center text-[#64748b] text-sm font-semibold">
                                ไม่พบข้อมูลที่ค้นหา
                            </div>
                        )}
                    </div>

                    {/* ท้ายตาราง */}
                    <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-between items-center text-xs font-bold text-[#64748b]">
                        <span>+ {mockMembers.length} total members</span>
                        <span className="text-[#10b981] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> All Ready</span>
                    </div>
                </div>

            </div>

            {/* ========================================= */}
            {/* MODAL: เพิ่ม/แก้ไขสมาชิก (ปรับให้เรียบคลีนขึ้น) */}
            {/* ========================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-[#0f172a]/20 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                    <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 flex flex-col shadow-2xl border border-[#e2e8f0] animate-modal-pop">
                        <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-[#94a3b8] hover:text-[#0f172a] transition-colors rounded-lg hover:bg-[#f1f5f9]">
                            <XMarkIcon className="w-5 h-5 font-bold" />
                        </button>

                        <h2 className="font-bold text-xl text-[#0f172a] mb-1">
                            {modalMode === 'add' ? 'Add New Member' : 'Edit Member Data'}
                        </h2>
                        <p className="font-semibold text-[#64748b] text-sm mb-6">
                            {modalMode === 'add' ? 'Fill in the details below to create a new profile.' : `Updating details for ${formData.fullName}`}
                        </p>

                        <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-bold text-xs text-[#475569]">FULL NAME</label>
                                <input type="text" required value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-2.5 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#eff6ff] transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-xs text-[#475569]">NICKNAME</label>
                                    <input type="text" required value={formData.nickname || ''} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="w-full px-4 py-2.5 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#eff6ff] transition-all" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-xs text-[#475569]">GRADE</label>
                                    <input type="text" required value={formData.grade || ''} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-2.5 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#eff6ff] transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-xs text-[#475569]">BALANCE (THB)</label>
                                    <input type="number" value={formData.balance || ''} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} className="w-full px-4 py-2.5 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#eff6ff] transition-all" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-xs text-[#475569]">CARBON (KG)</label>
                                    <input type="number" step="0.01" value={formData.carbonPoints || ''} onChange={(e) => setFormData({ ...formData, carbonPoints: e.target.value })} className="w-full px-4 py-2.5 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#eff6ff] transition-all" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#f1f5f9]">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-lg font-bold text-sm text-[#475569] hover:bg-[#f1f5f9] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2.5 rounded-lg font-bold text-sm bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}