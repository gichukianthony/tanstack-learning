import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useTheme } from "@table-library/react-table-library/theme";
import { usePagination } from "@table-library/react-table-library/pagination";
import { useSort } from "@table-library/react-table-library/sort";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useFeedback, useUpdateFeedback, useDeleteFeedback } from '@/hooks/useFeedback'
import type { Feedback } from '@/components/feedbacks/interface';
import { getTheme } from '@table-library/react-table-library/baseline';
import { toast } from 'sonner'



export const Route = createFileRoute('/admin/feedback')({
  component: RouteComponent,
});

function RouteComponent() {
  const theme = useTheme(getTheme());
  const [search, setSearch] = useState('');

  const { data: feedbacks = [], error, isLoading } = useFeedback() as {
    data: Feedback[];
    error: any;
    isLoading: boolean;
  };

  const filterData = useMemo(() => ({
    nodes: feedbacks.filter((f) =>
      f.comment.toLowerCase().includes(search.toLowerCase()) ||
      f.rating.toString().includes(search)
    ),
  }), [feedbacks, search]);

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
        rating: (arr) => arr.sort((a, b) => a.rating - b.rating),
        createdAt: (arr) => arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      },
    }
  );

  const updateFeedback = useUpdateFeedback()
  const deleteFeedback = useDeleteFeedback()
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null)
  const [form, setForm] = useState<Partial<Feedback>>({})
  const [showModal, setShowModal] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleEdit = (feedback: Feedback) => {
    setEditingFeedback(feedback)
    setForm({
      comment: feedback.comment,
      rating: feedback.rating,
    })
    setShowModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingFeedback) {
      updateFeedback.mutate({ id: editingFeedback.id, data: form }, {
        onSuccess: () => {
          setShowModal(false)
          toast.success('Feedback updated!')
        },
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      deleteFeedback.mutate(id, {
        onSuccess: () => toast.success('Feedback deleted!'),
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const COLUMNS = [
    { label: 'Feedback ID', renderCell: (f: Feedback) => f.id },
    { label: 'Mechanic ID', renderCell: (f: Feedback) => f.mechanicId },
    { label: 'User ID', renderCell: (f: Feedback) => f.userId },
    { label: 'Rating', renderCell: (f: Feedback) => f.rating.toString(), sort: { sortKey: 'rating' } },
    { label: 'Comment', renderCell: (f: Feedback) => f.comment },
    { label: 'Created At', renderCell: (f: Feedback) => new Date(f.createdAt).toLocaleString(), sort: { sortKey: 'createdAt' } },
    { label: 'Updated At', renderCell: (f: Feedback) => new Date(f.updatedAt).toLocaleString() },
    {
      label: 'Actions', renderCell: (f: Feedback) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline" onClick={() => handleEdit(f)}>Edit</button>
          <button className="text-red-600 hover:underline" onClick={() => handleDelete(f.id)}>Delete</button>
        </div>
      )
    },
  ];

  if (isLoading) return <div className="p-4">Loading feedbacks...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading feedbacks</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Feedback:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by ID, mechanicId, userId, rating..."
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
          Total Pages: {pagination.state.getTotalPages(filterData.nodes)} | Showing {filterData.nodes.length} of {feedbacks.length} feedbacks
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
      {showModal && editingFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Feedback</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.comment || ''} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input type="number" min={1} max={5} className="w-full border rounded px-3 py-2" value={form.rating || ''} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                {updateFeedback.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {updateFeedback.isError && <div className="text-red-500 text-sm mt-2">{updateFeedback.error?.message}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
