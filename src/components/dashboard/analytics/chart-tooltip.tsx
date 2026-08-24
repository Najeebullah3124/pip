import type { TooltipContentProps } from 'recharts'

type ChartTooltipProps = Partial<TooltipContentProps<number, string>> & {
  valueLabel?: string
  valueFormatter?: (value: number) => string
}

export function ChartTooltip({ active, payload, label, valueLabel, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const value = payload[0].value as number

  return (
    <div className="rounded-xl border border-border bg-popover px-3.5 py-2.5 text-xs shadow-elevation-3">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-foreground-muted">
        {valueLabel ?? payload[0].name}:{' '}
        <span className="font-semibold tabular-nums text-foreground">
          {valueFormatter ? valueFormatter(value) : value.toLocaleString()}
        </span>
      </p>
    </div>
  )
}
