import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        // Footer โค้งมนด้านบน พร้อมเงาฟุ้งๆ นุ่มนวลแบบ Clay
        <footer className="w-full bg-white shadow-[0_-10px_40px_rgba(124,58,237,0.06)] rounded-t-[40px] mt-20 relative z-10 pt-4">

            {/* ลูกเล่นเส้นตกแต่งขอบบน (เปลี่ยนจาก Memphis ขอบแข็ง เป็นแท่งดินปั้นขอบมนมีมิติ) */}
            <div className="absolute top-0 left-10 md:left-20 w-24 h-[8px] bg-[#f59e0b] rounded-b-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]"></div>
            <div className="absolute top-0 right-10 md:right-20 w-16 h-[8px] bg-[#10b981] rounded-b-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[8px] bg-[#7c3aed] rounded-b-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]"></div>

            <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* คอลัมน์ที่ 1: ชื่อโปรเจกต์และที่อยู่ */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="font-black text-2xl text-[#1e1b4b] mb-3 tracking-wide flex items-center gap-2">
                        SchoolWaste
                    </h2>
                    {/* เส้นคั่นแบบ Soft Clay (เซาะร่องเบาๆ) */}
                    <div className="w-full h-[4px] bg-[#f0eeff] rounded-full mb-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"></div>
                    <p className="font-bold text-sm text-[#6d6a8a] leading-relaxed">
                        โรงเรียนเทศบาลอุโมงค์ 1<br />
                        ที่อยู่ 1/1 หมู่ 1 ตำบลอุโมงค์<br />
                        อำเภอเมือง จังหวัดลำพูน 51150<br />
                        โทรศัพท์ 053-541407
                    </p>
                </div>

                {/* คอลัมน์ที่ 2: เกี่ยวกับโรงเรียน */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-black text-lg text-[#1e1b4b] mb-3">
                        เกี่ยวกับโรงเรียน
                    </h3>
                    <div className="w-full h-[4px] bg-[#f0eeff] rounded-full mb-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"></div>
                    <ul className="flex flex-col gap-3 font-bold text-sm text-[#6d6a8a]">
                        <li>
                            <a href="#" className="hover:text-[#7c3aed] hover:translate-x-2 transition-all inline-block">
                                หน้าหลัก (Dashboard)
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#7c3aed] hover:translate-x-2 transition-all inline-block">
                                ข้อมูลสถานศึกษา
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#7c3aed] hover:translate-x-2 transition-all inline-block">
                                รายชื่อสมาชิก
                            </a>
                        </li>
                    </ul>
                </div>

                {/* คอลัมน์ที่ 3: ข่าวสารและกิจกรรม */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.3s' }}>
                    <h3 className="font-black text-lg text-[#1e1b4b] mb-3">
                        ข่าวสารและกิจกรรม
                    </h3>
                    <div className="w-full h-[4px] bg-[#f0eeff] rounded-full mb-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"></div>
                    <ul className="flex flex-col gap-3 font-bold text-sm text-[#6d6a8a]">
                        <li>
                            <a href="#" className="hover:text-[#7c3aed] hover:translate-x-2 transition-all inline-block">
                                ข่าวสารและกิจกรรม
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#7c3aed] hover:translate-x-2 transition-all inline-block">
                                โครงการ/กิจกรรมเด่น
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#7c3aed] hover:translate-x-2 transition-all inline-block">
                                แลกรางวัล (Item Shop)
                            </a>
                        </li>
                    </ul>
                </div>

                {/* คอลัมน์ที่ 4: ติดต่อสอบถาม */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="font-black text-lg text-[#1e1b4b] mb-3">
                        ติดต่อสอบถาม
                    </h3>
                    <div className="w-full h-[4px] bg-[#f0eeff] rounded-full mb-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"></div>
                    <ul className="flex flex-col gap-3 font-bold text-sm text-[#6d6a8a]">
                        <li className="flex items-center gap-3">
                            {/* จับไอคอนใส่กรอบกลมแบบ Clay */}
                            <div className="w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center shadow-[inset_-1px_-2px_4px_rgba(0,0,0,0.05)] text-sm flex-shrink-0">📍</div>
                            <span>โรงเรียนเทศบาลอุโมงค์ 1</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center shadow-[inset_-1px_-2px_4px_rgba(0,0,0,0.05)] text-sm flex-shrink-0">☎️</div>
                            <span>053-541407</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#f0eeff] flex items-center justify-center shadow-[inset_-1px_-2px_4px_rgba(0,0,0,0.05)] text-sm flex-shrink-0">📱</div>
                            <span>Line: @schoolwaste</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* ส่วนที่ 3: แถบ Copyright  */}
            <div className="bg-[#f0eeff] py-5 text-center mt-4">
                <Link to="/login" className="font-black text-[10px] md:text-xs text-[#6d6a8a] tracking-[0.2em] uppercase hover:text-[#7c3aed] transition-colors cursor-pointer inline-block">
                    © 2026 School Waste Management. All Rights Reserved.
                </Link>
            </div>
        </footer>
    )
}