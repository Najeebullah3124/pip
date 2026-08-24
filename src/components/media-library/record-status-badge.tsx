import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { LibraryStatus } from '@/data/media-library-data'

const variant: Record<LibraryStatus, BadgeProps['variant']> = {
  Complete: 'success',
  Processing: 'accent',
  Failed: 'destructive',
  Draft: 'outline',
}

export function RecordStatusBadge({ status, className }: { status: LibraryStatus; className?: string }) {
  return (
    <Badge variant={variant[status]} className={className}>
      {status}
    </Badge>
  )
}
