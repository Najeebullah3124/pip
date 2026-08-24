import * as React from 'react'
import { PencilRuler, FlaskConical, Workflow } from 'lucide-react'
import { PromptEditorWorkspace } from '@/components/studio/prompt-editor-workspace'
import { PromptTesterWorkspace } from '@/components/studio/tester/prompt-tester-workspace'
import { PromptIntelligencePipeline } from '@/components/studio/pipeline/prompt-intelligence-pipeline'
import { cn } from '@/lib/utils'

type StudioMode = 'editor' | 'tester' | 'pipeline'

const modes: { key: StudioMode; label: string; icon: typeof PencilRuler }[] = [
  { key: 'editor', label: 'Editor', icon: PencilRuler },
  { key: 'tester', label: 'Test & Optimize', icon: FlaskConical },
  { key: 'pipeline', label: 'Intelligence Pipeline', icon: Workflow },
]

export default function PromptStudioPage() {
  const [mode, setMode] = React.useState<StudioMode>('editor')

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit items-center gap-1 rounded-xl border border-border bg-surface-2 p-1">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
              mode === m.key ? 'bg-surface text-foreground shadow-elevation-1' : 'cursor-pointer text-foreground-muted hover:text-foreground'
            )}
          >
            <m.icon className="size-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'editor' && <PromptEditorWorkspace />}
      {mode === 'tester' && <PromptTesterWorkspace />}
      {mode === 'pipeline' && <PromptIntelligencePipeline />}
    </div>
  )
}
