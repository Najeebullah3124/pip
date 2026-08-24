import * as React from 'react'
import { MessageSquareText, FileText, Fingerprint, Blocks, SlidersHorizontal, Package, ChevronRight, Play, RotateCcw, Workflow } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PipelineNode } from '@/components/studio/pipeline/pipeline-node'
import { ExecutionLog } from '@/components/studio/pipeline/execution-log'
import { NodeConfigDialog } from '@/components/studio/pipeline/node-config-dialog'
import { PackageViewer } from '@/components/studio/pipeline/package-viewer'
import type { NodeKey, PipelineState, ExecStep, NodeStatus } from '@/components/studio/pipeline/pipeline-types'
import { execStepDefs } from '@/components/studio/pipeline/pipeline-types'
import { compilePackage, type CompiledPackage } from '@/lib/prompt-compile'
import { getTemplate } from '@/data/template-data'
import { getCharacter } from '@/data/character-data'
import { components as libraryComponents } from '@/data/component-data'
import { useToast } from '@/hooks/use-toast'

function initialState(): PipelineState {
  return {
    request: 'Generate a hero product shot for our new wireless headphones, styled to match our brand identity.',
    templateId: 'tpl_000',
    characterId: 'char_001',
    componentIds: ['cmp_000'],
    engine: 'Claude Opus 5',
    temperature: 70,
    topP: 90,
    maxTokens: 2048,
  }
}

function initialSteps(): ExecStep[] {
  return execStepDefs.map((label, i) => ({ key: `step_${i}`, label, status: 'pending', timestamp: null }))
}

const nodeDefs: { key: NodeKey; label: string; icon: React.ElementType }[] = [
  { key: 'request', label: 'Request', icon: MessageSquareText },
  { key: 'template', label: 'Template', icon: FileText },
  { key: 'character', label: 'Character DNA', icon: Fingerprint },
  { key: 'components', label: 'Components', icon: Blocks },
  { key: 'settings', label: 'AI Settings', icon: SlidersHorizontal },
  { key: 'package', label: 'Prompt Package', icon: Package },
]

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function PromptIntelligencePipeline() {
  const { toast } = useToast()
  const [state, setState] = React.useState<PipelineState>(initialState)
  const [steps, setSteps] = React.useState<ExecStep[]>(initialSteps)
  const [running, setRunning] = React.useState(false)
  const [openNode, setOpenNode] = React.useState<NodeKey | null>(null)
  const [pkg, setPkg] = React.useState<CompiledPackage | null>(null)

  function patch(p: Partial<PipelineState>) {
    setState((prev) => ({ ...prev, ...p }))
  }

  function nodeStatus(index: number): NodeStatus {
    const s = steps[index]?.status
    if (s === 'active') return 'active'
    if (s === 'done') return 'done'
    return 'idle'
  }

  function nodeSummary(key: NodeKey): string {
    switch (key) {
      case 'request':
        return state.request.trim() || 'Not set'
      case 'template':
        return getTemplate(state.templateId ?? '')?.name ?? 'Not selected'
      case 'character':
        return getCharacter(state.characterId ?? '')?.name ?? 'No character'
      case 'components':
        return state.componentIds.length ? `${state.componentIds.length} selected` : 'None'
      case 'settings':
        return state.engine
      case 'package':
        return pkg ? `${pkg.tokens} tokens` : 'Pending'
    }
  }

  async function setStepStatus(index: number, status: 'active' | 'done') {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status, timestamp: status === 'done' ? 'Just now' : s.timestamp } : s))
    )
  }

  async function runPipeline() {
    setRunning(true)
    setSteps(initialSteps())
    setPkg(null)

    for (let i = 0; i < 6; i++) {
      await setStepStatus(i, 'active')
      await delay(550)
      await setStepStatus(i, 'done')

      if (i === 5) {
        const compiled = compilePackage({
          templateId: state.templateId,
          characterId: state.characterId,
          componentIds: state.componentIds,
          engine: state.engine,
          variables: {},
        })
        setPkg(compiled)
      }
    }
    await delay(300)
    await setStepStatus(6, 'done')
    setRunning(false)
    toast({ title: 'Pipeline completed', description: 'Prompt package generated successfully.', variant: 'success' })
  }

  function resetPipeline() {
    setSteps(initialSteps())
    setPkg(null)
  }

  const componentsPreview = state.componentIds.map((id) => libraryComponents.find((c) => c.id === id)?.name).filter(Boolean)

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-700 text-white shadow-elevation-1">
            <Workflow className="size-[18px]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">Prompt Intelligence Engine</p>
            <p className="text-xs text-foreground-muted">Request → Template → Character DNA → Components → AI Settings → Prompt Package</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={resetPipeline} disabled={running}>
            <RotateCcw />
            Reset
          </Button>
          <Button onClick={runPipeline} loading={running}>
            <Play />
            {running ? 'Running…' : 'Run pipeline'}
          </Button>
        </div>
      </Card>

      <Card className="overflow-x-auto p-5 sm:p-7">
        <div className="flex min-w-max items-center justify-center gap-2 sm:gap-3">
          {nodeDefs.map((n, i) => (
            <React.Fragment key={n.key}>
              <PipelineNode icon={n.icon} label={n.label} summary={nodeSummary(n.key)} status={nodeStatus(i)} onClick={() => setOpenNode(n.key)} />
              {i < nodeDefs.length - 1 && <ChevronRight className="size-4 shrink-0 text-foreground-subtle" />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-5 sm:p-6">
          <p className="mb-4 text-[15px] font-semibold text-foreground">Final prompt package</p>
          {pkg ? (
            <PackageViewer pkg={pkg} />
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface-2/60 py-12 text-center">
              <Package className="size-6 text-foreground-subtle" />
              <p className="text-sm font-medium text-foreground">No package generated yet</p>
              <p className="max-w-xs text-xs text-foreground-subtle">Run the pipeline to compile a request, template, character, components, and AI settings into a final package.</p>
            </div>
          )}
          {state.componentIds.length > 0 && !pkg && (
            <p className="mt-3 text-[11px] text-foreground-subtle">Configured components: {componentsPreview.join(', ')}</p>
          )}
        </Card>

        <ExecutionLog steps={steps} />
      </div>

      <NodeConfigDialog nodeKey={openNode} state={state} onChange={patch} onOpenChange={(open) => !open && setOpenNode(null)} compiledPackage={pkg} />
    </div>
  )
}
