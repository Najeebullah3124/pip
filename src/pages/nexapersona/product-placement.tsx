import * as React from 'react'
import { ArrowLeft, Download, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CharacterPicker } from '@/components/nexapersona/character-picker'
import { PlacementCanvas } from '@/components/nexapersona/placement-canvas'
import { MediaThumbnail } from '@/components/nexapersona/media-thumbnail'
import {
  campaigns as seedCampaigns,
  addCampaign,
  updateCampaign,
  placementStyles,
  placementEnvironments,
  type Campaign,
} from '@/data/campaign-data'
import { getCharacter } from '@/data/character-data'
import { addMediaItem, type MediaItem } from '@/data/nexapersona-data'
import { useToast } from '@/hooks/use-toast'

const environmentGradients: Record<string, [string, string]> = {
  'Modern studio': ['#c4b5fd', '#6d28d9'],
  'Sunlit loft': ['#fde68a', '#d97706'],
  'Urban rooftop': ['#93c5fd', '#2563eb'],
  'Minimal cyclorama': ['#e2e8f0', '#64748b'],
  'Cozy library': ['#fda4af', '#e11d48'],
  'Outdoor lifestyle': ['#86efac', '#16a34a'],
}

const statusVariant: Record<Campaign['status'], 'success' | 'outline'> = {
  Generated: 'success',
  Draft: 'outline',
}

const emptyForm = {
  brand: '',
  product: '',
  placementStyle: placementStyles[0],
  marketingNotes: '',
  cta: '',
  characterId: null as string | null,
}

