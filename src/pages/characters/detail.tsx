import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { IdentityHeader } from '@/components/characters/identity-header'
import { CharacterPreviewDialog } from '@/components/characters/character-preview-dialog'
import { DnaTabContent } from '@/components/characters/dna-tab-content'
import { dnaTabs } from '@/components/characters/dna-tabs-config'
import { getCharacter } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'
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
import { UsersRound } from 'lucide-react'

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const character = id ? getCharacter(id) : undefined
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

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

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Characters', href: '/characters' }, { label: character.name }]} />

      <IdentityHeader
        character={character}
        onOpenPreview={() => setPreviewOpen(true)}
        onDuplicate={() => toast({ title: 'Character duplicated', variant: 'success' })}
        onArchive={() => toast({ title: character.status === 'Archived' ? 'Character restored' : 'Character archived' })}
        onDelete={() => setDeleteOpen(true)}
      />

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
            <DnaTabContent tabKey={t.key} character={character} mode="view" onFieldChange={() => {}} />
          </TabsContent>
        ))}
      </Tabs>

      <CharacterPreviewDialog character={character} open={previewOpen} onOpenChange={setPreviewOpen} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {character.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the character's DNA, LoRA model, and memory. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDeleteOpen(false)
                toast({ title: 'Character deleted' })
                navigate('/characters')
              }}
            >
              Delete character
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
