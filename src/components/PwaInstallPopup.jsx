import { useState, useEffect } from 'react';

export default function PwaInstallPopup() {
    const [showTeaser, setShowTeaser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('ios');

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

    if (!showTeaser && !showModal) return null;

    return (
        <>
            {/* ปุ่มลอยวงกลมมุมขวาล่าง  */}
            {showTeaser && (
                <div className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3">
                    {/* ป้ายข้อความกำกับ */}
                    <div
                        onClick={() => setShowModal(true)}
                        className="hidden sm:flex cursor-pointer items-center rounded-full bg-slate-900/95 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-slate-900"
                    >
                        <span>ติดตั้งแอป</span>
                    </div>


                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-white transition-transform hover:scale-105 active:scale-95 hover:bg-emerald-600"
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

                        {/* ปุ่มปิดขนาดเล็ก  */}
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

            {/* หน้าต่างแนะนำขั้นตอน  */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-100"
                    >
                        {/* ส่วนหัว */}
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

                        {/* แท็บเลือกระบบปฏิบัติการ */}
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

                        {/* รายการขั้นตอน  */}
                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                            {activeTab === 'ios' ? (
                                <>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            1
                                        </span>
                                        <p>เปิดผ่านเบราว์เซอร์ Safari</p>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            2
                                        </span>
                                        <p>
                                            กดปุ่ม <strong>แชร์ (Share)</strong> ที่แถบเมนูด้านล่าง
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            3
                                        </span>
                                        <p>
                                            เลือก <strong>เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            4
                                        </span>
                                        <p>
                                            กด <strong>เพิ่ม (Add)</strong> ที่มุมขวาบน
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            1
                                        </span>
                                        <p>เปิดผ่านเบราว์เซอร์ Google Chrome</p>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            2
                                        </span>
                                        <p>
                                            กดปุ่ม <strong>จุด 3 จุด</strong> ที่มุมขวาบน
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            3
                                        </span>
                                        <p>
                                            เลือก <strong>ติดตั้งแอป</strong> หรือ <strong>เพิ่มลงในหน้าจอหลัก</strong>
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3.5">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                                            4
                                        </span>
                                        <p>
                                            กดยืนยัน <strong>ติดตั้ง</strong>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ปุ่มปิด  */}
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="mt-7 w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10"
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}