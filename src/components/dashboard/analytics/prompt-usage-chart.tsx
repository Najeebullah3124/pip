import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from './chart-card'
import { ChartTooltip } from './chart-tooltip'
import { promptUsageSeries } from '@/data/dashboard-data'
import { Badge } from '@/components/ui/badge'

export function PromptUsageChart() {
  const latest = promptUsageSeries[promptUsageSeries.length - 1].prompts
  const first = promptUsageSeries[0].prompts
  const change = Math.round(((latest - first) / first) * 100)

  return (
    <ChartCard
      title="Prompt usage"
      description="Prompt runs across every connected application"
      actions={
        <Badge variant="success" className="shrink-0">
          ↑ {change}% this month
        </Badge>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={promptUsageSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="promptUsageFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-trend-accent)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--chart-trend-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              interval={Math.ceil(promptUsageSeries.length / 6) - 1}
              tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={36}
              tick={{ fill: 'var(--chart-tick)', fontSize: 11 }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              cursor={{ stroke: 'var(--chart-axis)', strokeWidth: 1 }}
              content={<ChartTooltip valueLabel="Prompt runs" />}
            />
            <Area
              type="monotone"
              dataKey="prompts"
              stroke="var(--chart-trend-accent)"
              strokeWidth={2}
              fill="url(#promptUsageFill)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
