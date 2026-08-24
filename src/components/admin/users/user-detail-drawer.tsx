import * as React from 'react'
import { ShieldCheck, ShieldOff, Mail, Calendar, Clock, FolderKanban, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import { roleDefs, type AdminUser } from '@/data/admin-data'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

function initialsOf(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

interface UserDetailDrawerProps {
  user: AdminUser | null
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, patch: Partial<AdminUser>) => void
  onRemove: (id: string) => void
}

export function UserDetailDrawer({ user, onOpenChange, onUpdate, onRemove }: UserDetailDrawerProps) {
  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent>
        {user && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="text-sm">{initialsOf(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <SheetTitle className="truncate">{user.name}</SheetTitle>
                  <SheetDescription className="truncate">{user.email}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <SheetBody className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <StatusBadge status={user.status} />
                <Badge variant="outline">{user.role}</Badge>
                {user.twoFactor ? (
                  <Badge variant="success">
                    <ShieldCheck className="size-3" />
                    2FA enabled
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <ShieldOff className="size-3" />
                    No 2FA
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow icon={Calendar} label="Created" value={user.createdAt} />
                <InfoRow icon={Clock} label="Last active" value={user.lastActive} />
                <InfoRow icon={FolderKanban} label="Projects" value={String(user.projects)} />
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="drawer-role">Role</Label>
                <Select value={user.role} onValueChange={(v) => onUpdate(user.id, { role: v as AdminUser['role'] })}>
                  <SelectTrigger id="drawer-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleDefs
                      .filter((r) => r.builtIn)
                      .map((r) => (
                        <SelectItem key={r.key} value={r.key}>
                          {r.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-foreground-subtle">Changing role updates this member's permissions immediately.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="drawer-status">Status</Label>
                <Select value={user.status} onValueChange={(v) => onUpdate(user.id, { status: v as AdminUser['status'] })}>
                  <SelectTrigger id="drawer-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">Danger zone</p>
                <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/70">
                  Removing this member revokes their access immediately. This cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="mt-3">
                      <Trash2 />
                      Remove member
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove {user.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        They'll lose access to this workspace immediately. Any prompts or characters they own will remain, ownership transferred to the workspace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          onRemove(user.id)
                          onOpenChange(false)
                        }}
                      >
                        Remove member
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SheetBody>

            <SheetFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground-muted">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-foreground-subtle">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
