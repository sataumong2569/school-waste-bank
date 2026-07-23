export default function Footer() {
    return (
        // ใช้ border ด้านบนหนาๆ เพื่อแยกส่วนเนื้อหากับ Footer ให้ชัดเจน
        <footer className="w-full bg-white border-t-[4px] border-[#2d2d2d] mt-20 relative z-10">

            {/* ลูกเล่นเส้นสีสไตล์ Memphis ตกแต่งขอบบน */}
            <div className="absolute -top-[4px] left-10 w-24 h-[4px] bg-[#ff6b9d]"></div>
            <div className="absolute -top-[4px] right-20 w-16 h-[4px] bg-[#4ecdc4]"></div>
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-32 h-[4px] bg-[#ffd93d]"></div>

            <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* คอลัมน์ที่ 1: ชื่อโปรเจกต์และที่อยู่ */}
                <div className="flex flex-col">
                    <h2 className="font-black text-2xl text-[#2d2d2d] mb-3 tracking-wide flex items-center gap-2">
                        SchoolWaste
                    </h2>
                    {/* เส้นคั่นตามแบบในรูป */}
                    <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full mb-4"></div>
                    <p className="font-bold text-sm text-[#555] leading-relaxed">
                        โรงเรียนเทศบาลอุโมงค์ 1<br />
                        ที่อยู่ 1/1 หมู่ 1 ตำบลอุโมงค์<br />
                        อำเภอเมือง จังหวัดลำพูน 51150<br />
                        โทรศัพท์ 053-541407
                    </p>
                </div>

                {/* คอลัมน์ที่ 2: เกี่ยวกับโรงเรียน */}
                <div className="flex flex-col">
                    <h3 className="font-black text-lg text-[#2d2d2d] mb-3">
                        เกี่ยวกับโรงเรียน
                    </h3>
                    {/* เส้นคั่น */}
                    <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full mb-4"></div>
                    <ul className="flex flex-col gap-3 font-bold text-sm text-[#555]">
                        <li>
                            <a href="#" className="hover:text-[#ff6b9d] hover:translate-x-2 transition-transform inline-block">
                                หน้าหลัก (Dashboard)
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#ff6b9d] hover:translate-x-2 transition-transform inline-block">
                                ข้อมูลสถานศึกษา
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#ff6b9d] hover:translate-x-2 transition-transform inline-block">
                                รายชื่อสมาชิก
                            </a>
                        </li>
                    </ul>
                </div>

                {/* คอลัมน์ที่ 3: ข่าวสารและกิจกรรม */}
                <div className="flex flex-col">
                    <h3 className="font-black text-lg text-[#2d2d2d] mb-3">
                        ข่าวสารและกิจกรรม
                    </h3>
                    {/* เส้นคั่น */}
                    <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full mb-4"></div>
                    <ul className="flex flex-col gap-3 font-bold text-sm text-[#555]">
                        <li>
                            <a href="#" className="hover:text-[#ff6b9d] hover:translate-x-2 transition-transform inline-block">
                                ข่าวสารและกิจกรรม
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#ff6b9d] hover:translate-x-2 transition-transform inline-block">
                                โครงการ/กิจกรรมเด่น
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-[#ff6b9d] hover:translate-x-2 transition-transform inline-block">
                                แลกรางวัล (Item Shop)
                            </a>
                        </li>
                    </ul>
                </div>

                {/* คอลัมน์ที่ 4: ติดต่อสอบถาม */}
                <div className="flex flex-col">
                    <h3 className="font-black text-lg text-[#2d2d2d] mb-3">
                        ติดต่อสอบถาม
                    </h3>
                    {/* เส้นคั่น */}
                    <div className="w-full h-[3px] bg-[#2d2d2d] rounded-full mb-4"></div>
                    <ul className="flex flex-col gap-3 font-bold text-sm text-[#555]">
                        <li className="flex items-center gap-2">
                            <span className="text-lg">📍</span> โรงเรียนเทศบาลอุโมงค์ 1
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-lg">☎️</span> 053-541407
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-lg">📱</span> Line: @schoolwaste
                        </li>
                    </ul>
                </div>

            </div>

            {/* ส่วนที่ 3: แถบ Copyright ด้านล่างสุด */}
            <div className="bg-[#2d2d2d] py-4 text-center border-t-[4px] border-[#2d2d2d]">
                <p className="font-black text-[10px] md:text-xs text-white tracking-[0.2em] uppercase">
                    © 2026 School Waste Management. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}