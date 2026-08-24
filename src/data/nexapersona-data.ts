import {
  Image, Video, MessageSquareText, Mic, AudioWaveform, Package, Share2, type LucideIcon,
} from 'lucide-react'
import { characters } from './character-data'

export type GenerationType = 'Image' | 'Video' | 'Talking Head' | 'Voice' | 'Lip Sync' | 'Product Placement' | 'Social Media'
export type GenerationStatus = 'Complete' | 'Processing' | 'Failed'

export const generationTypeMeta: Record<GenerationType, { icon: LucideIcon; color: string }> = {
  Image: { icon: Image, color: 'var(--chart-cat-1)' },
  Video: { icon: Video, color: 'var(--chart-cat-2)' },
  'Talking Head': { icon: MessageSquareText, color: 'var(--chart-cat-3)' },
  Voice: { icon: Mic, color: 'var(--chart-cat-4)' },
  'Lip Sync': { icon: AudioWaveform, color: 'var(--chart-cat-5)' },
  'Product Placement': { icon: Package, color: 'var(--chart-cat-1)' },
  'Social Media': { icon: Share2, color: 'var(--chart-cat-2)' },
}

export interface MediaItem {
  id: string
  type: GenerationType
  title: string
  characterId: string | null
  status: GenerationStatus
  engine: string
  createdAt: string
  gradientFrom: string
  gradientTo: string
  meta: string
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

const gradientPairs: [string, string][] = [
  ['#a78bfa', '#7c3aed'], ['#f0abfc', '#c026d3'], ['#93c5fd', '#2563eb'], ['#5eead4', '#0891b2'],
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'], ['#86efac', '#16a34a'], ['#c4b5fd', '#6d28d9'],
]

const engineByType: Record<GenerationType, string[]> = {
  Image: ['FLUX.1 Pro', 'Stable Diffusion 3.5'],
  Video: ['Veo 3', 'Kling 1.5', 'Gen-3 Alpha'],
  'Talking Head': ['Veo 3', 'Gen-3 Alpha'],
  Voice: ['ElevenLabs Multilingual v2', 'ElevenLabs Turbo v2.5'],
  'Lip Sync': ['Gen-3 Alpha', 'Kling 1.5'],
  'Product Placement': ['FLUX.1 Pro', 'Stable Diffusion 3.5'],
  'Social Media': ['Claude Opus 5', 'GPT-4o'],
}

const titlesByType: Record<GenerationType, string[]> = {
  Image: ['Studio portrait', 'Editorial close-up', 'Hero campaign shot', 'Lifestyle candid'],
  Video: ['Brand intro clip', 'Product teaser', 'Scene walk-through', 'Motion loop'],
  'Talking Head': ['Welcome message', 'Product walkthrough', 'FAQ response', 'Weekly update'],
  Voice: ['Narration take', 'IVR greeting', 'Podcast intro', 'Audiobook sample'],
  'Lip Sync': ['Dialogue sync pass', 'Multilingual dub', 'Re-timed take', 'Sync QA pass'],
  'Product Placement': ['Hero shot integration', 'Lifestyle placement', 'Unboxing frame', 'Comparison shot'],
  'Social Media': ['Carousel copy', 'Short-form hook', 'Caption pack', 'Thread starter'],
}

const meta: Record<GenerationType, string[]> = {
  Image: ['1024×1024', '1536×1536', '2048×2048'],
  Video: ['0:08', '0:10', '0:16'],
  'Talking Head': ['0:12', '0:22', '0:35'],
  Voice: ['0:14', '0:28', '0:41'],
  'Lip Sync': ['0:18', '0:24', '0:31'],
  'Product Placement': ['1024×1024', '1536×1536'],
  'Social Media': ['3 variations', '5 variations', '1 thread'],
}

function formatRelative(daysAgo: number, hoursAgo: number) {
  if (daysAgo === 0 && hoursAgo === 0) return 'Just now'
  if (daysAgo === 0) return `${hoursAgo}h ago`
  if (daysAgo === 1) return 'Yesterday'
  return `${daysAgo}d ago`
}

const types: GenerationType[] = ['Image', 'Video', 'Talking Head', 'Voice', 'Lip Sync', 'Product Placement', 'Social Media']

export const mediaItems: MediaItem[] = Array.from({ length: 56 }, (_, i) => {
  const rand = seededRandom(i * 19 + 7)
  const type = types[i % types.length]
  const character = pick(characters.slice(0, 10), rand)
  const status: GenerationStatus = rand() > 0.92 ? 'Failed' : rand() > 0.85 ? 'Processing' : 'Complete'
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)

  return {
    id: `media_${(i + 1).toString().padStart(3, '0')}`,
    type,
    title: `${character.name} — ${pick(titlesByType[type], rand)}`,
    characterId: character.id,
    status,
    engine: pick(engineByType[type], rand),
    createdAt: formatRelative(Math.floor(rand() * 12), Math.floor(rand() * 24)),
    gradientFrom,
    gradientTo,
    meta: pick(meta[type], rand),
  }
})

export function addMediaItem(item: MediaItem) {
  mediaItems.unshift(item)
}

export interface LoraModel {
  id: string
  name: string
  characterId: string
  baseModel: string
  status: 'Trained' | 'Training' | 'Queued' | 'Failed'
  trainingImages: number
  weight: number
  version: string
  createdAt: string
}

export const loraModels: LoraModel[] = characters.slice(0, 8).map((c, i) => {
  const rand = seededRandom(i * 31 + 3)
  return {
    id: `lora_${(i + 1).toString().padStart(3, '0')}`,
    name: `${c.name.toLowerCase()}-identity-v${Math.floor(rand() * 3) + 1}`,
    characterId: c.id,
    baseModel: pick(['SDXL 1.0', 'Flux.1 Dev', 'SD 3.5 Large'], rand),
    status: pick(['Trained', 'Trained', 'Trained', 'Training', 'Queued'], rand),
    trainingImages: Math.floor(rand() * 60) + 20,
    weight: Math.round((rand() * 0.5 + 0.6) * 100) / 100,
    version: `v${Math.floor(rand() * 3) + 1}.${Math.floor(rand() * 9)}`,
    createdAt: `${Math.floor(rand() * 60) + 5}d ago`,
  }
})

export const nexaCharacterIds = [...new Set(mediaItems.map((m) => m.characterId).filter(Boolean))] as string[]
