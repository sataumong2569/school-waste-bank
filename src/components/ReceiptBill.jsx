
export default function ReceiptBill({ category, shopName, date, items }) {
    return (
        // คอนเทนเนอร์หลัก: เงาสีเบจทึบเยื้องซ้ายล่าง เหมือนในรูปต้นแบบ
        <div className="relative mx-auto w-full max-w-[320px]">
            {/* พื้นหลังเงาสีเบจ */}
            <div className="absolute top-4 -left-4 w-full h-full bg-[#e8dbce] rounded-sm -z-10"></div>

            {/* ตัวกระดาษใบเสร็จ */}
            <div className="bg-white border-[2px] border-[#2d2d2d] p-6 text-[#2d2d2d] font-mono shadow-sm">

                {/* หัวบิล */}
                <h3 className="text-center font-black text-2xl tracking-widest mb-6">RECEIPT</h3>

                {/* ข้อมูลร้านและวันที่ */}
                <div className="flex justify-between text-xs font-bold mb-4 uppercase">
                    <div>
                        <p>SHOP: {shopName}</p>
                        <p>TEL.: 053-541407</p>
                        <p>DATE: {date}</p>
                    </div>
                    <div className="text-right">
                        <p>CATE: {category}</p>
                    </div>
                </div>

                {/* เส้นประ */}
                <div className="border-t-[2px] border-dashed border-[#2d2d2d] my-4 w-full"></div>

                {/* รายการรับซื้อ */}
                <div className="flex flex-col gap-2 text-sm font-bold min-h-[140px]">
                    {items.map((item, index) => (
                        <div key={index} className="flex justify-between items-end gap-2">
                            {/* ชื่อรายการ */}
                            <span className="flex-1 leading-tight">{item.name}</span>
                            {/* ราคา */}
                            <span className="text-right shrink-0">{item.price}</span>
                        </div>
                    ))}
                </div>

                {/* เส้นประ */}
                <div className="border-t-[2px] border-dashed border-[#2d2d2d] my-4 w-full"></div>

                {/* ส่วนท้ายบิล */}
                <div className="text-xs font-bold flex justify-between mb-4">
                    <span>UNIT:</span>
                    <span>BAHT / KG</span>
                </div>

                <div className="border-t-[2px] border-dashed border-[#2d2d2d] my-4 w-full"></div>

                <p className="text-center text-sm font-black mb-3">THANK YOU</p>

                {/* บาร์โค้ดจำลอง */}
                <div className="flex justify-center h-10 w-full gap-[2px]">
                    <div className="w-1 bg-[#2d2d2d]"></div>
                    <div className="w-[2px] bg-[#2d2d2d]"></div>
                    <div className="w-2 bg-[#2d2d2d]"></div>
                    <div className="w-1 bg-[#2d2d2d]"></div>
                    <div className="w-[3px] bg-[#2d2d2d]"></div>
                    <div className="w-[1px] bg-[#2d2d2d]"></div>
                    <div className="w-1.5 bg-[#2d2d2d]"></div>
                    <div className="w-1 bg-[#2d2d2d]"></div>
                    <div className="w-[2px] bg-[#2d2d2d]"></div>
                    <div className="w-2 bg-[#2d2d2d]"></div>
                    <div className="w-[1px] bg-[#2d2d2d]"></div>
                    <div className="w-[3px] bg-[#2d2d2d]"></div>
                    <div className="w-1 bg-[#2d2d2d]"></div>
                </div>

            </div>
        </div>
    );
}