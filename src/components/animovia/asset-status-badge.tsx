import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { AnimoviaAssetStatus } from '@/data/animovia-data'

const variant: Record<AnimoviaAssetStatus, BadgeProps['variant']> = {
  Complete: 'success',
  Processing: 'accent',
  Failed: 'destructive',
  Draft: 'outline',
}

export function AssetStatusBadge({ status, className }: { status: AnimoviaAssetStatus; className?: string }) {
  return (
    <Badge variant={variant[status]} className={className}>
      {status}
    </Badge>
  )
}
