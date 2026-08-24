import { Link } from 'react-router-dom'
import { FolderKanban, BookOpen, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AssetCard } from '@/components/animovia/asset-card'
import { animoviaNavItems } from '@/components/animovia/animovia-nav-config'
import { projects, stories, animoviaAssets } from '@/data/animovia-data'
import { characters } from '@/data/character-data'

const toolKeys = ['illustrations', 'covers', 'books', 'narration', 'book-to-video', 'exports']
const tools = animoviaNavItems.filter((i) => toolKeys.includes(i.key))

const storyStatusVariant = { Draft: 'outline', Ready: 'accent', 'In Production': 'success' } as const

export default function AnimoviaDashboardPage() {
  const completeAssets = animoviaAssets.filter((a) => a.status === 'Complete').length
  const recent = animoviaAssets.slice(0, 8)
  const recentStories = stories.slice(0, 4)

  const topCharacters = characters
    .slice(0, 10)
    .map((c) => ({ character: c, count: animoviaAssets.filter((a) => a.characterId === c.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={String(projects.length)} icon={<FolderKanban />} />
        <StatCard label="Stories written" value={String(stories.length)} icon={<BookOpen />} />
        <StatCard label="Total assets" value={animoviaAssets.length.toLocaleString()} delta={{ value: `${completeAssets} complete`, direction: 'up' }} icon={<Sparkles />} />
        <StatCard label="Production success rate" value="96%" delta={{ value: '1.4%', direction: 'up' }} icon={<TrendingUp />} />
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-foreground">Production tools</h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
          {tools.map((tool) => (
            <Link key={tool.key} to={tool.href}>
              <Card className="group flex h-full cursor-pointer flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1">
                    <tool.icon className="size-[18px]" />
                  </div>
                  <ArrowUpRight className="size-3.5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-sm font-semibold text-foreground">{tool.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">Recent stories</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/animovia/story-builder">
                Story Builder
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {recentStories.map((story) => (
              <Link key={story.id} to={`/animovia/story-builder?story=${story.id}`}>
                <Card className="group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
                  <div className="relative h-20 w-full" style={{ background: `linear-gradient(135deg, ${story.gradientFrom}, ${story.gradientTo})` }}>
                    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{story.title}</p>
                      <Badge variant={storyStatusVariant[story.status]} className="shrink-0">
                        {story.status}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs text-foreground-subtle">{story.theme}</p>
                    <div className="mt-auto flex items-center gap-3 text-[11px] text-foreground-subtle">
                      <span>{story.genre}</span>
                      <span>·</span>
                      <span>Ages {story.targetAge}</span>
                      <span>·</span>
                      <span>{story.scenes.length} scenes</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mb-3 mt-6 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">Recent assets</h2>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {recent.map((item) => (
              <AssetCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-[15px] font-semibold text-foreground">Top characters</h2>
          <Card className="flex flex-col gap-1 p-2">
            {topCharacters.map(({ character, count }) => (
              <Link
                key={character.id}
                to={`/characters/${character.id}`}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-muted"
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-elevation-1"
                  style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
                >
                  {character.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{character.name}</p>
                  <p className="truncate text-xs text-foreground-subtle">{character.tagline}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground-muted">{count}</span>
              </Link>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
