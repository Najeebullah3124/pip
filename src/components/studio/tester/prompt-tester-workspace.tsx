import * as React from 'react'
import { FlaskConical } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { TestConfigBar } from '@/components/studio/tester/test-config-bar'
import { TestRunSidebar } from '@/components/studio/tester/test-run-sidebar'
import { ComparisonPanel } from '@/components/studio/tester/comparison-panel'
import type { TestRun } from '@/components/studio/tester/tester-types'
import { compilePackage, optimizePackage, qualityScore, extractVariableNames, type CompileInput } from '@/lib/prompt-compile'
import { getTemplate, aiEngines } from '@/data/template-data'
import { getCharacter } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'

function newDraft(): CompileInput {
  return { templateId: null, characterId: null, componentIds: [], engine: aiEngines[0], variables: {} }
}

function bumpVersion(version: string): string {
  const n = parseFloat(version.replace('v', '')) + 1
  return `v${n}.0`
}

export function PromptTesterWorkspace() {
  const { toast } = useToast()
  const [draft, setDraft] = React.useState<CompileInput>(newDraft)
  const [runs, setRuns] = React.useState<TestRun[]>([])
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [generating, setGenerating] = React.useState(false)
  const [optimizing, setOptimizing] = React.useState(false)
  const [testingSide, setTestingSide] = React.useState<'original' | 'optimized' | null>(null)

  const activeRun = runs.find((r) => r.id === activeId) ?? null

  function updateDraft(patch: Partial<CompileInput>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      if (patch.templateId) {
        const t = getTemplate(patch.templateId)
        if (t) {
          const names = extractVariableNames(t.content)
          const merged: Record<string, string> = {}
          names.forEach((n) => (merged[n] = prev.variables[n] ?? ''))
          next.variables = merged
        }
      }
      return next
    })
  }

  async function handleGenerate() {
    if (!draft.templateId) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 700))
    const original = compilePackage(draft)
    const score = qualityScore(original, draft.variables)
    const template = getTemplate(draft.templateId)
    const character = draft.characterId ? getCharacter(draft.characterId) : undefined
    const run: TestRun = {
      id: `run_${Date.now()}`,
      label: `${template?.name ?? 'Template'} × ${character?.name ?? 'No character'}`,
      createdAt: 'Just now',
      config: draft,
      original,
      optimized: null,
      originalScore: score,
      optimizedScore: null,
      improvements: [],
      changedSections: [],
      version: 'v1.0',
      versions: [{ version: 'v1.0', source: 'original', createdAt: 'Just now' }],
      originalTestResult: null,
      optimizedTestResult: null,
    }
    setRuns((prev) => [run, ...prev])
    setActiveId(run.id)
    setGenerating(false)
    toast({ title: 'Prompt package generated', description: `Ready to test "${run.label}".`, variant: 'success' })
  }

  function updateActive(patch: Partial<TestRun>) {
    if (!activeId) return
    setRuns((prev) => prev.map((r) => (r.id === activeId ? { ...r, ...patch } : r)))
  }

  async function handleOptimize() {
    if (!activeRun) return
    setOptimizing(true)
    await new Promise((r) => setTimeout(r, 1300))
    const result = optimizePackage(activeRun.original)
    const score = qualityScore(result.package, activeRun.config.variables)
    updateActive({
      optimized: result.package,
      optimizedScore: score,
      improvements: result.improvements,
      changedSections: result.changedSections,
    })
    setOptimizing(false)
    toast({ title: 'Optimization complete', description: `Quality score improved to ${score}.`, variant: 'success' })
  }

  async function handleRunTest(side: 'original' | 'optimized') {
    if (!activeRun) return
    setTestingSide(side)
    await new Promise((r) => setTimeout(r, 1200))
    const result =
      side === 'original'
        ? 'Baseline generation complete — output follows the brief but shows minor inconsistencies under close inspection.'
        : 'Optimized generation complete — output shows markedly stronger fidelity, cleaner composition, and no visible artifacts.'
    updateActive(side === 'original' ? { originalTestResult: result } : { optimizedTestResult: result })
    setTestingSide(null)
    toast({ title: 'Test run complete', variant: 'success' })
  }

  function handleApplyOptimization() {
    if (!activeRun || !activeRun.optimized) return
    const nextVersion = bumpVersion(activeRun.version)
    updateActive({
      original: activeRun.optimized,
      originalScore: activeRun.optimizedScore ?? activeRun.originalScore,
      optimized: null,
      optimizedScore: null,
      improvements: [],
      changedSections: [],
      version: nextVersion,
      versions: [{ version: nextVersion, source: 'optimized', createdAt: 'Today' }, ...activeRun.versions],
      originalTestResult: activeRun.optimizedTestResult,
      optimizedTestResult: null,
    })
    toast({ title: 'Optimization applied', description: `Now on ${nextVersion}.`, variant: 'success' })
  }

  function handleSaveAsNewVersion() {
    if (!activeRun) return
    const nextVersion = bumpVersion(activeRun.version)
    const source = activeRun.optimized ? 'optimized' : 'original'
    updateActive({
      version: nextVersion,
      versions: [{ version: nextVersion, source, createdAt: 'Today' }, ...activeRun.versions],
    })
    toast({ title: 'Saved as new version', description: `Snapshot stored as ${nextVersion}.`, variant: 'success' })
  }

  const nextVersionLabel = activeRun ? bumpVersion(activeRun.version) : 'v1.0'

  return (
    <div className="flex flex-col gap-4">
      <TestConfigBar config={draft} onChange={updateDraft} onGenerate={handleGenerate} generating={generating} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-1 lg:block">
          <TestRunSidebar runs={runs} activeId={activeId} onSelect={setActiveId} onNew={() => setDraft(newDraft())} />
        </div>

        <div className="min-h-[420px] overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-elevation-1 sm:p-6">
          {activeRun ? (
            <ComparisonPanel
              run={activeRun}
              optimizing={optimizing}
              testingSide={testingSide}
              nextVersionLabel={nextVersionLabel}
              onOptimize={handleOptimize}
              onRunTest={handleRunTest}
              onApplyOptimization={handleApplyOptimization}
              onSaveAsNewVersion={handleSaveAsNewVersion}
            />
          ) : (
            <EmptyState
              className="h-full border-0"
              icon={<FlaskConical />}
              title="Configure a test to begin"
              description="Select a template, character, components, and AI engine above, then generate a prompt package to test and compare optimizations."
            />
          )}
        </div>
      </div>
    </div>
  )
}
