import { Link } from 'react-router-dom'
// นำเข้าไอคอนสำหรับเมนูฝั่งขวา
import {
    PlusIcon, QrCodeIcon, TrashIcon,
    UsersIcon,
    BanknotesIcon,
    GlobeAsiaAustraliaIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    StarIcon
} from '@heroicons/react/24/outline'
import ReceiptBill from '../components/ReceiptBill'
export default function Home() {

    const membersList = [
        { id: 1, name: 'ด.ช. สมชาย รักดี', grade: 'ป.4/1', points: 1250 },
        { id: 2, name: 'ด.ญ. สมหญิง ใจบุญ', grade: 'ป.5/2', points: 980 },
        { id: 3, name: 'ด.ช. มานะ ขยันเรียน', grade: 'ป.6/1', points: 840 },
        { id: 4, name: 'ด.ญ. ปิติ ยินดี', grade: 'ป.3/3', points: 720 },
        { id: 5, name: 'ด.ช. ชูใจ ไชโย', grade: 'ป.4/2', points: 650 },
        { id: 6, name: 'ด.ญ. วีณา นารี', grade: 'ป.5/1', points: 500 },
    ];

    // ข้อมูลสถิติ 5 กล่อง
    const stats = [
        { title: 'ประเภทขยะมากที่สุด', value: 'พลาสติก', unit: '', icon: StarIcon, color: 'bg-[#ff6b9d]' },
        { title: 'ขยะรวมทั้งหมด', value: '450', unit: 'กก.', icon: TrashIcon, color: 'bg-[#ffd93d]' },
        { title: 'ยอดเงินออมรวม', value: '400', unit: 'บาท', icon: BanknotesIcon, color: 'bg-[#4ecdc4]' },
        { title: 'จำนวนสมาชิก', value: '170', unit: 'คน', icon: UsersIcon, color: 'bg-[#ff6b35]' },
        { title: 'ลดการปล่อยคาร์บอน', value: '155.53', unit: 'kgCO₂e', icon: GlobeAsiaAustraliaIcon, color: 'bg-[#a855f7]' },
    ];

    const detailedWaste = [
        { name: 'พลาสติกรวม', value: 850, color: 'bg-[#ff6b9d]' },
        { name: 'ขวดน้ำขุ่น', value: 420, color: 'bg-[#ffd93d]' },
        { name: 'ขวดน้ำใส', value: 380, color: 'bg-[#4ecdc4]' },
        { name: 'ขวดน้ำ PET สี', value: 310, color: 'bg-[#a855f7]' },
        { name: 'LDPE (ถุงพลาสติก, ถุงแกง, ฟิล์ม)', value: 290, color: 'bg-[#ff6b35]' },
        { name: 'กระดาษขาวดำ', value: 650, color: 'bg-[#ff6b9d]' },
        { name: 'กระดาษสีรวม/เศษ', value: 410, color: 'bg-[#ffd93d]' },
        { name: 'กระดาษลัง', value: 890, color: 'bg-[#4ecdc4]' },
        { name: 'กระป๋องกาแฟ/นม/ปลาประป๋อง', value: 220, color: 'bg-[#a855f7]' },
        { name: 'เหล็กหนา', value: 150, color: 'bg-[#ff6b35]' },
        { name: 'เหล็กบาง', value: 180, color: 'bg-[#ff6b9d]' },
        { name: 'สังกะสี', value: 90, color: 'bg-[#ffd93d]' },
        { name: 'กระป๋องเบียร์, โค้ก', value: 340, color: 'bg-[#4ecdc4]' },
        { name: 'กล่องเครื่องดื่ม UHT', value: 120, color: 'bg-[#a855f7]' },
    ];

    // คำนวณหาค่าที่เยอะที่สุด เพื่อเอามาทำสัดส่วนความยาวของหลอดกราฟ (100%)
    const maxWasteValue = Math.max(...detailedWaste.map(item => item.value));

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">

            {/* 1. ส่วนหัวข้อ (ขีดเส้นใต้สไตล์ Memphis) */}
            <div>
                <h1 className="font-['Fredoka_One'] text-4xl text-[#2d2d2d] tracking-wide relative inline-block">
                    Dashboard
                    {/* ขีดเส้นใต้หนาๆ */}
                    <div className="absolute -bottom-2 left-0 w-full h-[4px] bg-[#2d2d2d] rounded-full"></div>
                    <div className="absolute -bottom-4 left-4 w-3/4 h-[4px] bg-[#ff6b9d] rounded-full"></div>
                </h1>
            </div>

            {/* 2. กล่องสถิติ 5 กล่อง */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`${stat.color} border-[3px] border-[#2d2d2d] rounded-2xl shadow-[4px_4px_0px_#2d2d2d] p-4 flex flex-col hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2d2d2d] transition-all`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-white/30 border-[2px] border-[#2d2d2d] rounded-xl">
                                <stat.icon className="w-6 h-6 text-[#2d2d2d]" />
                            </div>
                        </div>
                        <p className="font-['Nunito'] font-bold text-[#2d2d2d] text-sm opacity-90">{stat.title}</p>
                        <div className="flex items-baseline gap-1 mt-1 text-[#2d2d2d]">
                            <span className="font-['Fredoka_One'] text-3xl text-white drop-shadow-[2px_2px_0px_#2d2d2d]">{stat.value}</span>
                            <span className="font-bold font-['Nunito'] text-sm">{stat.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. ส่วนเนื้อหาหลัก (Grid แบ่งซ้าย-ขวา) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ============================== */}
                {/* คอลัมน์ซ้าย (กินพื้นที่ 2 ใน 3 ส่วน) - ข้อมูลสมาชิก */}
                {/* ============================== */}
                <div className="lg:col-span-2">
                    <div className="bg-white border-[3px] border-[#2d2d2d] rounded-2xl shadow-[6px_6px_0px_#2d2d2d] p-6 relative h-full flex flex-col">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#ff6b9d] rounded-t-xl border-b-[3px] border-[#2d2d2d]"></div>

                        <div className="flex justify-between items-end mt-4 mb-6">
                            <h2 className="font-['Fredoka_One'] text-2xl text-[#2d2d2d]">สมาชิกยอดเยี่ยม (Top 6)</h2>
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            {membersList.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="flex justify-between items-center p-3 border-[2px] border-[#2d2d2d] rounded-xl hover:bg-[#f0fffe] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#2d2d2d] transition-all cursor-default"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full border-[2px] border-[#2d2d2d] bg-[#ffd93d] flex items-center justify-center font-bold text-[#2d2d2d]">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#2d2d2d] font-['Nunito']">{member.name}</p>
                                            <p className="text-sm text-[#666] font-semibold">ชั้น {member.grade}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-['Fredoka_One'] text-[#ff6b9d] text-lg">{member.points}</p>
                                        <p className="text-xs font-bold text-[#555]">แต้ม</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                to="/members"
                                className="inline-flex items-center gap-2 bg-[#ffd93d] border-[3px] border-[#2d2d2d] rounded-full px-8 py-3 font-['Nunito'] font-black text-lg text-[#2d2d2d] shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2d2d2d] active:translate-y-1 active:shadow-[2px_2px_0px_#2d2d2d] transition-all uppercase tracking-wide"
                            >
                                ดูรายชื่อทั้งหมด <span className="text-xl">➔</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ============================== */}
                {/* คอลัมน์ขวา (กินพื้นที่ 1 ใน 3 ส่วน) - พื้นที่กราฟแท่ง */}
                {/* ============================== */}
                <div className="lg:col-span-1 flex flex-col h-full">
                    <div className="bg-[#f0fffe] border-[3px] border-[#2d2d2d] rounded-2xl shadow-[6px_6px_0px_#2d2d2d] p-6 relative flex-1 flex flex-col items-center">
                        <h2 className="font-['Fredoka_One'] text-xl text-[#2d2d2d] mb-6 w-full text-left">สัดส่วนประเภทขยะ</h2>

                        {/* กราฟวงกลม (ใช้ CSS conic-gradient ไล่สีตามเปอร์เซ็นต์) */}
                        <div
                            className="w-40 h-40 rounded-full border-[3px] border-[#2d2d2d] shadow-[4px_4px_0px_#2d2d2d] mb-8 relative flex-shrink-0"
                            style={{
                                background: `conic-gradient(
                   #ff6b9d 0% 30%, 
                   #ffd93d 30% 55%, 
                   #4ecdc4 55% 75%, 
                   #a855f7 75% 85%, 
                   #ff6b35 85% 95%, 
                   #9ca3af 95% 100%
                 )`
                            }}
                        >
                            {/* วงกลมสีขาวตรงกลางเจาะรูให้เป็นโดนัท (ถ้าอยากได้พายเต็มวง ให้ลบ div นี้ทิ้งได้เลยครับ) */}
                            <div className="absolute inset-8 bg-[#f0fffe] rounded-full border-[3px] border-[#2d2d2d]"></div>
                        </div>

                        {/* คำอธิบาย (Legend) สี, ชื่อ, % */}
                        <div className="w-full flex flex-col gap-3 font-['Nunito'] font-bold text-base text-[#2d2d2d]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#ff6b9d] border-2 border-[#2d2d2d] rounded-full"></span>พลาสติก</div>
                                <span className="font-['Fredoka_One'] text-lg text-[#ff6b9d]">30%</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#ffd93d] border-2 border-[#2d2d2d] rounded-full"></span>กระดาษ</div>
                                {/* สีเหลืองอาจจะกลืนกับพื้นหลัง เลยแอบเติมขอบดำบางๆ ให้ตัวเลขด้วย drop-shadow ครับ */}
                                <span className="font-['Fredoka_One'] text-lg text-[#ffd93d] drop-shadow-[1px_1px_0px_#2d2d2d]">25%</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#4ecdc4] border-2 border-[#2d2d2d] rounded-full"></span>แก้ว</div>
                                <span className="font-['Fredoka_One'] text-lg text-[#4ecdc4]">20%</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#a855f7] border-2 border-[#2d2d2d] rounded-full"></span>อลูมิเนียม</div>
                                <span className="font-['Fredoka_One'] text-lg text-[#a855f7]">10%</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#ff6b35] border-2 border-[#2d2d2d] rounded-full"></span>โลหะผสม</div>
                                <span className="font-['Fredoka_One'] text-lg text-[#ff6b35]">10%</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#9ca3af] border-2 border-[#2d2d2d] rounded-full"></span>เหล็ก</div>
                                <span className="font-['Fredoka_One'] text-lg text-[#9ca3af]">5%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ========================================= */}
            {/* ส่วนรายการรับซื้อขยะ (เรตราคาแบบใบเสร็จ) */}
            {/* ========================================= */}
            <div className="mt-12">
                <h2 className="font-black text-3xl text-[#2d2d2d] mb-8 relative inline-block">
                    รายการรับซื้อ
                    <div className="absolute -bottom-2 left-0 w-full h-[4px] bg-[#2d2d2d] rounded-full"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 px-4 py-6">
                    {/* บิลที่ 1 */}
                    <ReceiptBill
                        category="PL"
                        shopName="SchoolWaste"
                        date="23/07/26"
                        items={[
                            { name: "พลาสติกรวม", price: "5.00" },
                            { name: "ขวดน้ำขุ่น", price: "10.00" },
                            { name: "ขวดน้ำใส", price: "8.50" },
                            { name: "ขวดน้ำ PET สี", price: "4.00" },
                            { name: "LDPE (ถุงพลาสติก, ถุงแกง, ฟิล์ม)", price: "2.00" }
                        ]}
                    />

                    {/* พื้นที่สำหรับบิลที่ 2 และ 3 ในอนาคต */}
                    <ReceiptBill
                        category="P"
                        shopName="SchoolWaste"
                        date="23/07/26"
                        items={[
                            { name: "กระดาษขาวดำ", price: "5.00" },
                            { name: "กระดาษสีรวรม/ขาวดำ", price: "1.00" },
                            { name: "กระดาษลัง", price: "5.50" },

                        ]}
                    />

                    <ReceiptBill
                        category="M/NM/ETC"
                        shopName="SchoolWaste"
                        date="23/07/26"
                        items={[
                            { name: "กระป๋องกาแฟ/นม/ปลาประป๋อง", price: "5.00" },
                            { name: "เหล็กหนา", price: "1.00" },
                            { name: "เหล็กบาง", price: "5.50" },
                            { name: "สังกะสี", price: "5.50" },
                            { name: "กระป๋องเบียร์, โค้ก", price: "5.50" },
                            { name: "กล่องเครื่องดื่ม UHT", price: "5.50" },

                        ]}
                    />

                </div>
            </div>

            {/* 4. แถวล่างสุด (เต็มจอ) - กราฟแนวนอนแบบละเอียด */}
            <div className="bg-[#fff0f5] border-[3px] border-[#2d2d2d] rounded-2xl shadow-[6px_6px_0px_#2d2d2d] p-8 w-full">
                <h2 className="font-['Fredoka_One'] text-2xl text-[#2d2d2d] mb-8">รายละเอียดขยะทุกประเภท</h2>

                <div className="flex flex-col gap-4">
                    {detailedWaste.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">

                            {/* ชื่อประเภท */}
                            <div className="w-1/3 md:w-1/4 text-right font-['Nunito'] font-bold text-sm text-[#2d2d2d] truncate">
                                {item.name}
                            </div>

                            {/* หลอดกราฟ */}
                            <div className="flex-1 h-6 bg-white border-[2px] border-[#2d2d2d] rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.color} border-r-[2px] border-[#2d2d2d] transition-all duration-1000`}
                                    style={{ width: `${(item.value / maxWasteValue) * 100}%` }}
                                ></div>
                            </div>

                            {/* ตัวเลข */}
                            <div className="w-20 font-['Fredoka_One'] text-[#2d2d2d] text-right">
                                {item.value} <span className="text-xs font-['Nunito']">กก.</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}