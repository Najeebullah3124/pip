import * as React from 'react'
import { Plus, Blocks } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TagEditor } from '@/components/characters/tag-editor'
import { allCategories, type ComponentCategory, type ComponentStatus, type PromptComponent } from '@/data/component-data'

interface ComponentFormDialogProps {
  mode: 'create' | 'edit'
  component?: PromptComponent
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (values: {
    name: string
    category: ComponentCategory
    description: string
    status: ComponentStatus
    content: string
    tags: string[]
  }) => void
}

export function ComponentFormDialog({ mode, component, trigger, open, onOpenChange, onSubmit }: ComponentFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen

  const [name, setName] = React.useState(component?.name ?? '')
  const [category, setCategory] = React.useState<ComponentCategory>(component?.category ?? 'Character DNA')
  const [description, setDescription] = React.useState(component?.description ?? '')
  const [status, setStatus] = React.useState<ComponentStatus>(component?.status ?? 'Draft')
  const [content, setContent] = React.useState(component?.content ?? '')
  const [tags, setTags] = React.useState<string[]>(component?.tags ?? [])
  const [nameError, setNameError] = React.useState<string>()

  React.useEffect(() => {
    if (dialogOpen && component) {
      setName(component.name)
      setCategory(component.category)
      setDescription(component.description)
      setStatus(component.status)
      setContent(component.content)
      setTags(component.tags)
    }
    if (dialogOpen && !component) {
      setName('')
      setCategory('Character DNA')
      setDescription('')
      setStatus('Draft')
      setContent('')
      setTags([])
    }
  }, [dialogOpen, component])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Component name is required')
      return
    }
    setNameError(undefined)
    onSubmit({ name, category, description, status, content, tags })
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        !isControlled && (
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create component
            </Button>
          </DialogTrigger>
        )
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Blocks className="size-4.5 text-accent" />
            {mode === 'create' ? 'Create component' : 'Edit component'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a reusable prompt building block that can be dropped into any prompt.'
              : 'Changes create a new version — previous versions stay available in history.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cmp-name">Name</Label>
            <Input
              id="cmp-name"
              placeholder="e.g. Studio Portrait LoRA"
              value={name}
              invalid={!!nameError}
              onChange={(e) => {
                setName(e.target.value)
                setNameError(undefined)
              }}
            />
            {nameError && <p className="text-xs font-medium text-destructive">{nameError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cmp-category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ComponentCategory)}>
                <SelectTrigger id="cmp-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cmp-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ComponentStatus)}>
                <SelectTrigger id="cmp-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cmp-desc">Description</Label>
            <Textarea id="cmp-desc" rows={2} placeholder="What does this component do?" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cmp-content">Definition</Label>
            <Textarea
              id="cmp-content"
              rows={3}
              className="font-mono text-xs"
              placeholder="Template text with {{variables}}"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p className="text-xs text-foreground-subtle">Use <code className="rounded bg-muted px-1 py-0.5">{'{{variable}}'}</code> placeholders for dynamic values.</p>
          </div>

          <TagEditor label="Tags" values={tags} onChange={setTags} placeholder="Add a tag…" />

          <DialogFooter className="pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'create' ? 'Create component' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
