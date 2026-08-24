import {
  Image, BookImage, BookOpen, Mic, Clapperboard, FileDown,
  Compass, Castle, Rocket, Search, Heart, GraduationCap, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { characters } from './character-data'

export type Genre = 'Adventure' | 'Fantasy' | 'Fairy Tale' | 'Sci-Fi' | 'Mystery' | 'Friendship' | 'Educational'
export type TargetAge = '2-4' | '5-7' | '8-10' | '11-13'
export type ReadingLevel = 'Pre-reader' | 'Early reader' | 'Independent reader' | 'Fluent reader'
export type StoryStatus = 'Draft' | 'Ready' | 'In Production'
export type ProjectStatus = 'Planning' | 'Story' | 'Illustration' | 'Layout' | 'Published'

export const genres: Genre[] = ['Adventure', 'Fantasy', 'Fairy Tale', 'Sci-Fi', 'Mystery', 'Friendship', 'Educational']
export const targetAges: TargetAge[] = ['2-4', '5-7', '8-10', '11-13']
export const readingLevels: ReadingLevel[] = ['Pre-reader', 'Early reader', 'Independent reader', 'Fluent reader']

export const genreMeta: Record<Genre, { icon: LucideIcon; color: string }> = {
  Adventure: { icon: Compass, color: 'var(--chart-cat-1)' },
  Fantasy: { icon: Sparkles, color: 'var(--chart-cat-2)' },
  'Fairy Tale': { icon: Castle, color: 'var(--chart-cat-3)' },
  'Sci-Fi': { icon: Rocket, color: 'var(--chart-cat-4)' },
  Mystery: { icon: Search, color: 'var(--chart-cat-5)' },
  Friendship: { icon: Heart, color: 'var(--chart-cat-1)' },
  Educational: { icon: GraduationCap, color: 'var(--chart-cat-2)' },
}

export const themePresets = [
  'Courage in the face of the unknown',
  'The value of true friendship',
  'Curiosity leads to discovery',
  'Kindness changes everything',
  'Believing in yourself',
  'Teamwork makes the impossible possible',
  'Every mistake is a lesson',
  'Home is wherever you belong',
]

export const educationalGoalPresets = [
  'Introduce basic counting and numbers',
  'Build vocabulary around emotions',
  'Teach the letters of the alphabet',
  'Encourage problem-solving skills',
  'Explain the water cycle',
  'Model conflict resolution between friends',
  'Introduce basic science concepts',
  'Build confidence trying new things',
]

export const moralLessonPresets = [
  'Being different is a strength, not a weakness.',
  'Asking for help is a sign of courage.',
  'Small acts of kindness make a big difference.',
  'Patience and persistence lead to success.',
  'It is okay to make mistakes and try again.',
  'True friends support each other no matter what.',
  'Sharing makes everything more fun.',
  'Every problem has a creative solution.',
]

export interface Scene {
  id: string
  title: string
  description: string
  setting: string
}

export const scenePresets: { title: string; description: string; setting: string }[] = [
  { title: 'The Ordinary Day', description: 'Our hero goes about a normal day, until something unexpected catches their eye.', setting: 'Cozy village home' },
  { title: 'The Call to Adventure', description: 'A mysterious clue or new friend invites the hero into the unknown.', setting: 'Edge of the forest' },
  { title: 'First Challenge', description: 'The hero faces their first obstacle and learns a new skill to overcome it.', setting: 'Winding mountain path' },
  { title: 'A New Friend', description: 'The hero meets an ally who will help them along the way.', setting: 'Sunlit meadow' },
  { title: 'The Dark Moment', description: 'Things look their worst — the hero must find inner strength to continue.', setting: 'Shadowy cave' },
  { title: 'The Big Idea', description: 'The hero discovers the clever solution hiding in plain sight.', setting: 'Starlit clearing' },
  { title: 'Facing It Together', description: 'With friends by their side, the hero faces the challenge head-on.', setting: 'Village square' },
  { title: 'Coming Home', description: 'The hero returns changed, ready to share what they have learned.', setting: 'Cozy village home, at dusk' },
]

export interface Story {
  id: string
  title: string
  theme: string
  genre: Genre
  targetAge: TargetAge
  readingLevel: ReadingLevel
  educationalGoal: string
  characterIds: string[]
  scenes: Scene[]
  moralLesson: string
  status: StoryStatus
  gradientFrom: string
  gradientTo: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  storyId: string | null
  characterIds: string[]
  gradientFrom: string
  gradientTo: string
  createdAt: string
  updatedAt: string
}

export type AnimoviaAssetKind = 'Illustration' | 'Cover' | 'Book' | 'Narration' | 'Book-to-Video' | 'Export'
export type AnimoviaAssetStatus = 'Complete' | 'Processing' | 'Failed' | 'Draft'

export interface AnimoviaAsset {
  id: string
  kind: AnimoviaAssetKind
  title: string
  characterId: string | null
  storyId: string | null
  status: AnimoviaAssetStatus
  engine: string
  createdAt: string
  gradientFrom: string
  gradientTo: string
  meta: string
}

export const assetKindMeta: Record<AnimoviaAssetKind, { icon: LucideIcon; color: string }> = {
  Illustration: { icon: Image, color: 'var(--chart-cat-1)' },
  Cover: { icon: BookImage, color: 'var(--chart-cat-2)' },
  Book: { icon: BookOpen, color: 'var(--chart-cat-3)' },
  Narration: { icon: Mic, color: 'var(--chart-cat-4)' },
  'Book-to-Video': { icon: Clapperboard, color: 'var(--chart-cat-5)' },
  Export: { icon: FileDown, color: 'var(--chart-cat-1)' },
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}
function pickN<T>(arr: readonly T[], n: number, rand: () => number): T[] {
  const copy = [...arr]
  const out: T[] = []
  while (out.length < n && copy.length > 0) {
    const idx = Math.floor(rand() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

const gradientPairs: [string, string][] = [
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'], ['#a78bfa', '#7c3aed'], ['#93c5fd', '#2563eb'],
  ['#86efac', '#16a34a'], ['#f0abfc', '#c026d3'], ['#5eead4', '#0891b2'], ['#c4b5fd', '#6d28d9'],
]

const storyTitles = [
  'Luma and the Lantern Grove',
  'The Whispering Compass',
  'Bramble’s Big Idea',
  'The Kite That Touched the Clouds',
  'Pip and the Puzzle Garden',
  'The Last Star of Autumn',
  'Willow and the River of Words',
  'The Tiny Robot Who Wanted Friends',
]

function formatRelative(daysAgo: number) {
  if (daysAgo === 0) return 'Just now'
  if (daysAgo === 1) return 'Yesterday'
  return `${daysAgo}d ago`
}

export const stories: Story[] = storyTitles.map((title, i) => {
  const rand = seededRandom(i * 13 + 3)
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)
  const chars = pickN(characters.slice(0, 12), Math.floor(rand() * 2) + 1, rand)
  const scenes: Scene[] = scenePresets.slice(0, Math.floor(rand() * 3) + 5).map((s, si) => ({
    id: `scene_${i}_${si}`,
    ...s,
  }))
  return {
    id: `story_${(i + 1).toString().padStart(3, '0')}`,
    title,
    theme: pick(themePresets, rand),
    genre: pick(genres, rand),
    targetAge: pick(targetAges, rand),
    readingLevel: pick(readingLevels, rand),
    educationalGoal: pick(educationalGoalPresets, rand),
    characterIds: chars.map((c) => c.id),
    scenes,
    moralLesson: pick(moralLessonPresets, rand),
    status: pick<StoryStatus>(['Draft', 'Ready', 'In Production'], rand),
    gradientFrom,
    gradientTo,
    createdAt: formatRelative(Math.floor(rand() * 20)),
  }
})

const projectTitles = [
  { title: 'Luma’s Forest Friends', description: 'A gentle bedtime series about courage and curiosity in the Lantern Grove.' },
  { title: 'Compass Kids Collection', description: 'An adventure trilogy teaching problem-solving through exploration.' },
  { title: 'Bramble the Inventor', description: 'STEM-flavored picture books about a young inventor and her gadgets.' },
  { title: 'Skyward — Kite Tales', description: 'A single illustrated storybook about perseverance and imagination.' },
  { title: 'Puzzle Garden Readers', description: 'Early-reader series built around counting and pattern recognition.' },
  { title: 'Autumn Star Anthology', description: 'A seasonal anthology exploring friendship and change.' },
  { title: 'River of Words', description: 'A vocabulary-building series following Willow along the river.' },
  { title: 'Circuit & Friends', description: 'A friendly robot learns about emotions and belonging.' },
]

export const projects: Project[] = projectTitles.map((p, i) => {
  const rand = seededRandom(i * 29 + 11)
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)
  const story = stories[i % stories.length]
  return {
    id: `project_${(i + 1).toString().padStart(3, '0')}`,
    title: p.title,
    description: p.description,
    status: pick<ProjectStatus>(['Planning', 'Story', 'Illustration', 'Layout', 'Published'], rand),
    storyId: story.id,
    characterIds: story.characterIds,
    gradientFrom,
    gradientTo,
    createdAt: formatRelative(Math.floor(rand() * 30) + 5),
    updatedAt: formatRelative(Math.floor(rand() * 5)),
  }
})

const engineByKind: Record<AnimoviaAssetKind, string[]> = {
  Illustration: ['FLUX.1 Pro', 'Stable Diffusion 3.5'],
  Cover: ['FLUX.1 Pro', 'Stable Diffusion 3.5'],
  Book: ['Animovia Layout Engine'],
  Narration: ['ElevenLabs Multilingual v2', 'ElevenLabs Turbo v2.5'],
  'Book-to-Video': ['Veo 3', 'Kling 1.5'],
  Export: ['Animovia Export Engine'],
}

const metaByKind: Record<AnimoviaAssetKind, string[]> = {
  Illustration: ['1536×1536 · scene', '2048×2048 · scene', '1536×1536 · spot art'],
  Cover: ['Front cover · 1600×2000', 'Front + back · 1600×2000'],
  Book: ['18 pages', '24 pages', '32 pages'],
  Narration: ['3:12 narration', '4:05 narration', '2:48 narration'],
  'Book-to-Video': ['0:48 video', '1:12 video', '0:36 video'],
  Export: ['PDF · 8.2MB', 'Print-ready PDF · 24MB', 'PNG pages · 18 files'],
}

export const kindDefaults: Record<AnimoviaAssetKind, { engine: string; meta: string }> = {
  Illustration: { engine: engineByKind.Illustration[0], meta: metaByKind.Illustration[0] },
  Cover: { engine: engineByKind.Cover[0], meta: metaByKind.Cover[0] },
  Book: { engine: engineByKind.Book[0], meta: metaByKind.Book[1] },
  Narration: { engine: engineByKind.Narration[0], meta: metaByKind.Narration[0] },
  'Book-to-Video': { engine: engineByKind['Book-to-Video'][0], meta: metaByKind['Book-to-Video'][0] },
  Export: { engine: engineByKind.Export[0], meta: metaByKind.Export[0] },
}

const kinds: AnimoviaAssetKind[] = ['Illustration', 'Cover', 'Book', 'Narration', 'Book-to-Video', 'Export']

export const animoviaAssets: AnimoviaAsset[] = Array.from({ length: 36 }, (_, i) => {
  const rand = seededRandom(i * 41 + 17)
  const kind = kinds[i % kinds.length]
  const story = pick(stories, rand)
  const character = story.characterIds.length > 0 ? pick(story.characterIds, rand) : null
  const status: AnimoviaAssetStatus = rand() > 0.9 ? 'Failed' : rand() > 0.82 ? 'Processing' : rand() > 0.15 ? 'Complete' : 'Draft'
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)
  return {
    id: `asset_${(i + 1).toString().padStart(3, '0')}`,
    kind,
    title: `${story.title} — ${kind}`,
    characterId: character,
    storyId: story.id,
    status,
    engine: pick(engineByKind[kind], rand),
    createdAt: formatRelative(Math.floor(rand() * 15)),
    gradientFrom,
    gradientTo,
    meta: pick(metaByKind[kind], rand),
  }
})

export function addStory(story: Story) {
  const existingIdx = stories.findIndex((s) => s.id === story.id)
  if (existingIdx !== -1) stories.splice(existingIdx, 1)
  stories.unshift(story)
}
export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id)
}
export function addProject(project: Project) {
  projects.unshift(project)
}
export function updateProject(id: string, patch: Partial<Project>) {
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return
  projects[idx] = { ...projects[idx], ...patch }
}
export function addAnimoviaAsset(asset: AnimoviaAsset) {
  animoviaAssets.unshift(asset)
}
