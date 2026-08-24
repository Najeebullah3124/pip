import { ChartCard } from './chart-card'
import { RankedBarList } from './ranked-bar-list'
import { applicationUsage } from '@/data/dashboard-data'

export function ApplicationUsageChart() {
  return (
    <ChartCard title="Application usage" description="Where activity is happening across the PIP platform">
      <RankedBarList items={applicationUsage} />
    </ChartCard>
  )
}
