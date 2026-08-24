import { Link } from 'react-router-dom'
import { ArrowUpRight, FileText, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const recentPrompts = [
  { name: 'Support Triage v3', engine: 'Claude Opus 5', status: 'Live', score: '94%' },
  { name: 'Onboarding Email Draft', engine: 'Claude Sonnet 5', status: 'Draft', score: '—' },
  { name: 'Product Copy Rewriter', engine: 'Claude Haiku 4.5', status: 'Live', score: '88%' },
  { name: 'Contract Summarizer', engine: 'Claude Opus 5', status: 'Review', score: '91%' },
]

const statusVariant: Record<string, 'success' | 'accent' | 'warning'> = {
  Live: 'success',
  Draft: 'accent',
  Review: 'warning',
}

export function RecentPromptsCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent prompts</CardTitle>
          <CardDescription>Your latest edited prompt workflows</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/prompt-library">
            View all
            <ArrowUpRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {recentPrompts.map((p) => (
          <div key={p.name} className="flex items-center gap-4 rounded-xl px-2.5 py-3 transition-colors hover:bg-muted">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
              <p className="truncate text-xs text-foreground-subtle">{p.engine}</p>
            </div>
            <p className="hidden text-sm font-medium tabular-nums text-foreground-muted sm:block">{p.score}</p>
            <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-surface hover:text-foreground">
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
