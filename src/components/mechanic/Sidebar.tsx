import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Wrench, Car, Settings, LogOut } from 'lucide-react'

const navItems = [
    { label: 'Dashboard', to: '/mechanic/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Jobs', to: '/mechanic/jobs', icon: <Wrench size={20} /> },
    { label: 'My Vehicles', to: '/mechanic/vehicles', icon: <Car size={20} /> },
    { label: 'Settings', to: '/mechanic/settings', icon: <Settings size={20} /> },
]

export default function MechanicSidebar() {
    return (
        <aside className="w-64 h-screen bg-green-50 text-green-900 flex flex-col p-4 shadow-lg">
            <h1 className="text-xl font-bold mb-6">Mechanic Panel</h1>
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-green-100 transition-all"
                        activeProps={{
                            className: 'bg-green-200 text-green-700',
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