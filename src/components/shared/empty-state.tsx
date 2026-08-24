import * as React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  size?: 'sm' | 'md'
}

export function EmptyState({ icon, title, description, action, size = 'md', className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-2/60 text-center',
        size === 'md' ? 'gap-4 px-6 py-16' : 'gap-3 px-4 py-10',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1 [&_svg]:size-6">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-semibold text-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
