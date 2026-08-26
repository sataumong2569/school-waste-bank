import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import PwaModalContent from './PwaModalContent';

const PwaInstallPopup = forwardRef(function PwaInstallPopup(props, ref) {
    const [showTeaser, setShowTeaser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('ios');

    // อนุญาตให้ข้างนอก (เช่น Footer) สั่งเปิด Modal ผ่าน ref ได้
    useImperativeHandle(ref, () => ({
        openModal: () => setShowModal(true)
    }));

    useEffect(() => {
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone;
        const isDismissed = sessionStorage.getItem('pwa_popup_dismissed') === 'true';

        if (!isStandalone && !isDismissed) {
            setShowTeaser(true);
        }
    }, []);

    const handleCloseTeaser = (e) => {
        e.stopPropagation();
        setShowTeaser(false);
        sessionStorage.setItem('pwa_popup_dismissed', 'true');
    };

    return (
        <>
            {/* ปุ่มลอยวงกลมมุมขวาล่าง */}
            {showTeaser && (
                <div className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3">
                    <div
                        onClick={() => setShowModal(true)}
                        className="hidden sm:flex cursor-pointer items-center rounded-full bg-slate-900/95 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-slate-900"
                    >
                        <span>ติดตั้งแอปลงมือถือ</span>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-white transition-transform hover:scale-105 active:scale-95 hover:bg-emerald-600"
                            aria-label="ติดตั้งแอปพลิเคชัน"
                        >
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                                />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={handleCloseTeaser}
                            className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-white shadow-md ring-2 ring-white hover:bg-slate-900 transition-colors"
                            aria-label="ปิดการแจ้งเตือน"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* หน้าต่าง Modal แสดงขั้นตอน */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-100"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                วิธีติดตั้งลงหน้าจอโฮม
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                aria-label="ปิดหน้าต่าง"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 text-sm font-semibold">
                            <button
                                type="button"
                                onClick={() => setActiveTab('ios')}
                                className={`rounded-xl py-2.5 transition-all ${activeTab === 'ios'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                iOS (Safari)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('android')}
                                className={`rounded-xl py-2.5 transition-all ${activeTab === 'android'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                Android (Chrome)
                            </button>
                        </div>

                        {/* ดึงเนื้อหาขั้นตอนจาก Component ที่แยกไว้ */}
                        <PwaModalContent activeTab={activeTab} onClose={() => setShowModal(false)} />
                    </div>
                </div>
            )}
        </>
    );
});

export default PwaInstallPopup;