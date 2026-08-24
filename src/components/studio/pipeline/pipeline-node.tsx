import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NodeStatus } from '@/components/studio/pipeline/pipeline-types'

interface PipelineNodeProps {
  icon: React.ElementType
  label: string
  summary: string
  status: NodeStatus
  onClick: () => void
}

export function PipelineNode({ icon: Icon, label, summary, status, onClick }: PipelineNodeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full shrink-0 cursor-pointer flex-col items-center gap-2.5 rounded-2xl border-2 bg-card p-4 text-center transition-all sm:w-40',
        status === 'active' && 'border-accent shadow-elevation-2 ring-4 ring-accent/15',
        status === 'done' && 'border-emerald-300 shadow-elevation-1',
        status === 'idle' && 'border-border hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevation-1'
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-2xl text-white shadow-elevation-1 transition-colors',
            status === 'active' && 'animate-pulse bg-gradient-to-br from-accent to-accent-700',
            status === 'done' && 'bg-gradient-to-br from-emerald-500 to-emerald-700',
            status === 'idle' && 'bg-gradient-to-br from-accent-100 to-accent-soft !text-accent'
          )}
        >
          <Icon className="size-5" />
        </div>
        {status === 'done' && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card">
            <Check className="size-2.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-foreground-subtle">{summary}</p>
      </div>
    </button>
  )
}
