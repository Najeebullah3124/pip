import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { TemplateStatus } from '@/data/template-data'

const statusVariant: Record<TemplateStatus, BadgeProps['variant']> = {
  Published: 'success',
  Draft: 'accent',
  Testing: 'warning',
  Archived: 'outline',
}

export function TemplateStatusBadge({ status, className }: { status: TemplateStatus; className?: string }) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {status}
    </Badge>
  )
}
