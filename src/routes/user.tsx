import UserSidebar from '@/components/users/Sidebar'
import DashboardHeader from '@/components/Header'
import DashboardFooter from '@/components/Footer'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/user')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex flex-1">
        <UserSidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
      <DashboardFooter />
    </div>
  )
}
