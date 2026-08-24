import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { ComponentStatus } from '@/data/component-data'

const statusVariant: Record<ComponentStatus, BadgeProps['variant']> = {
  Published: 'success',
  Draft: 'accent',
  Deprecated: 'outline',
}

export function ComponentStatusBadge({ status, className }: { status: ComponentStatus; className?: string }) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {status}
    </Badge>
  )
}
