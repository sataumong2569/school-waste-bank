import { useState, useMemo } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, FunnelIcon, UsersIcon } from '@heroicons/react/24/outline';
import { exportMembersToExcel } from '../utils/exportExcel';

export default function ExportModal({ isOpen, onClose, members }) {
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isExporting, setIsExporting] = useState(false);

    // กรองข้อมูลตามที่ Admin เลือกใน Modal
    const filteredData = useMemo(() => {
        return members.filter((m) => {
            const matchGrade = selectedGrade === 'all' || (m.grade && m.grade.startsWith(selectedGrade));
            const matchStatus = selectedStatus === 'all' || m.status === selectedStatus;
            return matchGrade && matchStatus;
        });
    }, [members, selectedGrade, selectedStatus]);

    if (!isOpen) return null;

    const handleConfirmExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const success = exportMembersToExcel(filteredData, 'สรุปข้อมูลสมาชิก_ธนาคารขยะ');
            setIsExporting(false);
            if (success) onClose();
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-['Prompt']">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative w-full max-w-md bg-white rounded-[28px] p-6 md:p-8 shadow-2xl z-10 animate-modal-pop">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                >
                    <XMarkIcon className="w-5 h-5 font-bold" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center shadow-sm">
                        <ArrowDownTrayIcon className="w-6 h-6 stroke-2" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-[#1e1b4b]">ส่งออกข้อมูลสมาชิก</h3>
                        <p className="text-xs text-gray-500">ดาวน์โหลดเป็นไฟล์ Excel (.xlsx)</p>
                    </div>
                </div>

                {/* Filters Form */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* ฟิลเตอร์ระดับชั้น */}
                    <div>
                        <label className="block text-xs font-bold text-[#64748b] mb-1.5 flex items-center gap-1.5">
                            <FunnelIcon className="w-3.5 h-3.5" /> ระดับชั้นเรียน
                        </label>
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#0f172a] outline-none focus:border-[#8b5cf6] cursor-pointer"
                        >
                            <option value="all">ทั้งหมดทุกชั้น</option>
                            <option value="ป.1">เฉพาะ ป.1</option>
                            <option value="ป.2">เฉพาะ ป.2</option>
                            <option value="ป.3">เฉพาะ ป.3</option>
                            <option value="ป.4">เฉพาะ ป.4</option>
                            <option value="ป.5">เฉพาะ ป.5</option>
                            <option value="ป.6">เฉพาะ ป.6</option>
                        </select>
                    </div>

                    {/* ฟิลเตอร์สถานะ */}
                    <div>
                        <label className="block text-xs font-bold text-[#64748b] mb-1.5 flex items-center gap-1.5">
                            <UsersIcon className="w-3.5 h-3.5" /> สถานะนักเรียน
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#0f172a] outline-none focus:border-[#8b5cf6] cursor-pointer"
                        >
                            <option value="all">ทั้งหมดทุกสถานะ</option>
                            <option value="กำลังศึกษา">กำลังศึกษา (Active)</option>
                            <option value="จบการศึกษา">จบการศึกษา (Graduated)</option>
                            <option value="ย้ายโรงเรียน">ย้ายโรงเรียน / พ้นสภาพ</option>
                        </select>
                    </div>

                    {/* สรุปยอดที่จะถูก Export */}
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-semibold">จำนวนข้อมูลที่จะส่งออก:</span>
                        <span className="font-bold text-[#8b5cf6] text-sm">{filteredData.length} คน</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmExport}
                        disabled={isExporting || filteredData.length === 0}
                        className="flex-1 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-sm shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {isExporting ? 'กำลังสร้างไฟล์...' : 'ดาวน์โหลด Excel'}
                    </button>
                </div>
            </div>
        </div>
    );
}