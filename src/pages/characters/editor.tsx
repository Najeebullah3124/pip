import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, Save, X, UsersRound } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { CharacterPreviewDialog } from '@/components/characters/character-preview-dialog'
import { DnaTabContent } from '@/components/characters/dna-tab-content'
import { dnaTabs } from '@/components/characters/dna-tabs-config'
import { getCharacter, type Character, type CharacterStatus } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'

export default function CharacterEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const source = id ? getCharacter(id) : undefined
  const [character, setCharacter] = React.useState<Character | undefined>(source)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  if (!character) {
    return (
      <EmptyState
        icon={<UsersRound />}
        title="Character not found"
        description="This character may have been deleted or the link is incorrect."
        action={<Button onClick={() => navigate('/characters')}>Back to gallery</Button>}
      />
    )
  }

  function onFieldChange(section: keyof Character, patch: Record<string, unknown>) {
    setCharacter((prev) => {
      if (!prev) return prev
      const current = prev[section]
      if (typeof current !== 'object' || current === null) return prev
      return { ...prev, [section]: { ...current, ...patch } }
    })
  }

  async function save() {
    if (!character) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    toast({ title: 'Character saved', description: `${character.name}'s DNA has been updated.`, variant: 'success' })
    navigate(`/characters/${character.id}`)
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <Breadcrumbs items={[{ label: 'Characters', href: '/characters' }, { label: character.name, href: `/characters/${character.id}` }, { label: 'Edit' }]} />

      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          {character.portraitImage ? (
            <img
              src={character.portraitImage}
              alt={character.name}
              className="size-16 shrink-0 rounded-2xl object-cover shadow-elevation-2"
            />
          ) : (
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-elevation-2"
              style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
            >
              {character.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              className="max-w-xs"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-tagline">Tagline</Label>
            <Input
              id="edit-tagline"
              className="max-w-xs"
              value={character.tagline}
              onChange={(e) => setCharacter({ ...character, tagline: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-status">Status</Label>
            <Select value={character.status} onValueChange={(v) => setCharacter({ ...character, status: v as CharacterStatus })}>
              <SelectTrigger id="edit-status" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
            <Eye />
            Preview
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/characters/${character.id}`)}>
            <X />
            Cancel
          </Button>
          <Button onClick={save} loading={saving}>
            <Save />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="appearance">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {dnaTabs.map((t) => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="gap-1.5 rounded-xl border border-transparent bg-muted/70 px-3.5 py-2 data-[state=active]:border-border data-[state=active]:bg-surface"
            >
              <t.icon className="size-3.5" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {dnaTabs.map((t) => (
          <TabsContent key={t.key} value={t.key}>
            <DnaTabContent tabKey={t.key} character={character} mode="edit" onFieldChange={onFieldChange} />
          </TabsContent>
        ))}
      </Tabs>

      <CharacterPreviewDialog character={character} open={previewOpen} onOpenChange={setPreviewOpen} />
    </div>
  )
}
