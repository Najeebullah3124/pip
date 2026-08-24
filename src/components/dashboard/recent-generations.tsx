import { Link } from 'react-router-dom'
import { ArrowUpRight, Image, Video, FileText, AudioLines } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { recentGenerations, type RecentGeneration } from '@/data/dashboard-data'

const typeIcon: Record<RecentGeneration['type'], typeof Image> = {
  Image: Image,
  Video: Video,
  Text: FileText,
  Audio: AudioLines,
}

export function RecentGenerationsCard() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent generations</CardTitle>
          <CardDescription>Latest assets produced across PIP</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/media-library">
            View all
            <ArrowUpRight />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {recentGenerations.map((gen) => {
          const Icon = typeIcon[gen.type]
          return (
            <button
              key={gen.id}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border text-left transition-all hover:-translate-y-0.5 hover:shadow-elevation-2"
            >
              <div
                className="relative flex h-20 items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${gen.thumbnailFrom}, ${gen.thumbnailTo})`,
                }}
              >
                <Icon className="size-6 text-white/90" />
                <Badge variant="outline" className="absolute left-1.5 top-1.5 border-white/30 bg-black/20 text-[10px] text-white backdrop-blur-sm">
                  {gen.type}
                </Badge>
              </div>
              <div className="flex flex-col gap-0.5 p-2.5">
                <p className="truncate text-xs font-semibold text-foreground">{gen.title}</p>
                <p className="truncate text-[11px] text-foreground-subtle">
                  {gen.source} · {gen.time}
                </p>
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
