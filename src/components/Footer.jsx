import { Link } from 'react-router-dom';
import umonglogo from '../assets/umong1municipal_icon_notra.webp';

export default function Footer() {
    return (
        <footer className="w-full bg-[#f8fafc] pt-16 pb-8 px-12 md:px-32 border-t border-[#e2e8f0]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">

                {/* ================= ฝั่งซ้าย: โลโก้ + ชื่อโรงเรียน (บรรทัดเดียว) + ที่อยู่ ================= */}
                <div className="w-full md:w-[55%] flex flex-col items-start">

                    {/* แถวบน: โลโก้ + ชื่อโรงเรียน */}
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-white rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-[#e2e8f0]/60 flex items-center justify-center">
                            <img
                                src={umonglogo}
                                alt="Logo"
                                width="64"
                                height="64"
                                loading="lazy"
                                className="w-26 h-26 object-contain"
                            />
                        </div>
                        <h3 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">
                            โรงเรียนเทศบาลอุโมงค์ 1
                        </h3>
                    </div>

                    {/* รายละเอียดส่วนล่าง */}
                    <div className="w-full">
                        {/* เส้นคั่น */}
                        <div className="w-full h-[1px] bg-[#cbd5e1] mb-4"></div>

                        {/* ที่อยู่ */}
                        <p className="text-[#64748b] text-sm leading-relaxed font-['Nunito'] font-semibold">
                            ที่อยู่ 1/1 หมู่ 1 ตำบลอุโมงค์ อำเภอเมือง<br />
                            จังหวัดลำพูน รหัสไปรษณีย์ 51150<br />
                            โทรศัพท์ 053-541407
                        </p>
                    </div>
                </div>


                {/* ================= ฝั่งขวา: เมนู 2 คอลัมน์ ================= */}
                <div className="w-full md:w-[45%] grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">

                    {/* คอลัมน์ย่อย 1: เกี่ยวกับโรงเรียน */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-base text-[#1e1b4b] mb-3">
                            เกี่ยวกับโรงเรียน
                        </h3>
                        <div className="w-full h-[2px] bg-[#cbd5e1] mb-4"></div>

                        <ul className="flex flex-col gap-3 font-bold text-sm text-[#6d6a8a]">
                            <li>
                                <Link to="/" className="hover:text-[#7c3aed] transition-colors flex items-center gap-1.5">
                                    <span className="text-xs text-[#7c3aed]">▸</span> หน้าหลัก
                                </Link>
                            </li>
                            <li>
                                <Link to="/members" className="hover:text-[#7c3aed] transition-colors flex items-center gap-1.5">
                                    <span className="text-xs text-[#7c3aed]">▸</span> ข้อมูลสมาชิก
                                </Link>
                            </li>
                            <li>
                                <a href="https://umong1municipal.ac.th/" target="_blank" rel="noopener noreferrer" className="hover:text-[#7c3aed] transition-colors flex items-center gap-1.5">
                                    <span className="text-xs text-[#7c3aed]">▸</span> ข้อมูลสถานศึกษา
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* คอลัมน์ย่อย 2: ติดต่อสอบถาม */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-base text-[#1e1b4b] mb-3">
                            ติดต่อสอบถาม
                        </h3>
                        <div className="w-full h-[2px] bg-[#cbd5e1] mb-4"></div>

                        <ul className="flex flex-col gap-3 text-sm text-[#6d6a8a] font-medium">
                            <li className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs shrink-0 shadow-sm">📞</span>
                                053-541407
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs shrink-0 shadow-sm">✉️</span>
                                email@umong1.ac.th
                            </li>
                        </ul>
                    </div>

                </div>

            </div>

            {/* ลิขสิทธิ์ */}
            <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-[#e2e8f0] text-center text-[#94a3b8] text-xs font-bold">
                © 2026 Umong Municipal School 1 - All rights reserved.
            </div>
        </footer>
    )
}