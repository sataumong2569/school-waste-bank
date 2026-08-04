import { useState } from 'react';
import {
    MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, XMarkIcon, UserIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
    // 🟢 States สำหรับจัดการ Modal (เปิด/ปิด และโหมด เพิ่ม/แก้ไข)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' หรือ 'edit'
    const [formData, setFormData] = useState({});

    // ข้อมูลสมาชิก Mock-up สำหรับหน้าจัดการ
    const mockMembers = [
        { id: '1', fullName: 'ด.ช. สมชาย รักดี', nickname: 'น้องเอ', grade: 'ป.4/1', balance: 1250, carbonPoints: 45.10, color: 'bg-[#f472b6]' },
        { id: '2', fullName: 'ด.ญ. สมหญิง ใจบุญ', nickname: 'น้องบี', grade: 'ป.5/2', balance: 980, carbonPoints: 38.50, color: 'bg-[#f59e0b]' },
        { id: '3', fullName: 'ด.ช. มานะ ขยันเรียน', nickname: 'น้องซี', grade: 'ป.6/1', balance: 840, carbonPoints: 30.20, color: 'bg-[#34d399]' },
    ];

    // ฟังก์ชันเปิด Modal
    const openModal = (mode, memberData = null) => {
        setModalMode(mode);
        if (mode === 'edit' && memberData) {
            setFormData(memberData);
        } else {
            // โหมด Add เคลียร์ข้อมูลทิ้ง
            setFormData({ fullName: '', nickname: '', grade: '', balance: '', carbonPoints: '' });
        }
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // ล็อกพื้นหลังไม่ให้เลื่อน
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    };

    // ฟังก์ชัน Submit Form (Mock-up)
    const handleSave = (e) => {
        e.preventDefault();
        console.log(`บันทึกข้อมูลโหมด ${modalMode}:`, formData);
        // TODO: ตรงนี้จะไปเขียนโค้ด Update/Add เข้า Firebase
        closeModal();
    };

    return (
        <div className="w-full bg-[#f8f9fa] min-h-screen pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8 fade-up">

                <h1 className="font-['Fredoka_One'] text-3xl md:text-4xl text-[#1e1b4b] mb-8">Admin Dashboard</h1>

                {/* 1. ส่วนบน: 2 Components Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="clay-card p-6 md:p-8 bg-white border border-[#f0f0f0] flex flex-col items-center justify-center min-h-[160px]">
                        <h3 className="font-['Fredoka_One'] text-xl text-[#7c3aed] mb-2">ภาพรวมระบบ</h3>
                        <p className="font-['Nunito'] font-bold text-[#6d6a8a] text-sm text-center">พื้นที่สำหรับแสดงกราฟสรุปยอดเงิน / ยอดขยะรวม (รอการพัฒนาเพิ่ม)</p>
                    </div>
                    <div className="clay-card p-6 md:p-8 bg-white border border-[#f0f0f0] flex flex-col items-center justify-center min-h-[160px]">
                        <h3 className="font-['Fredoka_One'] text-xl text-[#10b981] mb-2">อัปเดตสถิติล่าสุด</h3>
                        <p className="font-['Nunito'] font-bold text-[#6d6a8a] text-sm text-center">พื้นที่สำหรับอัปเดตข้อมูลของโรงเรียน (รอการพัฒนาเพิ่ม)</p>
                    </div>
                </div>

                {/* 2. ส่วนล่าง: List รายชื่อสมาชิก */}
                <div className="clay-card bg-white p-4 md:p-8 flex flex-col h-full overflow-hidden">

                    {/* Header ของตารางจัดการ */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-7 bg-[#db2777] rounded-full"></div>
                            <h2 className="font-['Fredoka_One'] text-2xl text-[#1e1b4b]">จัดการสมาชิก</h2>
                        </div>

                        {/* ปุ่ม + เพิ่มสมาชิก (มุมขวาบนของ Component) */}
                        <button
                            onClick={() => openModal('add')}
                            className="clay-btn-purple !bg-[#10b981] !shadow-[0_4px_0px_#047857] hover:!shadow-[0_6px_0px_#047857] active:!shadow-[0_2px_0px_#047857] !py-2.5 !px-5 !text-sm whitespace-nowrap"
                        >
                            <PlusIcon className="w-5 h-5 stroke-2" /> เพิ่มสมาชิกใหม่
                        </button>
                    </div>

                    {/* ช่องค้นหา */}
                    <div className="relative w-full md:max-w-md mb-6">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d6a8a] font-bold z-10" />
                        <input type="text" placeholder="ค้นหารายชื่อ..." className="w-full pl-12 pr-4 py-3 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#f8f9fa] border border-[#f0f0f0]" />
                    </div>

                    {/* ตาราง List รายชื่อ */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 pb-3 border-b-2 border-[#f0eeff] mb-4 font-['Fredoka_One'] text-[#1e1b4b] text-base">
                        <div className="text-left">ชื่อนักเรียน</div>
                        <div className="text-right">ยอดเงิน</div>
                        <div className="text-right">ลดคาร์บอน</div>
                        <div className="text-center">จัดการ</div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {mockMembers.map((member) => (
                            <div key={member.id} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center md:gap-4 p-4 bg-[#fafafa] rounded-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-[#f0f0f0] transition-all">

                                <div className="flex items-center gap-4 mb-3 md:mb-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white flex-shrink-0 clay-sphere ${member.color}`}>
                                        {member.fullName.split(' ')[1]?.[0] || 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-[#1e1b4b] font-['Nunito'] text-sm md:text-base truncate">{member.fullName}</p>
                                        <p className="text-[11px] text-[#6d6a8a] font-bold">ชั้น {member.grade} • {member.nickname}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between md:justify-end items-center px-1 md:px-0">
                                    <span className="text-[10px] font-bold text-[#6d6a8a] md:hidden">ยอดเงิน:</span>
                                    <p className="font-['Fredoka_One'] text-[#7c3aed] text-base">{member.balance} บ.</p>
                                </div>

                                <div className="flex justify-between md:justify-end items-center px-1 md:px-0 mt-1 md:mt-0">
                                    <span className="text-[10px] font-bold text-[#6d6a8a] md:hidden">คาร์บอน:</span>
                                    <p className="font-['Fredoka_One'] text-[#10b981] text-base">{member.carbonPoints} kg</p>
                                </div>

                                {/* ปุ่มแก้ไข ท้ายสุด */}
                                <div className="flex justify-end md:justify-center items-center mt-3 md:mt-0 pt-3 md:pt-0 border-t border-[#f0f0f0] md:border-none">
                                    <button
                                        onClick={() => openModal('edit', member)}
                                        className="clay-btn-white !py-1.5 !px-3 !text-xs !rounded-xl !shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:!text-[#f59e0b] border border-[#f0f0f0]"
                                    >
                                        <PencilSquareIcon className="w-4 h-4 mr-1" /> แก้ไข
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ========================================= */}
            {/* MODAL: เพิ่ม/แก้ไขสมาชิก (ใช้สไตล์การ์ด 3D) */}
            {/* ========================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                    <div className="clay-card relative w-full max-w-lg bg-white p-6 md:p-8 flex flex-col items-center animate-modal-pop shadow-[0_30px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto hide-scrollbar">
                        <button onClick={closeModal} className="absolute top-5 right-5 p-2 bg-[#f8f9fa] rounded-full hover:bg-[#fee2e2] hover:text-red-500 text-[#6d6a8a] transition-colors z-10">
                            <XMarkIcon className="w-5 h-5 font-bold" />
                        </button>

                        <div className="w-20 h-20 rounded-full bg-[#f0eeff] flex items-center justify-center clay-sphere text-[#7c3aed] mb-4">
                            <UserIcon className="w-10 h-10" />
                        </div>

                        <h2 className="font-['Fredoka_One'] text-2xl text-[#1e1b4b] mb-1">
                            {modalMode === 'add' ? 'เพิ่มสมาชิกใหม่' : 'แก้ไขข้อมูลสมาชิก'}
                        </h2>
                        <p className="font-['Nunito'] font-bold text-[#6d6a8a] text-sm mb-6">
                            {modalMode === 'add' ? 'กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชี' : `กำลังแก้ไข: ${formData.fullName}`}
                        </p>

                        <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-xs text-[#1e1b4b] ml-1">ชื่อ - นามสกุล</label>
                                <input type="text" required value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="font-bold text-xs text-[#1e1b4b] ml-1">ชื่อเล่น</label>
                                    <input type="text" required value={formData.nickname || ''} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="w-full px-4 py-3 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-bold text-xs text-[#1e1b4b] ml-1">ชั้นเรียน (เช่น ป.4/1)</label>
                                    <input type="text" required value={formData.grade || ''} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-4 py-3 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="font-bold text-xs text-[#1e1b4b] ml-1">ยอดเงินเริ่มต้น</label>
                                    <input type="number" value={formData.balance || ''} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} className="w-full px-4 py-3 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-bold text-xs text-[#1e1b4b] ml-1">คาร์บอนเริ่มต้น</label>
                                    <input type="number" step="0.01" value={formData.carbonPoints || ''} onChange={(e) => setFormData({ ...formData, carbonPoints: e.target.value })} className="w-full px-4 py-3 rounded-2xl font-bold outline-none text-[#1e1b4b] text-sm clay-input bg-[#fafafa]" />
                                </div>
                            </div>

                            <button type="submit" className="clay-btn-purple w-full mt-4 py-3.5 text-base">
                                บันทึกข้อมูล
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}