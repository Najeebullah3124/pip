import * as React from 'react'
import { Plus, Copy, Check, KeyRound, MoreHorizontal, Ban, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import { apiKeys as seedKeys, type ApiKeyRecord } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

export default function AdminApiKeysPage() {
  const [keys, setKeys] = React.useState<ApiKeyRecord[]>(seedKeys)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [revealOpen, setRevealOpen] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState('')
  const [newKeyScope, setNewKeyScope] = React.useState<ApiKeyRecord['scope']>('Full access')
  const [generatedKey, setGeneratedKey] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()

  function createKey(e: React.FormEvent) {
    e.preventDefault()
    if (!newKeyName.trim()) return
    const secret = `pip_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`
    const record: ApiKeyRecord = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      keyPrefix: secret.slice(0, 16),
      scope: newKeyScope,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never',
      createdBy: 'Emerson Sterling',
      status: 'Active',
    }
    setKeys((prev) => [record, ...prev])
    setGeneratedKey(secret)
    setCreateOpen(false)
    setRevealOpen(true)
    setNewKeyName('')
    setNewKeyScope('Full access')
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'Revoked' } : k)))
    toast({ title: 'API key revoked', description: 'Any requests using this key will now be rejected.' })
  }

  function copyKey() {
    navigator.clipboard?.writeText(generatedKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Keys authenticate service accounts and integrations using the <code className="rounded bg-muted px-1 py-0.5 text-xs">Authorization: ApiKey</code> header.
        </p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create API key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new API key</DialogTitle>
              <DialogDescription>You'll only be able to view the full key once, right after creation.</DialogDescription>
            </DialogHeader>
            <form onSubmit={createKey} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="key-name">Key name</Label>
                <Input id="key-name" placeholder="e.g. Production backend" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="key-scope">Scope</Label>
                <Select value={newKeyScope} onValueChange={(v) => setNewKeyScope(v as ApiKeyRecord['scope'])}>
                  <SelectTrigger id="key-scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full access">Full access</SelectItem>
                    <SelectItem value="Read only">Read only</SelectItem>
                    <SelectItem value="Prompts only">Prompts only</SelectItem>
                    <SelectItem value="Engines only">Engines only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate key</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="font-medium">{k.name}</TableCell>
                <TableCell>
                  <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground-muted">{k.keyPrefix}…</code>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{k.scope}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{k.createdAt}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{k.lastUsed}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{k.createdBy}</TableCell>
                <TableCell>
                  <StatusBadge status={k.status} />
                </TableCell>
                <TableCell>
                  {k.status === 'Active' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Revoke "{k.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Any application using this key will immediately lose access. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction variant="destructive" onClick={() => revokeKey(k.id)}>
                            <Ban />
                            Revoke key
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={revealOpen} onOpenChange={setRevealOpen}>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4.5 text-success" />
              Key created
            </DialogTitle>
            <DialogDescription>Copy this key now — you won't be able to see it again.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3">
            <KeyRound className="size-4 shrink-0 text-foreground-subtle" />
            <code className="flex-1 overflow-x-auto font-mono text-sm text-foreground">{generatedKey}</code>
            <Button variant="ghost" size="icon-sm" onClick={copyKey} aria-label="Copy key">
              {copied ? <Check className="text-success" /> : <Copy />}
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setRevealOpen(false)
                toast({ title: 'API key saved', description: 'Store it securely — it will not be shown again.', variant: 'success' })
              }}
            >
              I've copied my key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
