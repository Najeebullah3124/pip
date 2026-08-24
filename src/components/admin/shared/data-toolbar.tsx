import * as React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DataToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function DataToolbar({ searchValue, onSearchChange, searchPlaceholder, filters, actions, className }: DataToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder ?? 'Search…'}
            className="pl-9 pr-8"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center text-foreground-subtle hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        {filters}
      </div>
      {actions}
    </div>
  )
}
