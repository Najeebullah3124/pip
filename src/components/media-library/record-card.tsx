import { Star, Clock, Cpu } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RecordThumbnail } from '@/components/media-library/record-thumbnail'
import { RecordStatusBadge } from '@/components/media-library/record-status-badge'
import { getLibraryCharacter, type LibraryRecord } from '@/data/media-library-data'
import { cn } from '@/lib/utils'

interface RecordCardProps {
  record: LibraryRecord
  layout: 'grid' | 'list'
  onOpen: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function RecordCard({ record, layout, onOpen, onToggleFavorite }: RecordCardProps) {
  const character = getLibraryCharacter(record.characterId)

  const favoriteButton = (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onToggleFavorite(record.id)
      }}
      aria-label={record.favorite ? 'Remove from favorites' : 'Add to favorites'}
      className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-black/20"
    >
      <Star className={cn('size-4', record.favorite && 'fill-amber-400 text-amber-400')} />
    </button>
  )

  if (layout === 'list') {
    return (
      <Card
        onClick={() => onOpen(record.id)}
        className="flex cursor-pointer items-center gap-4 p-3.5 transition-all hover:border-accent-200 hover:shadow-elevation-1"
      >
        <RecordThumbnail record={record} className="size-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{record.title}</p>
            <RecordStatusBadge status={record.status} />
          </div>
          <p className="truncate text-xs text-foreground-subtle">
            {record.mediaType} · {record.sourceApp}
          </p>
        </div>
        {character && (
          <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <div
              className="flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
            >
              {character.name.slice(0, 1)}
            </div>
            <span className="text-xs text-foreground-muted">{character.name}</span>
          </div>
        )}
        <p className="hidden w-28 shrink-0 text-right text-xs text-foreground-muted md:block">{record.aiProvider}</p>
        <p className="hidden w-20 shrink-0 text-right text-xs tabular-nums text-foreground-subtle lg:block">{record.generationDate}</p>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(record.id)
          }}
          aria-label={record.favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted"
        >
          <Star className={cn('size-4', record.favorite && 'fill-amber-400 text-amber-400')} />
        </button>
      </Card>
    )
  }

  return (
    <Card
      onClick={() => onOpen(record.id)}
      className="group flex cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2"
    >
      <div className="relative">
        <RecordThumbnail record={record} className="h-32 w-full" />
        <div className="absolute right-1.5 top-1.5">{favoriteButton}</div>
        <Badge variant="outline" className="absolute left-1.5 top-1.5 border-white/30 bg-black/30 text-[9px] text-white backdrop-blur-sm">
          {record.sourceApp}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-xs font-semibold text-foreground">{record.title}</p>
          <RecordStatusBadge status={record.status} className="shrink-0 text-[9px]" />
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
          <span className="flex items-center gap-1 truncate">
            <Cpu className="size-2.5 shrink-0" />
            {record.aiProvider}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Clock className="size-2.5" />
            {record.generationDate}
          </span>
        </div>
      </div>
    </Card>
  )
}
