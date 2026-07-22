import { UserIcon, Cog8ToothIcon, ShieldCheckIcon, LightBulbIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'

export default function DropdownMenu() {
    return (
        <div className="absolute right-0 top-16 w-56 bg-white border-[3px] border-[#2d2d2d] rounded-2xl shadow-[6px_6px_0px_#2d2d2d] p-3 flex flex-col gap-1 z-50 animate-fade-in-down">

            <a href="/my-profile" className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold font-['Nunito'] text-[#2d2d2d] hover:bg-[#fffde7] hover:border-[2px] border-[2px] border-transparent hover:border-[#2d2d2d] transition-all">
                <UserIcon className="w-5 h-5" /> My profile
            </a>

            <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold font-['Nunito'] text-[#2d2d2d] hover:bg-[#f0fffe] hover:border-[2px] border-[2px] border-transparent hover:border-[#2d2d2d] transition-all">
                <Cog8ToothIcon className="w-5 h-5" /> Settings
            </a>

            {/* เส้นคั่น */}
            <div className="h-[3px] bg-[#2d2d2d] my-1 mx-2 rounded-full opacity-20"></div>

            <a href="/privacy" className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold font-['Nunito'] text-[#2d2d2d] hover:bg-[#fff0f5] hover:border-[2px] border-[2px] border-transparent hover:border-[#2d2d2d] transition-all">
                <ShieldCheckIcon className="w-5 h-5" /> Privacy policy
            </a>

            <a href="/feedback" className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold font-['Nunito'] text-[#2d2d2d] hover:bg-[#f5f0ff] hover:border-[2px] border-[2px] border-transparent hover:border-[#2d2d2d] transition-all">
                <LightBulbIcon className="w-5 h-5" /> Share feedback
            </a>

            {/* เส้นคั่น */}
            <div className="h-[3px] bg-[#2d2d2d] my-1 mx-2 rounded-full opacity-20"></div>

            <a href="/logout" className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold font-['Nunito'] text-red-500 hover:bg-[#fff5f0] hover:border-[2px] border-[2px] border-transparent hover:border-red-500 transition-all">
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Sign out
            </a>
        </div>
    )
}