import * as React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  delta?: { value: string; direction: 'up' | 'down' }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ label, value, delta, icon, className }: StatCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-foreground-muted">{label}</p>
        {icon && (
          <div className="flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent [&_svg]:size-4.5">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-[28px] font-bold leading-none tracking-tight tabular-nums text-foreground">{value}</p>
        {delta && (
          <span
            className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              delta.direction === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            )}
          >
            {delta.direction === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {delta.value}
          </span>
        )}
      </div>
    </Card>
  )
}
