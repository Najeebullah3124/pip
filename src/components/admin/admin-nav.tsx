import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  KeyRound,
  Cpu,
  Route,
  SlidersHorizontal,
  ScrollText,
  DatabaseBackup,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const adminNavItems = [
  { label: 'Overview', href: '/administration', icon: LayoutGrid, end: true },
  { label: 'Users', href: '/administration/users', icon: Users },
  { label: 'Roles', href: '/administration/roles', icon: ShieldCheck },
  { label: 'Permissions', href: '/administration/permissions', icon: KeyRound },
  { label: 'AI Providers', href: '/administration/ai-providers', icon: Cpu },
  { label: 'Routing Engine', href: '/administration/routing-engine', icon: Route },
  { label: 'System Settings', href: '/administration/system-settings', icon: SlidersHorizontal },
  { label: 'API Keys', href: '/administration/api-keys', icon: KeyRound },
  { label: 'Audit Logs', href: '/administration/audit-logs', icon: ScrollText },
  { label: 'Backup & Restore', href: '/administration/backup-restore', icon: DatabaseBackup },
]

export function AdminNav() {
  return (
    <nav className="-mx-1 flex items-center gap-1 overflow-x-auto border-b border-border px-1 pb-px">
      {adminNavItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-accent text-accent-700'
                : 'border-transparent text-foreground-muted hover:border-border-strong hover:text-foreground'
            )
          }
        >
          <item.icon className="size-3.5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
