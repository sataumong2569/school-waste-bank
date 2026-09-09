import { useEffect, useRef, useState } from 'react';

const FadeInSection = ({ children, className = '', delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // เมื่อเลื่อนมาเจอ section ให้แสดงผลและหยุดตรวจจับ
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.15, // เริ่มแสดงเมื่อส่วนของ section ปรากฏบนจอ 15%
                rootMargin: '0px 0px -50px 0px' // เผื่อระยะขอบล่างให้สมูท
            }
        );

        const currentTarget = domRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, []);

    return (
        <div
            ref={domRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out transform ${isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-[0.98]'
                } ${className}`}
        >
            {children}
        </div>
    );
};

export default FadeInSection;