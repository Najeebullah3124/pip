import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChartCard } from './chart-card'
import { activityFeed } from '@/data/dashboard-data'

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function RecentActivityChart() {
  return (
    <ChartCard title="Recent activity" description="What's happening across the workspace right now">
      <div className="flex flex-col gap-4">
        {activityFeed.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            <Avatar className="mt-0.5 size-8">
              <AvatarFallback className="text-[11px]">{initialsOf(a.user)}</AvatarFallback>
            </Avatar>
            <p className="text-sm leading-snug text-foreground-muted">
              <span className="font-semibold text-foreground">{a.user}</span> {a.action}{' '}
              <span className="font-medium text-foreground">{a.target}</span>
              <span className="block text-xs text-foreground-subtle">{a.time}</span>
            </p>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
