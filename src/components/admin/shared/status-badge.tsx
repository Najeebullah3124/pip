import { Badge, type BadgeProps } from '@/components/ui/badge'

const statusMap: Record<string, BadgeProps['variant']> = {
  Active: 'success',
  Connected: 'success',
  Complete: 'success',
  Success: 'success',
  Invited: 'accent',
  'In progress': 'accent',
  Suspended: 'warning',
  Warning: 'warning',
  'Attention needed': 'warning',
  Deactivated: 'destructive',
  Disconnected: 'destructive',
  Failed: 'destructive',
  Revoked: 'destructive',
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusMap[status] ?? 'default'}>{status}</Badge>
}
