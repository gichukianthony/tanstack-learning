import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useTheme } from "@table-library/react-table-library/theme";
import { useService, useUpdateService, useDeleteService } from '@/hooks/useService'; // Adjust path if needed
import { usePagination } from "@table-library/react-table-library/pagination";
import { useSort } from "@table-library/react-table-library/sort";
import { CompactTable } from "@table-library/react-table-library/compact";
import { type Service } from '@/components/services/Service'; // Adjust import path
import { getTheme } from '@table-library/react-table-library/baseline';
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/service')({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useTheme(getTheme());
  const [search, setSearch] = useState('');

  const { data: services = [], error, isLoading } = useService() as {
    data: Service[],
    error: any,
    isLoading: boolean,
  };

  const updateService = useUpdateService()
  const deleteService = useDeleteService()
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [form, setForm] = useState<Partial<Service>>({})
  const [showModal, setShowModal] = useState(false)

  const filterData = useMemo(() => ({
    nodes: services.filter((service) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.price.toLowerCase().includes(search.toLowerCase())
    )
  }), [services, search]);

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
        name: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        price: (array) => array.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
        duration: (array) => array.sort((a, b) => a.duration - b.duration),
      },
    }
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      isAvailable: service.isAvailable,
    })
    setShowModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      updateService.mutate({ id: editingService.id, data: form }, {
        onSuccess: () => {
          setShowModal(false)
          toast.success('Service updated!')
        },
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService.mutate(id, {
        onSuccess: () => toast.success('Service deleted!'),
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const COLUMNS = [
    { label: 'Name', renderCell: (item: Service) => item.name, sort: { sortKey: 'name' } },
    { label: 'Description', renderCell: (item: Service) => item.description },
    { label: 'Price', renderCell: (item: Service) => `KSh ${item.price}`, sort: { sortKey: 'price' } },
    { label: 'Duration (min)', renderCell: (item: Service) => item.duration.toString(), sort: { sortKey: 'duration' } },
    { label: 'Available', renderCell: (item: Service) => item.isAvailable ? 'Yes' : 'No' },
    { label: 'Created', renderCell: (item: Service) => new Date(item.createdAt).toLocaleDateString() },
    {
      label: 'Actions', renderCell: (item: Service) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline" onClick={() => handleEdit(item)}>Edit</button>
          <button className="text-red-600 hover:underline" onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      )
    },
  ];

  if (isLoading) return <div>Loading services...</div>;
  if (error) return <div>Error loading services</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Services:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, description, or price..."
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
          Total Pages: {pagination.state.getTotalPages(filterData.nodes)} | Showing {filterData.nodes.length} of {services.length} services
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
      {showModal && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Service</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (min)</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={form.duration || ''} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Available</label>
                <select className="w-full border rounded px-3 py-2" value={form.isAvailable ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.value === 'yes' }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                {updateService.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {updateService.isError && <div className="text-red-500 text-sm mt-2">{updateService.error?.message}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
