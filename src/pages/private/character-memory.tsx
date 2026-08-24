import * as React from 'react'
import { Plus, Brain } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PrivateBadge } from '@/components/private/private-badge'
import { privateMemoryEntries as seedMemories, privateCharacters, getPrivateCharacter, type PrivateMemoryEntry } from '@/data/private-data'
import { useToast } from '@/hooks/use-toast'

const importanceVariant = { Low: 'outline', Medium: 'accent', High: 'destructive' } as const

export default function PrivateCharacterMemoryPage() {
  const { toast } = useToast()
  const [memories, setMemories] = React.useState<PrivateMemoryEntry[]>(() => [...seedMemories])
  const [filter, setFilter] = React.useState('all')
  const [open, setOpen] = React.useState(false)
  const [characterId, setCharacterId] = React.useState(privateCharacters[0]?.id ?? '')
  const [content, setContent] = React.useState('')
  const [importance, setImportance] = React.useState<'Low' | 'Medium' | 'High'>('Medium')

  const filtered = filter === 'all' ? memories : memories.filter((m) => m.characterId === filter)

  function addMemory(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !characterId) return
    const entry: PrivateMemoryEntry = {
      id: `priv_mem_new_${Date.now()}`,
      characterId,
      content: content.trim(),
      importance,
      createdAt: 'Just now',
    }
    seedMemories.unshift(entry)
    setMemories((prev) => [entry, ...prev])
    setOpen(false)
    setContent('')
    setImportance('Medium')
    toast({ title: 'Memory recorded', description: 'This will inform future in-character generations.', variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground-muted">Persistent facts and corrections for private characters, isolated from the shared Character Memory system.</p>
          <PrivateBadge />
        </div>
        <div className="flex items-center gap-2.5">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All characters</SelectItem>
              {privateCharacters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setOpen(true)} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
            <Plus />
            Add memory
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map((m) => {
          const character = getPrivateCharacter(m.characterId)
          return (
            <Card key={m.id} className="flex items-start gap-3.5 border-amber-400/15 p-4">
              {character && (
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-elevation-1"
                  style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
                >
                  {character.name.slice(0, 1)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{character?.name ?? 'Unknown character'}</p>
                  <Badge variant={importanceVariant[m.importance]} className="text-[10px]">
                    {m.importance}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-foreground-muted">{m.content}</p>
              </div>
              <span className="shrink-0 text-[11px] text-foreground-subtle">{m.createdAt}</span>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <Card className="flex min-h-[180px] flex-col items-center justify-center gap-3 border-amber-400/15 p-6 text-center">
            <Brain className="size-6 text-amber-500/60" />
            <p className="text-sm font-semibold text-foreground">No memories recorded yet</p>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add memory</DialogTitle>
            <DialogDescription>Record a fact, correction, or preference this private character should consistently remember.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addMemory} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Character</Label>
              <Select value={characterId} onValueChange={setCharacterId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {privateCharacters.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mem-content">Memory</Label>
              <Textarea id="mem-content" placeholder="What should this character remember?" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Importance</Label>
              <Select value={importance} onValueChange={(v) => setImportance(v as 'Low' | 'Medium' | 'High')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim()} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
                Save memory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
