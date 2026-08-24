import { X, Clock, Loader2, CheckCircle2, TriangleAlert, ListChecks } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { generationTypeMeta, type GenerationType } from '@/data/nexapersona-data'
import { cn } from '@/lib/utils'

export interface QueueJob {
  id: string
  type: GenerationType
  characterName: string
  status: 'Queued' | 'Processing' | 'Complete' | 'Failed'
  progress: number
  createdAt: string
}

export function GenerationQueue({ jobs, onCancel }: { jobs: QueueJob[]; onCancel: (id: string) => void }) {
  const active = jobs.filter((j) => j.status === 'Queued' || j.status === 'Processing')

  return (
    <Card className="flex flex-col gap-3 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
        <ListChecks className="size-3.5" />
        Generation queue {active.length > 0 && <span className="text-accent">({active.length})</span>}
      </p>
      {active.length === 0 ? (
        <p className="py-3 text-center text-xs text-foreground-subtle">Nothing queued — new generations will appear here.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {active.map((job) => {
            const meta = generationTypeMeta[job.type]
            return (
              <div key={job.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: meta.color }}>
                  <meta.icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-medium text-foreground">
                      {job.type} · {job.characterName}
                    </p>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-foreground-subtle">
                      {job.status === 'Queued' ? (
                        <>
                          <Clock className="size-3" />
                          Queued
                        </>
                      ) : (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          {job.progress}%
                        </>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full bg-gradient-to-r from-accent to-accent-700 transition-all duration-300', job.status === 'Queued' && 'w-0')}
                      style={{ width: job.status === 'Processing' ? `${job.progress}%` : undefined }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => onCancel(job.id)}
                  className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-destructive"
                  aria-label="Cancel"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export function GenerationStatusStrip({ status }: { status: QueueJob['status'] | 'Idle' }) {
  const map = {
    Idle: { icon: ListChecks, label: 'Ready to generate', color: 'text-foreground-subtle' },
    Queued: { icon: Clock, label: 'Queued', color: 'text-foreground-muted' },
    Processing: { icon: Loader2, label: 'Processing…', color: 'text-accent' },
    Complete: { icon: CheckCircle2, label: 'Complete', color: 'text-success' },
    Failed: { icon: TriangleAlert, label: 'Failed', color: 'text-destructive' },
  } as const
  const entry = map[status]
  const Icon = entry.icon

  return (
    <div className={cn('flex items-center gap-1.5 text-xs font-medium', entry.color)}>
      <Icon className={cn('size-3.5', status === 'Processing' && 'animate-spin')} />
      {entry.label}
    </div>
  )
}
