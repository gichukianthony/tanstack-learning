import { createFileRoute } from '@tanstack/react-router'
import { User2, Briefcase, Settings, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getMechanics } from '@/api/mechanic'
import { getServices } from '@/api/services'
import { createServiceRequest } from '@/api/serviceRequest'
import { toast } from 'sonner'

export const Route = createFileRoute('/user/')({
  component: UserDashboard,
})

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-xs mx-auto">
      <div className="mb-2 text-blue-600">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-700 text-sm">{label}</div>
    </div>
  )
}

function UserDashboard() {
  // Example stats, replace with real data if available
  const stats = [
    { icon: <User2 size={32} />, label: 'Profile Complete', value: '80%' },
    { icon: <Briefcase size={32} />, label: 'My Services', value: 3 },
    { icon: <Settings size={32} />, label: 'Settings Updated', value: 'Yes' },
  ]

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ mechanicId: '', serviceId: '', description: '', price: '', scheduledDate: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [mechanics, setMechanics] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    if (showModal) {
      getMechanics().then(setMechanics).catch(() => setMechanics([]))
      getServices().then(setServices).catch(() => setServices([]))
    }
  }, [showModal])

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createServiceRequest({ ...form, mechanicId: Number(form.mechanicId), serviceId: Number(form.serviceId), price: form.price })
      toast.success('Service request created!')
      setShowModal(false)
      setForm({ mechanicId: '', serviceId: '', description: '', price: '', scheduledDate: '', location: '' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="w-full flex justify-end mb-4">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Create Service Request
        </button>
      </div>
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Your Dashboard</h1>
      <p className="text-gray-600 mb-6 text-center max-w-xl">Manage your profile, view your services, and keep your information up to date. Enjoy a seamless CRM experience!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      {/* Create Service Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Create Service Request</h2>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mechanic</label>
                <select className="w-full border rounded px-3 py-2" value={form.mechanicId} onChange={e => setForm(f => ({ ...f, mechanicId: e.target.value }))} required>
                  <option value="">Select Mechanic</option>
                  {mechanics.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name || m.first_name || m.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <select className="w-full border rounded px-3 py-2" value={form.serviceId} onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))} required>
                  <option value="">Select Service</option>
                  {services.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
                {loading ? 'Creating...' : 'Create Service Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
