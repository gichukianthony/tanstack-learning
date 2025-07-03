import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useTheme } from "@table-library/react-table-library/theme";
import { usePagination } from "@table-library/react-table-library/pagination";
import { useSort } from "@table-library/react-table-library/sort";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useServiceRequest } from '@/hooks/useserviceRequest';
import type { ServiceRequest } from '@/components/serviceRequest/interface';
import { getTheme } from '@table-library/react-table-library/baseline';
import { toast } from 'sonner';


export const Route = createFileRoute('/admin/service-request')({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useTheme(getTheme());
  const [search, setSearch] = useState('');
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [form, setForm] = useState<Partial<ServiceRequest>>({});
  const [showModal, setShowModal] = useState(false);

  const { data: requests = [], error, isLoading } = useServiceRequest() as {
    data: ServiceRequest[];
    error: any;
    isLoading: boolean;
  };

  const filterData = useMemo(() => ({
    nodes: requests.filter((r) =>
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceId.toString().includes(search) ||
      r.mechanicId.toString().includes(search) ||
      r.price.toString().includes(search)
    ),
  }), [requests, search]);

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
        mechanicId: (arr) => arr.sort((a, b) => a.mechanicId - b.mechanicId),
        serviceId: (arr) => arr.sort((a, b) => a.serviceId - b.serviceId),
        price: (arr) => arr.sort((a, b) => a.price - b.price),
        scheduledDate: (arr) =>
          arr.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()),
      },
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleEdit = (request: ServiceRequest) => {
    setEditingRequest(request);
    setForm({
      status: request.status,
      description: request.description,
      price: request.price,
      scheduledDate: request.scheduledDate,
      location: request.location,
    });
    setShowModal(true);
  };

  const COLUMNS = [
    { label: 'User', renderCell: (r: ServiceRequest) => r.user?.name || '-' },
    { label: 'Mechanic', renderCell: (r: ServiceRequest) => r.mechanic?.name || '-' },
    { label: 'Service', renderCell: (r: ServiceRequest) => r.service?.name || '-' },
    { label: 'Status', renderCell: (r: ServiceRequest) => r.status },
    { label: 'Price', renderCell: (r: ServiceRequest) => r.price },
    { label: 'Scheduled Date', renderCell: (r: ServiceRequest) => r.scheduledDate ? new Date(r.scheduledDate).toLocaleString() : '-' },
    { label: 'Location', renderCell: (r: ServiceRequest) => r.location },
    {
      label: 'Actions', renderCell: (r: ServiceRequest) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline" onClick={() => handleEdit(r)}>Edit</button>
        </div>
      )
    },
  ];

  if (isLoading) return <div className="p-4">Loading service requests...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading service requests</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Service Requests:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by mechanic ID, service ID, price, location..."
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
          Total Pages: {pagination.state.getTotalPages(filterData.nodes)} | Showing {filterData.nodes.length} of {requests.length} requests
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
      {showModal && editingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Service Request</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.status || ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
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
                <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.scheduledDate || ''} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
