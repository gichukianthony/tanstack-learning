import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useTheme } from "@table-library/react-table-library/theme";
import { useService } from '@/hooks/useService'; // Adjust path if needed
import { usePagination } from "@table-library/react-table-library/pagination";
import { useSort } from "@table-library/react-table-library/sort";
import { CompactTable } from "@table-library/react-table-library/compact";
import { type Service} from '@/components/services/Service'; // Adjust import path
import { getTheme } from '@table-library/react-table-library/baseline';

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
    onChange: () => {},
  });

  const sort = useSort(
    filterData,
    {
      onChange: () => {},
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

  const COLUMNS = [
    { label: 'Name', renderCell: (item: Service) => item.name, sort: { sortKey: 'name' } },
    { label: 'Description', renderCell: (item: Service) => item.description },
    { label: 'Price', renderCell: (item: Service) => `KSh ${item.price}`, sort: { sortKey: 'price' } },
    { label: 'Duration (min)', renderCell: (item: Service) => item.duration.toString(), sort: { sortKey: 'duration' } },
    { label: 'Available', renderCell: (item: Service) => item.isAvailable ? 'Yes' : 'No' },
    { label: 'Created', renderCell: (item: Service) => new Date(item.createdAt).toLocaleDateString() },
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
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  pagination.state.page === index
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
    </div>
  );
}
