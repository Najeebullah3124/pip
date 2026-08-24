import * as React from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Save, TestTube2, SlidersHorizontal, Braces, FlaskConical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrivateBadge } from '@/components/private/private-badge'
import {
  getPromptTemplate, addPromptTemplate, updatePromptTemplate, promptCategories,
  type PrivatePromptTemplate, type PromptCategory,
} from '@/data/private-data'
import { useToast } from '@/hooks/use-toast'

function extractVariables(text: string): string[] {
  const matches = [...text.matchAll(/{{\s*([\w.]+)\s*}}/g)].map((m) => m[1])
  return [...new Set(matches)]
}

export default function PrivatePromptBuilderPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')
  const existing = templateId ? getPromptTemplate(templateId) : undefined

  const [name, setName] = React.useState(existing?.name ?? '')
  const [category, setCategory] = React.useState<PromptCategory>(existing?.category ?? promptCategories[0])
  const [systemPrompt, setSystemPrompt] = React.useState(existing?.systemPrompt ?? '')

  const variables = React.useMemo(() => extractVariables(systemPrompt), [systemPrompt])

  function save(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !systemPrompt.trim()) return

    if (existing) {
      updatePromptTemplate(existing.id, { name: name.trim(), category, systemPrompt, variables })
      toast({ title: 'Template saved', description: `${name} was updated.`, variant: 'success' })
    } else {
      const template: PrivatePromptTemplate = {
        id: `priv_prompt_new_${Date.now()}`,
        name: name.trim(),
        category,
        systemPrompt,
        variables,
        status: 'Draft',
        version: 'v1.0',
        usageCount: 0,
        updatedAt: 'Just now',
      }
      addPromptTemplate(template)
      toast({ title: 'Template created', description: `${template.name} was added to your private prompt library.`, variant: 'success' })
      navigate(`/private-platform/prompt-builder?template=${template.id}`, { replace: true })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground-muted">{existing ? 'Editing an existing private prompt template.' : 'Build a new private prompt template from scratch.'}</p>
          <PrivateBadge />
        </div>
        {existing && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/private-platform/prompt-tester?template=${existing.id}`}>
                <TestTube2 />
                Test
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to={`/private-platform/prompt-optimizer?template=${existing.id}`}>
                <SlidersHorizontal />
                Optimize
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Card className="flex flex-col gap-5 border-amber-400/15 p-5 sm:p-6">
        <form onSubmit={save} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pb-name">Template name</Label>
              <Input id="pb-name" placeholder="e.g. Character voice — warm narrator" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as PromptCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {promptCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pb-system">System prompt</Label>
            <Textarea
              id="pb-system"
              placeholder="Write the system prompt — use {{variable_name}} to mark dynamic inputs."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-40 font-mono text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5">
              <Braces className="size-3.5" />
              Detected variables
            </Label>
            {variables.length === 0 ? (
              <p className="text-xs text-foreground-subtle">Wrap dynamic inputs in double curly braces, e.g. {'{{character_name}}'}, to detect variables automatically.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {variables.map((v) => (
                  <Badge key={v} variant="accent" className="font-mono text-[11px]">
                    {v}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
            <Button type="submit" disabled={!name.trim() || !systemPrompt.trim()} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
              <Save />
              {existing ? 'Save changes' : 'Create template'}
            </Button>
          </div>
        </form>
      </Card>

      {!existing && (
        <Card className="flex items-center gap-3 border-amber-400/15 p-4">
          <FlaskConical className="size-4 shrink-0 text-amber-500" />
          <p className="text-xs text-foreground-subtle">Once saved, this template becomes available in the Prompt Tester and Prompt Optimizer for internal evaluation.</p>
        </Card>
      )}
    </div>
  )
}
