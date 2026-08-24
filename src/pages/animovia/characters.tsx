import { Link } from 'react-router-dom'
import { Plus, BookOpen, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CharacterStatusBadge } from '@/components/characters/character-status-badge'
import { characters } from '@/data/character-data'
import { animoviaAssets, stories } from '@/data/animovia-data'

export default function AnimoviaCharactersPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">
          Characters are managed centrally in PIP's <Link to="/characters" className="font-medium text-accent hover:underline">Character DNA</Link> module — every storybook here draws on that same identity.
        </p>
        <Button asChild>
          <Link to="/characters/new">
            <Plus />
            Create character
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {characters.map((c) => {
          const assetCount = animoviaAssets.filter((a) => a.characterId === c.id).length
          const storyCount = stories.filter((s) => s.characterIds.includes(c.id)).length
          return (
            <Link key={c.id} to={`/characters/${c.id}`}>
              <Card className="group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
                <div
                  className="relative flex h-24 items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}
                >
                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
                  <div className="relative flex size-14 items-center justify-center rounded-2xl border-2 border-white/50 text-lg font-bold text-white shadow-elevation-2">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute right-2.5 top-2.5">
                    <CharacterStatusBadge status={c.status} className="border border-white/20 bg-black/25 text-white backdrop-blur-sm" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-foreground-subtle">{c.tagline}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-subtle">
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3.5" />
                      {assetCount} {assetCount === 1 ? 'asset' : 'assets'}
                    </span>
                    {storyCount > 0 ? (
                      <Badge variant="accent" className="text-[10px]">
                        <BookOpen className="size-2.5" />
                        {storyCount} {storyCount === 1 ? 'story' : 'stories'}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">No stories</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
