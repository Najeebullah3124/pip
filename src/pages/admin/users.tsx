import * as React from 'react'
import { MoreHorizontal, ShieldCheck, ShieldOff, Trash2, UserCog, Ban, CheckCircle2 } from 'lucide-react'
import { DataToolbar } from '@/components/admin/shared/data-toolbar'
import { BulkActionBar } from '@/components/admin/shared/bulk-action-bar'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import { UserDetailDrawer } from '@/components/admin/users/user-detail-drawer'
import { InviteUserDialog } from '@/components/admin/users/invite-user-dialog'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { UsersRound } from 'lucide-react'
import { adminUsers as seedUsers, type AdminUser, type UserRole } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

const PAGE_SIZE = 10

function initialsOf(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminUser[]>(seedUsers)
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [drawerUser, setDrawerUser] = React.useState<AdminUser | null>(null)
  const [bulkRemoveOpen, setBulkRemoveOpen] = React.useState(false)
  const { toast } = useToast()

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [search, roleFilter, statusFilter])

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(pageItems.map((u) => u.id)) : new Set())
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function updateUser(id: string, patch: Partial<AdminUser>) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
    setDrawerUser((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev))
  }

  function removeUsers(ids: string[]) {
    setUsers((prev) => prev.filter((u) => !ids.includes(u.id)))
    setSelected(new Set())
    toast({ title: `Removed ${ids.length} member${ids.length > 1 ? 's' : ''}`, variant: 'success' })
  }

  function inviteUser(email: string, role: UserRole) {
    const newUser: AdminUser = {
      id: `usr_new_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role,
      status: 'Invited',
      lastActive: 'Never',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      projects: 0,
      twoFactor: false,
    }
    setUsers((prev) => [newUser, ...prev])
  }

  const allOnPageSelected = pageItems.length > 0 && pageItems.every((u) => selected.has(u.id))

  return (
    <div className="flex flex-col gap-5">
      <DataToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email…"
        filters={
          <>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Invited">Invited</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        actions={<InviteUserDialog onInvite={inviteUser} />}
      />

      <BulkActionBar count={selected.size} onClear={() => setSelected(new Set())}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            selected.forEach((id) => updateUser(id, { status: 'Active' }))
            toast({ title: `Activated ${selected.size} member(s)`, variant: 'success' })
            setSelected(new Set())
          }}
        >
          <CheckCircle2 />
          Activate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            selected.forEach((id) => updateUser(id, { status: 'Suspended' }))
            toast({ title: `Suspended ${selected.size} member(s)` })
            setSelected(new Set())
          }}
        >
          <Ban />
          Suspend
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setBulkRemoveOpen(true)}>
          <Trash2 />
          Remove
        </Button>
      </BulkActionBar>

      <Card className="overflow-hidden p-0">
        {filtered.length === 0 ? (
          <EmptyState
            className="border-0"
            icon={<UsersRound />}
            title="No users match your filters"
            description="Try adjusting your search or filters to find who you're looking for."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allOnPageSelected} onCheckedChange={(v) => toggleAll(v === true)} aria-label="Select all" />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((u) => (
                <TableRow key={u.id} className="cursor-pointer" onClick={() => setDrawerUser(u)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selected.has(u.id)} onCheckedChange={(v) => toggleOne(u.id, v === true)} aria-label={`Select ${u.name}`} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-[11px]">{initialsOf(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                        <p className="truncate text-xs text-foreground-subtle">{u.email}</p>
                      </div>
                      {u.twoFactor ? (
                        <ShieldCheck className="size-3.5 shrink-0 text-success" aria-label="2FA enabled" />
                      ) : (
                        <ShieldOff className="size-3.5 shrink-0 text-foreground-subtle" aria-label="2FA disabled" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={u.status} />
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted">{u.lastActive}</TableCell>
                  <TableCell className="text-sm text-foreground-muted">{u.createdAt}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDrawerUser(u)}>
                          <UserCog />
                          View details
                        </DropdownMenuItem>
                        {u.status === 'Suspended' ? (
                          <DropdownMenuItem onClick={() => updateUser(u.id, { status: 'Active' })}>
                            <CheckCircle2 />
                            Reactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateUser(u.id, { status: 'Suspended' })}>
                            <Ban />
                            Suspend
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => removeUsers([u.id])}>
                          <Trash2 />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      <UserDetailDrawer
        user={drawerUser}
        onOpenChange={(open) => !open && setDrawerUser(null)}
        onUpdate={updateUser}
        onRemove={(id) => removeUsers([id])}
      />

      <AlertDialog open={bulkRemoveOpen} onOpenChange={setBulkRemoveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {selected.size} member{selected.size > 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription>
              They'll lose access to this workspace immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                removeUsers([...selected])
                setBulkRemoveOpen(false)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
