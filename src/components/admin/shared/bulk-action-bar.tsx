import * as React from 'react'
import { X } from 'lucide-react'

interface BulkActionBarProps {
  count: number
  onClear: () => void
  children: React.ReactNode
}

export function BulkActionBar({ count, onClear, children }: BulkActionBarProps) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-soft px-4 py-2.5 animate-fade-in-up">
      <button
        onClick={onClear}
        className="flex cursor-pointer items-center gap-1.5 rounded-lg text-xs font-semibold text-accent-700 hover:underline"
      >
        <X className="size-3.5" />
        {count} selected
      </button>
      <div className="h-4 w-px bg-accent-200" />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
