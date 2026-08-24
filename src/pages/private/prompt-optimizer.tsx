import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Sparkles, Check, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrivateBadge } from '@/components/private/private-badge'
import { privatePromptTemplates, updatePromptTemplate, type PrivatePromptTemplate } from '@/data/private-data'
import { useToast } from '@/hooks/use-toast'

interface Suggestion {
  id: string
  issue: string
  suggestion: string
  impact: 'Low' | 'Medium' | 'High'
  addition: string
}

const impactVariant = { Low: 'outline', Medium: 'accent', High: 'success' } as const

function buildSuggestions(template: PrivatePromptTemplate): Suggestion[] {
  const out: Suggestion[] = []
  if (!/tone|voice/i.test(template.systemPrompt)) {
    out.push({
      id: 'tone',
      issue: 'No explicit tone guardrail',
      suggestion: 'Add an instruction constraining tone to prevent drift across generations.',
      impact: 'High',
      addition: ' Maintain a consistent, on-brand tone throughout the response.',
    })
  }
  if (!/never|do not|avoid/i.test(template.systemPrompt)) {
    out.push({
      id: 'guardrail',
      issue: 'Missing negative constraint',
      suggestion: 'Add a guardrail clarifying what the model should avoid.',
      impact: 'Medium',
      addition: ' Never reference real-world brands, people, or unrelated products.',
    })
  }
  if (template.variables.length > 3) {
    out.push({
      id: 'variables',
      issue: `${template.variables.length} variables may increase failure surface`,
      suggestion: 'Add a fallback instruction for when optional variables are empty.',
      impact: 'Medium',
      addition: ' If a variable is missing, infer a sensible default rather than leaving a gap.',
    })
  }
  out.push({
    id: 'format',
    issue: 'Output format is unconstrained',
    suggestion: 'Specify the expected output format to improve downstream parsing reliability.',
    impact: 'Low',
    addition: ' Respond in plain text only, with no markdown formatting.',
  })
  return out
}

export default function PrivatePromptOptimizerPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialId = searchParams.get('template') ?? privatePromptTemplates[0]?.id ?? ''
  const [templateId, setTemplateId] = React.useState(initialId)
  const [applied, setApplied] = React.useState<Set<string>>(new Set())
  const [, forceRender] = React.useState(0)

  const template = privatePromptTemplates.find((t) => t.id === templateId)
  const suggestions = React.useMemo(() => (template ? buildSuggestions(template) : []), [template])

  function selectTemplate(id: string) {
    setTemplateId(id)
    setApplied(new Set())
    setSearchParams({ template: id }, { replace: true })
  }

  function applySuggestion(s: Suggestion) {
    if (!template || applied.has(s.id)) return
    const versionParts = template.version.replace('v', '').split('.').map(Number)
    const nextVersion = `v${versionParts[0]}.${versionParts[1] + 1}`
    updatePromptTemplate(template.id, { systemPrompt: template.systemPrompt + s.addition, version: nextVersion, updatedAt: 'Just now' })
    setApplied((prev) => new Set(prev).add(s.id))
    forceRender((n) => n + 1)
    toast({ title: 'Suggestion applied', description: `${template.name} bumped to ${nextVersion}.`, variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-foreground-muted">AI-assisted review of private prompt templates — surface risks before they reach production traffic.</p>
        <PrivateBadge />
      </div>

      <Card className="flex flex-col gap-1.5 border-amber-400/15 p-5">
        <Label>Template</Label>
        <Select value={templateId} onValueChange={selectTemplate}>
          <SelectTrigger className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {privatePromptTemplates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {template && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="flex flex-col gap-3 border-amber-400/15 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Current prompt · {template.version}</p>
              <Badge variant="outline" className="text-[10px]">
                {template.category}
              </Badge>
            </div>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-border bg-surface-2 p-3.5 font-mono text-xs leading-relaxed text-foreground-muted">
              {template.systemPrompt}
            </pre>
          </Card>

          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
              <SlidersHorizontal className="size-3.5" />
              Optimization suggestions
            </p>
            {suggestions.map((s) => {
              const isApplied = applied.has(s.id)
              return (
                <Card key={s.id} className="flex flex-col gap-2.5 border-amber-400/15 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{s.issue}</p>
                    <Badge variant={impactVariant[s.impact]} className="shrink-0 text-[10px]">
                      {s.impact} impact
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground-subtle">{s.suggestion}</p>
                  <Button
                    size="sm"
                    variant={isApplied ? 'secondary' : 'primary'}
                    disabled={isApplied}
                    onClick={() => applySuggestion(s)}
                    className={isApplied ? '' : 'w-fit bg-amber-500 text-ink-950 hover:bg-amber-400'}
                  >
                    {isApplied ? (
                      <>
                        <Check />
                        Applied
                      </>
                    ) : (
                      <>
                        <Sparkles />
                        Apply
                      </>
                    )}
                  </Button>
                </Card>
              )
            })}
            {applied.size > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-400/40 bg-amber-500/[0.06] px-3.5 py-2.5 text-xs text-amber-700 dark:text-amber-400">
                <TrendingUp className="size-3.5" />
                {applied.size} suggestion{applied.size > 1 ? 's' : ''} applied — now version {template.version}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
