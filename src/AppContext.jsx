import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, increment, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_PRICES, WASTE_CATEGORIES } from './utils/wasteConfig';

const AppContext = createContext();

// ฟังก์ชันช่วยปัดเศษทศนิยม 2 ตำแหน่งและคงชนิดเป็น Number
const round2 = (num) => Math.round((Number(num) || 0) * 100) / 100;

export const AppProvider = ({ children }) => {
    const [members, setMembers] = useState([]);
    const [pricing, setPricing] = useState(DEFAULT_PRICES);
    const [priceUpdatedAt, setPriceUpdatedAt] = useState(null);
    const [duration, setDuration] = useState({ round1: 15, round2: 25 });
    const [rewards, setRewards] = useState([]);

    const [sysStats, setSysStats] = useState({
        totalBalance: 0,
        totalCarbon: 0,
        totalMembers: 0,
        totalWeight: 0,
        categories: {},
        items: {}
    });

    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. ดึงข้อมูล Config
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

                // 2. ดึงข้อมูล System Stats
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
                setIsAppLoading(false);
            }

            // 3. ดึง Directory สมาชิก (Background)
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

    const updatePricing = async (newPricing) => {
        const now = new Date();
        setPricing(newPricing);
        setPriceUpdatedAt(now);
        try {
            await updateDoc(doc(db, 'system', 'config'), { pricing: newPricing, priceUpdatedAt: now });
        } catch (e) {
            console.error("Error updating pricing:", e);
        }
    };

    const updateDuration = async (newDuration) => {
        setDuration(newDuration);
        try {
            await updateDoc(doc(db, 'system', 'config'), { duration: newDuration });
        } catch (e) {
            console.error("Error updating duration:", e);
        }
    };

    const updateRewards = async (newRewards) => {
        setRewards(newRewards);
        try {
            await updateDoc(doc(db, 'system', 'config'), { rewards: newRewards });
        } catch (e) {
            console.error("Error updating rewards:", e);
        }
    };

    const addMember = async (newMember) => {
        const newId = `uid_${Date.now()}`;
        const initialBalance = parseFloat(newMember.balance) || 0;
        const initialCarbon = round2(newMember.carbonPoints);
        const initialReward = round2(newMember.rewardPoints);

        const memberWithId = {
            ...newMember,
            id: newId,
            balance: initialBalance,
            carbonPoints: initialCarbon, // บันทึกเป็น Number
            rewardPoints: initialReward, // บันทึกเป็น Number
            history: []
        };

        try {
            await setDoc(doc(db, 'members', newId), memberWithId);
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(1),
                totalBalance: increment(initialBalance),
                totalCarbon: increment(initialCarbon)
            });

            setMembers(prev => [...prev, memberWithId]);
            setSysStats(prev => ({
                ...prev,
                totalMembers: prev.totalMembers + 1,
                totalBalance: round2(prev.totalBalance + initialBalance),
                totalCarbon: round2(prev.totalCarbon + initialCarbon)
            }));
        } catch (error) {
            console.error("Error adding member:", error);
            alert("บันทึกสมาชิกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ");
        }
    };

    const updateMember = async (updatedMember) => {
        const oldMember = members.find(m => m.id === updatedMember.id);
        if (!oldMember) return;

        const balanceDiff = (parseFloat(updatedMember.balance) || 0) - (parseFloat(oldMember.balance) || 0);
        const carbonDiff = (parseFloat(updatedMember.carbonPoints) || 0) - (parseFloat(oldMember.carbonPoints) || 0);

        try {
            await updateDoc(doc(db, 'members', updatedMember.id), updatedMember);
            if (balanceDiff !== 0 || carbonDiff !== 0) {
                await updateDoc(doc(db, 'system', 'stats'), {
                    totalBalance: increment(balanceDiff),
                    totalCarbon: increment(carbonDiff)
                });
            }

            // อัปเดต State เมื่อบันทึกสำเร็จ
            setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
            if (balanceDiff !== 0 || carbonDiff !== 0) {
                setSysStats(prev => ({
                    ...prev,
                    totalBalance: Math.max(0, round2(prev.totalBalance + balanceDiff)),
                    totalCarbon: Math.max(0, round2(prev.totalCarbon + carbonDiff))
                }));
            }
        } catch (e) {
            console.error("Error updating member:", e);
            alert("อัปเดตข้อมูลไม่สำเร็จ");
        }
    };

    const deleteMember = async (memberId) => {
        const memberToDelete = members.find(m => m.id === memberId);
        if (!memberToDelete) return;

        const moneyToDeduct = parseFloat(memberToDelete.balance) || 0;
        const carbonToDeduct = parseFloat(memberToDelete.carbonPoints) || 0;

        try {
            await deleteDoc(doc(db, 'members', memberId));
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(-1),
                totalBalance: increment(-moneyToDeduct),
                totalCarbon: increment(-carbonToDeduct)
            });

            // อัปเดต State เมื่อบันทึกสำเร็จ
            setMembers(prev => prev.filter(m => m.id !== memberId));
            setSysStats(prev => ({
                ...prev,
                totalMembers: Math.max(0, prev.totalMembers - 1),
                totalBalance: Math.max(0, round2(prev.totalBalance - moneyToDeduct)),
                totalCarbon: Math.max(0, round2(prev.totalCarbon - carbonToDeduct))
            }));
        } catch (error) {
            console.error("Error deleting member:", error);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };

    const processDeposit = async (member, depositCart, cartTotalMoney, cartTotalCarbon) => {
        const moneyAdded = parseFloat(cartTotalMoney) || 0;
        const carbonAdded = parseFloat(cartTotalCarbon) || 0;
        let weightAdded = 0;

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

        const newHistoryEntries = depositCart.map(item => {
            const w = round2(parseFloat(item.weight) || 0);
            weightAdded += w;
            return { type: item.item, weight: w, date: formattedDate };
        });

        const combinedHistory = [...newHistoryEntries, ...(member.history || [])].slice(0, 10);
        const newBalance = round2((parseFloat(member.balance) || 0) + moneyAdded);
        const newCarbon = round2((parseFloat(member.carbonPoints) || 0) + carbonAdded);
        const newReward = round2((parseFloat(member.rewardPoints) || 0) + carbonAdded);

        const updatedMember = {
            ...member,
            balance: newBalance,
            carbonPoints: newCarbon,
            rewardPoints: newReward,
            history: combinedHistory
        };

        const statsUpdates = {
            totalBalance: increment(moneyAdded),
            totalCarbon: increment(carbonAdded),
            totalWeight: increment(weightAdded)
        };

        depositCart.forEach(item => {
            const w = round2(parseFloat(item.weight) || 0);
            // แทนที่เครื่องหมายจุด (.) ด้วยขีดล่าง (_) เพื่อป้องกัน Firestore Dot-Notation Error
            const safeItemKey = item.item.replace(/\./g, '_');
            statsUpdates[`items.${safeItemKey}`] = increment(w);

            for (const [catKey, catVal] of Object.entries(WASTE_CATEGORIES)) {
                if (catVal.items.includes(item.item)) {
                    statsUpdates[`categories.${catKey}`] = increment(w);
                    break;
                }
            }
        });

        try {
            await updateDoc(doc(db, 'members', updatedMember.id), updatedMember);
            await updateDoc(doc(db, 'system', 'stats'), statsUpdates);

            const txId = `tx_${Date.now()}`;
            await setDoc(doc(db, 'transactions', txId), {
                memberId: member.id,
                memberName: member.fullName,
                items: depositCart,
                totalMoney: moneyAdded,
                totalCarbon: carbonAdded,
                timestamp: new Date()
            });

            setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
            setSysStats(prev => {
                const nextStats = { ...prev };
                nextStats.totalBalance = round2((prev.totalBalance || 0) + moneyAdded);
                nextStats.totalCarbon = round2((prev.totalCarbon || 0) + carbonAdded);
                nextStats.totalWeight = round2((prev.totalWeight || 0) + weightAdded);
                nextStats.categories = { ...(prev.categories || {}) };
                nextStats.items = { ...(prev.items || {}) };

                depositCart.forEach(item => {
                    const w = round2(parseFloat(item.weight) || 0);
                    const safeItemKey = item.item.replace(/\./g, '_');
                    nextStats.items[safeItemKey] = round2((nextStats.items[safeItemKey] || 0) + w);
                    for (const [catKey, catVal] of Object.entries(WASTE_CATEGORIES)) {
                        if (catVal.items.includes(item.item)) {
                            nextStats.categories[catKey] = round2((nextStats.categories[catKey] || 0) + w);
                            break;
                        }
                    }
                });
                return nextStats;
            });
        } catch (error) {
            console.error("Error processing deposit:", error);
            alert("บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต");
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
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};