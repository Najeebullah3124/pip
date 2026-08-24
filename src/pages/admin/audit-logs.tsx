import * as React from 'react'
import { Download, ScrollText } from 'lucide-react'
import { DataToolbar } from '@/components/admin/shared/data-toolbar'
import { BulkActionBar } from '@/components/admin/shared/bulk-action-bar'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import { AuditDetailDrawer } from '@/components/admin/audit/audit-detail-drawer'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/shared/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { auditLogs, type AuditLogEntry } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

const PAGE_SIZE = 12

export default function AdminAuditLogsPage() {
  const [search, setSearch] = React.useState('')
  const [resourceFilter, setResourceFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [drawerEntry, setDrawerEntry] = React.useState<AuditLogEntry | null>(null)
  const { toast } = useToast()

  const sorted = React.useMemo(() => [...auditLogs].reverse(), [])

  const filtered = React.useMemo(() => {
    return sorted.filter((e) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        e.user.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q) ||
        e.ip.includes(q)
      const matchesResource = resourceFilter === 'all' || e.resourceType === resourceFilter
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      return matchesSearch && matchesResource && matchesStatus
    })
  }, [sorted, search, resourceFilter, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [search, resourceFilter, statusFilter])

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(pageItems.map((e) => e.id)) : new Set())
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const allOnPageSelected = pageItems.length > 0 && pageItems.every((e) => selected.has(e.id))

  function exportSelected(count: number) {
    toast({ title: `Exported ${count} log entries`, description: 'Download will start shortly.', variant: 'success' })
    setSelected(new Set())
  }

  return (
    <div className="flex flex-col gap-5">
      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by user, action, resource, or IP…"
        filters={
          <>
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All resources</SelectItem>
                <SelectItem value="Prompt">Prompt</SelectItem>
                <SelectItem value="Character">Character</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="API Key">API Key</SelectItem>
                <SelectItem value="Engine">Engine</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button variant="secondary" onClick={() => exportSelected(filtered.length)}>
            <Download />
            Export all
          </Button>
        }
      />

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button variant="secondary" size="sm" onClick={() => exportSelected(selected.size)}>
          <Download />
          Export selected
        </Button>
      </BulkActionBar>

      <Card className="overflow-hidden p-0">
        {filtered.length === 0 ? (
          <EmptyState
            className="border-0"
            icon={<ScrollText />}
            title="No matching audit events"
            description="Try a different search term or clear your filters."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allOnPageSelected} onCheckedChange={(v) => toggleAll(v === true)} aria-label="Select all" />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP / device</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((e) => (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => setDrawerEntry(e)}>
                  <TableCell onClick={(ev) => ev.stopPropagation()}>
                    <Checkbox checked={selected.has(e.id)} onCheckedChange={(v) => toggleOne(e.id, v === true)} aria-label={`Select ${e.id}`} />
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{e.user}</p>
                    <p className="text-xs text-foreground-subtle">{e.userEmail}</p>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{e.action}</TableCell>
                  <TableCell>
                    <p className="font-mono text-xs text-foreground-muted">{e.resource}</p>
                    <p className="text-[11px] text-foreground-subtle">{e.resourceType}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-foreground-muted">{e.timestamp}</TableCell>
                  <TableCell>
                    <p className="font-mono text-xs text-foreground-muted">{e.ip}</p>
                    <p className="text-[11px] text-foreground-subtle">{e.device}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={e.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {filtered.length > 0 && (
        <Pagination page={pageSafe} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}

      <AuditDetailDrawer entry={drawerEntry} onOpenChange={(open) => !open && setDrawerEntry(null)} />
    </div>
  )
}
