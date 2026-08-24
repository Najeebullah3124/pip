import { Link } from 'react-router-dom'
import { Users, ShieldCheck, Cpu, KeyRound, ScrollText, ArrowUpRight, UserPlus, TriangleAlert } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import { adminUsers, aiProviders, apiKeys, auditLogs } from '@/data/admin-data'
import { adminNavItems } from '@/components/admin/admin-nav'

export default function AdminOverviewPage() {
  const activeUsers = adminUsers.filter((u) => u.status === 'Active').length
  const invitedUsers = adminUsers.filter((u) => u.status === 'Invited').length
  const attentionProviders = aiProviders.filter((p) => p.status !== 'Connected').length
  const activeKeys = apiKeys.filter((k) => k.status === 'Active').length
  const recentLogs = [...auditLogs].reverse().slice(0, 6)
  const failedLogs = auditLogs.filter((l) => l.status === 'Failed').length

  const shortcuts = adminNavItems.filter((i) => i.href !== '/administration')

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total members" value={String(adminUsers.length)} delta={{ value: `${invitedUsers} invited`, direction: 'up' }} icon={<Users />} />
        <StatCard label="Active members" value={String(activeUsers)} delta={{ value: '96% of total', direction: 'up' }} icon={<ShieldCheck />} />
        <StatCard label="AI providers" value={String(aiProviders.length)} delta={{ value: `${attentionProviders} need attention`, direction: attentionProviders > 0 ? 'down' : 'up' }} icon={<Cpu />} />
        <StatCard label="Active API keys" value={String(activeKeys)} delta={{ value: `${apiKeys.length - activeKeys} revoked`, direction: 'up' }} icon={<KeyRound />} />
      </div>

      {failedLogs > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-500/10">
          <TriangleAlert className="size-4.5 shrink-0 text-warning" />
          <p className="flex-1 text-sm text-amber-900 dark:text-amber-200">
            <span className="font-semibold">{failedLogs} failed events</span> recorded in the audit log over the last 45 days.
          </p>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/administration/audit-logs">Review</Link>
          </Button>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-foreground">Manage</h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4">
          {shortcuts.map((s) => (
            <Link key={s.href} to={s.href}>
              <Card className="group flex h-full cursor-pointer flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevation-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent transition-colors group-hover:from-accent group-hover:to-accent-700 group-hover:text-white">
                    <s.icon className="size-[18px]" />
                  </div>
                  <ArrowUpRight className="size-3.5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent admin activity</CardTitle>
              <CardDescription>The latest actions across your workspace</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/administration/audit-logs">
                View all
                <ArrowUpRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 rounded-xl px-2.5 py-3 transition-colors hover:bg-muted">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <ScrollText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    <span className="font-semibold">{log.user}</span> · {log.action}
                  </p>
                  <p className="truncate text-xs text-foreground-subtle">
                    {log.resource} · {log.timestamp}
                  </p>
                </div>
                <StatusBadge status={log.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>Members who haven't joined yet</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {adminUsers
              .filter((u) => u.status === 'Invited')
              .slice(0, 5)
              .map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                    <UserPlus className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{u.email}</p>
                    <p className="text-xs text-foreground-subtle">Invited as {u.role}</p>
                  </div>
                </div>
              ))}
            <Button variant="secondary" size="sm" className="mt-1 w-full" asChild>
              <Link to="/administration/users">Manage users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
