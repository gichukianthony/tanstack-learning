import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useTheme } from "@table-library/react-table-library/theme";
import { usePagination } from "@table-library/react-table-library/pagination";
import { useSort } from "@table-library/react-table-library/sort";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useMechanic, useUpdateMechanic, useDeleteMechanic, useVerifyMechanic, useSuspendMechanic } from '@/hooks/useMechanic'
import type { Mechanic } from '@/components/mechanic/interface';
import { getTheme } from '@table-library/react-table-library/baseline';
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/mechanic')({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useTheme((getTheme()));
  const [search, setSearch] = useState('');

  const { data: mechanics = [], error, isLoading } = useMechanic() as {
    data: Mechanic[];
    error: any;
    isLoading: boolean;
  };

  const updateMechanic = useUpdateMechanic()
  const verifyMechanic = useVerifyMechanic()
  const suspendMechanic = useSuspendMechanic()
  const 
  const deleteMechanic = useDeleteMechanic()
  const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null)
  const [form, setForm] = useState<Partial<Mechanic>>({})
  const [showModal, setShowModal] = useState(false)

  const filterData = useMemo(() => ({
    nodes: mechanics.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      m.status.toLowerCase().includes(search.toLowerCase()) ||
      m.specialization.toLowerCase().includes(search.toLowerCase())
    )
  }), [mechanics, search]);

  const pagination = usePagination(filterData, {
    state: {
      page: 0,
      size: 5,
    },
    onChange: () => { },
  });

  const sort = useSort(
    filterData,
    {
      onChange: () => { },
    },
    {
      sortFns: {
        name: (arr) => arr.sort((a, b) => a.name.localeCompare(b.name)),
        email: (arr) => arr.sort((a, b) => a.email.localeCompare(b.email)),
        location: (arr) => arr.sort((a, b) => a.location.localeCompare(b.location)),
        status: (arr) => arr.sort((a, b) => a.status.localeCompare(b.status)),
        specialization: (arr) => arr.sort((a, b) => a.specialization.localeCompare(b.specialization)),
      },
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleEdit = (mechanic: Mechanic) => {
    setEditingMechanic(mechanic)
    setForm({
      name: mechanic.name,
      email: mechanic.email,
      phone: mechanic.phone,
      location: mechanic.location,
      status: mechanic.status,
      specialization: mechanic.specialization,
      notes: mechanic.notes,
    })
    setShowModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMechanic) {
      updateMechanic.mutate({ id: editingMechanic.id, data: form }, {
        onSuccess: () => {
          setShowModal(false)
          toast.success('Mechanic updated!')
        },
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mechanic?')) {
      deleteMechanic.mutate(id, {
        onSuccess: () => toast.success('Mechanic deleted!'),
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const COLUMNS = [
    { label: 'Name', renderCell: (m: Mechanic) => m.name, sort: { sortKey: 'name' } },
    { label: 'Email', renderCell: (m: Mechanic) => m.email, sort: { sortKey: 'email' } },
    { label: 'Phone', renderCell: (m: Mechanic) => m.phone },
    { label: 'Location', renderCell: (m: Mechanic) => m.location, sort: { sortKey: 'location' } },
    { label: 'Status', renderCell: (m: Mechanic) => m.status, sort: { sortKey: 'status' } },
    { label: 'Specialization', renderCell: (m: Mechanic) => m.specialization, sort: { sortKey: 'specialization' } },
    { label: 'Notes', renderCell: (m: Mechanic) => m.notes },
    {
      label: 'Actions', renderCell: (m: Mechanic) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline" onClick={() => handleEdit(m)}>Edit</button>
          <button className="text-red-600 hover:underline" onClick={() => handleDelete(m.id)}>Delete</button>
        </div>
      )
    },
  ];

  if (isLoading) return <div className="p-4">Loading mechanics...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading mechanics</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Mechanics:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email, status, etc..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <CompactTable
          columns={COLUMNS}
          data={filterData}
          theme={theme}
          pagination={pagination}
          sort={sort}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Total Pages: {pagination.state.getTotalPages(filterData.nodes)} | Showing {filterData.nodes.length} of {mechanics.length} mechanics
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Page:</span>
          <div className="flex gap-1">
            {pagination.state.getPages(filterData.nodes).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => pagination.fns.onSetPage(index)}
                className={`px-3 py-1 text-sm rounded transition-colors ${pagination.state.page === index
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editingMechanic && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Mechanic</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.status || ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.specialization || ''} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                {updateMechanic.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {updateMechanic.isError && <div className="text-red-500 text-sm mt-2">{updateMechanic.error?.message}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
