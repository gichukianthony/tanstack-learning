import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useTheme } from "@table-library/react-table-library/theme"
import { getTheme } from "@table-library/react-table-library/baseline"
import { usePagination } from "@table-library/react-table-library/pagination"
import { useSort } from "@table-library/react-table-library/sort"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useUsers } from '@/hooks/useUser'
import type { User } from '@/components/users/interface'

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

  const COLUMNS = [
    { label: 'Name', renderCell: (u: User) => u.name, sort: { sortKey: 'name' } },
    { label: 'Email', renderCell: (u: User) => u.email, sort: { sortKey: 'email' } },
    { label: 'Role', renderCell: (u: User) => u.role, sort: { sortKey: 'role' } },
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
    </div>
  )
}