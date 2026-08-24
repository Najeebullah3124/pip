import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, TestTube2, History, Terminal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrivateBadge } from '@/components/private/private-badge'
import { privatePromptTemplates, promptTestRuns, addTestRun, type PromptTestRun } from '@/data/private-data'
import { useToast } from '@/hooks/use-toast'

const sampleOutputs = [
  'The response stays fully in character, respects the requested tone, and includes no disallowed references. Latency: 640ms.',
  'Output honors every provided variable and reads naturally for the target audience. Latency: 480ms.',
  'Generated result is on-brand and consistent with prior test runs for this template. Latency: 710ms.',
  'The model followed instructions precisely, with no hallucinated details outside the provided variables. Latency: 555ms.',
]

export default function PrivatePromptTesterPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialId = searchParams.get('template') ?? privatePromptTemplates[0]?.id ?? ''
  const [templateId, setTemplateId] = React.useState(initialId)
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [running, setRunning] = React.useState(false)
  const [runs, setRuns] = React.useState<PromptTestRun[]>(() => [...promptTestRuns])

  const template = privatePromptTemplates.find((t) => t.id === templateId)

  function selectTemplate(id: string) {
    setTemplateId(id)
    setValues({})
    setSearchParams({ template: id }, { replace: true })
  }

  function runTest(e: React.FormEvent) {
    e.preventDefault()
    if (!template) return
    setRunning(true)
    setTimeout(() => {
      let compiled = template.systemPrompt
      for (const v of template.variables) {
        compiled = compiled.replaceAll(`{{${v}}}`, values[v]?.trim() || `[${v}]`)
      }
      const output = `${compiled}\n\n— ${sampleOutputs[Math.floor(Math.random() * sampleOutputs.length)]}`
      const run: PromptTestRun = {
        id: `priv_run_${Date.now()}`,
        templateId: template.id,
        input: { ...values },
        output,
        createdAt: 'Just now',
      }
      addTestRun(run)
      setRuns((prev) => [run, ...prev])
      setRunning(false)
      toast({ title: 'Test run complete', description: `${template.name} produced a result.`, variant: 'success' })
    }, 1100)
  }

  const templateRuns = runs.filter((r) => r.templateId === templateId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-foreground-muted">Run a private prompt template against sample inputs before it's trusted in production.</p>
        <PrivateBadge />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="flex flex-col gap-5 border-amber-400/15 p-5 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <Label>Template</Label>
            <Select value={templateId} onValueChange={selectTemplate}>
              <SelectTrigger>
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
          </div>

          {template && (
            <form onSubmit={runTest} className="flex flex-col gap-4">
              {template.variables.length === 0 ? (
                <p className="text-xs text-foreground-subtle">This template has no variables — it can be run as-is.</p>
              ) : (
                template.variables.map((v) => (
                  <div key={v} className="flex flex-col gap-1.5">
                    <Label htmlFor={`var-${v}`} className="font-mono text-xs">
                      {`{{${v}}}`}
                    </Label>
                    <Input
                      id={`var-${v}`}
                      placeholder={`Value for ${v}`}
                      value={values[v] ?? ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [v]: e.target.value }))}
                    />
                  </div>
                ))
              )}
              <Button type="submit" loading={running} className="bg-amber-500 text-ink-950 hover:bg-amber-400">
                <Play />
                {running ? 'Running…' : 'Run test'}
              </Button>
            </form>
          )}
        </Card>

        <Card className="flex flex-col gap-3 border-amber-400/15 p-5 sm:p-6">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <History className="size-3.5" />
            Test history
          </p>
          {templateRuns.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
              <TestTube2 className="size-6 text-amber-500/60" />
              <p className="text-sm text-foreground-subtle">No test runs yet for this template.</p>
            </div>
          ) : (
            <div className="flex max-h-[420px] flex-col gap-2.5 overflow-y-auto pr-1">
              {templateRuns.map((run) => (
                <div key={run.id} className="rounded-xl border border-border bg-surface-2 p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                    <Terminal className="size-3" />
                    {run.createdAt}
                  </div>
                  <p className="whitespace-pre-line font-mono text-[11px] leading-relaxed text-foreground-muted">{run.output}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
