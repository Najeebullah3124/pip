import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Pencil, Copy, Download, Archive, Trash2, Star, Zap, Clock, Calendar, Blocks, Cpu, Play,
  RotateCcw, ThumbsUp, ThumbsDown, Sparkles, Library,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { EmptyState } from '@/components/shared/empty-state'
import { Spinner } from '@/components/shared/spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { TemplateStatusBadge } from '@/components/templates/template-status-badge'
import { TemplateFormDialog } from '@/components/templates/template-form-dialog'
import { ExportTemplateDialog } from '@/components/templates/import-export-dialog'
import { UsageChart } from '@/components/library/usage-chart'
import { categoryMeta, getTemplate, updateTemplate, addTemplate, type PromptTemplate, type TestRun } from '@/data/template-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

function extractVariables(content: string): string[] {
  const matches = [...content.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])
  return [...new Set(matches)]
}

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const source = id ? getTemplate(id) : undefined
  const [template, setTemplate] = React.useState<PromptTemplate | undefined>(source)
  const [editOpen, setEditOpen] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [varValues, setVarValues] = React.useState<Record<string, string>>({})
  const [running, setRunning] = React.useState(false)
  const [testRuns, setTestRuns] = React.useState<TestRun[]>(source?.testRuns ?? [])

  if (!template) {
    return (
      <EmptyState
        icon={<Library />}
        title="Template not found"
        description="This template may have been deleted or the link is incorrect."
        action={<Button onClick={() => navigate('/prompt-library')}>Back to library</Button>}
      />
    )
  }

  const meta = categoryMeta[template.category]
  const variables = extractVariables(template.content)

  function persist(patch: Partial<PromptTemplate>) {
    if (!id) return
    updateTemplate(id, patch)
    setTemplate((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  function toggleFavorite() {
    persist({ favorite: !template!.favorite })
  }

  function duplicateTemplate() {
    const copy: PromptTemplate = {
      ...template!,
      id: `tpl_copy_${Date.now()}`,
      name: `${template!.name} Copy`,
      status: 'Draft',
      usageCount: 0,
      favorite: false,
      version: 'v1.0',
      versions: [{ version: 'v1.0', changelog: `Duplicated from ${template!.name}`, updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: template!.content }],
    }
    addTemplate(copy)
    toast({ title: 'Template duplicated', description: `"${copy.name}" was added as a draft.`, variant: 'success' })
    navigate(`/prompt-library/${copy.id}`)
  }

  function handleEditSubmit(values: Parameters<React.ComponentProps<typeof TemplateFormDialog>['onSubmit']>[0]) {
    const nextVersionNum = parseFloat(template!.version.replace('v', '')) + 1
    const nextVersion = `v${nextVersionNum}.0`
    persist({
      ...values,
      version: nextVersion,
      lastUpdated: 'Today',
      versions: [
        { version: nextVersion, changelog: 'Updated via editor', updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: values.content },
        ...template!.versions,
      ],
    })
    toast({ title: 'Template updated', description: `Saved as ${nextVersion}.`, variant: 'success' })
  }

  function restoreVersion(version: string) {
    const target = template!.versions.find((v) => v.version === version)
    if (!target) return
    persist({ version: target.version, content: target.content, lastUpdated: 'Today' })
    toast({ title: `Restored ${version}`, variant: 'success' })
  }

  function runTest() {
    setRunning(true)
    setTimeout(() => {
      const compiled = template!.content.replace(/\{\{(\w+)\}\}/g, (_, key) => varValues[key] || `[${key}]`)
      const run: TestRun = {
        id: `run_${Date.now()}`,
        input: compiled,
        output: 'Generation complete — output matches the compiled brief with strong fidelity to the requested style and framing.',
        engine: template!.aiEngine,
        timestamp: 'Just now',
        rating: null,
      }
      setTestRuns((prev) => [run, ...prev])
      persist({ usageCount: template!.usageCount + 1, lastUpdated: 'Today' })
      setRunning(false)
      toast({ title: 'Test run complete', variant: 'success' })
    }, 1400)
  }

  function rateRun(runId: string, rating: TestRun['rating']) {
    setTestRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, rating } : r)))
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Prompt Library', href: '/prompt-library' }, { label: template.name }]} />

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-1">
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${meta.color}, var(--accent))` }} />
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-elevation-2" style={{ backgroundColor: meta.color }}>
              <meta.icon className="size-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{template.name}</h1>
                <TemplateStatusBadge status={template.status} />
                <Badge variant="outline">{template.version}</Badge>
                <button onClick={toggleFavorite} aria-label="Toggle favorite" className="cursor-pointer">
                  <Star className={cn('size-5 text-foreground-subtle transition-colors hover:text-amber-500', template.favorite && 'fill-amber-400 text-amber-500')} />
                </button>
              </div>
              <p className="mt-1 max-w-xl text-sm text-foreground-muted">{template.description}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline">{template.category}</Badge>
                <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground-muted">
                  <Cpu className="size-3" />
                  {template.aiEngine}
                </span>
                {template.tags.map((t) => (
                  <Badge key={t} variant="accent">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" onClick={duplicateTemplate}>
              <Copy />
              Duplicate
            </Button>
            <Button variant="secondary" onClick={() => setExportOpen(true)}>
              <Download />
              Export
            </Button>
            <Button variant="secondary" onClick={() => persist({ status: template.status === 'Archived' ? 'Draft' : 'Archived' })}>
              <Archive />
              {template.status === 'Archived' ? 'Restore' : 'Archive'}
            </Button>
            <Button onClick={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </Button>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-destructive hover:bg-red-50" aria-label="Delete template">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{template.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>This removes the template and its version history. This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      toast({ title: 'Template deleted' })
                      navigate('/prompt-library')
                    }}
                  >
                    Delete template
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4">
          <MetricCell icon={Zap} label="Usage" value={template.usageCount.toLocaleString()} />
          <MetricCell icon={Blocks} label="Components" value={String(template.componentsUsed.length)} />
          <MetricCell icon={Clock} label="Last updated" value={template.lastUpdated} />
          <MetricCell icon={Calendar} label="Created" value={template.createdAt} />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test">Test &amp; Preview</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-5">
          <Card className="p-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Prompt content</p>
            <pre className="overflow-x-auto rounded-xl border border-border bg-surface-2 p-3.5 text-xs leading-relaxed text-foreground-muted">{template.content}</pre>
          </Card>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Components used</p>
              <div className="flex flex-wrap gap-1.5">
                {template.componentsUsed.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Usage over time</p>
              <UsageChart data={template.usageHistory} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test" className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fill template variables</CardTitle>
                <CardDescription>Run a live test with sample values and see how the prompt compiles.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {variables.length === 0 ? (
                  <p className="text-sm text-foreground-subtle">This template has no variables to fill.</p>
                ) : (
                  variables.map((v) => (
                    <div key={v} className="flex flex-col gap-1.5">
                      <Label htmlFor={`var-${v}`}>{v.replace(/_/g, ' ')}</Label>
                      <Input
                        id={`var-${v}`}
                        placeholder={`Enter ${v.replace(/_/g, ' ')}…`}
                        value={varValues[v] ?? ''}
                        onChange={(e) => setVarValues((prev) => ({ ...prev, [v]: e.target.value }))}
                      />
                    </div>
                  ))
                )}
                <Button onClick={runTest} loading={running} className="mt-1">
                  <Play />
                  {running ? 'Running test…' : 'Run test'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live preview</CardTitle>
                <CardDescription>Compiled prompt using your current values</CardDescription>
              </CardHeader>
              <CardContent>
                {running ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10">
                    <Spinner size={26} />
                    <p className="text-sm text-foreground-muted">Compiling with {template.aiEngine}…</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-accent-200 bg-accent-soft p-3.5 text-sm leading-relaxed text-accent-700">
                    {template.content.replace(/\{\{(\w+)\}\}/g, (_, key) => varValues[key] || `[${key}]`)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4.5 text-accent" />
                <div>
                  <CardTitle>Test run history</CardTitle>
                  <CardDescription>Recent test executions for this template</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {testRuns.length === 0 ? (
                <p className="py-6 text-center text-sm text-foreground-subtle">No test runs yet — run your first test above.</p>
              ) : (
                testRuns.map((run) => (
                  <div key={run.id} className="flex flex-col gap-2 rounded-xl px-3 py-3 transition-colors hover:bg-muted">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                        <Badge variant="outline">{run.engine}</Badge>
                        {run.timestamp}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => rateRun(run.id, run.rating === 'good' ? null : 'good')}
                          className={cn('flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-emerald-50', run.rating === 'good' ? 'text-success' : 'text-foreground-subtle')}
                          aria-label="Rate good"
                        >
                          <ThumbsUp className="size-3.5" />
                        </button>
                        <button
                          onClick={() => rateRun(run.id, run.rating === 'bad' ? null : 'bad')}
                          className={cn('flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-red-50', run.rating === 'bad' ? 'text-destructive' : 'text-foreground-subtle')}
                          aria-label="Rate bad"
                        >
                          <ThumbsDown className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{run.output}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="flex flex-col gap-1">
          <Card className="p-2">
            {template.versions.map((v, i) => (
              <div key={v.version} className="flex items-start gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-muted">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-700">
                  {v.version.replace('v', '')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{v.version}</p>
                    {i === 0 && <Badge variant="success">Current</Badge>}
                  </div>
                  <p className="text-sm text-foreground-muted">{v.changelog}</p>
                  <p className="mt-0.5 text-xs text-foreground-subtle">
                    {v.updatedBy} · {v.updatedAt}
                  </p>
                </div>
                {i !== 0 && (
                  <Button variant="ghost" size="sm" onClick={() => restoreVersion(v.version)}>
                    <RotateCcw />
                    Restore
                  </Button>
                )}
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>

      <TemplateFormDialog mode="edit" template={template} open={editOpen} onOpenChange={setEditOpen} onSubmit={handleEditSubmit} />
      <ExportTemplateDialog template={template} open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  )
}

function MetricCell({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4">
      <p className="flex items-center gap-1.5 text-xs text-foreground-subtle">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="truncate text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
