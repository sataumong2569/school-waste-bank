import { HomeIcon, CalendarIcon, ShoppingBagIcon, SignalIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

const navItems = [
    { label: 'Home', url: '/', icon: HomeIcon, hoverColor: 'hover:bg-[#fffde7]', active: true },
    { label: 'Events', url: '/events', icon: CalendarIcon, hoverColor: 'hover:bg-[#fff0f5]' },
    { label: 'Orders', url: '/orders', icon: ShoppingBagIcon, hoverColor: 'hover:bg-[#f0fffe]' },
    { label: 'Broadcasts', url: '/broadcasts', icon: SignalIcon, hoverColor: 'hover:bg-[#f5f0ff]' },
    { label: 'Settings', url: '/settings', icon: Cog8ToothIcon, hoverColor: 'hover:bg-[#fff5f0]' },
]

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r-[3px] border-[#2d2d2d] hidden md:flex flex-col p-6 min-h-[calc(100vh-76px)]">
            <div className="flex flex-col gap-3 mt-4">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.url}
                        className={`flex items-center gap-3 px-4 py-3 border-[3px] border-transparent rounded-xl font-['Nunito'] font-bold text-[#555] transition-all 
            ${item.hoverColor} hover:border-[#2d2d2d] hover:text-[#2d2d2d] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#2d2d2d]
            ${item.active ? 'bg-[#ffd93d] border-[#2d2d2d] text-[#2d2d2d] shadow-[4px_4px_0px_#2d2d2d]' : ''}`}
                    >
                        <item.icon className="w-6 h-6" />
                        {item.label}
                    </a>
                ))}
            </div>
        </aside>
    )
}