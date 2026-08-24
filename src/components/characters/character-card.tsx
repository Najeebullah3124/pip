import { Link } from 'react-router-dom'
import { Zap, Clock, MoreHorizontal, Copy, Archive, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
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

interface CharacterCardProps {
  character: Character
  onArchive: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function CharacterCard({ character, onArchive, onDuplicate, onDelete }: CharacterCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
      <Link to={`/characters/${character.id}`} className="block">
        <div
          className="relative flex h-32 items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
        >
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
          {character.portraitImage ? (
            <img
              src={character.portraitImage}
              alt={character.name}
              className="relative size-16 rounded-2xl border-2 border-white/50 object-cover shadow-elevation-2"
            />
          ) : (
            <div className="relative flex size-16 items-center justify-center rounded-2xl border-2 border-white/50 text-xl font-bold text-white shadow-elevation-2">
              {character.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="absolute right-2.5 top-2.5">
            <CharacterStatusBadge status={character.status} className="border border-white/20 bg-black/25 text-white backdrop-blur-sm" />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to={`/characters/${character.id}`} className="block">
          <p className="text-[15px] font-semibold text-foreground">{character.name}</p>
          <p className="text-xs text-foreground-muted">{character.tagline}</p>
        </Link>

        <div className="flex flex-wrap gap-1.5">
          {character.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-[10px]">
              {t}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-subtle">
          <span className="flex items-center gap-1">
            <Zap className="size-3.5" />
            {character.generationCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {character.lastUsed}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.preventDefault()}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDuplicate(character.id)}>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(character.id)}>
                <Archive />
                {character.status === 'Archived' ? 'Restore' : 'Archive'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(character.id)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
