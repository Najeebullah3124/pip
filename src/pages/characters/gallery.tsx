import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, UsersRound, Search } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { CharacterCard } from '@/components/characters/character-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { characters as seedCharacters, type Character } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'

export default function CharacterGalleryPage() {
  const navigate = useNavigate()
  const [characters, setCharacters] = React.useState<Character[]>(seedCharacters)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [appFilter, setAppFilter] = React.useState('all')
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null)
  const { toast } = useToast()

  const filtered = React.useMemo(() => {
    return characters.filter((c) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesApp = appFilter === 'all' || c.applications.includes(appFilter)
      return matchesSearch && matchesStatus && matchesApp
    })
  }, [characters, search, statusFilter, appFilter])

  function archiveCharacter(id: string) {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Archived' ? 'Draft' : 'Archived' } : c))
    )
    toast({ title: 'Character updated', variant: 'success' })
  }

  function duplicateCharacter(id: string) {
    const source = characters.find((c) => c.id === id)
    if (!source) return
    const copy: Character = { ...source, id: `char_copy_${Date.now()}`, name: `${source.name} Copy`, status: 'Draft', generationCount: 0, lastUsed: 'Never' }
    setCharacters((prev) => [copy, ...prev])
    toast({ title: 'Character duplicated', description: `"${copy.name}" was added as a draft.`, variant: 'success' })
  }

  function deleteCharacter() {
    setCharacters((prev) => prev.filter((c) => c.id !== deleteTarget))
    setDeleteTarget(null)
    toast({ title: 'Character deleted' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Characters"
        description="Manage the Character DNA behind every AI persona across PIP."
        icon={<UsersRound />}
        actions={
          <Button onClick={() => navigate('/characters/new')}>
            <Plus />
            Create character
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search characters…" className="pl-9" />
        </div>
        <div className="flex items-center gap-2.5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={appFilter} onValueChange={setAppFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Application" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All applications</SelectItem>
              <SelectItem value="Prompt Studio">Prompt Studio</SelectItem>
              <SelectItem value="NexaPersona">NexaPersona</SelectItem>
              <SelectItem value="Animovia">Animovia</SelectItem>
              <SelectItem value="Private Platform">Private Platform</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<UsersRound />}
          title="No characters found"
          description="Try adjusting your search or filters, or create a new character to get started."
          action={
            <Button onClick={() => navigate('/characters/new')}>
              <Plus />
              Create character
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => (
            <CharacterCard
              key={c.id}
              character={c}
              onArchive={archiveCharacter}
              onDuplicate={duplicateCharacter}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this character?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the character's DNA, LoRA model, and memory. Any prompts referencing it will need a new character.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteCharacter}>
              Delete character
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
