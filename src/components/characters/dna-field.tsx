import * as React from 'react'
import { Badge } from '@/components/ui/badge'

export function DnaField({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-foreground-subtle">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
      {hint && <p className="text-xs text-foreground-subtle">{hint}</p>}
    </div>
  )
}

export function DnaTagField({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-foreground-subtle">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <Badge key={v} variant="accent">
            {v}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export function DnaSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-foreground-muted">{description}</p>}
      </div>
      {children}
    </div>
  )
}
