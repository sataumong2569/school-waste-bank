import { UserIcon, Cog8ToothIcon, ShieldCheckIcon, LightBulbIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
// 🟢 Import Firebase Auth สำหรับออกจากระบบ
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function DropdownMenu() {
    const navigate = useNavigate();

    // 🟢 ฟังก์ชันออกจากระบบ
    const handleLogout = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้า
        try {
            await signOut(auth); // สั่ง Firebase ให้ออกจากระบบ
            navigate('/'); // เด้งกลับไปหน้า Home
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <div className="absolute right-0 top-16 w-56 bg-white rounded-[28px] shadow-[0_12px_40px_rgba(124,58,237,0.12),_inset_0_-4px_0_rgba(0,0,0,0.02)] p-3 flex flex-col gap-1.5 z-50 animate-fade-in-down border border-[#f0eeff]">

            <Link to="/my-profile" className="flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold font-['Nunito'] text-[#1e1b4b] hover:bg-[#fef3c7] hover:text-[#d97706] transition-all active:scale-[0.98] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.05)]">
                <UserIcon className="w-5 h-5 opacity-80" /> My profile
            </Link>

            <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold font-['Nunito'] text-[#1e1b4b] hover:bg-[#d1fae5] hover:text-[#047857] transition-all active:scale-[0.98] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.05)]">
                <Cog8ToothIcon className="w-5 h-5 opacity-80" /> Settings
            </Link>

            <div className="h-[2px] bg-[#f0eeff] my-1 mx-2 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"></div>

            <Link to="/privacy" className="flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold font-['Nunito'] text-[#1e1b4b] hover:bg-[#fce7f3] hover:text-[#be185d] transition-all active:scale-[0.98] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.05)]">
                <ShieldCheckIcon className="w-5 h-5 opacity-80" /> Privacy policy
            </Link>

            <Link to="/feedback" className="flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold font-['Nunito'] text-[#1e1b4b] hover:bg-[#f3e8ff] hover:text-[#6d28d9] transition-all active:scale-[0.98] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.05)]">
                <LightBulbIcon className="w-5 h-5 opacity-80" /> Share feedback
            </Link>

            <div className="h-[2px] bg-[#f0eeff] my-1 mx-2 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"></div>

            {/* 🟢 เปลี่ยนเป็น <button> และใส่ onClick เพื่อออกจากระบบ */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold font-['Nunito'] text-red-500 hover:bg-[#fee2e2] hover:text-red-700 transition-all active:scale-[0.98] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.05)]"
            >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5 opacity-80" /> Sign out
            </button>
        </div>
    )
}