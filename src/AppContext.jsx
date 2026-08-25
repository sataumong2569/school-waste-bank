import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, increment, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_PRICES, WASTE_CATEGORIES } from './utils/wasteConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // ==========================================
    // STATE: ข้อมูลทั้งหมดของระบบ
    // ==========================================
    const [members, setMembers] = useState([]);
    const [pricing, setPricing] = useState(DEFAULT_PRICES);
    const [priceUpdatedAt, setPriceUpdatedAt] = useState(null);
    const [duration, setDuration] = useState({ round1: 15, round2: 25 });
    const [rewards, setRewards] = useState([]);

    // ระบบบิลรวม (System Stats)
    const [sysStats, setSysStats] = useState({
        totalBalance: 0,
        totalCarbon: 0,
        totalMembers: 0,
        totalWeight: 0,
        categories: {},
        items: {}
    });

    const [isAppLoading, setIsAppLoading] = useState(true);

    // ==========================================
    // โหลดข้อมูลจาก Firebase (โหลดครั้งเดียวตอนเปิดเว็บ)
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

                // 2. ดึงข้อมูลบิลรวมกลาง (System Stats)
                const statsRef = doc(db, 'system', 'stats');
                const statsSnap = await getDoc(statsRef);
                if (statsSnap.exists()) {
                    setSysStats(statsSnap.data());
                } else {
                    const initialStats = { totalBalance: 0, totalCarbon: 0, totalMembers: 0, totalWeight: 0, categories: {}, items: {} };
                    await setDoc(statsRef, initialStats);
                    setSysStats(initialStats);
                }

            } catch (error) {
                console.error("Error fetching core data:", error);
            } finally {
                // 🚀 หัวใจสำคัญ: ปลดล็อกหน้าจอโหลดทันทีที่ได้สถิติหลัก!
                // ไม่ต้องรอโหลดรายชื่อเด็กทั้งโรงเรียน ผู้ใช้จะได้เห็นหน้าเว็บทันที
                setIsAppLoading(false);
            }

            // 3. ดึง Directory สมาชิก (ทำเป็น Background Process ภายหลัง)
            // ระหว่างที่แอบดึงข้อมูลก้อนนี้ ผู้ใช้จะเห็นหน้า Dashboard สวยๆ ไปพลางๆ แล้ว
            try {
                const membersRef = collection(db, 'members');
                const membersSnap = await getDocs(membersRef);
                const loadedMembers = membersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMembers(loadedMembers);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchInitialData();
    }, []);

    // ==========================================
    // ACTIONS: ฟังก์ชันบันทึกข้อมูลแบบประหยัด Read/Write
    // ==========================================
    const updatePricing = async (newPricing) => {
        const now = new Date();
        setPricing(newPricing);
        setPriceUpdatedAt(now);
        try {
            await updateDoc(doc(db, 'system', 'config'), { pricing: newPricing, priceUpdatedAt: now });
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

    const addMember = async (newMember) => {
        const newId = `uid_${Date.now()}`;
        const initialBalance = parseFloat(newMember.balance) || 0;
        const initialCarbon = parseFloat(newMember.carbonPoints) || 0;
        const initialReward = parseFloat(newMember.rewardPoints) || 0;

        const memberWithId = {
            ...newMember, id: newId, balance: initialBalance,
            carbonPoints: initialCarbon.toFixed(2), rewardPoints: initialReward.toFixed(2), history: []
        };

        setMembers([...members, memberWithId]);
        setSysStats(prev => ({
            ...prev, totalMembers: prev.totalMembers + 1,
            totalBalance: prev.totalBalance + initialBalance, totalCarbon: prev.totalCarbon + initialCarbon
        }));

        try {
            await setDoc(doc(db, 'members', newId), memberWithId);
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(1), totalBalance: increment(initialBalance), totalCarbon: increment(initialCarbon)
            });
        } catch (error) { console.error("Error adding member:", error); }
    };

    const updateMember = async (updatedMember) => {
        const oldMember = members.find(m => m.id === updatedMember.id);
        if (!oldMember) return;

        const balanceDiff = (parseFloat(updatedMember.balance) || 0) - (parseFloat(oldMember.balance) || 0);
        const carbonDiff = (parseFloat(updatedMember.carbonPoints) || 0) - (parseFloat(oldMember.carbonPoints) || 0);

        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));

        if (balanceDiff !== 0 || carbonDiff !== 0) {
            setSysStats(prev => ({
                ...prev, totalBalance: Math.max(0, prev.totalBalance + balanceDiff), totalCarbon: Math.max(0, prev.totalCarbon + carbonDiff)
            }));
        }

        try {
            await updateDoc(doc(db, 'members', updatedMember.id), updatedMember);
            if (balanceDiff !== 0 || carbonDiff !== 0) {
                await updateDoc(doc(db, 'system', 'stats'), {
                    totalBalance: increment(balanceDiff), totalCarbon: increment(carbonDiff)
                });
            }
        } catch (e) { console.error("Error updating member:", e); }
    };

    const deleteMember = async (memberId) => {
        const memberToDelete = members.find(m => m.id === memberId);
        if (!memberToDelete) return;

        const moneyToDeduct = parseFloat(memberToDelete.balance) || 0;
        const carbonToDeduct = parseFloat(memberToDelete.carbonPoints) || 0;

        setMembers(members.filter(m => m.id !== memberId));
        setSysStats(prev => ({
            ...prev, totalMembers: Math.max(0, prev.totalMembers - 1),
            totalBalance: Math.max(0, prev.totalBalance - moneyToDeduct), totalCarbon: Math.max(0, prev.totalCarbon - carbonToDeduct)
        }));

        try {
            await deleteDoc(doc(db, 'members', memberId));
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(-1), totalBalance: increment(-moneyToDeduct), totalCarbon: increment(-carbonToDeduct)
            });
        } catch (error) {
            console.error("Error deleting member:", error);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };

    const processDeposit = async (member, depositCart, cartTotalMoney, cartTotalCarbon) => {
        const moneyAdded = parseFloat(cartTotalMoney);
        const carbonAdded = parseFloat(cartTotalCarbon);
        let weightAdded = 0;

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

        // เตรียมข้อมูลประวัติใหม่ของเด็ก
        const newHistoryEntries = depositCart.map(item => {
            const w = parseFloat(item.weight) || 0;
            weightAdded += w;
            return { type: item.item, weight: w.toFixed(1), date: formattedDate };
        });

        const combinedHistory = [...newHistoryEntries, ...(member.history || [])].slice(0, 10);
        const newBalance = (parseFloat(member.balance) || 0) + moneyAdded;
        const newCarbon = (parseFloat(member.carbonPoints) || 0) + carbonAdded;
        const newReward = (parseFloat(member.rewardPoints) || 0) + carbonAdded;

        const updatedMember = {
            ...member, balance: newBalance, carbonPoints: newCarbon.toFixed(2),
            rewardPoints: newReward.toFixed(2), history: combinedHistory
        };

        // เตรียมข้อมูลการอัปเดตบิลรวมสำหรับส่งไป Firebase
        const statsUpdates = {
            totalBalance: increment(moneyAdded),
            totalCarbon: increment(carbonAdded),
            totalWeight: increment(weightAdded)
        };

        // อัปเดตหน้าจอทันที (Optimistic UI)
        setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));

        setSysStats(prev => {
            const nextStats = { ...prev };
            nextStats.totalBalance = (prev.totalBalance || 0) + moneyAdded;
            nextStats.totalCarbon = (prev.totalCarbon || 0) + carbonAdded;
            nextStats.totalWeight = (prev.totalWeight || 0) + weightAdded;

            nextStats.categories = { ...(prev.categories || {}) };
            nextStats.items = { ...(prev.items || {}) };

            depositCart.forEach(item => {
                const w = parseFloat(item.weight) || 0;

                // อัปเดตยอดแยกตามขยะแต่ละชนิด
                nextStats.items[item.item] = (nextStats.items[item.item] || 0) + w;
                statsUpdates[`items.${item.item}`] = increment(w);

                // ค้นหาและอัปเดตยอดแยกตามหมวดหมู่หลัก
                for (const [catKey, catVal] of Object.entries(WASTE_CATEGORIES)) {
                    if (catVal.items.includes(item.item)) {
                        nextStats.categories[catKey] = (nextStats.categories[catKey] || 0) + w;
                        statsUpdates[`categories.${catKey}`] = increment(w);
                        break;
                    }
                }
            });

            return nextStats;
        });

        // ยิงข้อมูลเก็บลง Firebase
        try {
            await updateDoc(doc(db, 'members', updatedMember.id), updatedMember);
            await updateDoc(doc(db, 'system', 'stats'), statsUpdates);

            const txId = `tx_${Date.now()}`;
            await setDoc(doc(db, 'transactions', txId), {
                memberId: member.id, memberName: member.fullName, items: depositCart,
                totalMoney: moneyAdded, totalCarbon: carbonAdded, timestamp: new Date()
            });
        } catch (error) {
            console.error("Error processing deposit:", error);
            alert("บันทึกข้อมูลไม่สมบูรณ์ กรุณาตรวจสอบอินเทอร์เน็ต");
        }
    };

    const contextValue = useMemo(() => ({
        isAppLoading, sysStats,
        members, setMembers, addMember, updateMember, processDeposit, deleteMember,
        pricing, updatePricing, priceUpdatedAt,
        duration, updateDuration,
        rewards, updateRewards
    }), [isAppLoading, sysStats, members, pricing, priceUpdatedAt, duration, rewards]);

    return (
        <AppContext.Provider value={contextValue}>
            {isAppLoading ? <AppGlobalLoader /> : children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};

// ==========================================
// UI Component: หน้าจอโหลด
// ==========================================
const AppGlobalLoader = () => (
    <div className="w-full overflow-hidden bg-[#f8fafc] min-h-screen cursor-wait">
        <div className="w-full bg-[#f0eeff] pt-8 md:pt-16 pb-16">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between min-h-[50vh] mb-20">
                    <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
                        <div className="w-48 h-10 bg-white/60 rounded-full animate-pulse shadow-sm"></div>
                        <div className="w-full max-w-lg space-y-4">
                            <div className="h-12 md:h-16 bg-gray-300/60 rounded-2xl animate-pulse w-full"></div>
                            <div className="h-12 md:h-16 bg-gray-300/60 rounded-2xl animate-pulse w-3/4"></div>
                        </div>
                        <div className="w-full max-w-md space-y-3 mt-2">
                            <div className="h-4 bg-gray-300/50 rounded-full animate-pulse w-full"></div>
                            <div className="h-4 bg-gray-300/50 rounded-full animate-pulse w-5/6"></div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center mt-16 md:mt-0 relative">
                        <div className="w-56 h-64 md:w-72 md:h-80 bg-gray-200/60 rounded-[32px] animate-pulse border-4 border-gray-100/50"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);