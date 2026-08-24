import * as React from 'react'
import { Plus, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { roleDefs, type UserRole } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function InviteUserDialog({ onInvite }: { onInvite: (email: string, role: UserRole) => void }) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<UserRole>('Member')
  const [error, setError] = React.useState<string>()
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return setError('Email is required')
    if (!EMAIL_RE.test(email)) return setError('Enter a valid email address')
    setError(undefined)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    onInvite(email, role)
    setLoading(false)
    setOpen(false)
    setEmail('')
    setRole('Member')
    toast({ title: 'Invitation sent', description: `${email} will receive an email to join the workspace.`, variant: 'success' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Invite user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4.5 text-accent" />
            Invite a new user
          </DialogTitle>
          <DialogDescription>They'll receive an email invitation to join this workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              invalid={!!error}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(undefined)
              }}
            />
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger id="invite-role">
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
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? 'Sending invite…' : 'Send invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
