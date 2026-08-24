import * as React from 'react'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PrivateAssetCard } from '@/components/private/private-asset-card'
import { PrivateBadge } from '@/components/private/private-badge'
import {
  privateAssets as seedAssets, addPrivateAsset, privateAssetKindMeta, privateCharacters,
  type PrivateAsset, type PrivateAssetKind,
} from '@/data/private-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface PrivateAssetGalleryPageProps {
  kind: PrivateAssetKind
  description: string
  createLabel: string
}

export function PrivateAssetGalleryPage({ kind, description, createLabel }: PrivateAssetGalleryPageProps) {
  const { toast } = useToast()
  const meta = privateAssetKindMeta[kind]
  const [assets, setAssets] = React.useState<PrivateAsset[]>(() => seedAssets.filter((a) => a.kind === kind))
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [characterId, setCharacterId] = React.useState<string | null>(null)

  function create(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const asset: PrivateAsset = {
      id: `priv_asset_new_${Date.now()}`,
      kind,
      title: title.trim(),
      characterId,
      status: 'Draft',
      meta: meta.metaPool[0],
      updatedAt: 'Just now',
    }
    addPrivateAsset(asset)
    setAssets((prev) => [asset, ...prev])
    setOpen(false)
    setTitle('')
    setCharacterId(null)
    toast({ title: `${kind} created`, description: `${asset.title} was added to your private ${kind.toLowerCase()} catalog.`, variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground-muted">{description}</p>
          <PrivateBadge />
        </div>
        <Button onClick={() => setOpen(true)} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
          <Plus />
          {createLabel}
        </Button>
      </div>

      {assets.length === 0 ? (
        <Card className="flex min-h-[220px] flex-col items-center justify-center gap-3 border-amber-400/15 p-6 text-center">
          <meta.icon className="size-6 text-amber-500/60" />
          <p className="text-sm font-semibold text-foreground">No private {kind.toLowerCase()}s yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {assets.map((asset) => (
            <PrivateAssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <meta.icon className="size-4.5 text-amber-500" />
              {createLabel}
            </DialogTitle>
            <DialogDescription>This asset stays private to this workspace and will never appear in standard libraries.</DialogDescription>
          </DialogHeader>
          <form onSubmit={create} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priv-asset-title">Name</Label>
              <Input id="priv-asset-title" placeholder={`e.g. ${meta.metaPool[0]}`} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Linked private character (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {privateCharacters.map((c) => {
                  const active = characterId === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCharacterId(active ? null : c.id)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors',
                        active ? 'border-amber-400 bg-amber-500/15 text-amber-600' : 'border-border text-foreground-muted hover:bg-muted'
                      )}
                    >
                      <span
                        className="flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}
                      >
                        {c.name.slice(0, 1)}
                      </span>
                      {c.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim()} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
