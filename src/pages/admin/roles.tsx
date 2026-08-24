import * as React from 'react'
import { Plus, ShieldCheck, Users, MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RoleDetailDrawer } from '@/components/admin/roles/role-detail-drawer'
import { roleDefs, type RoleDef } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

export default function AdminRolesPage() {
  const [roles, setRoles] = React.useState<RoleDef[]>(roleDefs)
  const [drawerRole, setDrawerRole] = React.useState<RoleDef | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const { toast } = useToast()

  function saveRolePermissions(key: string, permissions: string[]) {
    setRoles((prev) => prev.map((r) => (r.key === key ? { ...r, permissions } : r)))
    toast({ title: 'Role updated', description: 'Permission changes saved.', variant: 'success' })
  }

  function createRole(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const role: RoleDef = {
      key: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description: description || 'Custom role',
      builtIn: false,
      memberCount: 0,
      permissions: [],
    }
    setRoles((prev) => [...prev, role])
    setCreateOpen(false)
    setName('')
    setDescription('')
    toast({ title: 'Role created', description: `${name} is ready — assign permissions to get started.`, variant: 'success' })
    setDrawerRole(role)
  }

  function deleteRole(key: string) {
    setRoles((prev) => prev.filter((r) => r.key !== key))
    toast({ title: 'Role deleted' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">{roles.length} roles configured for this workspace</p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a custom role</DialogTitle>
              <DialogDescription>Define a name and description, then configure permissions.</DialogDescription>
            </DialogHeader>
            <form onSubmit={createRole} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-name">Role name</Label>
                <Input id="role-name" placeholder="e.g. Compliance Reviewer" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role-desc">Description</Label>
                <Textarea id="role-desc" placeholder="What can this role do?" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create & configure permissions</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.key} className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent">
                <ShieldCheck className="size-[18px]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDrawerRole(role)}>
                    <Pencil />
                    Edit permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy />
                    Duplicate
                  </DropdownMenuItem>
                  {!role.builtIn && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => deleteRole(role.key)}>
                        <Trash2 />
                        Delete role
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-foreground">{role.name}</p>
                {role.builtIn && <Badge variant="outline">Built-in</Badge>}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{role.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                <Users className="size-3.5" />
                {role.memberCount} member{role.memberCount === 1 ? '' : 's'}
              </span>
              <span className="text-xs font-medium text-accent">{role.permissions.length} permissions</span>
            </div>

            <Button variant="secondary" size="sm" onClick={() => setDrawerRole(role)}>
              Edit permissions
            </Button>
          </Card>
        ))}
      </div>

      <RoleDetailDrawer role={drawerRole} onOpenChange={(open) => !open && setDrawerRole(null)} onSave={saveRolePermissions} />
    </div>
  )
}
