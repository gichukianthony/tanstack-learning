import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useTheme } from "@table-library/react-table-library/theme"
import { getTheme } from "@table-library/react-table-library/baseline"
import { usePagination } from "@table-library/react-table-library/pagination"
import { useSort } from "@table-library/react-table-library/sort"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/useUser'
import type { User, UpdateUsersData } from '@/components/users/interface'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/user')({
  component: RouteComponent,
})

function RouteComponent() {
  const theme = useTheme(getTheme())
  const [search, setSearch] = useState('')

  const { data: users = [], error, isLoading } = useUsers() as {
    data: User[]
    error: any
    isLoading: boolean
  }

  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<UpdateUsersData>({})
  const [showModal, setShowModal] = useState(false)

  const filterData = useMemo(() => ({
    nodes: users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    )
  }), [users, search])

  const pagination = usePagination(filterData, {
    state: {
      page: 0,
      size: 5,
    },
    onChange: () => { },
  })

  const sort = useSort(
    filterData,
    {
      onChange: () => { },
    },
    {
      sortFns: {
        name: (arr) => arr.sort((a, b) => a.name.localeCompare(b.name)),
        email: (arr) => arr.sort((a, b) => a.email.localeCompare(b.email)),
        role: (arr) => a.role.localeCompare(b.role)
      },
    }
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    })
    setShowModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      updateUser.mutate({ id: editingUser.id, data: form }, {
        onSuccess: () => {
          setShowModal(false)
          toast.success('User updated successfully!')
        },
        onError: (err) => {
          toast.error(err.message)
        }
      })
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(id, {
        onSuccess: () => toast.success('User deleted!'),
        onError: (err) => toast.error(err.message)
      })
    }
  }

  const COLUMNS = [
    { label: 'Name', renderCell: (u: User) => u.name, sort: { sortKey: 'name' } },
    { label: 'Email', renderCell: (u: User) => u.email, sort: { sortKey: 'email' } },
    { label: 'Role', renderCell: (u: User) => u.role, sort: { sortKey: 'role' } },
    {
      label: 'Actions',
      renderCell: (u: User) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline" onClick={() => handleEdit(u)}>Edit</button>
          <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)}>Delete</button>
        </div>
      )
    },
  ]

  if (isLoading) return <div className="p-4">Loading users...</div>
  if (error) return <div className="p-4 text-red-500">Error loading users</div>

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Users:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email, or role..."
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
          Total Pages: {pagination.state.getTotalPages(filterData.nodes)} | Showing {filterData.nodes.length} of {users.length} users
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
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
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
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full border rounded px-3 py-2" value={form.role || ''} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="mechanic">Mechanic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.address || ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                {updateUser.isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {updateUser.isError && <div className="text-red-500 text-sm mt-2">{updateUser.error?.message}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}