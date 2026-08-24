import * as React from 'react'
import { Breadcrumbs, type Crumb } from '@/components/shared/breadcrumbs'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  actions?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, breadcrumbs, actions, icon, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          {icon && (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-700 text-white shadow-elevation-2 [&_svg]:size-5">
              {icon}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {description && <p className="text-sm text-foreground-muted">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  )
}
