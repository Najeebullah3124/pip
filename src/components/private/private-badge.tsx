import { LockKeyhole } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PrivateBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-400',
        className
      )}
    >
      <LockKeyhole className="size-3" />
      Private
    </span>
  )
}
