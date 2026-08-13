import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        // Footer โค้งมนด้านบน พร้อมเงาฟุ้งๆ นุ่มนวลแบบ Clay
        <footer className="w-full bg-white shadow-[0_-15px_40px_rgba(0,0,0,0.04)] rounded-t-[40px] md:rounded-t-[60px] mt-24 relative z-10 pt-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[6px] md:h-[8px] bg-gradient-to-r from-[#7c3aed] via-[#38bdf8] to-[#10b981] opacity-80"></div>

            <div className="max-w-7xl mx-auto px-8 md:px-10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">

                {/* คอลัมน์ที่ 1: ชื่อโปรเจกต์และที่อยู่ */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.1s' }}>
                    <h2 className="font-black text-xl md:text-2xl text-[#1e1b4b] mb-5 flex items-center gap-2.5">
                        <span className="w-2 h-6 md:h-7 bg-[#7c3aed] rounded-full shadow-sm"></span>
                        Zero waste School
                    </h2>
                    <p className="font-bold text-sm text-[#6d6a8a] leading-relaxed">
                        โรงเรียนเทศบาลอุโมงค์ 1<br />
                        ที่อยู่ 1/1 หมู่ 1 ตำบลอุโมงค์<br />
                        อำเภอเมือง จังหวัดลำพูน 51150<br />
                    </p>
                </div>

                {/* คอลัมน์ที่ 2: เกี่ยวกับโรงเรียน */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="font-black text-lg text-[#1e1b4b] mb-5 flex items-center gap-2.5">
                        <span className="w-2 h-6 bg-[#f59e0b] rounded-full shadow-sm"></span>
                        เกี่ยวกับโรงเรียน
                    </h3>
                    <ul className="flex flex-col gap-3.5 font-bold text-sm text-[#6d6a8a]">
                        {['หน้าหลัก (Dashboard)', 'ข้อมูลสถานศึกษา', 'รายชื่อสมาชิก'].map((item, idx) => (
                            <li key={idx}>
                                <a href="#" className="group flex items-center gap-2.5 hover:text-[#7c3aed] transition-all w-max">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] group-hover:bg-[#7c3aed] group-hover:scale-[1.8] transition-all"></span>
                                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* คอลัมน์ที่ 3: ข่าวสารและกิจกรรม */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.3s' }}>
                    <h3 className="font-black text-lg text-[#1e1b4b] mb-5 flex items-center gap-2.5">
                        <span className="w-2 h-6 bg-[#38bdf8] rounded-full shadow-sm"></span>
                        ข่าวสารและกิจกรรม
                    </h3>
                    <ul className="flex flex-col gap-3.5 font-bold text-sm text-[#6d6a8a]">
                        {['ข่าวสารและกิจกรรม', 'โครงการ/กิจกรรมเด่น', 'แลกรางวัล (Item Shop)'].map((item, idx) => (
                            <li key={idx}>
                                <a href="#" className="group flex items-center gap-2.5 hover:text-[#38bdf8] transition-all w-max">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] group-hover:bg-[#38bdf8] group-hover:scale-[1.8] transition-all"></span>
                                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* คอลัมน์ที่ 4: ติดต่อสอบถาม */}
                <div className="flex flex-col fade-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="font-black text-lg text-[#1e1b4b] mb-5 flex items-center gap-2.5">
                        <span className="w-2 h-6 bg-[#ec4899] rounded-full shadow-sm"></span>
                        ติดต่อสอบถาม
                    </h3>
                    <ul className="flex flex-col gap-4 font-bold text-sm text-[#6d6a8a]">
                        <li className="flex items-center gap-3.5 group cursor-default w-max">
                            <div className="w-10 h-10 rounded-[14px] bg-[#f0eeff] flex items-center justify-center shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05)] text-lg group-hover:bg-[#7c3aed] group-hover:text-white group-hover:shadow-[0_4px_10px_rgba(124,58,237,0.3),_inset_0_-2px_4px_rgba(0,0,0,0.2)] transition-all duration-300">📍</div>
                            <span className="group-hover:text-[#1e1b4b] transition-colors">โรงเรียนเทศบาลอุโมงค์ 1</span>
                        </li>
                        <li className="flex items-center gap-3.5 group cursor-default w-max">
                            <div className="w-10 h-10 rounded-[14px] bg-[#ecfdf5] flex items-center justify-center shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05)] text-lg group-hover:bg-[#10b981] group-hover:text-white group-hover:shadow-[0_4px_10px_rgba(16,185,129,0.3),_inset_0_-2px_4px_rgba(0,0,0,0.2)] transition-all duration-300">☎️</div>
                            <span className="group-hover:text-[#1e1b4b] transition-colors">053-541407</span>
                        </li>
                        <li className="flex items-center gap-3.5 group cursor-pointer w-max">
                            <div className="w-10 h-10 rounded-[14px] bg-[#fff7ed] flex items-center justify-center shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.05)] text-lg group-hover:bg-[#f59e0b] group-hover:text-white group-hover:shadow-[0_4px_10px_rgba(245,158,11,0.3),_inset_0_-2px_4px_rgba(0,0,0,0.2)] transition-all duration-300">📱</div>
                            <span className="group-hover:text-[#f59e0b] transition-colors">Line: @schoolwaste</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* ส่วนที่ 3: แถบ Copyright  */}
            <div className="bg-[#f0eeff] pt-5 pb-28 md:py-5 text-center mt-4">
                <Link to="/login" className="font-black text-[10px] md:text-xs text-[#6d6a8a] tracking-[0.2em] uppercase hover:text-[#7c3aed] transition-colors cursor-pointer inline-block">
                    © 2026 School Waste Management. All Rights Reserved.
                </Link>
            </div>
        </footer>
    )
}