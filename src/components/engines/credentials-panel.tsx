import * as React from 'react'
import { KeyRound, ShieldCheck, RefreshCw, ExternalLink, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { maskedApiKey, type AiEngine } from '@/data/engine-data'
import { useToast } from '@/hooks/use-toast'

export function CredentialsPanel({ engine, onUpdateKey, onUpdateBaseUrl }: { engine: AiEngine; onUpdateKey: (last4: string) => void; onUpdateBaseUrl: (url: string) => void }) {
  const { toast } = useToast()
  const [rotateOpen, setRotateOpen] = React.useState(false)
  const [newKey, setNewKey] = React.useState('')
  const [baseUrl, setBaseUrl] = React.useState(engine.baseUrl)
  const [saved, setSaved] = React.useState(false)

  function submitRotate(e: React.FormEvent) {
    e.preventDefault()
    if (!newKey.trim()) return
    onUpdateKey(newKey.slice(-4))
    setRotateOpen(false)
    setNewKey('')
    toast({ title: 'API key updated', description: 'The new key is now in use. Only the last 4 characters are ever shown.', variant: 'success' })
  }

  function saveBaseUrl() {
    onUpdateBaseUrl(baseUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
    toast({ title: 'Base URL saved', variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4.5 text-accent" />
          <p className="text-[15px] font-semibold text-foreground">API credentials</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>API key</Label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5">
            <KeyRound className="size-4 shrink-0 text-foreground-subtle" />
            <code className="flex-1 select-none font-mono text-sm tracking-wide text-foreground-muted">{maskedApiKey(engine)}</code>
          </div>
          <p className="text-xs text-foreground-subtle">For security, the full key is never displayed once saved — only the last 4 characters are shown.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setRotateOpen(true)}>
            <RefreshCw />
            Rotate / update key
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={engine.docsUrl} target="_blank" rel="noreferrer">
              <ExternalLink />
              Provider docs
            </a>
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-5">
        <Label htmlFor="base-url">Base URL</Label>
        <div className="flex items-center gap-2.5">
          <Input id="base-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className="font-mono text-[13px]" />
          <Button variant="secondary" size="sm" onClick={saveBaseUrl}>
            {saved ? <Check className="text-success" /> : null}
            Save
          </Button>
        </div>
        <p className="text-xs text-foreground-subtle">The endpoint PIP sends requests to for this provider.</p>
      </Card>

      <Dialog open={rotateOpen} onOpenChange={setRotateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rotate API key</DialogTitle>
            <DialogDescription>Paste a new key below. It's encrypted at rest — after saving, only the last 4 characters are ever shown again.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRotate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-key">New API key</Label>
              <Input
                id="new-key"
                type="password"
                placeholder="sk-••••••••••••••••"
                className="font-mono text-[13px]"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setRotateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save key</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
