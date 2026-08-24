import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { ChartTooltip } from '@/components/dashboard/analytics/chart-tooltip'
import type { UsagePoint } from '@/data/component-data'

export function UsageChart({ data }: { data: UsagePoint[] }) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }} barCategoryGap="30%">
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
          <Tooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltip valueLabel="Uses" />} />
          <Bar dataKey="count" fill="var(--chart-trend-accent)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
