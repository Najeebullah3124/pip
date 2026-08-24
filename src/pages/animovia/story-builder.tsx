import * as React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Type, Compass, GraduationCap, UsersRound, ClipboardList, Heart, Sparkles,
  ArrowLeft, ArrowRight, Check, Plus, BookOpen, MapPin,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CharacterMultiPicker } from '@/components/animovia/character-multi-picker'
import { SceneCardEditor } from '@/components/animovia/scene-card-editor'
import {
  genres, targetAges, readingLevels, genreMeta, themePresets, educationalGoalPresets, moralLessonPresets, scenePresets,
  getStory, addStory, updateProject,
  type Genre, type TargetAge, type ReadingLevel, type Scene, type Story,
} from '@/data/animovia-data'
import { getCharacter } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface StoryDraft {
  title: string
  theme: string
  genre: Genre
  targetAge: TargetAge
  readingLevel: ReadingLevel
  educationalGoal: string
  characterIds: string[]
  scenes: Scene[]
  moralLesson: string
}

function makeScene(preset: { title: string; description: string; setting: string }): Scene {
  return { id: `scene_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, ...preset }
}

const emptyDraft: StoryDraft = {
  title: '',
  theme: themePresets[0],
  genre: 'Adventure',
  targetAge: '5-7',
  readingLevel: 'Early reader',
  educationalGoal: educationalGoalPresets[0],
  characterIds: [],
  scenes: scenePresets.slice(0, 3).map(makeScene),
  moralLesson: moralLessonPresets[0],
}

const gradientByGenre: Record<Genre, [string, string]> = {
  Adventure: ['#fda4af', '#e11d48'],
  Fantasy: ['#c4b5fd', '#6d28d9'],
  'Fairy Tale': ['#f0abfc', '#c026d3'],
  'Sci-Fi': ['#93c5fd', '#2563eb'],
  Mystery: ['#a78bfa', '#7c3aed'],
  Friendship: ['#fde68a', '#d97706'],
  Educational: ['#86efac', '#16a34a'],
}

const steps = [
  { key: 'title', label: 'Title & Theme', icon: Type },
  { key: 'format', label: 'Genre & Format', icon: Compass },
  { key: 'goal', label: 'Educational Goal', icon: GraduationCap },
  { key: 'characters', label: 'Characters', icon: UsersRound },
  { key: 'scenes', label: 'Scene Structure', icon: ClipboardList },
  { key: 'moral', label: 'Moral Lesson', icon: Heart },
  { key: 'review', label: 'Review & Save', icon: Sparkles },
]

function PillOption({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
        active ? 'border-accent bg-accent text-white shadow-elevation-1' : 'border-border bg-surface-2 text-foreground-muted hover:bg-muted'
      )}
    >
      {children}
    </button>
  )
}

function PresetCard({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-2 rounded-xl border-2 p-3.5 text-left text-sm transition-all',
        active ? 'border-accent bg-accent-soft text-accent-700' : 'border-border bg-surface-2 text-foreground-muted hover:bg-muted'
      )}
    >
      <span className={cn('mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border', active ? 'border-accent bg-accent text-white' : 'border-border')}>
        {active && <Check className="size-2.5" strokeWidth={3} />}
      </span>
      <span className="leading-snug">{children}</span>
    </button>
  )
}

export default function StoryBuilderPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const editingStoryId = searchParams.get('story')

  const [step, setStep] = React.useState(0)
  const [draft, setDraft] = React.useState<StoryDraft>(() => {
    const existing = editingStoryId ? getStory(editingStoryId) : undefined
    if (!existing) return emptyDraft
    const { id: _id, status: _status, gradientFrom: _gf, gradientTo: _gt, createdAt: _ca, ...rest } = existing
    return rest
  })

  function patch(p: Partial<StoryDraft>) {
    setDraft((d) => ({ ...d, ...p }))
  }
  function patchScene(index: number, p: Partial<Scene>) {
    setDraft((d) => ({ ...d, scenes: d.scenes.map((s, i) => (i === index ? { ...s, ...p } : s)) }))
  }
  function moveScene(index: number, dir: -1 | 1) {
    setDraft((d) => {
      const scenes = [...d.scenes]
      const target = index + dir
      if (target < 0 || target >= scenes.length) return d
      ;[scenes[index], scenes[target]] = [scenes[target], scenes[index]]
      return { ...d, scenes }
    })
  }
  function removeScene(index: number) {
    setDraft((d) => (d.scenes.length <= 1 ? d : { ...d, scenes: d.scenes.filter((_, i) => i !== index) }))
  }
  function addScene() {
    const unused = scenePresets.find((p) => !draft.scenes.some((s) => s.title === p.title)) ?? scenePresets[draft.scenes.length % scenePresets.length]
    setDraft((d) => ({ ...d, scenes: [...d.scenes, makeScene(unused)] }))
  }

  const canAdvance = step !== 0 || draft.title.trim().length > 0
  const gradient = gradientByGenre[draft.genre]
  const selectedCharacters = draft.characterIds.map((id) => getCharacter(id)).filter(Boolean)

  function saveStory() {
    const story: Story = {
      id: editingStoryId ?? `story_new_${Date.now()}`,
      ...draft,
      title: draft.title.trim() || 'Untitled story',
      status: 'Ready',
      gradientFrom: gradient[0],
      gradientTo: gradient[1],
      createdAt: 'Just now',
    }
    addStory(story)
    if (projectId) {
      updateProject(projectId, { storyId: story.id, status: 'Story', updatedAt: 'Just now' })
    }
    toast({ title: 'Story saved', description: `${story.title} is ready for illustration.`, variant: 'success' })
    navigate('/animovia/projects')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Story Builder</h2>
          <p className="text-sm text-foreground-muted">A guided, visual way to shape a new storybook — from theme to scene structure.</p>
        </div>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all',
                  i === step ? 'bg-accent text-white shadow-elevation-1' : i < step ? 'text-accent hover:bg-accent-soft' : 'text-foreground-subtle hover:bg-muted'
                )}
              >
                <span className={cn('flex size-5 items-center justify-center rounded-full', i === step ? 'bg-white/25' : i < step ? 'bg-accent-soft' : 'bg-muted')}>
                  {i < step ? <Check className="size-3" strokeWidth={3} /> : <s.icon className="size-3" />}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && <div className={cn('h-px w-4 shrink-0 sm:w-6', i < step ? 'bg-accent' : 'bg-border')} />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-6 p-5 sm:p-8">
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <div
              className="relative flex min-h-40 flex-col justify-end overflow-hidden rounded-2xl p-6"
              style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
            >
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:16px_16px]" />
              <BookOpen className="absolute right-5 top-5 size-8 text-white/30" />
              <p className="relative text-2xl font-bold leading-tight text-white">{draft.title || 'Your story title'}</p>
              <p className="relative mt-1 max-w-md text-sm text-white/80">{draft.theme}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-title">Title</Label>
              <Input id="story-title" placeholder="e.g. Luma and the Lantern Grove" value={draft.title} onChange={(e) => patch({ title: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label>Theme</Label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {themePresets.map((t) => (
                  <PresetCard key={t} active={draft.theme === t} onClick={() => patch({ theme: t })}>
                    {t}
                  </PresetCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2.5">
              <Label>Genre</Label>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {genres.map((g) => {
                  const gm = genreMeta[g]
                  const active = draft.genre === g
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => patch({ genre: g })}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all',
                        active ? 'border-accent bg-accent-soft' : 'border-border bg-surface-2 hover:bg-muted'
                      )}
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl text-white shadow-elevation-1" style={{ backgroundColor: gm.color }}>
                        <gm.icon className="size-5" />
                      </span>
                      <span className={cn('text-sm font-medium', active ? 'text-accent-700' : 'text-foreground-muted')}>{g}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label>Target age</Label>
              <div className="flex flex-wrap gap-2">
                {targetAges.map((a) => (
                  <PillOption key={a} active={draft.targetAge === a} onClick={() => patch({ targetAge: a })}>
                    Ages {a}
                  </PillOption>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label>Reading level</Label>
              <div className="flex flex-wrap gap-2">
                {readingLevels.map((r) => (
                  <PillOption key={r} active={draft.readingLevel === r} onClick={() => patch({ readingLevel: r })}>
                    {r}
                  </PillOption>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <Label>Educational goal presets</Label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {educationalGoalPresets.map((goal) => (
                  <PresetCard key={goal} active={draft.educationalGoal === goal} onClick={() => patch({ educationalGoal: goal })}>
                    {goal}
                  </PresetCard>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-goal">Educational goal</Label>
              <Textarea id="story-goal" value={draft.educationalGoal} onChange={(e) => patch({ educationalGoal: e.target.value })} className="min-h-20" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <Label>Characters in this story</Label>
              <p className="mt-1 text-xs text-foreground-subtle">Choose one or more characters from your Character DNA roster to bring this story to life.</p>
            </div>
            <CharacterMultiPicker value={draft.characterIds} onChange={(ids) => patch({ characterIds: ids })} />
            {selectedCharacters.length === 0 && (
              <p className="text-xs text-foreground-subtle">No characters selected yet — you can still continue and add them later.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Scene structure</Label>
                <p className="mt-1 text-xs text-foreground-subtle">Shape the story arc scene by scene — reorder, edit, or add new beats.</p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={addScene}>
                <Plus />
                Add scene
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {draft.scenes.map((scene, i) => (
                <SceneCardEditor
                  key={scene.id}
                  scene={scene}
                  index={i}
                  total={draft.scenes.length}
                  gradient={gradient}
                  onChange={(p) => patchScene(i, p)}
                  onMove={(dir) => moveScene(i, dir)}
                  onRemove={() => removeScene(i)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <Label>Moral lesson presets</Label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {moralLessonPresets.map((lesson) => (
                  <PresetCard key={lesson} active={draft.moralLesson === lesson} onClick={() => patch({ moralLesson: lesson })}>
                    {lesson}
                  </PresetCard>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-moral">Moral lesson</Label>
              <Textarea id="story-moral" value={draft.moralLesson} onChange={(e) => patch({ moralLesson: e.target.value })} className="min-h-20" />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-6">
            <div
              className="relative flex min-h-48 flex-col justify-end overflow-hidden rounded-2xl p-6"
              style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
            >
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative flex flex-wrap items-center gap-1.5">
                <Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">{draft.genre}</Badge>
                <Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">Ages {draft.targetAge}</Badge>
                <Badge className="border-white/30 bg-white/20 text-white backdrop-blur-sm">{draft.readingLevel}</Badge>
              </div>
              <p className="relative mt-3 text-3xl font-bold leading-tight text-white">{draft.title || 'Untitled story'}</p>
              <p className="relative mt-1 max-w-md text-sm text-white/80">{draft.theme}</p>
              {selectedCharacters.length > 0 && (
                <div className="relative mt-4 flex -space-x-2">
                  {selectedCharacters.map((c) => (
                    <div
                      key={c!.id}
                      className="flex size-8 items-center justify-center rounded-full border-2 border-white/60 text-[10px] font-bold text-white shadow-elevation-1"
                      style={{ background: `linear-gradient(135deg, ${c!.gradientFrom}, ${c!.gradientTo})` }}
                    >
                      {c!.name.slice(0, 1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <Label>Scene preview</Label>
              <div className="-mx-1 flex gap-3.5 overflow-x-auto px-1 pb-2">
                {draft.scenes.map((scene, i) => (
                  <div key={scene.id} className="flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-border">
                    <div className="relative flex h-16 items-center gap-2 px-3" style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
                      <span className="flex size-6 items-center justify-center rounded-full bg-white/25 text-[11px] font-bold text-white">{i + 1}</span>
                      <p className="truncate text-xs font-semibold text-white">{scene.title}</p>
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <p className="flex items-center gap-1 text-[10px] text-foreground-subtle">
                        <MapPin className="size-2.5" />
                        {scene.setting}
                      </p>
                      <p className="line-clamp-3 text-[11px] leading-snug text-foreground-muted">{scene.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  <GraduationCap className="size-3.5" />
                  Educational goal
                </p>
                <p className="text-sm text-foreground">{draft.educationalGoal}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  <Heart className="size-3.5" />
                  Moral lesson
                </p>
                <p className="text-sm text-foreground">{draft.moralLesson}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-5">
          <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={!canAdvance}>
              Next
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={saveStory}>
              <Sparkles />
              Save story
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
