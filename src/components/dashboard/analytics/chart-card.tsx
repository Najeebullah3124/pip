import * as React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, description, actions, children, className }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col gap-5 p-5 sm:p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  )
}
