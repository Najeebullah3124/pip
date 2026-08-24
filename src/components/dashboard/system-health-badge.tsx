import * as React from 'react'
import { CheckCircle2, TriangleAlert, XCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type HealthLevel = 'operational' | 'degraded' | 'down'

interface SystemComponent {
  name: string
  status: HealthLevel
  detail: string
}

const components: SystemComponent[] = [
  { name: 'Prompt Studio', status: 'operational', detail: 'All evaluations running normally' },
  { name: 'AI Engines', status: 'operational', detail: '5 of 5 providers reachable' },
  { name: 'NexaPersona', status: 'operational', detail: 'Identity sync up to date' },
  { name: 'Animovia render queue', status: 'degraded', detail: 'Elevated render latency (~+18s)' },
  { name: 'API gateway', status: 'operational', detail: '99.98% uptime, 30 days' },
]

const levelMeta: Record<HealthLevel, { label: string; icon: React.ElementType; dot: string; text: string }> = {
  operational: { label: 'All systems operational', icon: CheckCircle2, dot: 'bg-success', text: 'text-success' },
  degraded: { label: 'Minor degradation', icon: TriangleAlert, dot: 'bg-warning', text: 'text-warning' },
  down: { label: 'Service disruption', icon: XCircle, dot: 'bg-destructive', text: 'text-destructive' },
}

export function SystemHealthBadge() {
  const overall: HealthLevel = components.some((c) => c.status === 'down')
    ? 'down'
    : components.some((c) => c.status === 'degraded')
      ? 'degraded'
      : 'operational'
  const meta = levelMeta[overall]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-surface-2 py-1.5 pl-2.5 pr-3.5 text-xs font-medium text-foreground-muted transition-colors hover:border-border-strong hover:bg-muted">
          <span className="relative flex size-2">
            <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', meta.dot)} />
            <span className={cn('relative inline-flex size-2 rounded-full', meta.dot)} />
          </span>
          {meta.label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <meta.icon className={cn('size-4', meta.text)} />
            {meta.label}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 p-2">
          {components.map((c) => {
            const cMeta = levelMeta[c.status]
            return (
              <div key={c.name} className="flex items-start justify-between gap-3 rounded-xl px-2.5 py-2.5">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-foreground-subtle">{c.detail}</p>
                </div>
                <span className={cn('mt-0.5 flex shrink-0 items-center gap-1.5 text-xs font-medium', cMeta.text)}>
                  <span className={cn('size-1.5 rounded-full', cMeta.dot)} />
                  {c.status === 'operational' ? 'Up' : c.status === 'degraded' ? 'Degraded' : 'Down'}
                </span>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
