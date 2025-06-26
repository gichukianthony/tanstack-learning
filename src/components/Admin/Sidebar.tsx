// src/components/AdminSidebar.tsx
import { Link, } from '@tanstack/react-router'
import {
  Car,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Settings,
  Cog,
  Users,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Users', to: '/admin/user', icon: <Users size={20} /> },
  { label: 'Services', to: '/admin/service', icon: <Cog size={20} /> },
  { label: 'Vehicles', to: '/admin/vehicles', icon: <Car size={20} /> },
  { label: 'service-requests', to: '/admin/service-request', icon: <Cog size={20} /> },
  { label: 'Reports', to: '/admin/reports', icon: <FileBarChart size={20} /> },
  { label: 'Settings', to: '/admin/settings', icon: <Settings size={20} /> },
]

export function AdminSidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-all"
            activeProps={{
              className: 'bg-gray-800 text-blue-400',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <button
        className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors mt-4"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  )
}
