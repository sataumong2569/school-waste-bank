import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon, PlusIcon, PencilSquareIcon, XMarkIcon,
    UsersIcon, BanknotesIcon, GlobeAsiaAustraliaIcon, CameraIcon,
    ChevronLeftIcon, ChevronRightIcon, ScaleIcon, TrashIcon, Cog8ToothIcon,
    UserPlusIcon, PencilIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import Cropper from 'react-easy-crop';

import { WASTE_CATEGORIES, DEFAULT_PRICES } from '../utils/wasteConfig';
import { useApp } from '../AppContext';
import { uploadImageToCloudinary } from '../utils/uploadImage';
import { getCroppedImg } from '../utils/cropImage';
import { getOptimizedImageUrl } from '../utils/uploadImage';

export default function Settings() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('');
    const [formData, setFormData] = useState({});

    // States สำหรับระบบรับฝากขยะ
    const [depositMemberSearch, setDepositMemberSearch] = useState('');
    const [selectedDepositMember, setSelectedDepositMember] = useState(null);
    const [depositCart, setDepositCart] = useState([]);
    const [currentDepositItem, setCurrentDepositItem] = useState({ category: 'plastic', item: 'พลาสติกรวม', weight: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { members, addMember, updateMember, deleteMember, pricing, sysStats, processDeposit } = useApp();

    const filteredMembers = members.filter(member => member.fullName.includes(searchTerm) || member.grade.includes(searchTerm));
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const displayedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // States สำหรับอัปโหลดและ Crop รูปภาพ
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);
    const fileInputRef = useRef(null);

    // States สำหรับ react-easy-crop
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const openModal = (mode, memberData = null) => {
        setModalMode(mode);
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);

        if (mode === 'edit' && memberData) {
            setFormData(memberData);
        } else if (mode === 'add') {
            setFormData({ fullName: '', nickname: '', grade: '', balance: 0, carbonPoints: 0, rewardPoints: 0, status: 'กำลังศึกษา', color: 'bg-[#3b82f6]', image: '' });
        } else if (mode === 'deposit') {
            setDepositCart([]);
            setSelectedDepositMember(null);
            setDepositMemberSearch('');
            setCurrentDepositItem({ category: 'plastic', item: 'พลาสติกรวม', weight: '' });
        }
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleExport = () => { alert("ระบบจำลอง: ส่งออกข้อมูลเป็นไฟล์ Excel (.csv) สำเร็จ!"); };

    const handleAddToCart = () => {
        if (!currentDepositItem.weight || currentDepositItem.weight <= 0) return;

        const pricePerKg = pricing[currentDepositItem.item] || 0;
        const multiplier = WASTE_CATEGORIES[currentDepositItem.category].carbonMultiplier;

        const newItem = {
            id: Date.now(),
            ...currentDepositItem,
            totalPrice: parseFloat(currentDepositItem.weight) * pricePerKg,
            totalCarbon: parseFloat(currentDepositItem.weight) * multiplier
        };
        setDepositCart([...depositCart, newItem]);
        setCurrentDepositItem({ ...currentDepositItem, weight: '' });
    };

    const handleRemoveFromCart = (idToRemove) => {
        setDepositCart(depositCart.filter(item => item.id !== idToRemove));
    };

    const cartTotalMoney = depositCart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
    const cartTotalCarbon = depositCart.reduce((sum, item) => sum + item.totalCarbon, 0).toFixed(4);

    // แก้ไข: เพิ่มคำสั่ง await ในการเรียกใช้ Context เพื่อรอให้ฐานข้อมูลบันทึกสำเร็จก่อน
    const handleSave = async (e) => {
        e.preventDefault();

        // 1. ดักจับ: ถ้าไม่มีการเลือกรูปใหม่ (imageSrc) และ ไม่มีรูปเดิมอยู่แล้ว (formData.image)
        if (!imageSrc && !formData.image) {
            // แจ้งเตือน Pop-up
            const confirmNoImage = window.confirm("คุณยังไม่ได้ใส่รูปภาพโปรไฟล์ ต้องการบันทึกข้อมูลโดยไม่ใช้รูปภาพใช่หรือไม่?");
            if (!confirmNoImage) {
                return; // ถ้าผู้ใช้กดยกเลิก ให้หยุดการทำงานและกลับไปหน้าฟอร์ม
            }
        }

        setIsUploading(true);

        try {
            // 2. ให้ค่าเริ่มต้นเป็นรูปเดิม หรือค่าว่าง "" (ถ้าไม่มีรูป)
            let finalImageUrl = formData.image || "";

            // 3. ถ้ามีการเลือกรูปใหม่ ค่อยประมวลผลและส่งขึ้น Cloudinary
            if (imageSrc && croppedAreaPixels) {
                const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
                const uploadedUrl = await uploadImageToCloudinary(croppedFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    throw new Error("อัปโหลดรูปภาพไม่สำเร็จ");
                }
            }

            // 4. บันทึกข้อมูล (ถ้าไม่มีรูป finalImageUrl จะเป็น "")
            const finalData = { ...formData, image: finalImageUrl };

            if (modalMode === 'add') {
                await addMember(finalData);
            } else if (modalMode === 'edit') {
                await updateMember(finalData);
            }

            closeModal();
        } catch (error) {
            console.error("Save error:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsUploading(false);
        }
    };

    // แก้ไข: ดึงฟังก์ชันบันทึกตะกร้าขยะออกมาจัดการแยก เพื่อใส่ try/catch และ await
    const handleConfirmDeposit = async (e) => {
        e.preventDefault();
        if (!selectedDepositMember || depositCart.length === 0) return;

        setIsProcessingDeposit(true);
        try {
            // รอจนกว่าจะบันทึกประวัติลงฐานข้อมูลสำเร็จ
            await processDeposit(selectedDepositMember, depositCart, cartTotalMoney, cartTotalCarbon);

            alert(`ยืนยันการรับฝากสำเร็จ!\n${selectedDepositMember.fullName} ได้รับเงิน ${cartTotalMoney} บาท`);

            // ล้างค่าหลังจากบันทึกสำเร็จเท่านั้น
            setDepositCart([]);
            setSelectedDepositMember(null);
            setDepositMemberSearch('');
            setCurrentDepositItem({ category: 'plastic', item: 'พลาสติกรวม', weight: '' });
            closeModal();
        } catch (error) {
            console.error("Deposit error:", error);
            alert("บันทึกการฝากไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsProcessingDeposit(false);
        }
    };

    return (
        <div className="w-full min-h-screen font-['Nunito'] flex flex-col">

            {/* ส่วนที่ 1: สีขาว (Overview & Quick Actions) */}
            <div className="bg-white pt-8 pb-4 w-full">
                <div className="max-w-6xl mx-auto px-4 md:px-8 fade-up">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
                            <div className="flex items-center gap-3 w-full text-left mb-2">
                                <div className="w-2 h-7 bg-[#db2777] rounded-full"></div>
                                <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">ภาพรวมระบบ</h2>
                            </div>
                            <p className="text-[#64748b] text-xs mb-6 font-semibold">สถิติและข้อมูลภาพรวมของระบบธนาคารขยะ</p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 bg-[#eff6ff]/50 border border-[#dbeafe] p-3.5 rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center flex-shrink-0 shadow-sm"><UsersIcon className="w-5 h-5" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-sm mb-0.5">สมาชิกทั้งหมด</h3><p className="text-xs text-[#64748b] font-semibold">ในระบบมีจำนวน {sysStats.totalMembers} คน</p></div>
                                </div>
                                <div className="flex items-center gap-4 bg-[#f5f3ff]/50 border border-[#ede9fe] p-3.5 rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-[#8b5cf6] text-white flex items-center justify-center flex-shrink-0 shadow-sm"><BanknotesIcon className="w-5 h-5" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-sm mb-0.5">ยอดเงินฝากรวม</h3><p className="text-xs text-[#64748b] font-semibold">หมุนเวียนรวม {(sysStats.totalBalance || 0).toLocaleString()} บาท</p></div>
                                </div>
                                <div className="flex items-center gap-4 bg-[#ecfdf5]/50 border border-[#d1fae5] p-3.5 rounded-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center flex-shrink-0 shadow-sm"><GlobeAsiaAustraliaIcon className="w-5 h-5" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-sm mb-0.5">ลดก๊าซคาร์บอน</h3><p className="text-xs text-[#64748b] font-semibold">ช่วยโลกลดไป {(sysStats.totalCarbon || 0).toFixed(2)} kgCO₂e</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col">
                            <div className="flex items-center gap-3 w-full text-left mb-2">
                                <div className="w-2 h-7 bg-[#f59e0b] rounded-full"></div>
                                <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">การจัดการด่วน</h2>
                            </div>
                            <p className="text-[#64748b] text-xs mb-6 font-semibold">ทางลัดสำหรับฟังก์ชันที่ใช้งานบ่อย</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                <div onClick={() => openModal('add')} className="border border-[#e2e8f0] rounded-xl p-4 flex gap-3 cursor-pointer hover:border-[#3b82f6] hover:shadow-sm transition-all group items-center">
                                    <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center shrink-0 group-hover:bg-[#3b82f6] group-hover:text-white transition-colors"><PlusIcon className="w-5 h-5 stroke-2" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-xs">เพิ่มสมาชิกใหม่</h3><p className="text-[10px] text-[#64748b]">สร้างบัญชีนักเรียน</p></div>
                                </div>
                                <div onClick={() => openModal('deposit')} className="border border-[#e2e8f0] rounded-xl p-4 flex gap-3 cursor-pointer hover:border-[#10b981] hover:shadow-sm transition-all group items-center">
                                    <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#10b981] flex items-center justify-center shrink-0 group-hover:bg-[#10b981] group-hover:text-white transition-colors"><ScaleIcon className="w-5 h-5 stroke-2" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-xs">รับฝากขยะ</h3><p className="text-[10px] text-[#64748b]">ชั่งน้ำหนักและบันทึก</p></div>
                                </div>
                                <Link to="/system-config" className="border border-[#e2e8f0] rounded-xl p-4 flex gap-3 cursor-pointer hover:border-[#f59e0b] hover:shadow-sm transition-all group items-center">
                                    <div className="w-8 h-8 rounded-lg bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center shrink-0 group-hover:bg-[#f59e0b] group-hover:text-white transition-colors"><Cog8ToothIcon className="w-5 h-5 stroke-2" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-xs">ตั้งค่าระบบ</h3><p className="text-[10px] text-[#64748b]">ราคา / ระยะเวลา / รางวัล</p></div>
                                </Link>
                                <div onClick={handleExport} className="border border-[#e2e8f0] rounded-xl p-4 flex gap-3 cursor-pointer hover:border-[#8b5cf6] hover:shadow-sm transition-all group items-center">
                                    <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] text-[#8b5cf6] flex items-center justify-center shrink-0 group-hover:bg-[#8b5cf6] group-hover:text-white transition-colors"><ArrowDownTrayIcon className="w-5 h-5 stroke-2" /></div>
                                    <div><h3 className="font-bold text-[#0f172a] text-xs">ส่งออกข้อมูล</h3><p className="text-[10px] text-[#64748b]">ดาวน์โหลด Excel</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <svg viewBox="0 0 1440 100" className="w-full h-[30px] md:h-[50px] block bg-white text-[#fafafa] -mt-1" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,74.7C1248,64,1344,32,1392,16L1440,0L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
            </svg>

            {/* ส่วนที่ 2: สีเทาอ่อน (ตาราง Directory) */}
            <div className="bg-[#fafafa] flex-1 pb-20 pt-4">
                <div className="max-w-6xl mx-auto px-4 md:px-8 fade-up" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full text-left mb-2">
                                <div className="w-2 h-7 bg-[#27db4e] rounded-full"></div>
                                <h2 className="font-bold text-[#0f172a] text-lg">รายชื่อสมาชิกในระบบ</h2>
                                <p className="text-xs text-[#64748b] font-semibold mt-0.5">จัดการ ค้นหา และแก้ไขข้อมูลของสมาชิก</p>
                            </div>
                            <div className="relative w-full md:w-64">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] font-bold" />
                                <input type="text" placeholder="ค้นหาสมาชิก..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-4 py-2 rounded-lg font-semibold outline-none text-[#0f172a] text-sm border border-[#e2e8f0] focus:border-[#cbd5e1] focus:ring-2 focus:ring-[#f1f5f9] transition-all bg-[#f8fafc]" />
                            </div>
                        </div>

                        {/* ส่วนหัวตาราง */}
                        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1.2fr_0.8fr] px-6 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]/50 text-[11px] font-black text-[#94a3b8] uppercase tracking-wider">
                            <div>ชื่อ-นามสกุล</div><div>สถานะ / ชั้นเรียน</div><div>ยอดเงิน (บาท)</div><div>ลดคาร์บอน / เครดิต</div><div className="text-right">จัดการ</div>
                        </div>

                        {/* ส่วนข้อมูลในตาราง */}
                        <div className="flex flex-col">
                            {displayedMembers.length > 0 ? displayedMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between md:grid md:grid-cols-[1.5fr_1fr_1fr_1.2fr_0.8fr] px-4 md:px-5 py-3 md:py-4 border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors gap-3 md:gap-0">

                                    {/* คอลัมน์ 1: ชื่อ */}
                                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                        <div className={`w-9 h-9 md:w-8 md:h-8 rounded-full ${member.color} flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden`}>
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
                                                <span>{member.fullName.split(' ')[1]?.[0] || 'U'}</span>
                                            )}
                                        </div>

                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-[#0f172a] text-sm truncate">{member.fullName}</span>
                                            <span className="text-[10px] text-[#64748b] font-semibold md:hidden truncate">
                                                ชั้น {member.grade} • ฿{member.balance}
                                            </span>
                                        </div>
                                    </div>

                                    {/* คอลัมน์ 2: สถานะ */}
                                    <div className="hidden md:flex flex-col items-start gap-1">
                                        <span className="bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded text-[10px] font-bold border border-[#e2e8f0]">{member.grade}</span>
                                        <span className={`text-[10px] font-bold ${member.status === 'กำลังศึกษา' ? 'text-[#10b981]' : 'text-[#64748b]'}`}>{member.status}</span>
                                    </div>

                                    {/* คอลัมน์ 3: ยอดเงิน */}
                                    <div className="hidden md:flex font-mono text-[#8b5cf6] text-sm font-semibold">฿ {parseFloat(member.balance || 0).toLocaleString()}</div>

                                    {/* คอลัมน์ 4: คาร์บอน และ เครดิต */}
                                    <div className="hidden md:flex flex-col items-start justify-center gap-0.5">
                                        <span className="text-[#10b981] text-xs font-bold" title="สถิติโลกรวม">🌍 {(member.carbonPoints || 0)} kg</span>
                                        <span className="text-[#f59e0b] text-[11px] font-bold" title="แต้มสะสม">🎁 {(member.rewardPoints || 0)} pts</span>
                                    </div>

                                    {/* คอลัมน์ 5: จัดการ */}
                                    <div className="flex justify-end shrink-0">
                                        <button
                                            onClick={() => openModal('edit', member)}
                                            className="bg-[#fef2f2] text-[#ef4444] px-3 py-1.5 rounded-lg md:rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2] hover:shadow-sm active:scale-95 transition-all duration-200"
                                        >
                                            <PencilSquareIcon className="w-4 h-4 md:w-3.5 md:h-3.5" />
                                            <span className="hidden sm:inline">แก้ไข</span>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center text-[#64748b] text-sm font-semibold">ไม่พบข้อมูลที่ค้นหา</div>
                            )}
                        </div>

                        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-between items-center text-xs font-bold text-[#64748b]">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex items-center gap-1 hover:text-[#0f172a] disabled:opacity-40 transition-colors"><ChevronLeftIcon className="w-4 h-4 stroke-2" /> ย้อนกลับ</button>
                            <span className="text-[#0f172a] bg-white border border-[#e2e8f0] px-3 py-1 rounded-md shadow-sm">หน้า {currentPage} จาก {totalPages || 1}</span>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center gap-1 hover:text-[#0f172a] disabled:opacity-40 transition-colors">ถัดไป <ChevronRightIcon className="w-4 h-4 stroke-2" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS SECTION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                    {/* 1. Modal: เพิ่ม/แก้ไขสมาชิก */}
                    {(modalMode === 'add' || modalMode === 'edit') && (
                        <form
                            onSubmit={handleSave}
                            className="relative w-full max-w-[95%] md:max-w-2xl bg-white rounded-[24px] p-6 md:p-8 flex flex-col gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.1)] animate-modal-pop max-h-[90vh] overflow-y-auto hide-scrollbar pb-24 md:pb-8"
                        >
                            <button type="button" onClick={closeModal} className="absolute top-4 right-4 p-1.5 md:p-2 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors z-20">
                                <XMarkIcon className="w-5 h-5 font-bold" />
                            </button>

                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                                {modalMode === 'add' ? (
                                    <UserPlusIcon className="w-6 h-6 text-[#3b82f6] stroke-2" />
                                ) : (
                                    <PencilIcon className="w-6 h-6 text-[#ef4444] stroke-2" />
                                )}
                                <h2 className="font-['Fredoka_One'] text-xl text-[#1e1b4b]">
                                    {modalMode === 'add' ? 'เพิ่มสมาชิกใหม่' : 'แก้ไขข้อมูลสมาชิก'}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* คอลัมน์ 1: โปรไฟล์ & ข้อมูลพื้นฐาน */}
                                <div className="flex flex-col gap-4">

                                    {/* กล่องอัปโหลดและ Crop รูปภาพ */}
                                    <div className="w-full flex flex-col items-center gap-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        {imageSrc ? (
                                            <div className="w-full flex flex-col gap-3">
                                                <div className="w-full h-48 md:h-56 relative bg-gray-900 rounded-xl overflow-hidden shadow-sm">
                                                    <Cropper
                                                        image={imageSrc}
                                                        crop={crop}
                                                        zoom={zoom}
                                                        aspect={1 / 1}
                                                        onCropChange={setCrop}
                                                        onCropComplete={(croppedArea, areaPixels) => setCroppedAreaPixels(areaPixels)}
                                                        onZoomChange={setZoom}
                                                    />
                                                </div>
                                                <div className="w-full flex items-center gap-3 bg-[#f8fafc] px-3 py-2 rounded-xl border border-[#e2e8f0]">
                                                    <span className="text-[10px] font-bold text-[#64748b] whitespace-nowrap">ซูม</span>
                                                    <input
                                                        type="range"
                                                        value={zoom}
                                                        min={1}
                                                        max={3}
                                                        step={0.1}
                                                        onChange={(e) => setZoom(e.target.value)}
                                                        className="flex-1 accent-[#3b82f6]"
                                                    />
                                                    <button type="button" onClick={() => setImageSrc(null)} className="text-[10px] font-bold text-red-500 hover:text-red-600 px-2 py-1 bg-red-50 rounded-lg whitespace-nowrap">ยกเลิก</button>
                                                </div>
                                            </div>
                                        ) : formData.image ? (
                                            <div
                                                onClick={triggerFileInput}
                                                className="relative group w-full h-48 md:h-56 rounded-xl overflow-hidden cursor-pointer shadow-sm border-2 border-transparent hover:border-[#3b82f6] transition-all"
                                            >
                                                <img
                                                    src={getOptimizedImageUrl(formData.image, 100)}
                                                    alt="Profile"
                                                    loading="lazy"
                                                    width="100"
                                                    height="100"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <div className="text-white flex flex-col items-center gap-1">
                                                        <CameraIcon className="w-8 h-8" />
                                                        <span className="text-xs font-bold">เปลี่ยนรูปภาพ</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={triggerFileInput}
                                                className="w-full h-48 md:h-56 rounded-xl border-2 border-dashed border-[#cbd5e1] hover:border-[#3b82f6] bg-[#f8fafc] hover:bg-[#eff6ff] flex flex-col items-center justify-center cursor-pointer transition-all text-[#64748b] hover:text-[#3b82f6]"
                                            >
                                                <CameraIcon className="w-10 h-10 mb-2 opacity-70" />
                                                <span className="text-sm font-bold">คลิกเพื่อเลือกรูปภาพ</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ชื่อ-นามสกุล */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#64748b] mb-1">ชื่อ-นามสกุล</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="เช่น ด.ช. สมชาย"
                                            value={formData.fullName || ''}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm font-bold text-[#0f172a] outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'} focus:bg-white placeholder:text-gray-400`}
                                        />
                                    </div>

                                    {/* ชั้นเรียน & ชื่อเล่น */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-[#64748b] mb-1">ชั้นเรียน</label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <select
                                                    value={formData.grade ? formData.grade.split('/')[0] : 'ป.1'}
                                                    onChange={(e) => {
                                                        const currentRoom = formData.grade && formData.grade.includes('/') ? formData.grade.split('/')[1] : '1';
                                                        setFormData({ ...formData, grade: `${e.target.value}/${currentRoom}` });
                                                    }}
                                                    className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-2 py-2.5 rounded-xl text-xs font-bold text-[#0f172a] text-center outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'
                                                        } focus:bg-white cursor-pointer`}
                                                >
                                                    <option value="ป.1">ป.1</option>
                                                    <option value="ป.2">ป.2</option>
                                                    <option value="ป.3">ป.3</option>
                                                    <option value="ป.4">ป.4</option>
                                                    <option value="ป.5">ป.5</option>
                                                    <option value="ป.6">ป.6</option>
                                                </select>

                                                <select
                                                    value={formData.grade && formData.grade.includes('/') ? formData.grade.split('/')[1] : '1'}
                                                    onChange={(e) => {
                                                        const currentLevel = formData.grade ? formData.grade.split('/')[0] : 'ป.1';
                                                        setFormData({ ...formData, grade: `${currentLevel}/${e.target.value}` });
                                                    }}
                                                    className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-2 py-2.5 rounded-xl text-xs font-bold text-[#0f172a] text-center outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'
                                                        } focus:bg-white cursor-pointer`}
                                                >
                                                    <option value="1">/1</option>
                                                    <option value="2">/2</option>
                                                    <option value="3">/3</option>
                                                    <option value="4">/4</option>
                                                    <option value="5">/5</option>
                                                    <option value="6">/6</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-[#64748b] mb-1">ชื่อเล่น</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="ชื่อเล่น"
                                                value={formData.nickname || ''}
                                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                                className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2.5 rounded-xl text-xs font-bold text-[#0f172a] text-center outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'
                                                    } focus:bg-white placeholder:text-gray-400`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* คอลัมน์ 2: ข้อมูลสถิติ & สถานะนักเรียน */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#64748b] mb-1">ยอดเงินสะสม (บาท)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                            required
                                            value={formData.balance || ''}
                                            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm font-bold text-[#7c3aed] outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'} focus:bg-white placeholder:text-gray-400`}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#64748b] mb-1">ลดคาร์บอน (kgCO₂e)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                            required
                                            value={formData.carbonPoints || ''}
                                            onChange={(e) => setFormData({ ...formData, carbonPoints: e.target.value })}
                                            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm font-bold text-[#10b981] outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'} focus:bg-white placeholder:text-gray-400`}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#f59e0b] mb-1">แต้มเครดิต (สำหรับแลกของ)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                            required
                                            value={formData.rewardPoints !== undefined ? formData.rewardPoints : ''}
                                            onChange={(e) => setFormData({ ...formData, rewardPoints: e.target.value })}
                                            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] px-4 py-2.5 rounded-xl text-sm font-bold text-[#f59e0b] outline-none transition-colors ${modalMode === 'add' ? 'focus:border-[#3b82f6]' : 'focus:border-[#ef4444]'} focus:bg-white placeholder:text-gray-400`}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#64748b] mb-1">สถานะนักเรียน</label>
                                        <select
                                            value={formData.status || 'กำลังศึกษา'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className={`w-full bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] text-sm rounded-xl block px-4 py-2.5 font-bold outline-none cursor-pointer hover:border-[#cbd5e1] transition-colors ${modalMode === 'add' ? 'focus:ring-2 focus:ring-[#3b82f6]' : 'focus:ring-2 focus:ring-[#ef4444]'}`}
                                        >
                                            <option value="กำลังศึกษา">กำลังศึกษา (Active)</option>
                                            <option value="จบการศึกษา">จบการศึกษา (Graduated)</option>
                                            <option value="ย้ายโรงเรียน">ย้ายโรงเรียน / พ้นสภาพ</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            {/* ส่วนปุ่มด้านล่าง (ลบ, ยกเลิก และ บันทึกข้อมูล) */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                                <div>
                                    {modalMode === 'edit' && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ ${formData.fullName} ?\n(ข้อมูลยอดเงินและคาร์บอนของคนนี้จะถูกหักออกจากระบบด้วย)`)) {
                                                    deleteMember(formData.id);
                                                    closeModal();
                                                }
                                            }}
                                            className="px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm flex items-center gap-2 border border-transparent hover:border-red-200 cursor-pointer active:scale-95 transition-all duration-200"
                                        >
                                            <TrashIcon className="w-5 h-5 stroke-2" />
                                            <span className="hidden sm:inline">ลบสมาชิกนี้</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 cursor-pointer active:scale-95 transition-all duration-200"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading}
                                        className={`px-6 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 
                                            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'} 
                                            ${modalMode === 'add'
                                                ? 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                                                : 'bg-[#ef4444] hover:bg-[#dc2626] shadow-[0_4px_12px_rgba(239,68,68,0.3)]'
                                            }`}
                                    >
                                        {isUploading ? 'กำลังอัปโหลด...' : 'บันทึกข้อมูล (Save)'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* 2. Modal: รับฝากขยะ (ระบบตะกร้า Cart) */}
                    {modalMode === 'deposit' && (
                        <form
                            onSubmit={handleConfirmDeposit}
                            className="relative w-full max-w-4xl bg-white border border-[#f0f0f0] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-modal-pop max-h-[90vh]"
                        >
                            <button type="button" onClick={closeModal} className="absolute top-4 right-4 p-2 bg-[#f8f9fa] rounded-full hover:bg-[#fee2e2] hover:text-red-500 text-[#6d6a8a] transition-colors z-10"><XMarkIcon className="w-5 h-5 font-bold" /></button>

                            {/* ฝั่งซ้าย: ฟอร์มค้นหาและเพิ่มของลงตะกร้า */}
                            <div className="w-full md:w-1/2 flex flex-col gap-5 overflow-y-auto hide-scrollbar pr-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <ScaleIcon className="w-6 h-6 text-[#10b981] stroke-2" />
                                    <h2 className="font-['Fredoka_One'] text-xl text-[#1e1b4b]">รับฝากขยะ (ตะกร้า)</h2>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-xs text-[#475569]">ค้นหาชื่อผู้ฝาก (พิมพ์เพื่อค้นหา)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="ตัวอย่าง: สมชาย"
                                            value={depositMemberSearch}
                                            onChange={(e) => {
                                                setDepositMemberSearch(e.target.value);
                                                setSelectedDepositMember(null);
                                            }}
                                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] pl-4 pr-10 py-2.5 rounded-lg text-sm font-bold text-[#0f172a] outline-none focus:border-[#10b981]"
                                        />
                                        <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                                    </div>
                                    {depositMemberSearch && !selectedDepositMember && (
                                        <div className="bg-white border border-[#e2e8f0] rounded-lg mt-1 max-h-32 overflow-y-auto shadow-sm absolute z-20 w-[calc(50%-2rem)]">
                                            {members.filter(m => m.fullName.includes(depositMemberSearch)).map(m => (
                                                <div
                                                    key={m.id}
                                                    onClick={() => { setSelectedDepositMember(m); setDepositMemberSearch(`${m.fullName} (${m.grade})`); }}
                                                    className="px-4 py-2 hover:bg-[#ecfdf5] cursor-pointer text-sm font-bold text-[#0f172a] border-b border-[#f1f5f9] last:border-0"
                                                >
                                                    {m.fullName} <span className="text-[#64748b] text-xs font-semibold">({m.grade})</span>
                                                </div>
                                            ))}
                                            {members.filter(m => m.fullName.includes(depositMemberSearch)).length === 0 && (
                                                <div className="px-4 py-3 text-xs text-[#94a3b8] text-center">ไม่พบชื่อที่ค้นหา</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-bold text-xs text-[#475569]">หมวดหมู่ขยะ</label>
                                        <select value={currentDepositItem.category} onChange={(e) => setCurrentDepositItem({ ...currentDepositItem, category: e.target.value, item: WASTE_CATEGORIES[e.target.value].items[0] })} className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2.5 rounded-lg text-sm font-bold text-[#0f172a] outline-none focus:border-[#10b981] cursor-pointer">
                                            {Object.entries(WASTE_CATEGORIES).map(([key, cat]) => <option key={key} value={key}>{cat.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-bold text-xs text-[#475569]">ประเภท</label>
                                        <select value={currentDepositItem.item} onChange={(e) => setCurrentDepositItem({ ...currentDepositItem, item: e.target.value })} className="w-full bg-[#f8fafc] border border-[#e2e8f0] px-3 py-2.5 rounded-lg text-sm font-bold text-[#0f172a] outline-none focus:border-[#10b981] cursor-pointer">
                                            {WASTE_CATEGORIES[currentDepositItem.category].items.map(item => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="font-bold text-xs text-[#475569]">น้ำหนัก (กิโลกรัม)</label>
                                    <div className="relative">
                                        <input type="number" step="0.01" min="0.01" placeholder="0.00" value={currentDepositItem.weight} onChange={(e) => setCurrentDepositItem({ ...currentDepositItem, weight: e.target.value })} className="w-full bg-white border border-[#e2e8f0] pl-4 pr-12 py-2.5 rounded-lg text-base font-black text-[#10b981] outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#ecfdf5]" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748b]">กก.</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={!selectedDepositMember || !currentDepositItem.weight}
                                    className="w-full bg-[#f8fafc] text-[#3b82f6] border border-[#3b82f6] hover:bg-[#eff6ff] font-bold text-sm py-3 rounded-xl transition-all duration-200 mt-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    + เพิ่มลงรายการ
                                </button>
                            </div>

                            <div className="hidden md:block w-[1px] bg-[#f0f0f0]"></div>

                            {/* ฝั่งขวา: รายการในตะกร้า & สรุปยอด */}
                            <div className="w-full md:w-1/2 flex flex-col h-[400px] md:h-auto">
                                <h3 className="font-bold text-[#0f172a] text-sm mb-3">รายการรับฝากปัจจุบัน</h3>

                                <div className="flex-1 overflow-y-auto bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 flex flex-col gap-2 hide-scrollbar mb-4">
                                    {depositCart.length === 0 ? (
                                        <div className="text-center text-[#94a3b8] text-xs font-bold py-10 mt-auto mb-auto">ยังไม่มีรายการขยะในตะกร้า</div>
                                    ) : (
                                        depositCart.map(item => (
                                            <div key={item.id} className="bg-white p-3 rounded-lg border border-[#e2e8f0] shadow-sm flex justify-between items-center group">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#0f172a] text-sm">{item.item} <span className="text-[#64748b] text-xs font-semibold">({item.weight} กก.)</span></span>
                                                    <span className="text-[10px] text-[#10b981] font-bold">ได้ {item.totalPrice.toFixed(2)} บ. | คาร์บอน/แต้ม {item.totalCarbon.toFixed(2)}</span>
                                                </div>
                                                <button type="button" onClick={() => handleRemoveFromCart(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><TrashIcon className="w-4 h-4 stroke-2" /></button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                                    <div className="flex flex-col items-center bg-white py-3 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-[#e2e8f0]">
                                        <span className="text-[10px] font-bold text-[#64748b] mb-1">ยอดเงินรวม</span>
                                        <span className="font-['Fredoka_One'] text-2xl text-[#10b981]">฿ {cartTotalMoney}</span>
                                    </div>
                                    <div className="flex flex-col items-center bg-white py-3 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-[#e2e8f0]">
                                        <span className="text-[10px] font-bold text-[#64748b] mb-1">คาร์บอน / แต้ม</span>
                                        <span className="font-['Fredoka_One'] text-xl text-[#3b82f6]">{cartTotalCarbon}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={depositCart.length === 0 || isProcessingDeposit}
                                    className={`w-full text-white font-bold text-sm py-4 rounded-xl transition-all duration-200 shrink-0 
                                        ${depositCart.length === 0 || isProcessingDeposit
                                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                                            : 'bg-[#10b981] hover:bg-[#059669] active:scale-[0.98] shadow-[0_4px_10px_rgba(16,185,129,0.3)] cursor-pointer'
                                        }`}
                                >
                                    {isProcessingDeposit ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการรับฝาก'}
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            )}
        </div>
    )
}