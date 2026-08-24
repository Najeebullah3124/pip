import { Link } from 'react-router-dom'
import { ArrowUpRight, Terminal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { apiActivity } from '@/data/dashboard-data'

const methodColor: Record<string, string> = {
  GET: 'text-info bg-blue-50 dark:bg-blue-500/10',
  POST: 'text-success bg-emerald-50 dark:bg-emerald-500/10',
  PATCH: 'text-warning bg-amber-50 dark:bg-amber-500/10',
  DELETE: 'text-destructive bg-red-50 dark:bg-red-500/10',
}

function statusColor(status: number) {
  if (status >= 500) return 'text-destructive'
  if (status >= 400) return 'text-warning'
  return 'text-success'
}

export function ApiActivityCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>API activity</CardTitle>
          <CardDescription>Live requests across every connected app</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/administration">
            View logs
            <ArrowUpRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 font-mono">
        {apiActivity.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-xs transition-colors hover:bg-muted">
            <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold', methodColor[entry.method])}>
              {entry.method}
            </span>
            <span className="min-w-0 flex-1 truncate text-foreground">{entry.endpoint}</span>
            <span className={cn('shrink-0 font-semibold tabular-nums', statusColor(entry.status))}>{entry.status}</span>
            <span className="hidden shrink-0 tabular-nums text-foreground-subtle sm:block">{entry.latencyMs}ms</span>
            <span className="hidden shrink-0 text-foreground-subtle md:block">{entry.time}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2 rounded-xl bg-muted px-2.5 py-2 text-[11px] text-foreground-subtle">
          <Terminal className="size-3.5" />
          Prepared for Bearer token &amp; API key authenticated requests
        </div>
      </CardContent>
    </Card>
  )
}
