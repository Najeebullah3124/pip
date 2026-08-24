import * as React from 'react'
import { FileText, Blocks, UsersRound, Braces, Search, Plus, GripVertical } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { templates } from '@/data/template-data'
import { components as libraryComponents, categoryMeta as componentCategoryMeta } from '@/data/component-data'
import { characters } from '@/data/character-data'
import { cn } from '@/lib/utils'

interface StudioLeftPanelProps {
  selectedComponentIds: string[]
  selectedCharacterId: string | null
  variableNames: string[]
  onLoadTemplate: (templateId: string) => void
  onAddComponent: (componentId: string) => void
  onSelectCharacter: (characterId: string) => void
  onInsertVariable: (name: string) => void
  onAddVariable: (name: string) => void
}

export function StudioLeftPanel({
  selectedComponentIds,
  selectedCharacterId,
  variableNames,
  onLoadTemplate,
  onAddComponent,
  onSelectCharacter,
  onInsertVariable,
  onAddVariable,
}: StudioLeftPanelProps) {
  const [search, setSearch] = React.useState('')
  const [newVar, setNewVar] = React.useState('')

  const filteredTemplates = templates.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())).slice(0, 30)
  const filteredComponents = libraryComponents.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 30)
  const filteredCharacters = characters.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Tabs defaultValue="templates" className="flex h-full flex-col">
      <div className="px-3 pt-3">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" title="Templates">
            <FileText className="size-3.5" />
          </TabsTrigger>
          <TabsTrigger value="components" title="Components">
            <Blocks className="size-3.5" />
          </TabsTrigger>
          <TabsTrigger value="characters" title="Characters">
            <UsersRound className="size-3.5" />
          </TabsTrigger>
          <TabsTrigger value="variables" title="Variables">
            <Braces className="size-3.5" />
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="h-8 pl-8 text-xs" />
        </div>
      </div>

      <TabsContent value="templates" className="mt-2 flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-1.5">
          {filteredTemplates.map((t) => {
            return (
              <button
                key={t.id}
                onClick={() => onLoadTemplate(t.id)}
                className="flex items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition-colors hover:border-border hover:bg-muted"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: 'var(--accent)' }}>
                  <FileText className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{t.name}</p>
                  <p className="truncate text-[11px] text-foreground-subtle">{t.category}</p>
                </div>
              </button>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="components" className="mt-2 flex-1 overflow-y-auto px-3 pb-3">
        <p className="mb-2 px-1 text-[11px] text-foreground-subtle">Drag onto the editor, or click to add</p>
        <div className="flex flex-col gap-1.5">
          {filteredComponents.map((c) => {
            const meta = componentCategoryMeta[c.category]
            const added = selectedComponentIds.includes(c.id)
            return (
              <div
                key={c.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', `[[${c.name}]]`)
                  e.dataTransfer.setData('application/x-pip-component', c.id)
                }}
                onClick={() => onAddComponent(c.id)}
                className={cn(
                  'group flex cursor-grab items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors active:cursor-grabbing',
                  added ? 'border-accent-200 bg-accent-soft' : 'border-transparent hover:border-border hover:bg-muted'
                )}
              >
                <GripVertical className="size-3 shrink-0 text-foreground-subtle opacity-0 group-hover:opacity-100" />
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: meta.color }}>
                  <meta.icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-[11px] text-foreground-subtle">{c.category}</p>
                </div>
                {added && <Badge variant="accent" className="shrink-0 text-[9px]">Added</Badge>}
              </div>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="characters" className="mt-2 flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex flex-col gap-1.5">
          {filteredCharacters.map((c) => {
            const active = selectedCharacterId === c.id
            return (
              <button
                key={c.id}
                onClick={() => onSelectCharacter(c.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors',
                  active ? 'border-accent-200 bg-accent-soft' : 'border-transparent hover:border-border hover:bg-muted'
                )}
              >
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-[11px] text-foreground-subtle">{c.tagline}</p>
                </div>
                {active && <Badge variant="accent" className="shrink-0 text-[9px]">Active</Badge>}
              </button>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="variables" className="mt-2 flex-1 overflow-y-auto px-3 pb-3">
        <p className="mb-2 px-1 text-[11px] text-foreground-subtle">Click to insert at cursor</p>
        <div className="flex flex-wrap gap-1.5">
          {variableNames.length === 0 && <p className="px-1 text-xs text-foreground-subtle">No variables yet.</p>}
          {variableNames.map((v) => (
            <button
              key={v}
              onClick={() => onInsertVariable(v)}
              className="cursor-pointer rounded-full border border-accent-200 bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent-700 transition-colors hover:bg-accent-100"
            >
              {`{{${v}}}`}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <Input
            value={newVar}
            onChange={(e) => setNewVar(e.target.value.replace(/\s+/g, '_'))}
            placeholder="new_variable"
            className="h-8 font-mono text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newVar.trim()) {
                onAddVariable(newVar.trim())
                setNewVar('')
              }
            }}
          />
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => {
              if (newVar.trim()) {
                onAddVariable(newVar.trim())
                setNewVar('')
              }
            }}
            aria-label="Add variable"
          >
            <Plus />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
