import { Outlet, useLocation } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { AdminNav, adminNavItems } from '@/components/admin/admin-nav'

export default function AdminLayout() {
  const location = useLocation()
  const current = adminNavItems.find((item) =>
    item.end ? location.pathname === item.href : location.pathname.startsWith(item.href)
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Administration"
        description="Manage users, roles, providers, and platform-wide configuration."
        icon={<Settings2 />}
        breadcrumbs={current && current.href !== '/administration' ? [{ label: 'Administration', href: '/administration' }, { label: current.label }] : [{ label: 'Administration' }]}
      />
      <AdminNav />
      <Outlet />
    </div>
  )
}
