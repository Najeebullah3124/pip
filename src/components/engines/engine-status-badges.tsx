import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { ConnectionStatus, ApiStatus } from '@/data/engine-data'

const connectionVariant: Record<ConnectionStatus, BadgeProps['variant']> = {
  Connected: 'success',
  'Attention needed': 'warning',
  Disconnected: 'destructive',
}

const apiVariant: Record<ApiStatus, BadgeProps['variant']> = {
  Operational: 'success',
  Degraded: 'warning',
  Down: 'destructive',
}

export function ConnectionStatusBadge({ status, className }: { status: ConnectionStatus; className?: string }) {
  return (
    <Badge variant={connectionVariant[status]} className={className}>
      {status}
    </Badge>
  )
}

export function ApiStatusBadge({ status, className }: { status: ApiStatus; className?: string }) {
  return (
    <Badge variant={apiVariant[status]} className={className}>
      {status}
    </Badge>
  )
}
