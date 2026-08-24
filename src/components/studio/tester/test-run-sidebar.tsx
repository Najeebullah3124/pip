import { Plus, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TestRun } from '@/components/studio/tester/tester-types'

interface TestRunSidebarProps {
  runs: TestRun[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}

export function TestRunSidebar({ runs, activeId, onSelect, onNew }: TestRunSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
          <FlaskConical className="size-3.5" />
          Test runs
        </p>
        <Button variant="ghost" size="icon-sm" onClick={onNew} aria-label="New test">
          <Plus />
        </Button>
      </div>

      {runs.length === 0 ? (
        <p className="px-1 text-xs text-foreground-subtle">Generate a prompt package to start comparing configurations.</p>
      ) : (
        <div className="flex flex-col gap-1.5 overflow-y-auto">
          {runs.map((run) => (
            <button
              key={run.id}
              onClick={() => onSelect(run.id)}
              className={cn(
                'flex flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
                activeId === run.id ? 'border-accent-200 bg-accent-soft' : 'border-transparent hover:border-border hover:bg-muted'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-semibold text-foreground">{run.label}</p>
                <Badge variant="outline" className="shrink-0 text-[9px]">
                  {run.version}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-foreground-subtle">
                <span>{run.config.engine}</span>
                <span>{run.createdAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-700" style={{ width: `${run.optimizedScore ?? run.originalScore}%` }} />
                </div>
                <span className="text-[10px] font-semibold tabular-nums text-foreground-muted">{run.optimizedScore ?? run.originalScore}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
