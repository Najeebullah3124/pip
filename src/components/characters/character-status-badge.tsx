import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { CharacterStatus } from '@/data/character-data'

const statusVariant: Record<CharacterStatus, BadgeProps['variant']> = {
  Live: 'success',
  Draft: 'accent',
  Training: 'warning',
  Archived: 'outline',
}

export function CharacterStatusBadge({ status, className }: { status: CharacterStatus; className?: string }) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {status}
    </Badge>
  )
}
