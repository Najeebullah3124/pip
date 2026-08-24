import { ArrowRight, ArrowUp, ArrowDown, Pencil, Copy, Trash2, FlaskConical, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoutingRule } from '@/data/routing-data'

interface RuleCardProps {
  rule: RoutingRule
  isFirst: boolean
  isLast: boolean
  onToggleEnabled: (id: string, enabled: boolean) => void
  onMove: (id: string, direction: 'up' | 'down') => void
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onTest: (id: string) => void
}

function Chip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className={cn(
        'rounded-lg border px-2.5 py-1.5 text-xs font-medium',
        accent ? 'border-accent-200 bg-accent-soft text-accent-700' : 'border-border bg-surface-2 text-foreground'
      )}
    >
      {label}
    </span>
  )
}

export function RuleCard({ rule, isFirst, isLast, onToggleEnabled, onMove, onEdit, onDuplicate, onDelete, onTest }: RuleCardProps) {
  return (
    <Card className={cn('flex flex-col gap-4 p-5 transition-opacity', !rule.enabled && 'opacity-60')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <button
              onClick={() => onMove(rule.id, 'up')}
              disabled={isFirst}
              className="flex size-5 cursor-pointer items-center justify-center rounded text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              aria-label="Move up"
            >
              <ArrowUp className="size-3.5" />
            </button>
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground-muted">{rule.priority}</span>
            <button
              onClick={() => onMove(rule.id, 'down')}
              disabled={isLast}
              className="flex size-5 cursor-pointer items-center justify-center rounded text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              aria-label="Move down"
            >
              <ArrowDown className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{rule.name}</p>
            <p className="flex items-center gap-1 text-xs text-foreground-subtle">
              <Zap className="size-3" />
              {rule.matchCount.toLocaleString()} matches · updated {rule.lastModified}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={rule.enabled} onCheckedChange={(v) => onToggleEnabled(rule.id, v)} aria-label="Enable rule" />
          <Badge variant={rule.enabled ? 'success' : 'outline'}>{rule.enabled ? 'Active' : 'Disabled'}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(rule.id)}>
                <Pencil />
                Edit rule
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTest(rule.id)}>
                <FlaskConical />
                Test route
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(rule.id)}>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(rule.id)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border-strong bg-surface-2/60 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-foreground-subtle">If</span>
          <Chip label={rule.application} accent />
          <span className="text-xs font-medium text-foreground-subtle">+</span>
          <Chip label={rule.requestType} accent />
        </div>

        <div className="flex items-center gap-2 pl-1">
          <ArrowRight className="size-4 rotate-90 text-foreground-subtle" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-foreground-subtle">Then</span>
          <Chip label={rule.promptLibrary} />
          <ArrowRight className="size-3.5 text-foreground-subtle" />
          <Chip label={rule.workflow} />
          <ArrowRight className="size-3.5 text-foreground-subtle" />
          <Chip label={rule.promptBuilder} />
          <ArrowRight className="size-3.5 text-foreground-subtle" />
          <Chip label={rule.provider} />
          <ArrowRight className="size-3.5 text-foreground-subtle" />
          <Chip label={rule.model} accent />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => onTest(rule.id)}>
          <FlaskConical />
          Test route
        </Button>
      </div>
    </Card>
  )
}
