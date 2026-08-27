import { useEffect, useRef, useState } from 'react';

export default function usePullToRefresh({ onRefresh, threshold = 80, maxPull = 140 } = {}) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const isPullingRef = useRef(false);
    const startYRef = useRef(0);
    // ใช้ Ref เพื่อเก็บค่าล่าสุด ป้องกันปัญหา Stale Closure ใน Event Listener
    const currentDistanceRef = useRef(0);

    useEffect(() => {
        // หากกำลังโหลดอยู่ ไม่ต้องดักจับ Event ลากซ้ำซ้อน
        if (isRefreshing) return;

        const handleTouchStart = (e) => {
            if (window.scrollY === 0) {
                startYRef.current = e.touches[0].clientY;
                isPullingRef.current = true;
                currentDistanceRef.current = 0;
            }
        };

        const handleTouchMove = (e) => {
            if (!isPullingRef.current) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startYRef.current;

            if (diff < 0) {
                isPullingRef.current = false;
                currentDistanceRef.current = 0;
                setPullDistance(0);
                return;
            }

            if (window.scrollY === 0 && diff > 0) {
                if (e.cancelable) e.preventDefault();

                // สูตรคำนวณแรงต้านของคุณ (ปรับให้หนืดกำลังดี)
                const progress = diff / window.innerHeight;
                const resistanceDistance = Math.min(maxPull, diff * (1 - progress * 1.5));

                currentDistanceRef.current = resistanceDistance; // อัปเดตค่าเข้า Ref ทันที
                setPullDistance(resistanceDistance);
            }
        };

        const handleTouchEnd = async () => {
            if (!isPullingRef.current) return;
            isPullingRef.current = false;

            // อ่านค่าจาก Ref ตัวล่าสุด ทำให้เงื่อนไขนี้แม่นยำ 100%
            if (currentDistanceRef.current >= threshold && window.scrollY === 0) {
                setIsRefreshing(true);
                setPullDistance(threshold * 0.8); // ล็อกค้างไว้เท่ ๆ แบบแอปดัง

                if (onRefresh) {
                    try {
                        await onRefresh();
                    } catch (error) {
                        console.error("Refresh failed:", error);
                    }
                    // โหลดเสร็จค่อยเคลียร์ค่ากลับที่เดิม
                    setIsRefreshing(false);
                    setPullDistance(0);
                } else {
                    // กรณีไม่มี onRefresh ให้หน่วงเวลารอรีโหลด โดยไม่ต้องเคลียร์ State เพื่อให้ Spinner ค้างไว้จนหน้าเว็บดับไปเอง
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    window.location.reload();
                }
            } else {
                // ถ้าดึงไม่ถึงระยะ ให้ดีดกลับทันที
                currentDistanceRef.current = 0;
                setPullDistance(0);
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
        // ลบ pullDistance ออกจาก Dependency เพื่อไม่ให้ผูก Event ใหม่ทุก ๆ พิกเซลที่นิ้วขยับ (ช่วยเรื่อง Performance)
    }, [threshold, maxPull, isRefreshing, onRefresh]);

    return { pullDistance, isRefreshing };
}