export default function ProductPlacementPage() {
  const { toast } = useToast()
  const [campaigns, setCampaigns] = React.useState<Campaign[]>(() => [...seedCampaigns])
  const [createOpen, setCreateOpen] = React.useState(false)
  const [form, setForm] = React.useState(emptyForm)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [generating, setGenerating] = React.useState(false)
  const [resultsById, setResultsById] = React.useState<Record<string, MediaItem>>(() => {
    const map: Record<string, MediaItem> = {}
    for (const c of seedCampaigns) {
      if (c.status === 'Generated') {
        const [gradientFrom, gradientTo] = environmentGradients[c.environment] ?? ['#a78bfa', '#7c3aed']
        map[c.id] = {
          id: c.resultId ?? `media_pp_seed_${c.id}`,
          type: 'Product Placement',
          title: `${c.brand} — ${c.product}`,
          characterId: c.characterId,
          status: 'Complete',
          engine: 'FLUX.1 Pro',
          createdAt: c.createdAt,
          gradientFrom,
          gradientTo,
          meta: c.placementStyle,
        }
      }
    }
    return map
  })

  const active = campaigns.find((c) => c.id === activeId) ?? null
  const result = active ? (resultsById[active.id] ?? null) : null

  function patchActive(patch: Partial<Campaign>) {
    if (!active) return
    updateCampaign(active.id, patch)
    setCampaigns((prev) => prev.map((c) => (c.id === active.id ? { ...c, ...patch } : c)))
  }

  function createCampaign(e: React.FormEvent) {
    e.preventDefault()
    if (!form.brand.trim() || !form.product.trim()) return
    const campaign: Campaign = {
      id: `campaign_new_${Date.now()}`,
      brand: form.brand.trim(),
      product: form.product.trim(),
      placementStyle: form.placementStyle,
      marketingNotes: form.marketingNotes.trim(),
      cta: form.cta.trim() || 'Shop now',
      characterId: form.characterId,
      environment: placementEnvironments[0],
      markerX: 50,
      markerY: 55,
      scale: 1,
      status: 'Draft',
      resultId: null,
      createdAt: 'Just now',
    }
    addCampaign(campaign)
    setCampaigns((prev) => [campaign, ...prev])
    setCreateOpen(false)
    setForm(emptyForm)
    setActiveId(campaign.id)
  }

  function generate() {
    if (!active) return
    setGenerating(true)
    setTimeout(() => {
      const character = active.characterId ? getCharacter(active.characterId) : undefined
      const [gradientFrom, gradientTo] = environmentGradients[active.environment] ?? ['#a78bfa', '#7c3aed']
      const item: MediaItem = {
        id: `media_pp_${Date.now()}`,
        type: 'Product Placement',
        title: `${active.brand} — ${active.product}`,
        characterId: active.characterId,
        status: 'Complete',
        engine: 'FLUX.1 Pro',
        createdAt: 'Just now',
        gradientFrom,
        gradientTo,
        meta: active.placementStyle,
      }
      addMediaItem(item)
      setResultsById((prev) => ({ ...prev, [active.id]: item }))
      patchActive({ status: 'Generated', resultId: item.id })
      setGenerating(false)
      toast({
        title: 'Placement generated',
        description: `${active.product} composed into the ${active.environment.toLowerCase()} scene.${character ? ` Featuring ${character.name}.` : ''}`,
        variant: 'success',
      })
    }, 1500)
  }

  if (active) {
    const character = active.characterId ? getCharacter(active.characterId) : undefined
    const gradient = environmentGradients[active.environment] ?? ['#a78bfa', '#7c3aed']

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setActiveId(null)}>
            <ArrowLeft />
            All campaigns
          </Button>
          <div className="h-4 w-px bg-border" />
          <p className="text-sm font-semibold text-foreground">
            {active.brand} — {active.product}
          </p>
          <Badge variant={statusVariant[active.status]}>{active.status}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <Label>Character</Label>
              <CharacterPicker value={active.characterId} onChange={(id) => patchActive({ characterId: id })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pp-brand">Brand</Label>
                <Input id="pp-brand" value={active.brand} onChange={(e) => patchActive({ brand: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pp-product">Product</Label>
                <Input id="pp-product" value={active.product} onChange={(e) => patchActive({ product: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Placement style</Label>
                <Select value={active.placementStyle} onValueChange={(v) => patchActive({ placementStyle: v as Campaign['placementStyle'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {placementStyles.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Scene environment</Label>
                <Select value={active.environment} onValueChange={(v) => patchActive({ environment: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {placementEnvironments.map((env) => (
                      <SelectItem key={env} value={env}>
                        {env}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pp-notes">Marketing notes</Label>
              <Textarea
                id="pp-notes"
                placeholder="Tone, mood, key details the scene should emphasize…"
                value={active.marketingNotes}
                onChange={(e) => patchActive({ marketingNotes: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pp-cta">Call to action</Label>
              <Input id="pp-cta" placeholder="e.g. Shop now" value={active.cta} onChange={(e) => patchActive({ cta: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <Label>Product scale</Label>
                <span className="text-xs font-semibold tabular-nums text-foreground-muted">{active.scale.toFixed(2)}×</span>
              </div>
              <Slider value={[active.scale]} min={0.5} max={1.6} step={0.05} onValueChange={([v]) => patchActive({ scale: v })} />
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Visual editor</p>
                <p className="text-[11px] text-foreground-subtle">Drag the pin to position the product</p>
              </div>
              <PlacementCanvas
                environmentGradient={gradient}
                markerX={active.markerX}
                markerY={active.markerY}
                scale={active.scale}
                product={active.product}
                cta={active.cta}
                onMove={(x, y) => patchActive({ markerX: x, markerY: y })}
                className="h-64"
              />
              {character && (
                <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                  <div
                    className="flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
                  >
                    {character.name.slice(0, 1)}
                  </div>
                  Featuring {character.name}
                </div>
              )}
            </Card>

            <Card className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden p-6">
              {generating ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <Sparkles className="size-6 animate-pulse text-accent" />
                  <p className="text-sm font-medium text-foreground">Composing scene…</p>
                </div>
              ) : result ? (
                <div className="flex w-full flex-col gap-4">
                  <MediaThumbnail item={result} className="h-52 w-full rounded-2xl" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{result.title}</p>
                      <p className="text-xs text-foreground-subtle">
                        {result.engine} · {result.meta}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="icon-sm" onClick={generate} aria-label="Regenerate">
                        <RotateCcw />
                      </Button>
                      <Button variant="secondary" size="icon-sm" aria-label="Download">
                        <Download />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <Sparkles className="size-5 text-foreground-subtle" />
                  <p className="text-sm font-semibold text-foreground">Ready to compose</p>
                  <p className="max-w-xs text-xs text-foreground-subtle">Position the product, then generate the final placement shot.</p>
                </div>
              )}
            </Card>

            <Button size="lg" onClick={generate} loading={generating} disabled={generating}>
              <Sparkles />
              {generating ? 'Generating…' : result ? 'Regenerate placement' : 'Generate placement'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">Manage brand campaigns and compose products into character-led scenes.</p>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          New campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((campaign) => {
          const character = campaign.characterId ? getCharacter(campaign.characterId) : undefined
          const campaignResult = resultsById[campaign.id]
          const gradient = environmentGradients[campaign.environment] ?? ['#a78bfa', '#7c3aed']
          return (
            <Card
              key={campaign.id}
              className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2"
              onClick={() => setActiveId(campaign.id)}
            >
              {campaignResult ? (
                <MediaThumbnail item={campaignResult} className="h-32 w-full" />
              ) : (
                <div className="relative h-32 w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
                  <div
                    className="absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/70 bg-white/25 text-white backdrop-blur-sm"
                    style={{ left: `${campaign.markerX}%`, top: `${campaign.markerY}%` }}
                  >
                    <Sparkles className="size-3.5" />
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{campaign.brand}</p>
                    <p className="truncate text-xs text-foreground-subtle">{campaign.product}</p>
                  </div>
                  <Badge variant={statusVariant[campaign.status]} className="shrink-0">
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">{campaign.placementStyle}</Badge>
                  <Badge variant="accent">{campaign.cta}</Badge>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[11px] text-foreground-subtle">
                  {character ? (
                    <span className="flex items-center gap-1.5">
                      <div
                        className="flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
                      >
                        {character.name.slice(0, 1)}
                      </div>
                      {character.name}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span>{campaign.createdAt}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New campaign</DialogTitle>
            <DialogDescription>Set up the brand and product details, then compose the scene in the visual editor.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createCampaign} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-brand">Brand</Label>
                <Input id="new-brand" placeholder="e.g. Aurora Audio" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-product">Product</Label>
                <Input
                  id="new-product"
                  placeholder="e.g. Wireless headphones"
                  value={form.product}
                  onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Placement style</Label>
              <Select value={form.placementStyle} onValueChange={(v) => setForm((f) => ({ ...f, placementStyle: v as Campaign['placementStyle'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {placementStyles.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-notes">Marketing notes</Label>
              <Textarea
                id="new-notes"
                placeholder="Tone, mood, key details the scene should emphasize…"
                value={form.marketingNotes}
                onChange={(e) => setForm((f) => ({ ...f, marketingNotes: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-cta">Call to action</Label>
              <Input id="new-cta" placeholder="e.g. Shop now" value={form.cta} onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Character (optional)</Label>
              <CharacterPicker value={form.characterId} onChange={(id) => setForm((f) => ({ ...f, characterId: id }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.brand.trim() || !form.product.trim()}>
                Create campaign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
