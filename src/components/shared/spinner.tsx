import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return <Loader2 className={cn('animate-spin text-accent', className)} style={{ width: size, height: size }} />
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24">
      <Spinner size={28} />
      <p className="text-sm text-foreground-muted">{label}</p>
    </div>
  )
}
