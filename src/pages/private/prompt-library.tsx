import * as React from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Zap, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrivateBadge } from '@/components/private/private-badge'
import { privatePromptTemplates, promptCategories, type PrivateStatus } from '@/data/private-data'

const statusVariant: Record<PrivateStatus, 'outline' | 'accent' | 'success' | 'destructive'> = {
  Draft: 'outline',
  Active: 'success',
  Testing: 'accent',
  Archived: 'destructive',
}

export default function PrivatePromptLibraryPage() {
  const [category, setCategory] = React.useState('all')
  const filtered = category === 'all' ? privatePromptTemplates : privatePromptTemplates.filter((p) => p.category === category)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground-muted">Private prompt templates that power NexaPersona and Animovia generations behind the scenes.</p>
          <PrivateBadge />
        </div>
        <div className="flex items-center gap-2.5">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {promptCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild className="bg-amber-500 text-ink-950 hover:bg-amber-400">
            <Link to="/private-platform/prompt-builder">
              <Plus />
              New template
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <Link key={t.id} to={`/private-platform/prompt-builder?template=${t.id}`}>
            <Card className="group flex h-full cursor-pointer flex-col gap-3 border-amber-400/15 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-elevation-2">
              <div className="flex items-start justify-between gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <FileText className="size-4" />
                </span>
                <Badge variant={statusVariant[t.status]} className="text-[10px]">
                  {t.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <Badge variant="outline" className="mt-1.5 text-[10px]">
                  {t.category}
                </Badge>
              </div>
              <p className="line-clamp-2 font-mono text-[11px] leading-relaxed text-foreground-subtle">{t.systemPrompt}</p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[11px] text-foreground-subtle">
                <span className="font-medium tabular-nums text-foreground-muted">{t.version}</span>
                <span className="flex items-center gap-1">
                  <Zap className="size-3" />
                  {t.usageCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {t.updatedAt}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
