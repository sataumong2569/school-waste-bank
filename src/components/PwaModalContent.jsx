export default function PwaModalContent({ activeTab, onClose }) {
    return (
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
            {/* ปุ่มปิด */}
            <button
                type="button"
                onClick={onClose}
                className="mt-7 w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10"
            >
                เข้าใจแล้ว
            </button>
        </div>
    );
}