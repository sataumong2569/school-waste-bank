import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, increment, deleteDoc } from 'firebase/firestore';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { db } from './firebase';
import { DEFAULT_PRICES, WASTE_CATEGORIES } from './utils/wasteConfig';

const AppContext = createContext();

// ฟังก์ชันช่วยปัดเศษทศนิยม 2 ตำแหน่งและคงชนิดเป็น Number
const round2 = (num) => Math.round((Number(num) || 0) * 100) / 100;

// ========================================================
// [QUOTA-TRACK] ฟังก์ชันแสดง Log ตรวจจับโควตา Real-time
// ========================================================
const logQuota = (action, count, detail = '') => {
    if (import.meta.env.DEV) {
        const color = action.includes('WRITE') ? '#ef4444' : '#3b82f6';
        console.log(
            `%c[Firestore ${action}]%c +${count} docs %c(${detail})`,
            `background:${color};color:white;font-weight:bold;border-radius:3px;padding:2px 5px;`,
            'color:#10b981;font-weight:bold;margin-left:4px;',
            'color:#64748b;'
        );
    }
};

export const AppProvider = ({ children }) => {
    const [members, setMembers] = useState([]);
    const [pricing, setPricing] = useState(DEFAULT_PRICES);
    // ระบบแจ้งเตือน Clay Toast & Confirm Modal กลาง
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3200);
    };

    const showConfirm = ({ title, message, onConfirm, confirmText = 'ยืนยัน', cancelText = 'ยกเลิก', confirmColor = 'bg-[#7c3aed]' }) => {
        setConfirmModal({ title, message, onConfirm, confirmText, cancelText, confirmColor });
    };

    const closeConfirm = () => setConfirmModal(null);
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

                // [QUOTA-TRACK] ดักจับการอ่าน config 1 doc
                logQuota('READ', 1, 'system/config');

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

                    // [QUOTA-TRACK] ดักจับการเขียนเริ่มต้น config 1 doc
                    logQuota('WRITE', 1, 'init system/config');
                }

                // 2. ดึงข้อมูล System Stats
                const statsRef = doc(db, 'system', 'stats');
                const statsSnap = await getDoc(statsRef);

                // [QUOTA-TRACK] ดักจับการอ่าน stats 1 doc
                logQuota('READ', 1, 'system/stats');

                if (statsSnap.exists()) {
                    setSysStats(statsSnap.data());
                } else {
                    const initialStats = { totalBalance: 0, totalCarbon: 0, totalMembers: 0, totalWeight: 0, categories: {}, items: {} };
                    await setDoc(statsRef, initialStats);

                    // [QUOTA-TRACK] ดักจับการเขียนเริ่มต้น stats 1 doc
                    logQuota('WRITE', 1, 'init system/stats');

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

                // [QUOTA-TRACK] ดักจับการอ่านรายชื่อสมาชิกทั้งหมด
                logQuota('READ', membersSnap.size, `members list (${membersSnap.size} คน)`);

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

            // [QUOTA-TRACK] ดักจับการอัปเดตราคา
            logQuota('WRITE', 1, 'update pricing');
        } catch (e) {
            console.error("Error updating pricing:", e);
        }
    };

    const updateDuration = async (newDuration) => {
        setDuration(newDuration);
        try {
            await updateDoc(doc(db, 'system', 'config'), { duration: newDuration });

            // [QUOTA-TRACK] ดักจับการอัปเดตรอบเวลา
            logQuota('WRITE', 1, 'update duration');
        } catch (e) {
            console.error("Error updating duration:", e);
        }
    };

    const updateRewards = async (newRewards) => {
        setRewards(newRewards);
        try {
            await updateDoc(doc(db, 'system', 'config'), { rewards: newRewards });

            // [QUOTA-TRACK] ดักจับการอัปเดตของรางวัล
            logQuota('WRITE', 1, 'update rewards');
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
            carbonPoints: initialCarbon,
            rewardPoints: initialReward,
            history: []
        };

        try {
            await setDoc(doc(db, 'members', newId), memberWithId);
            await updateDoc(doc(db, 'system', 'stats'), {
                totalMembers: increment(1),
                totalBalance: increment(initialBalance),
                totalCarbon: increment(initialCarbon)
            });

            // [QUOTA-TRACK] ดักจับการเพิ่มสมาชิกใหม่และอัปเดตสถิติรวม (รวม 2 writes)
            logQuota('WRITE', 2, 'add member + stats');

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
            let writeCount = 1;

            if (balanceDiff !== 0 || carbonDiff !== 0) {
                await updateDoc(doc(db, 'system', 'stats'), {
                    totalBalance: increment(balanceDiff),
                    totalCarbon: increment(carbonDiff)
                });
                writeCount += 1;
            }

            // [QUOTA-TRACK] ดักจับการอัปเดตสมาชิก (และสถิติหากมีการเปลี่ยนยอด)
            logQuota('WRITE', writeCount, 'update member' + (writeCount > 1 ? ' + stats' : ''));

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

            // [QUOTA-TRACK] ดักจับการลบสมาชิกและอัปเดตสถิติรวม (รวม 2 writes)
            logQuota('WRITE', 2, 'delete member + stats');

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

            // [QUOTA-TRACK] ดักจับการฝากขยะ: อัปเดตสมาชิก + สถิติ + บันทึกธุรกรรม (รวม 3 writes)
            logQuota('WRITE', 3, 'process deposit: member + stats + transaction');

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

    // ========================================================
    // ฟังก์ชันแลกของรางวัล: ตัดแต้มสมาชิก และลดสต็อกของรางวัล
    // ========================================================
    const redeemReward = async (memberId, rewardItem) => {
        const targetMember = members.find(m => m.id === memberId);
        if (!targetMember) return { success: false, message: "ไม่พบข้อมูลสมาชิก" };

        const currentPoints = Number(targetMember.rewardPoints) || 0;
        const requiredPoints = Number(rewardItem.points) || 0;

        if (currentPoints < requiredPoints) {
            return { success: false, message: "แต้มสะสมไม่เพียงพอสำหรับการแลกรางวัลนี้" };
        }
        if (Number(rewardItem.stock) <= 0) {
            return { success: false, message: "ของรางวัลนี้หมดสต็อกแล้ว" };
        }

        try {
            const today = new Date();
            const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

            const newRewardPoints = round2(currentPoints - requiredPoints);
            const redemptionEntry = {
                type: `แลก: ${rewardItem.name}`,
                weight: 0,
                date: formattedDate,
                pointsSpent: requiredPoints
            };
            const updatedHistory = [redemptionEntry, ...(targetMember.history || [])].slice(0, 10);

            // 1. อัปเดตข้อมูลสมาชิกใน Firestore
            const memberRef = doc(db, 'members', memberId);
            await updateDoc(memberRef, {
                rewardPoints: newRewardPoints,
                history: updatedHistory
            });

            // 2. อัปเดตสต็อกของรางวัลใน system/config
            const updatedRewards = rewards.map(item =>
                item.id === rewardItem.id ? { ...item, stock: Math.max(0, Number(item.stock) - 1) } : item
            );
            const configRef = doc(db, 'system', 'config');
            await updateDoc(configRef, { rewards: updatedRewards });

            // 3. บันทึกสลิปการแลกรางวัลลงคอลเลกชันกลาง transactions (สำหรับรายงาน/Export ย้อนหลัง)
            const txId = `tx_redeem_${Date.now()}`;
            await setDoc(doc(db, 'transactions', txId), {
                type: 'redeem',
                memberId: memberId,
                memberName: targetMember.fullName,
                rewardId: rewardItem.id,
                rewardName: rewardItem.name,
                pointsSpent: requiredPoints,
                quantity: 1,
                timestamp: new Date()
            });

            // [QUOTA-TRACK] อัปเดตสมาชิก 1 + สต็อก 1 + สลิปธุรกรรม 1 = 3 writes
            logQuota('WRITE', 3, `redeem reward: ${rewardItem.name} (-${requiredPoints} pts) + tx logged`);

            // 3. อัปเดต State ภายในแอป
            setMembers(prev => prev.map(m => m.id === memberId ? {
                ...m,
                rewardPoints: newRewardPoints,
                history: updatedHistory
            } : m));
            setRewards(updatedRewards);

            return { success: true, message: `แลก ${rewardItem.name} สำเร็จ!` };
        } catch (error) {
            console.error("Error redeeming reward:", error);
            return { success: false, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" };
        }
    };

    const batchUpdateMembers = (updatedMemberList) => {
        setMembers(updatedMemberList);
    };

    const contextValue = useMemo(() => ({
        isAppLoading, sysStats,
        members, setMembers, addMember, updateMember, processDeposit, deleteMember,
        pricing, updatePricing, priceUpdatedAt,
        duration, updateDuration,
        rewards, updateRewards,
        redeemReward,
        batchUpdateMembers,
        showToast,
        showConfirm
    }), [isAppLoading, sysStats, members, pricing, priceUpdatedAt, duration, rewards]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}

            {/* 🌟 1. CLAY TOAST NOTIFICATION (เด้งเตือนมุมบนจอ) */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] font-['Prompt'] animate-modal-pop pointer-events-none">
                    <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md pointer-events-auto ${toast.type === 'error'
                        ? 'bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-900/10'
                        : toast.type === 'info'
                            ? 'bg-blue-50/95 border-blue-200 text-blue-800 shadow-blue-900/10'
                            : 'bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-900/10'
                        }`}>
                        {toast.type === 'error' ? (
                            <ExclamationCircleIcon className="w-6 h-6 text-rose-600 shrink-0 stroke-2" />
                        ) : toast.type === 'info' ? (
                            <InformationCircleIcon className="w-6 h-6 text-blue-600 shrink-0 stroke-2" />
                        ) : (
                            <CheckCircleIcon className="w-6 h-6 text-emerald-600 shrink-0 stroke-2" />
                        )}
                        <span className="text-xs md:text-sm font-bold flex-1 leading-snug">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                            <XMarkIcon className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* 🌟 2. CLAY CONFIRMATION MODAL (กล่องถามยืนยันสไตล์ Claymorphism) */}
            {confirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-['Prompt']">
                    <div className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm transition-opacity" onClick={closeConfirm}></div>
                    <div className="clay-card relative w-full max-w-sm bg-white p-6 md:p-7 rounded-[28px] shadow-2xl z-10 animate-modal-pop flex flex-col gap-4 border border-slate-100">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="font-bold text-base md:text-lg text-slate-800 leading-tight">{confirmModal.title || 'ยืนยันการทำรายการ'}</h3>
                            <p className="text-xs md:text-sm text-slate-500 font-medium whitespace-pre-line leading-relaxed">{confirmModal.message}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={closeConfirm}
                                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs md:text-sm font-bold transition-all active:scale-95"
                            >
                                {confirmModal.cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const action = confirmModal.onConfirm;
                                    closeConfirm();
                                    if (action) action();
                                }}
                                className={`px-5 py-2.5 rounded-xl text-white text-xs md:text-sm font-bold shadow-md transition-all active:scale-95 ${confirmModal.confirmColor}`}
                            >
                                {confirmModal.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    return useContext(AppContext);
};