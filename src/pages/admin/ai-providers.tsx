import * as React from 'react'
import { Plus, MoreHorizontal, Pencil, RefreshCw, Unplug, Cpu, DollarSign, Gauge } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
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
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import { aiProviders as seedProviders, type AiProviderConfig } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

export default function AdminAiProvidersPage() {
  const [providers, setProviders] = React.useState<AiProviderConfig[]>(seedProviders)
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [apiKey, setApiKey] = React.useState('')
  const { toast } = useToast()

  const totalSpend = providers.reduce((sum, p) => sum + Number(p.monthlySpend.replace(/[^0-9.]/g, '') || 0), 0)
  const connected = providers.filter((p) => p.status === 'Connected').length

  function toggleConnection(id: string) {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'Connected' ? 'Disconnected' : 'Connected' } : p))
    )
  }

  function addProvider(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !apiKey.trim()) return
    const provider: AiProviderConfig = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      vendor: 'Custom provider',
      status: 'Connected',
      models: ['Custom model'],
      usagePercent: 0,
      monthlySpend: '$0',
      keyLast4: apiKey.slice(-4),
      color: '#7c3aed',
    }
    setProviders((prev) => [...prev, provider])
    setOpen(false)
    setName('')
    setApiKey('')
    toast({ title: 'Provider connected', description: `${name} is now available in Prompt Studio.`, variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Connected providers" value={`${connected}/${providers.length}`} icon={<Cpu />} />
        <StatCard label="Monthly spend" value={`$${totalSpend.toLocaleString()}`} icon={<DollarSign />} />
        <StatCard label="Total models available" value={String(providers.reduce((s, p) => s + p.models.length, 0))} icon={<Gauge />} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">Providers powering prompt execution, evaluation, and generation</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Add AI Engine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect a new AI engine</DialogTitle>
              <DialogDescription>Add a provider's API credentials to make its models available across PIP.</DialogDescription>
            </DialogHeader>
            <form onSubmit={addProvider} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="provider-name">Provider name</Label>
                <Input id="provider-name" placeholder="e.g. Cohere" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="provider-key">API key</Label>
                <Input
                  id="provider-key"
                  placeholder="sk-••••••••••••••••"
                  className="font-mono text-[13px]"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Connect provider</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3.5">
        {providers.map((p) => (
          <Card key={p.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-elevation-1"
                style={{ backgroundColor: p.color }}
              >
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-xs text-foreground-subtle">{p.vendor}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.models.map((m) => (
                    <Badge key={m} variant="outline" className="text-[10px]">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:gap-8">
              <div className="text-right">
                <p className="text-xs text-foreground-subtle">Usage share</p>
                <p className="text-sm font-semibold tabular-nums text-foreground">{p.usagePercent}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-foreground-subtle">Monthly spend</p>
                <p className="text-sm font-semibold tabular-nums text-foreground">{p.monthlySpend}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-foreground-subtle">Key</p>
                <p className="font-mono text-sm text-foreground-muted">••••{p.keyLast4}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil />
                    Edit configuration
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw />
                    Rotate key
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => toggleConnection(p.id)}>
                    <Unplug />
                    {p.status === 'Connected' ? 'Disconnect' : 'Reconnect'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
