import * as React from 'react'
import { Plus, FileText } from 'lucide-react'
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
import { allCategories, aiEngines, type TemplateCategory, type TemplateStatus, type PromptTemplate } from '@/data/template-data'

interface TemplateFormDialogProps {
  mode: 'create' | 'edit'
  template?: PromptTemplate
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (values: {
    name: string
    category: TemplateCategory
    description: string
    status: TemplateStatus
    aiEngine: string
    content: string
    tags: string[]
  }) => void
}

export function TemplateFormDialog({ mode, template, open, onOpenChange, onSubmit }: TemplateFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen

  const [name, setName] = React.useState(template?.name ?? '')
  const [category, setCategory] = React.useState<TemplateCategory>(template?.category ?? 'Image')
  const [description, setDescription] = React.useState(template?.description ?? '')
  const [status, setStatus] = React.useState<TemplateStatus>(template?.status ?? 'Draft')
  const [aiEngine, setAiEngine] = React.useState(template?.aiEngine ?? aiEngines[0])
  const [content, setContent] = React.useState(template?.content ?? '')
  const [tags, setTags] = React.useState<string[]>(template?.tags ?? [])
  const [nameError, setNameError] = React.useState<string>()

  React.useEffect(() => {
    if (dialogOpen && template) {
      setName(template.name)
      setCategory(template.category)
      setDescription(template.description)
      setStatus(template.status)
      setAiEngine(template.aiEngine)
      setContent(template.content)
      setTags(template.tags)
    }
    if (dialogOpen && !template) {
      setName('')
      setCategory('Image')
      setDescription('')
      setStatus('Draft')
      setAiEngine(aiEngines[0])
      setContent('')
      setTags([])
    }
  }, [dialogOpen, template])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Template name is required')
      return
    }
    setNameError(undefined)
    onSubmit({ name, category, description, status, aiEngine, content, tags })
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Create template
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-4.5 text-accent" />
            {mode === 'create' ? 'Create template' : 'Edit template'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a reusable prompt template that can be run across any connected engine.'
              : 'Changes create a new version — previous versions stay available in history.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tpl-name">Name</Label>
            <Input
              id="tpl-name"
              placeholder="e.g. Product Launch Teaser"
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
              <Label htmlFor="tpl-category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
                <SelectTrigger id="tpl-category">
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
              <Label htmlFor="tpl-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TemplateStatus)}>
                <SelectTrigger id="tpl-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tpl-engine">AI engine</Label>
            <Select value={aiEngine} onValueChange={setAiEngine}>
              <SelectTrigger id="tpl-engine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiEngines.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tpl-desc">Description</Label>
            <Textarea id="tpl-desc" rows={2} placeholder="What does this template produce?" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tpl-content">Prompt content</Label>
            <Textarea
              id="tpl-content"
              rows={3}
              className="font-mono text-xs"
              placeholder="Template text with {{variables}}"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <TagEditor label="Tags" values={tags} onChange={setTags} placeholder="Add a tag…" />

          <DialogFooter className="pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{mode === 'create' ? 'Create template' : 'Save changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
