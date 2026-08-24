import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from './chart-card'
import { ChartTooltip } from './chart-tooltip'
import { generationVolumeSeries } from '@/data/dashboard-data'

export function GenerationVolumeChart() {
  const total = generationVolumeSeries.reduce((sum, d) => sum + d.generations, 0)

  return (
    <ChartCard title="Generation volume" description={`${total.toLocaleString()} assets generated this week`}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={generationVolumeSeries} margin={{ top: 4, right: 8, left: -16, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} width={36} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
            <Tooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltip valueLabel="Generations" />} />
            <Bar dataKey="generations" fill="var(--chart-trend-blue)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
