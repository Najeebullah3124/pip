import { Clock, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MediaThumbnail } from '@/components/nexapersona/media-thumbnail'
import { GenerationStatusBadge } from '@/components/nexapersona/generation-status-badge'
import { getCharacter } from '@/data/character-data'
import type { MediaItem } from '@/data/nexapersona-data'

export function MediaCard({ item }: { item: MediaItem }) {
  const character = item.characterId ? getCharacter(item.characterId) : undefined

  return (
    <Card className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
      <MediaThumbnail item={item} className="h-32 w-full" />
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-xs font-semibold text-foreground">{item.title}</p>
          <GenerationStatusBadge status={item.status} className="shrink-0 text-[9px]" />
        </div>
        {character && (
          <div className="flex items-center gap-1.5">
            <div
              className="flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
            >
              {character.name.slice(0, 1)}
            </div>
            <span className="truncate text-[11px] text-foreground-subtle">{character.name}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between text-[10px] text-foreground-subtle">
          <span className="flex items-center gap-1">
            <Cpu className="size-2.5" />
            {item.engine}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-2.5" />
            {item.createdAt}
          </span>
        </div>
      </div>
    </Card>
  )
}
