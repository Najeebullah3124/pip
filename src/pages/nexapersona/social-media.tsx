import * as React from 'react'
import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CharacterPicker } from '@/components/nexapersona/character-picker'
import { PlatformPreviewCard } from '@/components/nexapersona/platform-preview-card'
import {
  platforms,
  platformMeta,
  tones,
  generatePlatformContent,
  addSocialPost,
  socialPosts as seedPosts,
  type Platform,
  type PlatformContent,
  type SocialPost,
} from '@/data/social-content'
import { getCharacter } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const gradientPairs: [string, string][] = [
  ['#a78bfa', '#7c3aed'], ['#f0abfc', '#c026d3'], ['#93c5fd', '#2563eb'], ['#5eead4', '#0891b2'],
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'],
]

export default function SocialMediaPage() {
  const { toast } = useToast()
  const [posts, setPosts] = React.useState<SocialPost[]>(() => [...seedPosts])
  const [topic, setTopic] = React.useState('')
  const [tone, setTone] = React.useState(tones[0])
  const [cta, setCta] = React.useState('')
  const [characterId, setCharacterId] = React.useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<Platform[]>(['Instagram', 'TikTok', 'LinkedIn'])
  const [generating, setGenerating] = React.useState(false)
  const [current, setCurrent] = React.useState<SocialPost | null>(seedPosts[0] ?? null)
  const [activeTab, setActiveTab] = React.useState<Platform>(seedPosts[0]?.platforms[0] ?? 'Instagram')

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  function generate(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim() || selectedPlatforms.length === 0) return
    setGenerating(true)
    setTimeout(() => {
      const character = characterId ? getCharacter(characterId) : undefined
      const content: Partial<Record<Platform, PlatformContent>> = {}
      for (const p of selectedPlatforms) {
        content[p] = generatePlatformContent(topic.trim(), tone, character?.name, p, cta)
      }
      const [gradientFrom, gradientTo] = gradientPairs[Math.floor(Math.random() * gradientPairs.length)]
      const post: SocialPost = {
        id: `social_new_${Date.now()}`,
        topic: topic.trim(),
        tone,
        characterId,
        platforms: selectedPlatforms,
        content,
        gradientFrom,
        gradientTo,
        createdAt: 'Just now',
      }
      addSocialPost(post)
      setPosts((prev) => [post, ...prev])
      setCurrent(post)
      setActiveTab(selectedPlatforms[0])
      setGenerating(false)
      toast({ title: 'Content generated', description: `${selectedPlatforms.length} platform variation${selectedPlatforms.length > 1 ? 's' : ''} ready to preview.`, variant: 'success' })
    }, 1400)
  }

  const currentCharacter = current?.characterId ? getCharacter(current.characterId) : undefined
  const handle = currentCharacter ? currentCharacter.name.toLowerCase().replace(/\s+/g, '') : 'yourbrand'

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-foreground-muted">Generate platform-ready copy and preview exactly how it will look before you publish.</p>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,380px)_1fr]">
        <Card className="flex flex-col gap-5 p-5 sm:p-6">
          <form onSubmit={generate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sm-topic">Topic</Label>
              <Input id="sm-topic" placeholder="e.g. Launch of our new spring collection" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Character voice (optional)</Label>
              <CharacterPicker value={characterId} onChange={setCharacterId} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sm-cta">Call to action</Label>
                <Input id="sm-cta" placeholder="e.g. Shop the collection" value={cta} onChange={(e) => setCta(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-2.5">
                {platforms.map((p) => {
                  const Icon = platformMeta[p].icon
                  const checked = selectedPlatforms.includes(p)
                  return (
                    <label
                      key={p}
                      className={cn(
                        'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors',
                        checked ? 'border-accent bg-accent-soft' : 'border-border hover:bg-muted'
                      )}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => togglePlatform(p)} />
                      <Icon className="size-4 shrink-0" style={{ color: platformMeta[p].color }} />
                      <span className="text-sm font-medium text-foreground">{p}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <Button type="submit" size="lg" loading={generating} disabled={generating || !topic.trim() || selectedPlatforms.length === 0}>
              <Sparkles />
              {generating ? 'Generating…' : 'Generate content'}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-4">
          {current ? (
            <Card className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{current.topic}</p>
                  <p className="text-xs text-foreground-subtle">{current.tone}</p>
                </div>
                <Badge variant="outline">{current.platforms.length} platform{current.platforms.length > 1 ? 's' : ''}</Badge>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Platform)}>
                <TabsList className="flex-wrap">
                  {current.platforms.map((p) => {
                    const Icon = platformMeta[p].icon
                    return (
                      <TabsTrigger key={p} value={p} className="gap-1.5">
                        <Icon className="size-3.5" />
                        {p}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                {current.platforms.map((p) => {
                  const content = current.content[p]
                  if (!content) return null
                  return (
                    <TabsContent key={p} value={p}>
                      <div className="mx-auto max-w-sm">
                        <PlatformPreviewCard
                          platform={p}
                          content={content}
                          gradientFrom={current.gradientFrom}
                          gradientTo={current.gradientTo}
                          characterName={currentCharacter?.name}
                          handle={handle}
                        />
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </Card>
          ) : (
            <Card className="flex min-h-[340px] flex-col items-center justify-center gap-3 p-6 text-center">
              <Sparkles className="size-6 text-foreground-subtle" />
              <p className="text-sm font-semibold text-foreground">Ready when you are</p>
              <p className="max-w-xs text-xs text-foreground-subtle">Describe your topic and pick platforms to generate a preview.</p>
            </Card>
          )}
        </div>
      </div>

      {posts.length > 0 && (
        <div>
          <h3 className="mb-3 text-[15px] font-semibold text-foreground">Recent posts</h3>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 9).map((post) => (
              <Card
                key={post.id}
                className={cn(
                  'group flex cursor-pointer flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevation-2',
                  current?.id === post.id && 'ring-2 ring-accent'
                )}
                onClick={() => {
                  setCurrent(post)
                  setActiveTab(post.platforms[0])
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-semibold text-foreground">{post.topic}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {post.platforms.map((p) => {
                    const Icon = platformMeta[p].icon
                    return (
                      <span key={p} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground-muted">
                        <Icon className="size-2.5" />
                        {p}
                      </span>
                    )
                  })}
                </div>
                <div className="mt-auto flex items-center justify-between text-[11px] text-foreground-subtle">
                  <span>{post.tone}</span>
                  <span>{post.createdAt}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
