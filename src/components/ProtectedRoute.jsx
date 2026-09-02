import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ตรวจสอบสถานะการล็อกอินกับ Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // ขณะกำลังเช็ก Session (ป้องกันไม่ให้เด้งไปหน้า login ทั้งที่ล็อกอินค้างไว้)
    if (loading) {
        return (
            <div className="w-full min-h-[80vh] flex items-center justify-center bg-white">
                <div className="w-9 h-9 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // หากไม่มี User ให้ดีดกลับไปหน้า Login ทันที
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // หากล็อกอินถูกต้อง ให้แสดงผลหน้านั้นๆ
    return <Outlet />;
}