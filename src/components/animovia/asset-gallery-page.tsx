import * as React from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CharacterPicker } from '@/components/nexapersona/character-picker'
import { AssetCard } from '@/components/animovia/asset-card'
import { assetKindMeta, animoviaAssets as seedAssets, addAnimoviaAsset, kindDefaults, stories, getStory, type AnimoviaAsset, type AnimoviaAssetKind } from '@/data/animovia-data'
import { useToast } from '@/hooks/use-toast'

interface AssetGalleryPageProps {
  kind: AnimoviaAssetKind
  description: string
  generateLabel: string
  generateHint: string
}

export function AssetGalleryPage({ kind, description, generateLabel, generateHint }: AssetGalleryPageProps) {
  const { toast } = useToast()
  const meta = assetKindMeta[kind]
  const [assets, setAssets] = React.useState<AnimoviaAsset[]>(() => seedAssets.filter((a) => a.kind === kind))
  const [storyFilter, setStoryFilter] = React.useState('all')
  const [open, setOpen] = React.useState(false)
  const [storyId, setStoryId] = React.useState<string | null>(null)
  const [characterId, setCharacterId] = React.useState<string | null>(null)
  const [generating, setGenerating] = React.useState(false)

  const filtered = storyFilter === 'all' ? assets : assets.filter((a) => a.storyId === storyFilter)
  const usedStoryIds = [...new Set(assets.map((a) => a.storyId).filter(Boolean))] as string[]

  function generate(e: React.FormEvent) {
    e.preventDefault()
    if (!storyId) return
    setGenerating(true)
    setTimeout(() => {
      const story = getStory(storyId)
      const defaults = kindDefaults[kind]
      const asset: AnimoviaAsset = {
        id: `asset_new_${Date.now()}`,
        kind,
        title: `${story?.title ?? 'Untitled story'} — ${kind}`,
        characterId,
        storyId,
        status: 'Complete',
        engine: defaults.engine,
        createdAt: 'Just now',
        gradientFrom: story?.gradientFrom ?? '#a78bfa',
        gradientTo: story?.gradientTo ?? '#7c3aed',
        meta: defaults.meta,
      }
      addAnimoviaAsset(asset)
      setAssets((prev) => [asset, ...prev])
      setGenerating(false)
      setOpen(false)
      setStoryId(null)
      setCharacterId(null)
      toast({ title: `${kind} generated`, description: `${asset.title} is ready.`, variant: 'success' })
    }, 1300)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">{description}</p>
        <div className="flex items-center gap-2.5">
          <Select value={storyFilter} onValueChange={setStoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stories</SelectItem>
              {usedStoryIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {getStory(id)?.title ?? id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setOpen(true)}>
            <Plus />
            {generateLabel}
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
          <meta.icon className="size-6 text-foreground-subtle" />
          <p className="text-sm font-semibold text-foreground">Nothing here yet</p>
          <p className="max-w-xs text-xs text-foreground-subtle">{generateHint}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filtered.map((item) => (
            <AssetCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <meta.icon className="size-4.5" style={{ color: meta.color }} />
              {generateLabel}
            </DialogTitle>
            <DialogDescription>{generateHint}</DialogDescription>
          </DialogHeader>
          <form onSubmit={generate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Story</Label>
              <Select value={storyId ?? undefined} onValueChange={setStoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a story" />
                </SelectTrigger>
                <SelectContent>
                  {stories.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Character (optional)</Label>
              <CharacterPicker value={characterId} onChange={setCharacterId} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!storyId} loading={generating}>
                <Sparkles />
                Generate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
