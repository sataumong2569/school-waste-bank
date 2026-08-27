import { useEffect, useRef, useState } from 'react';

export default function usePullToRefresh({ onRefresh, threshold = 110, maxPull = 200 } = {}) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const spinnerRef = useRef(null);
    const isPullingRef = useRef(false);
    const startYRef = useRef(0);
    const currentDistanceRef = useRef(0);

    useEffect(() => {
        if (isRefreshing) return;

        const handleTouchStart = (e) => {
            if (window.scrollY <= 1) {
                startYRef.current = e.touches[0].clientY;
                isPullingRef.current = true;
                currentDistanceRef.current = 0;
            } else {
                isPullingRef.current = false;
            }
        };

        const handleTouchMove = (e) => {
            if (!isPullingRef.current) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startYRef.current;

            if (diff < 5) {
                currentDistanceRef.current = 0;
                if (spinnerRef.current) {
                    spinnerRef.current.style.transform = `translateY(-60px)`;
                    spinnerRef.current.style.opacity = '0';
                }
                return;
            }

            if (window.scrollY <= 1 && diff > 0) {
                if (e.cancelable) e.preventDefault();

                // ปรับสูตรความหนืดใหม่ ให้ลากถึง threshold (110) ได้จริงและนุ่มนวล
                const resistanceDistance = Math.min(maxPull, diff * 0.6);

                currentDistanceRef.current = resistanceDistance;

                // อัปเดต UI ผ่าน DOM ตรงๆ เพื่อความลื่นไหล
                if (spinnerRef.current) {
                    spinnerRef.current.style.transform = `translateY(${resistanceDistance}px)`;
                    spinnerRef.current.style.opacity = resistanceDistance > 15 ? '1' : '0';

                    const svg = spinnerRef.current.querySelector('svg');
                    if (svg) {
                        svg.style.transform = `rotate(${resistanceDistance * 3}deg)`;
                    }
                }
            }
        };

        const handleTouchEnd = async () => {
            if (!isPullingRef.current) return;
            isPullingRef.current = false;

            // ตรวจสอบว่าดึงถึง threshold (110) หรือยัง
            if (currentDistanceRef.current >= threshold && window.scrollY <= 1) {
                setIsRefreshing(true);

                // ค้างตัวหมุนไว้
                if (spinnerRef.current) {
                    spinnerRef.current.style.transform = `translateY(${threshold * 0.8}px)`;
                    spinnerRef.current.style.opacity = '1';
                    const svg = spinnerRef.current.querySelector('svg');
                    if (svg) svg.classList.add('animate-spin');
                }

                if (onRefresh) {
                    try { await onRefresh(); } catch (e) { }
                    setIsRefreshing(false);
                    resetSpinner();
                } else {
                    // หน่วงเวลาให้เห็นสปินเนอร์หมุนแป๊บหนึ่ง แล้วสั่งรีเฟรชหน้าเว็บจริง
                    await new Promise(resolve => setTimeout(resolve, 800));
                    window.location.reload();
                }
            } else {
                resetSpinner();
            }
        };

        const resetSpinner = () => {
            currentDistanceRef.current = 0;
            if (spinnerRef.current) {
                spinnerRef.current.style.transform = `translateY(-60px)`;
                spinnerRef.current.style.opacity = '0';
                const svg = spinnerRef.current.querySelector('svg');
                if (svg) svg.classList.remove('animate-spin');
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [threshold, maxPull, isRefreshing, onRefresh]);

    return { spinnerRef, isRefreshing };
}