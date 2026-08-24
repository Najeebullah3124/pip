import { Check, Loader2, Circle, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ExecStep } from '@/components/studio/pipeline/pipeline-types'

export function ExecutionLog({ steps }: { steps: ExecStep[] }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
        <Activity className="size-3.5" />
        Live execution
      </p>
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full',
                step.status === 'done' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
                step.status === 'active' && 'bg-accent-soft text-accent',
                step.status === 'pending' && 'bg-muted text-foreground-subtle'
              )}
            >
              {step.status === 'done' && <Check className="size-3.5" strokeWidth={3} />}
              {step.status === 'active' && <Loader2 className="size-3.5 animate-spin" />}
              {step.status === 'pending' && <Circle className="size-2 fill-current" />}
            </span>
            {i < steps.length - 1 && <span className={cn('my-0.5 h-5 w-px', step.status === 'done' ? 'bg-emerald-300' : 'bg-border')} />}
          </div>
          <div className="flex flex-1 items-center justify-between pb-4">
            <p
              className={cn(
                'text-sm',
                step.status === 'pending' ? 'text-foreground-subtle' : 'font-medium text-foreground'
              )}
            >
              {step.label}
            </p>
            {step.timestamp && <span className="text-[11px] text-foreground-subtle">{step.timestamp}</span>}
          </div>
        </div>
      ))}
    </Card>
  )
}
