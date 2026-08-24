import * as React from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PrivateAssetGalleryPage } from '@/components/private/private-asset-gallery-page'
import { PrivateBadge } from '@/components/private/private-badge'
import { privateCharacters as seedCharacters, privateAssets, type PrivateCharacter, type PrivateStatus } from '@/data/private-data'
import { useToast } from '@/hooks/use-toast'

const statusVariant: Record<PrivateStatus, 'outline' | 'accent' | 'success' | 'destructive'> = {
  Draft: 'outline',
  Active: 'success',
  Testing: 'accent',
  Archived: 'destructive',
}

const archetypes = ['Prototype mascot', 'Experimental narrator', 'Internal test persona', 'Brand voice draft', 'Unreleased ambassador']
const gradientPairs: [string, string][] = [
  ['#fbbf24', '#b45309'], ['#f97316', '#7c2d12'], ['#facc15', '#854d0e'], ['#fb923c', '#9a3412'],
]

export default function PrivateCharacterDnaPage() {
  const { toast } = useToast()
  const [characters, setCharacters] = React.useState<PrivateCharacter[]>(() => [...seedCharacters])
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [archetype, setArchetype] = React.useState(archetypes[0])
  const [notes, setNotes] = React.useState('')

  function createCharacter(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const [gradientFrom, gradientTo] = gradientPairs[Math.floor(Math.random() * gradientPairs.length)]
    const character: PrivateCharacter = {
      id: `priv_char_new_${Date.now()}`,
      name: name.trim(),
      archetype,
      tagline: notes.trim() || 'Internal-only identity, not yet published to NexaPersona or Animovia.',
      gradientFrom,
      gradientTo,
      status: 'Draft',
      updatedAt: 'Just now',
    }
    seedCharacters.unshift(character)
    setCharacters((prev) => [character, ...prev])
    setOpen(false)
    setName('')
    setArchetype(archetypes[0])
    setNotes('')
    toast({ title: 'Private character created', description: `${character.name} is ready for internal testing.`, variant: 'success' })
  }

  return (
    <Tabs defaultValue="characters">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="characters">Private Characters</TabsTrigger>
          <TabsTrigger value="wardrobes">Private Wardrobes</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="characters" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-foreground-muted">Experimental identities kept isolated from PIP's shared Character DNA module until they're ready to publish.</p>
            <PrivateBadge />
          </div>
          <Button onClick={() => setOpen(true)} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
            <Plus />
            New private character
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {characters.map((c) => (
            <Card key={c.id} className="flex flex-col overflow-hidden border-amber-400/15 transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-elevation-2">
              <div className="relative flex h-24 items-center justify-center" style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}>
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
                <div className="relative flex size-14 items-center justify-center rounded-2xl border-2 border-white/50 text-lg font-bold text-white shadow-elevation-2">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <Badge variant={statusVariant[c.status]} className="shrink-0 text-[10px]">
                    {c.status}
                  </Badge>
                </div>
                <p className="text-xs text-foreground-subtle">{c.archetype}</p>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[11px] text-foreground-subtle">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3" />
                    {privateAssets.filter((a) => a.characterId === c.id).length} linked assets
                  </span>
                  <span>{c.updatedAt}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="wardrobes">
        <PrivateAssetGalleryPage kind="Wardrobe" description="Wardrobe presets under internal review before they're added to a character's public styling options." createLabel="New wardrobe" />
      </TabsContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New private character</DialogTitle>
            <DialogDescription>Draft an experimental identity for internal testing — it stays isolated from the shared Character DNA module.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createCharacter} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pc-name">Name</Label>
              <Input id="pc-name" placeholder="e.g. Prototype Echo" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Archetype</Label>
              <Select value={archetype} onValueChange={setArchetype}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {archetypes.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pc-notes">Internal notes</Label>
              <Textarea id="pc-notes" placeholder="What is this identity being tested for?" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}
