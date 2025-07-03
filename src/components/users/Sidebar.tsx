import { Link } from '@tanstack/react-router'
import { LayoutDashboard, User, Briefcase, Settings, LogOut } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', to: '/user', icon: <LayoutDashboard size={20} /> },
 
    { label: 'Available Mechanics', to: '/user/mechanic', icon: <Briefcase size={20} /> },
    { label: 'Settings', to: '/user/settings', icon: <Settings size={20} /> },
       { label: 'Profile', to: '/user/profile', icon: <User size={20} /> },
]

export default function UserSidebar() {
    return (
        <aside className="w-64 h-screen bg-blue-50 text-blue-900 flex flex-col p-4 shadow-lg">
            <h1 className="text-xl font-bold mb-6">User Panel</h1>
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 transition-all"
                        activeProps={{
                            className: 'bg-blue-200 text-blue-700',
                        }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <button
                className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors mt-4"
            >
                <LogOut size={20} />
                Logout
            </button>
        </aside>
    )
} 