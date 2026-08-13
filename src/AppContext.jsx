import { createContext, useState, useEffect, useContext } from 'react';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, increment, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_PRICES } from './utils/wasteConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // ==========================================
    //  STATE: ข้อมูลทั้งหมดของระบบ
    // ==========================================
    const [members, setMembers] = useState([]);
    const [pricing, setPricing] = useState(DEFAULT_PRICES);
    const [priceUpdatedAt, setPriceUpdatedAt] = useState(null);
    const [duration, setDuration] = useState({ round1: 15, round2: 25 });
    const [rewards, setRewards] = useState([]);

    //  ระบบบิลรวม 
    const [sysStats, setSysStats] = useState({ totalBalance: 0, totalCarbon: 0, totalMembers: 0 });

    const [isAppLoading, setIsAppLoading] = useState(true);

    // ==========================================
    //  โหลดข้อมูลจาก Firebase (โหลดครั้งเดียวตอนเปิดเว็บ)
    // ==========================================
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. ดึงข้อมูล Config (ราคา, รางวัล)
                const configRef = doc(db, 'system', 'config');
                const configSnap = await getDoc(configRef);
                if (configSnap.exists()) {
                    const data = configSnap.data();
                    if (data.pricing) setPricing(data.pricing);
                    if (data.priceUpdatedAt) {
                        setPriceUpdatedAt(data.priceUpdatedAt.toDate ? data.priceUpdatedAt.toDate() : new Date(data.priceUpdatedAt));
                    }
                    if (data.duration) setDuration(data.duration);
                    if (data.rewards) setRewards(data.rewards);
                } else {
                    await setDoc(configRef, { pricing: DEFAULT_PRICES, duration: { round1: 15, round2: 25 }, rewards: [] });
                }

                // 2.  ดึงข้อมูลบิลรวม (System Stats)
                const statsRef = doc(db, 'system', 'stats');
                const statsSnap = await getDoc(statsRef);
                if (statsSnap.exists()) {
                    setSysStats(statsSnap.data());
                } else {
                    await setDoc(statsRef, { totalBalance: 0, totalCarbon: 0, totalMembers: 0 });
                }

                // 3. ดึง Directory สมาชิกและคำนวณยอดรวมจริงเพื่อป้องกันตัวเลขติดลบ
                const membersRef = collection(db, 'members');
                const membersSnap = await getDocs(membersRef);
                const loadedMembers = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMembers(loadedMembers);

                // คำนวณยอดจริงจากสมาชิกทั้งหมดที่มีอยู่จริงในฐานข้อมูล
                const realTotalMembers = loadedMembers.length;
                const realTotalBalance = loadedMembers.reduce((sum, m) => sum + (parseFloat(m.balance) || 0), 0);
                const realTotalCarbon = loadedMembers.reduce((sum, m) => sum + (parseFloat(m.carbonPoints) || 0), 0);

                setSysStats({
                    totalMembers: realTotalMembers,
                    totalBalance: realTotalBalance,
                    totalCarbon: realTotalCarbon
                });

            } catch (error) {
                console.error("❌ Error fetching data:", error);
            } finally {
                setIsAppLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // ==========================================
    //  ACTIONS: ฟังก์ชันบันทึกข้อมูลแบบประหยัด Read/Write
    // ==========================================

    const updatePricing = async (newPricing) => {
        const now = new Date();
        setPricing(newPricing);
        setPriceUpdatedAt(now);
        try {
            await updateDoc(doc(db, 'system', 'config'), {
                pricing: newPricing,
                priceUpdatedAt: now
            });
        } catch (e) { }
    };

    const updateDuration = async (newDuration) => {
        setDuration(newDuration);
        try { await updateDoc(doc(db, 'system', 'config'), { duration: newDuration }); } catch (e) { }
    };

    const updateRewards = async (newRewards) => {
        setRewards(newRewards);
        try { await updateDoc(doc(db, 'system', 'config'), { rewards: newRewards }); } catch (e) { }
    };

    //  1. เพิ่มสมาชิกใหม่ (อัปเดตบิลรวมทั้ง จำนวนคน, เงินเริ่มต้น, คาร์บอนเริ่มต้น และ แต้มแลกของ)
    const addMember = async (newMember) => {
        const newId = `uid_${Date.now()}`;

        // ดึงยอดเริ่มต้นที่คุณกรอกในฟอร์ม (ถ้าไม่กรอกให้เป็น 0)
        const initialBalance = parseFloat(newMember.balance) || 0;
        const initialCarbon = parseFloat(newMember.carbonPoints) || 0;
        const initialReward = parseFloat(newMember.rewardPoints) || 0; //  1. ดึงค่าแต้มเครดิตที่แอดมินกรอก

        //  2. เอาตัวแปรมาจัดฟอร์แมตก่อนเซฟลงฐานข้อมูล
        const memberWithId = {
            ...newMember,
            id: newId,
            balance: initialBalance,
            carbonPoints: initialCarbon.toFixed(2),
            rewardPoints: initialReward.toFixed(2),
            history: []
        };

        // 1. อัปเดตหน้าจอทันที (Optimistic UI)
        setMembers([...members, memberWithId]);
        setSysStats(prev => ({
            ...prev,
            totalMembers: prev.totalMembers + 1,
            totalBalance: prev.totalBalance + initialBalance,
            totalCarbon: prev.totalCarbon + initialCarbon
        }));

        // 2. แอบเซฟลง Firebase
        try {
            await setDoc(doc(db, 'members', newId), memberWithId);
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(1),
                totalBalance: increment(initialBalance),
                totalCarbon: increment(initialCarbon)
            });
        } catch (error) { console.error("Error adding member:", error); }
    };

    // 🟢 2. แก้ไขข้อมูลสมาชิก (ถ้าแอดมินแก้ตัวเลขเงิน/คาร์บอน ต้องหา "ส่วนต่าง" เพื่อไปทบยอดบิลรวม)
    const updateMember = async (updatedMember) => {
        // หาข้อมูลเก่าของเด็กคนนี้ก่อน
        const oldMember = members.find(m => m.id === updatedMember.id);
        if (!oldMember) return;

        // คำนวณ "ส่วนต่าง" ของเงินและคาร์บอน (เผื่อแอดมินเข้าไปแก้ตัวเลข)
        const balanceDiff = (parseFloat(updatedMember.balance) || 0) - (parseFloat(oldMember.balance) || 0);
        const carbonDiff = (parseFloat(updatedMember.carbonPoints) || 0) - (parseFloat(oldMember.carbonPoints) || 0);

        // 1. อัปเดตหน้าจอทันที
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));

        if (balanceDiff !== 0 || carbonDiff !== 0) {
            setSysStats(prev => ({
                ...prev,
                totalBalance: Math.max(0, prev.totalBalance + balanceDiff),
                totalCarbon: Math.max(0, prev.totalCarbon + carbonDiff)
            }));
        }

        // 2. เซฟลง Firebase
        try {
            await updateDoc(doc(db, 'members', updatedMember.id), updatedMember);
            // อัปเดตบิลรวมเฉพาะตอนที่มีการเปลี่ยนตัวเลข
            if (balanceDiff !== 0 || carbonDiff !== 0) {
                await updateDoc(doc(db, 'system', 'stats'), {
                    totalBalance: increment(balanceDiff),
                    totalCarbon: increment(carbonDiff)
                });
            }
        } catch (e) { console.error("Error updating member:", e); }
    };

    // 🟢 ลบสมาชิก (และหักลบยอดออกจากบิลรวม)
    const deleteMember = async (memberId) => {
        // หาตัวเด็กที่จะลบ เพื่อดูว่ามีเงินและคาร์บอนเท่าไหร่ จะได้หักออกถูก
        const memberToDelete = members.find(m => m.id === memberId);
        if (!memberToDelete) return;

        const moneyToDeduct = parseFloat(memberToDelete.balance) || 0;
        const carbonToDeduct = parseFloat(memberToDelete.carbonPoints) || 0;

        // 1. อัปเดตหน้าจอทันที (Optimistic UI)
        setMembers(members.filter(m => m.id !== memberId));
        setSysStats(prev => ({
            ...prev,
            totalMembers: Math.max(0, prev.totalMembers - 1),
            totalBalance: Math.max(0, prev.totalBalance - moneyToDeduct),
            totalCarbon: Math.max(0, prev.totalCarbon - carbonToDeduct)
        }));

        // 2. ลบออกจาก Firebase
        try {
            await deleteDoc(doc(db, 'members', memberId));
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(-1),
                totalBalance: increment(-moneyToDeduct),
                totalCarbon: increment(-carbonToDeduct)
            });
        } catch (error) {
            console.error("Error deleting member:", error);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };

    //  2. รับฝากขยะ (แยกมาเป็นฟังก์ชันเฉพาะ เพื่อจัดการบิลรวมและประวัติ)
    const processDeposit = async (member, depositCart, cartTotalMoney, cartTotalCarbon) => {
        const moneyAdded = parseFloat(cartTotalMoney);
        const carbonAdded = parseFloat(cartTotalCarbon);

        // --- 1. เตรียมข้อมูลประวัติ ---
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

        const newHistoryEntries = depositCart.map(item => ({
            type: item.item, weight: parseFloat(item.weight).toFixed(1), date: formattedDate
        }));

        const combinedHistory = [...newHistoryEntries, ...(member.history || [])].slice(0, 10);
        const newBalance = (parseFloat(member.balance) || 0) + moneyAdded;
        const newCarbon = (parseFloat(member.carbonPoints) || 0) + carbonAdded;
        const newReward = (parseFloat(member.rewardPoints) || 0) + carbonAdded;

        const updatedMember = { ...member, balance: newBalance, carbonPoints: newCarbon.toFixed(2), rewardPoints: newReward.toFixed(2), history: combinedHistory };

        // --- 2. อัปเดตหน้าจอทันที (Optimistic UI) ---
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
        setSysStats(prev => ({
            ...prev,
            totalBalance: prev.totalBalance + moneyAdded,
            totalCarbon: prev.totalCarbon + carbonAdded
        }));

        // --- 3. ยิงข้อมูลเก็บลง Firebase  ---
        try {
            // อัปเดตข้อมูลเด็ก
            await updateDoc(doc(db, 'members', updatedMember.id), updatedMember);

            // อัปเดตบิลรวมแบบทบยอด (ประหยัด Read สุดๆ)
            await updateDoc(doc(db, 'system', 'stats'), {
                totalBalance: increment(moneyAdded),
                totalCarbon: increment(carbonAdded)
            });

            // โยนประวัติแบบเต็มลง Collection ลับ (transactions)
            const txId = `tx_${Date.now()}`;
            await setDoc(doc(db, 'transactions', txId), {
                memberId: member.id,
                memberName: member.fullName,
                items: depositCart,
                totalMoney: moneyAdded,
                totalCarbon: carbonAdded,
                timestamp: new Date()
            });

        } catch (error) {
            console.error("Error processing deposit:", error);
            alert("⚠️ บันทึกข้อมูลไม่สมบูรณ์ กรุณาตรวจสอบอินเทอร์เน็ต");
        }
    };

    return (
        <AppContext.Provider value={{
            isAppLoading,
            sysStats,
            members, setMembers, addMember, updateMember, processDeposit,
            pricing, updatePricing, priceUpdatedAt,
            duration, updateDuration, deleteMember,
            rewards, updateRewards
        }}>
            {isAppLoading ? (

                <div className="w-full overflow-hidden bg-[#f8fafc] min-h-screen cursor-wait">

                    {/* SECTION 1: HERO SKELETON */}
                    <div className="w-full bg-[#f0eeff] pt-8 md:pt-16 pb-16">
                        <div className="max-w-7xl mx-auto px-6 md:px-8">

                            <div className="flex flex-col md:flex-row items-center justify-between min-h-[50vh] mb-20">
                                {/* ซ้าย: ข้อความ */}
                                <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
                                    {/* Badge */}
                                    <div className="w-48 h-10 bg-white/60 rounded-full animate-pulse shadow-sm"></div>

                                    {/* Heading */}
                                    <div className="w-full max-w-lg space-y-4">
                                        <div className="h-12 md:h-16 bg-gray-300/60 rounded-2xl animate-pulse w-full"></div>
                                        <div className="h-12 md:h-16 bg-gray-300/60 rounded-2xl animate-pulse w-3/4"></div>
                                    </div>

                                    {/* Paragraph */}
                                    <div className="w-full max-w-md space-y-3 mt-2">
                                        <div className="h-4 bg-gray-300/50 rounded-full animate-pulse w-full"></div>
                                        <div className="h-4 bg-gray-300/50 rounded-full animate-pulse w-5/6"></div>
                                        <div className="h-4 bg-gray-300/50 rounded-full animate-pulse w-4/6"></div>
                                    </div>

                                    {/* Button */}
                                    <div className="h-14 w-40 bg-gray-300/70 rounded-full animate-pulse mt-4"></div>
                                </div>

                                {/* ขวา: 3D Elements Placeholder */}
                                <div className="w-full md:w-1/2 flex justify-center mt-16 md:mt-0 relative">
                                    <div className="absolute right-10 -top-10 w-32 h-32 bg-gray-300/50 rounded-full animate-pulse z-20"></div>
                                    <div className="w-56 h-64 md:w-72 md:h-80 bg-gray-200/60 rounded-[32px] animate-pulse border-4 border-gray-100/50 flex flex-col items-center justify-center gap-4">
                                        <div className="w-24 h-24 bg-gray-300/50 rounded-full animate-pulse"></div>
                                        <div className="bg-gray-300/40 w-2/3 h-4 rounded-full"></div>
                                        <div className="bg-gray-300/40 w-1/2 h-4 rounded-full"></div>
                                    </div>
                                    <div className="absolute left-10 bottom-0 w-8 h-8 bg-gray-300/60 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* กล่องสถิติ 5 กล่อง SKELETON */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-[24px] p-5 md:p-6 h-36 flex flex-col justify-between animate-pulse shadow-sm border border-white/60">
                                        <div className="w-12 h-12 bg-gray-200/80 rounded-[14px]"></div>
                                        <div>
                                            <div className="w-20 h-3 bg-gray-200/80 rounded-full mb-2.5"></div>
                                            <div className="w-16 h-8 bg-gray-300/70 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ข้อมูลสมาชิก & กราฟวงกลม SKELETON */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-[24px] p-6 md:p-8 h-full flex flex-col shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-2 h-7 bg-gray-200 animate-pulse rounded-full"></div>
                                            <div className="w-48 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col gap-3 flex-1">
                                            {Array.from({ length: 6 }).map((_, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-2xl animate-pulse border border-gray-100">
                                                    <div className="flex items-center gap-4 w-full">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                                                        <div className="flex flex-col gap-2 w-1/3">
                                                            <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                                                            <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Placeholder ฝั่งขวา (เผื่อสำหรับกราฟ) */}
                                <div className="hidden lg:block lg:col-span-1">
                                    <div className="bg-white rounded-[24px] p-6 h-full shadow-sm flex flex-col items-center justify-center animate-pulse">
                                        <div className="w-48 h-48 bg-gray-200 rounded-full mb-6"></div>
                                        <div className="w-3/4 h-4 bg-gray-200 rounded-full mb-3"></div>
                                        <div className="w-1/2 h-4 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};