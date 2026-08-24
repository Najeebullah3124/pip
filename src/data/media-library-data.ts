import {
  Image, Video, MessageSquareText, Mic, Sparkles, BookOpen, type LucideIcon,
} from 'lucide-react'
import { mediaItems } from './nexapersona-data'
import { animoviaAssets } from './animovia-data'
import { books } from './book-builder-data'
import { getCharacter } from './character-data'

export type LibraryMediaType = 'Image' | 'Video' | 'Talking Head' | 'Voice' | 'Illustration' | 'Book' | 'Generated Asset'
export type LibraryStatus = 'Complete' | 'Processing' | 'Failed' | 'Draft'
export type LibrarySourceApp = 'NexaPersona' | 'Animovia'

export const libraryMediaTypeMeta: Record<LibraryMediaType, { icon: LucideIcon; color: string }> = {
  Image: { icon: Image, color: 'var(--chart-cat-1)' },
  Video: { icon: Video, color: 'var(--chart-cat-2)' },
  'Talking Head': { icon: MessageSquareText, color: 'var(--chart-cat-3)' },
  Voice: { icon: Mic, color: 'var(--chart-cat-4)' },
  Illustration: { icon: Image, color: 'var(--chart-cat-5)' },
  Book: { icon: BookOpen, color: 'var(--chart-cat-1)' },
  'Generated Asset': { icon: Sparkles, color: 'var(--chart-cat-2)' },
}

export interface HistoryEntry {
  version: string
  date: string
  status: LibraryStatus
  note: string
}

export interface LibraryRecord {
  id: string
  title: string
  mediaType: LibraryMediaType
  characterId: string | null
  promptVersion: string
  aiProvider: string
  generationDate: string
  status: LibraryStatus
  tags: string[]
  favorite: boolean
  sourceApp: LibrarySourceApp
  sourceHref: string
  gradientFrom: string
  gradientTo: string
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}
const providerByEngine: [RegExp, string][] = [
  [/flux/i, 'Black Forest Labs'],
  [/stable diffusion/i, 'Stability AI'],
  [/veo/i, 'Google'],
  [/kling/i, 'Kuaishou'],
  [/gen-3/i, 'Runway'],
  [/elevenlabs/i, 'ElevenLabs'],
  [/claude/i, 'Anthropic'],
  [/gpt|chatgpt/i, 'OpenAI'],
  [/animovia/i, 'Animovia'],
]
function providerFor(engine: string): string {
  for (const [pattern, provider] of providerByEngine) {
    if (pattern.test(engine)) return provider
  }
  return 'PIP'
}

function promptVersionFor(id: string): string {
  const h = hashId(id)
  return `v${1 + (h % 3)}.${h % 10}`
}

export function historyFor(record: Pick<LibraryRecord, 'id' | 'generationDate' | 'status' | 'promptVersion'>): HistoryEntry[] {
  const rand = seededRandom(hashId(record.id))
  const revisions = Math.floor(rand() * 2) + 1
  const entries: HistoryEntry[] = [{ version: 'v1.0', date: `${Math.floor(rand() * 20) + revisions * 3}d ago`, status: 'Complete', note: 'Initial generation' }]
  for (let i = 1; i <= revisions; i++) {
    entries.push({
      version: i === revisions ? record.promptVersion : `v1.${i}`,
      date: i === revisions ? record.generationDate : `${Math.floor(rand() * 10) + 1}d ago`,
      status: i === revisions ? record.status : 'Complete',
      note: i === revisions ? 'Latest revision' : 'Regenerated with updated prompt',
    })
  }
  return entries
}

const genTypeToLibraryType: Record<string, LibraryMediaType> = {
  Image: 'Image',
  Video: 'Video',
  'Talking Head': 'Talking Head',
  Voice: 'Voice',
  'Lip Sync': 'Generated Asset',
  'Product Placement': 'Generated Asset',
  'Social Media': 'Generated Asset',
}

const assetKindToLibraryType: Record<string, LibraryMediaType> = {
  Illustration: 'Illustration',
  Cover: 'Illustration',
  Book: 'Generated Asset',
  Narration: 'Generated Asset',
  'Book-to-Video': 'Generated Asset',
  Export: 'Generated Asset',
}

function buildRecords(): LibraryRecord[] {
  const fromNexa: LibraryRecord[] = mediaItems.map((m) => ({
    id: `lib_nexa_${m.id}`,
    title: m.title,
    mediaType: genTypeToLibraryType[m.type] ?? 'Generated Asset',
    characterId: m.characterId,
    promptVersion: promptVersionFor(m.id),
    aiProvider: providerFor(m.engine),
    generationDate: m.createdAt,
    status: m.status,
    tags: [m.type, 'NexaPersona', m.meta].filter(Boolean),
    favorite: hashId(m.id) % 7 === 0,
    sourceApp: 'NexaPersona',
    sourceHref: '/nexapersona/media-library',
    gradientFrom: m.gradientFrom,
    gradientTo: m.gradientTo,
  }))

  const fromAnimovia: LibraryRecord[] = animoviaAssets
    .filter((a) => a.kind !== 'Book')
    .map((a) => ({
      id: `lib_anim_${a.id}`,
      title: a.title,
      mediaType: assetKindToLibraryType[a.kind] ?? 'Generated Asset',
      characterId: a.characterId,
      promptVersion: promptVersionFor(a.id),
      aiProvider: providerFor(a.engine),
      generationDate: a.createdAt,
      status: a.status,
      tags: [a.kind, 'Animovia', a.meta].filter(Boolean),
      favorite: hashId(a.id) % 7 === 0,
      sourceApp: 'Animovia',
      sourceHref: a.kind === 'Illustration' ? '/animovia/illustrations' : a.kind === 'Cover' ? '/animovia/covers' : a.kind === 'Narration' ? '/animovia/narration' : a.kind === 'Book-to-Video' ? '/animovia/book-to-video' : '/animovia/exports',
      gradientFrom: a.gradientFrom,
      gradientTo: a.gradientTo,
    }))

  const bookStatusMap: Record<string, LibraryStatus> = { Draft: 'Draft', 'In Layout': 'Processing', Ready: 'Complete', Published: 'Complete' }
  const fromBooks: LibraryRecord[] = books.map((b) => ({
    id: `lib_book_${b.id}`,
    title: b.title,
    mediaType: 'Book',
    characterId: b.characterIds[0] ?? null,
    promptVersion: promptVersionFor(b.id),
    aiProvider: 'Animovia',
    generationDate: b.updatedAt,
    status: bookStatusMap[b.status] ?? 'Draft',
    tags: ['Book', 'Animovia', `${b.pages.length} pages`],
    favorite: hashId(b.id) % 5 === 0,
    sourceApp: 'Animovia',
    sourceHref: `/animovia/book-builder/${b.id}`,
    gradientFrom: b.coverGradientFrom,
    gradientTo: b.coverGradientTo,
  }))

  return [...fromNexa, ...fromAnimovia, ...fromBooks]
}

export const libraryRecords: LibraryRecord[] = buildRecords()

export function getLibraryRecord(id: string): LibraryRecord | undefined {
  return libraryRecords.find((r) => r.id === id)
}

export const libraryProviders = [...new Set(libraryRecords.map((r) => r.aiProvider))].sort()

export function getLibraryCharacter(id: string | null) {
  return id ? getCharacter(id) : undefined
}

