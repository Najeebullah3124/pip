import { Link } from 'react-router-dom'
import { Sparkles, Zap, Clock, Pencil, MoreHorizontal, Copy, Archive, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CharacterStatusBadge } from '@/components/characters/character-status-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Character } from '@/data/character-data'

interface IdentityHeaderProps {
  character: Character
  onOpenPreview?: () => void
  onArchive?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

export function IdentityHeader({ character, onOpenPreview, onArchive, onDelete, onDuplicate }: IdentityHeaderProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-1">
      <div
        className="relative h-28 w-full sm:h-32"
        style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          {character.portraitImage ? (
            <img
              src={character.portraitImage}
              alt={character.name}
              className="size-24 shrink-0 rounded-3xl border-4 border-card object-cover shadow-elevation-3"
            />
          ) : (
            <div
              className="flex size-24 shrink-0 items-center justify-center rounded-3xl border-4 border-card text-3xl font-bold text-white shadow-elevation-3"
              style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
            >
              {character.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="pb-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{character.name}</h1>
              <CharacterStatusBadge status={character.status} />
            </div>
            <p className="mt-0.5 text-sm text-foreground-muted">{character.tagline}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" onClick={onOpenPreview}>
            <Eye />
            Preview
          </Button>
          <Button asChild>
            <Link to={`/characters/${character.id}/edit`}>
              <Pencil />
              Edit character
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onArchive}>
                <Archive />
                {character.status === 'Archived' ? 'Restore' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 />
                Delete character
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4">
        <MetricCell icon={Sparkles} label="Applications" value={String(character.applications.length)} detail={character.applications.join(', ')} />
        <MetricCell icon={Zap} label="Generations" value={character.generationCount.toLocaleString()} />
        <MetricCell icon={Clock} label="Last used" value={character.lastUsed} />
        <MetricCell
          icon={Copy}
          label="Tags"
          value={String(character.tags.length)}
          detail={<div className="mt-1 flex flex-wrap gap-1">{character.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>}
        />
      </div>
    </div>
  )
}

function MetricCell({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType
  label: string
  value: string
  detail?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4">
      <p className="flex items-center gap-1.5 text-xs text-foreground-subtle">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
      {typeof detail === 'string' ? <p className="truncate text-xs text-foreground-subtle">{detail}</p> : detail}
    </div>
  )
}
