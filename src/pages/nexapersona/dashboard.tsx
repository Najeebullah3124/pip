import { Link } from 'react-router-dom'
import { UsersRound, Sparkles, Layers, TrendingUp, ArrowUpRight, Package, Share2 } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MediaCard } from '@/components/nexapersona/media-card'
import { mediaItems, loraModels, generationTypeMeta, type GenerationType } from '@/data/nexapersona-data'
import { characters } from '@/data/character-data'

const studioTools: { key: string; label: string; href: string; type: GenerationType; icon?: typeof Package }[] = [
  { key: 'image', label: 'Image', href: '/nexapersona/studio?type=Image', type: 'Image' },
  { key: 'video', label: 'Video', href: '/nexapersona/studio?type=Video', type: 'Video' },
  { key: 'talking-head', label: 'Talking Head', href: '/nexapersona/studio?type=Talking Head', type: 'Talking Head' },
  { key: 'voice', label: 'Voice', href: '/nexapersona/studio?type=Voice', type: 'Voice' },
  { key: 'lip-sync', label: 'Lip Sync', href: '/nexapersona/studio?type=Lip Sync', type: 'Lip Sync' },
  { key: 'product-placement', label: 'Product Placement', href: '/nexapersona/product-placement', type: 'Product Placement', icon: Package },
  { key: 'social-media', label: 'Social Media', href: '/nexapersona/social-media', type: 'Social Media', icon: Share2 },
]

export default function NexaDashboardPage() {
  const completedThisWeek = mediaItems.filter((m) => m.status === 'Complete').length
  const trainedLora = loraModels.filter((m) => m.status === 'Trained').length
  const recent = mediaItems.slice(0, 8)

  const topCharacters = characters
    .slice(0, 10)
    .map((c) => ({ character: c, count: mediaItems.filter((m) => m.characterId === c.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Characters in use" value={String(characters.length)} icon={<UsersRound />} />
        <StatCard label="Total generations" value={mediaItems.length.toLocaleString()} delta={{ value: `${completedThisWeek} complete`, direction: 'up' }} icon={<Sparkles />} />
        <StatCard label="Trained LoRA models" value={`${trainedLora}/${loraModels.length}`} icon={<Layers />} />
        <StatCard label="Generation success rate" value="94%" delta={{ value: '2.1%', direction: 'up' }} icon={<TrendingUp />} />
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-foreground">Creator tools</h2>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4">
          {studioTools.map((tool) => {
            const meta = generationTypeMeta[tool.type]
            const Icon = tool.icon ?? meta.icon
            return (
              <Link key={tool.key} to={tool.href}>
                <Card className="group flex h-full cursor-pointer flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl text-white shadow-elevation-1"
                      style={{ backgroundColor: meta?.color ?? 'var(--accent)' }}
                    >
                      <Icon className="size-[18px]" />
                    </div>
                    <ArrowUpRight className="size-3.5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">Recent generations</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/nexapersona/media-library">
                View all
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((item) => (
              <MediaCard key={item.id} item={item} />
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
