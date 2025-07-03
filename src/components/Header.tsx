import { Link } from '@tanstack/react-router'
import { Menu, Bell, UserCircle, LogOut } from 'lucide-react'
import { useState } from 'react'
import logo from '../logo.svg'

const isAuthenticated = true // Assume always authenticated for dashboards

export default function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  // Example profile data (replace with real user data)
  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john@example.com' })
  const [editForm, setEditForm] = useState(profile)

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile(editForm)
    setEditModalOpen(false)
  }

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-700 tracking-tight">CRM Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-blue-50 rounded-full">
            <Bell size={24} />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {/* Profile Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-full" onClick={() => setProfileOpen((v) => !v)}>
              <UserCircle size={28} />
              <span className="hidden sm:inline font-medium">{profile.name}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={() => { setEditModalOpen(true); setProfileOpen(false) }}>Edit Profile</button>
                <Link to="/auth/login" className="block px-4 py-2 hover:bg-blue-50 text-red-600"><LogOut className="inline mr-2" size={18} />Logout</Link>
              </div>
            )}
          </div>
        </div>
        {/* Mobile Hamburger (optional) */}
        <button className="md:hidden p-2 ml-2" onClick={() => setMenuOpen((v) => !v)}>
          <Menu size={28} />
        </button>
      </div>
      {/* Profile Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setEditModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

export function LandingNavbar() {
  return (
    <nav className="w-full bg-white/90 shadow-sm fixed top-0 left-0 z-30 backdrop-blur border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CRM Logo" className="h-8 w-8" />
          <span className="font-bold text-xl text-blue-700 tracking-tight">CRM</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/admin" className="text-blue-700 hover:text-blue-900 font-medium transition">Admin Dashboard</Link>
          <Link to="/user" className="text-blue-700 hover:text-blue-900 font-medium transition">User Dashboard</Link>
          <Link to="/mechanic" className="text-blue-700 hover:text-blue-900 font-medium transition">Mechanic Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
