import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { GenerationStatus } from '@/data/nexapersona-data'

const variant: Record<GenerationStatus, BadgeProps['variant']> = {
  Complete: 'success',
  Processing: 'accent',
  Failed: 'destructive',
}

export function GenerationStatusBadge({ status, className }: { status: GenerationStatus; className?: string }) {
  return (
    <Badge variant={variant[status]} className={className}>
      {status}
    </Badge>
  )
}
