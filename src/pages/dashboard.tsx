import { WelcomeHeader } from '@/components/dashboard/welcome-header'
import { StatOverview } from '@/components/dashboard/stat-overview'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentGenerationsCard } from '@/components/dashboard/recent-generations'
import { RecentPromptsCard } from '@/components/dashboard/recent-prompts'
import { ApiActivityCard } from '@/components/dashboard/api-activity'
import { PromptUsageChart } from '@/components/dashboard/analytics/prompt-usage-chart'
import { GenerationVolumeChart } from '@/components/dashboard/analytics/generation-volume-chart'
import { ProviderUsageChart } from '@/components/dashboard/analytics/provider-usage-chart'
import { ApplicationUsageChart } from '@/components/dashboard/analytics/application-usage-chart'
import { RecentActivityChart } from '@/components/dashboard/analytics/recent-activity-chart'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <WelcomeHeader />

      <StatOverview />

      <QuickActions />

      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-foreground">Analytics</h2>
            <p className="text-sm text-foreground-muted">Platform-wide usage, at a glance — last 30 days</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <PromptUsageChart />
            </div>
            <ProviderUsageChart />
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <GenerationVolumeChart />
            </div>
            <ApplicationUsageChart />
          </div>
          <RecentActivityChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <RecentGenerationsCard />
          <RecentPromptsCard />
        </div>
        <ApiActivityCard />
      </div>
    </div>
  )
}
