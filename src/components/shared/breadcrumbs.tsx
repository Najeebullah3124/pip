import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      <Link
        to="/"
        className="flex items-center text-foreground-subtle transition-colors hover:text-foreground"
        aria-label="Home"
      >
        <Home className="size-3.5" />
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <React.Fragment key={item.label}>
            <ChevronRight className="size-3.5 text-foreground-subtle/60" />
            {item.href && !isLast ? (
              <Link to={item.href} className="text-foreground-subtle transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? 'font-medium text-foreground' : 'text-foreground-subtle')}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
