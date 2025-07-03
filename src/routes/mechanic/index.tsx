import { createFileRoute } from '@tanstack/react-router'
import { Wrench, Car, CheckCircle2, Plus } from 'lucide-react'
import { useState } from 'react'
import { createService } from '@/api/services'
import { toast } from 'sonner'

export const Route = createFileRoute('/mechanic/')({
  component: MechanicDashboard,
})

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 w-full max-w-xs mx-auto">
      <div className="mb-2 text-green-600">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-gray-700 text-sm">{label}</div>
    </div>
  )
}

function MechanicDashboard() {
  // Example stats, replace with real data if available
  const stats = [
    { icon: <Wrench size={32} />, label: 'Jobs Completed', value: 12 },
    { icon: <Car size={32} />, label: 'Vehicles Serviced', value: 8 },
    { icon: <CheckCircle2 size={32} />, label: 'Verified', value: 'Yes' },
  ]

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '', isAvailable: true })
  const [loading, setLoading] = useState(false)

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createService({ ...form, duration: Number(form.duration), price: form.price })
      toast.success('Service created!')
      setShowModal(false)
      setForm({ name: '', description: '', price: '', duration: '', isAvailable: true })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="w-full flex justify-end mb-4">
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Create Service
        </button>
      </div>
      <h1 className="text-3xl font-bold text-green-700 mb-2">Welcome, Mechanic!</h1>
      <p className="text-gray-600 mb-6 text-center max-w-xl">Track your jobs, manage your vehicles, and stay on top of your mechanic profile. Deliver top-notch service every time!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      {/* Create Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Create Service</h2>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
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
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Available</label>
                <select className="w-full border rounded px-3 py-2" value={form.isAvailable ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.value === 'yes' }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition" disabled={loading}>
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
