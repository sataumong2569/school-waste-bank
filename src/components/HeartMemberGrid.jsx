import React from 'react';
import { HeartIcon, } from '@heroicons/react/24/outline';
import { useApp } from '../AppContext';
import { getOptimizedImageUrl } from '../utils/uploadImage';

const heartCoordinates = [
    // แถว 1
    { col: 3, row: 1 }, { col: 4, row: 1 }, { col: 8, row: 1 }, { col: 9, row: 1 },
    // แถว 2
    { col: 2, row: 2 }, { col: 3, row: 2 }, { col: 4, row: 2 }, { col: 5, row: 2 }, { col: 7, row: 2 }, { col: 8, row: 2 }, { col: 9, row: 2 }, { col: 10, row: 2 },
    // แถว 3
    { col: 1, row: 3 }, { col: 2, row: 3 }, { col: 3, row: 3 }, { col: 4, row: 3 }, { col: 5, row: 3 }, { col: 6, row: 3 }, { col: 7, row: 3 }, { col: 8, row: 3 }, { col: 9, row: 3 }, { col: 10, row: 3 }, { col: 11, row: 3 },
    // แถว 4
    { col: 1, row: 4 }, { col: 2, row: 4 }, { col: 3, row: 4 }, { col: 4, row: 4 }, { col: 5, row: 4 }, { col: 6, row: 4 }, { col: 7, row: 4 }, { col: 8, row: 4 }, { col: 9, row: 4 }, { col: 10, row: 4 }, { col: 11, row: 4 },
    // แถว 5
    { col: 1, row: 5 }, { col: 2, row: 5 }, { col: 3, row: 5 }, { col: 4, row: 5 }, { col: 5, row: 5 }, { col: 6, row: 5 }, { col: 7, row: 5 }, { col: 8, row: 5 }, { col: 9, row: 5 }, { col: 10, row: 5 }, { col: 11, row: 5 },
    // แถว 6
    { col: 2, row: 6 }, { col: 3, row: 6 }, { col: 4, row: 6 }, { col: 5, row: 6 }, { col: 6, row: 6 }, { col: 7, row: 6 }, { col: 8, row: 6 }, { col: 9, row: 6 }, { col: 10, row: 6 },
    // แถว 7
    { col: 3, row: 7 }, { col: 4, row: 7 }, { col: 5, row: 7 }, { col: 6, row: 7 }, { col: 7, row: 7 }, { col: 8, row: 7 }, { col: 9, row: 7 },
    // แถว 8
    { col: 4, row: 8 }, { col: 5, row: 8 }, { col: 6, row: 8 }, { col: 7, row: 8 }, { col: 8, row: 8 },
    // แถว 9
    { col: 5, row: 9 }, { col: 6, row: 9 }, { col: 7, row: 9 },
    // แถว 10
    { col: 6, row: 10 }
].map((item, index) => ({ id: index + 1, ...item }));

export default function HeartMemberGrid() {
    const { members } = useApp();

    const activeMembers = [...members]
        .filter(m => m.balance > 0 || m.carbonPoints > 0)
        .sort((a, b) => b.balance - a.balance);

    const recentDepositMembers = [...members]
        .filter(m => (m.balance > 0 || m.carbonPoints > 0))
        .reverse();

    return (
        <div className="clay-card p-6 md:p-8 relative h-full flex flex-col bg-white">

            {/* Header */}
            <div className="flex flex-col gap-1 mb-4 shrink-0 z-10 relative">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/*  เปลี่ยนแถบสีเป็นสีชมพูหัวใจ พร้อมออร่าเรืองแสง */}
                        <div className="w-2 h-7 bg-[#ec4899] rounded-full "></div>
                        <h2 className="font-['Fredoka_One'] text-xl md:text-2xl text-[#1e1b4b]">ผู้ฝากขยะล่าสุด</h2>
                    </div>

                </div>

                <p className="text-[11px] md:text-xs font-bold text-[#64748b] ml-5 mt-0.5">
                    มาช่วยกันเติมเต็มหัวใจด้วยการฝากขยะ!
                </p>
            </div>

            {/* กล่องบรรจุหัวใจ */}
            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[350px]">

                {/* 🟢 อัปเกรด: ขยายขนาด max-width ให้เต็มพื้นที่มากขึ้น และเพิ่ม gap ให้ช่องดูชัดขึ้น */}
                <div
                    className="grid gap-[3px] sm:gap-1.5 w-full max-w-[320px] sm:max-w-[450px] md:max-w-[520px] mx-auto"
                    style={{
                        gridTemplateColumns: 'repeat(11, 1fr)',
                        gridTemplateRows: 'repeat(10, 1fr)'
                    }}
                >
                    {heartCoordinates.map((coord, index) => {
                        const member = recentDepositMembers[index];

                        return (
                            <div
                                key={coord.id}
                                style={{ gridColumnStart: coord.col, gridRowStart: coord.row }}
                                className="relative group aspect-square w-full h-full"
                            >
                                {member ? (
                                    <div className="w-full h-full rounded-md sm:rounded-lg overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 group-hover:scale-150 group-hover:z-20 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-[#10b981]">
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
                                            <div className={`w-full h-full flex items-center justify-center text-white font-black text-[10px] sm:text-xs md:text-sm ${member.color || 'bg-[#10b981]'}`}>
                                                {member.fullName.split(' ')[1]?.[0] || 'U'}
                                            </div>
                                        )}
                                        {/* ป้ายชื่อ */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e1b4b] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-xl">
                                            {member.nickname || member.fullName.split(' ')[0]}
                                            <span className="text-[#34d399] ml-1">+{member.balance}฿</span> {/* โชว์ยอดเงินแถมไปใน Tooltip */}
                                        </div>
                                    </div>
                                ) : (

                                    <div className="w-full h-full bg-[#e2e8f0] rounded-md sm:rounded-lg border border-[#cbd5e1] shadow-inner transition-colors duration-300 hover:bg-[#cbd5e1]"></div>
                                )}
                            </div>
                        );
                    })}
                </div>


            </div>
        </div>
    );
}