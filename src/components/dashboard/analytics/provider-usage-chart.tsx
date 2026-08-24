import { ChartCard } from './chart-card'
import { RankedBarList } from './ranked-bar-list'
import { providerUsage } from '@/data/dashboard-data'

export function ProviderUsageChart() {
  return (
    <ChartCard title="AI provider usage" description="Share of prompt runs by connected engine provider">
      <RankedBarList items={providerUsage} />
    </ChartCard>
  )
}
