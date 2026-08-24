import { Link } from 'react-router-dom'
import { Clock, Gauge, MoreHorizontal, FlaskConical, Power, Trash2, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConnectionStatusBadge, ApiStatusBadge } from '@/components/engines/engine-status-badges'
import type { AiEngine } from '@/data/engine-data'

interface EngineCardProps {
  engine: AiEngine
  testing?: boolean
  onToggleEnabled: (id: string, enabled: boolean) => void
  onTest: (id: string) => void
  onDelete: (id: string) => void
}

export function EngineCard({ engine, testing, onToggleEnabled, onTest, onDelete }: EngineCardProps) {
  const defaultModel = engine.models.find((m) => m.id === engine.defaultModelId)

  return (
    <Card className="relative flex flex-col gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
      <Link to={`/ai-engines/${engine.id}`} className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-elevation-1"
              style={{ backgroundColor: engine.color }}
            >
              {engine.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-foreground">{engine.name}</p>
              <p className="truncate text-xs text-foreground-subtle">{engine.vendor}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {testing ? (
            <Badge variant="accent" className="gap-1">
              <Loader2 className="size-3 animate-spin" />
              Testing…
            </Badge>
          ) : (
            <>
              <ConnectionStatusBadge status={engine.connectionStatus} />
              <ApiStatusBadge status={engine.apiStatus} />
            </>
          )}
        </div>

        <div className="rounded-xl bg-muted/60 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">Default model</p>
          <p className="truncate text-sm font-medium text-foreground">{defaultModel?.name ?? '—'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-foreground-subtle">
          <div className="flex items-center gap-1.5">
            <Gauge className="size-3.5" />
            <div>
              <p className="font-semibold tabular-nums text-foreground">{engine.usagePercent}%</p>
              <p>usage</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <div>
              <p className="font-semibold text-foreground">{engine.lastTested}</p>
              <p>last tested</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-border pt-3.5">
        <div className="flex items-center gap-2">
          <Switch
            checked={engine.enabled}
            onCheckedChange={(v) => onToggleEnabled(engine.id, v)}
            aria-label="Enable provider"
          />
          <Badge variant={engine.enabled ? 'success' : 'outline'} className="text-[10px]">
            {engine.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTest(engine.id)}>
                <FlaskConical />
                Test connection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleEnabled(engine.id, !engine.enabled)}>
                <Power />
                {engine.enabled ? 'Disable' : 'Enable'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(engine.id)}>
                <Trash2 />
                Remove provider
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
