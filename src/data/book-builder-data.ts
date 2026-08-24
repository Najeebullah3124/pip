import {
  PanelTop, PanelBottom, Columns2, Square, AlignLeft,
  type LucideIcon,
} from 'lucide-react'
import { stories, type Story } from './animovia-data'

export type PageLayout = 'full-bleed' | 'image-top' | 'image-bottom' | 'split-left' | 'split-right' | 'text-only'
export type TextAlign = 'left' | 'center' | 'right'
export type TextSize = 'sm' | 'md' | 'lg'
export type BookStatus = 'Draft' | 'In Layout' | 'Ready' | 'Published'

export const pageLayouts: { key: PageLayout; label: string; icon: LucideIcon }[] = [
  { key: 'full-bleed', label: 'Full bleed', icon: Square },
  { key: 'image-top', label: 'Image top', icon: PanelTop },
  { key: 'image-bottom', label: 'Image bottom', icon: PanelBottom },
  { key: 'split-left', label: 'Split, image left', icon: Columns2 },
  { key: 'split-right', label: 'Split, image right', icon: Columns2 },
  { key: 'text-only', label: 'Text only', icon: AlignLeft },
]

export const illustrationStyles = ['Storybook watercolor', 'Flat vector', 'Soft 3D render', 'Pencil & ink sketch', 'Whimsical gouache', 'Paper cutout collage']
export const bookCameraAngles = ['Eye-level', 'Wide establishing', 'Close-up', 'Bird’s-eye', 'Low-angle heroic']
export const bookLightingStyles = ['Warm golden hour', 'Soft morning light', 'Dreamy twilight', 'Bright daylight', 'Cozy lamplight']
export const bookEnvironments = ['Enchanted forest', 'Cozy village', 'Starlit sky', 'Sunny meadow', 'Mountain path', 'Underwater reef', 'City rooftops']

export interface BookPage {
  id: string
  pageNumber: number
  text: string
  layout: PageLayout
  characterId: string | null
  illustrationStyle: string
  camera: string
  lighting: string
  environment: string
  gradientFrom: string
  gradientTo: string
  hasIllustration: boolean
  textAlign: TextAlign
  textSize: TextSize
}

export interface Book {
  id: string
  title: string
  storyId: string | null
  characterIds: string[]
  coverGradientFrom: string
  coverGradientTo: string
  coverSubtitle: string
  author: string
  description: string
  showPageNumbers: boolean
  pages: BookPage[]
  status: BookStatus
  createdAt: string
  updatedAt: string
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
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'], ['#a78bfa', '#7c3aed'], ['#93c5fd', '#2563eb'],
  ['#86efac', '#16a34a'], ['#f0abfc', '#c026d3'], ['#5eead4', '#0891b2'], ['#c4b5fd', '#6d28d9'],
]

const layoutCycle: PageLayout[] = ['image-top', 'split-left', 'image-bottom', 'split-right', 'full-bleed']

function makePage(index: number, story: Story, rand: () => number): BookPage {
  const scene = story.scenes[index % story.scenes.length]
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)
  return {
    id: `page_${story.id}_${index}`,
    pageNumber: index + 1,
    text: scene.description,
    layout: layoutCycle[index % layoutCycle.length],
    characterId: story.characterIds.length > 0 ? pick(story.characterIds, rand) : null,
    illustrationStyle: pick(illustrationStyles, rand),
    camera: pick(bookCameraAngles, rand),
    lighting: pick(bookLightingStyles, rand),
    environment: pick(bookEnvironments, rand),
    gradientFrom,
    gradientTo,
    hasIllustration: rand() > 0.25,
    textAlign: 'left',
    textSize: 'md',
  }
}

function makeBook(story: Story, i: number): Book {
  const rand = seededRandom(i * 37 + 9)
  const [coverGradientFrom, coverGradientTo] = pick(gradientPairs, rand)
  const pages = story.scenes.map((_, si) => makePage(si, story, seededRandom(i * 37 + si + 9)))
  return {
    id: `book_${(i + 1).toString().padStart(3, '0')}`,
    title: story.title,
    storyId: story.id,
    characterIds: story.characterIds,
    coverGradientFrom,
    coverGradientTo,
    coverSubtitle: story.theme,
    author: 'PIP Studio',
    description: story.educationalGoal,
    showPageNumbers: true,
    pages,
    status: pick<BookStatus>(['Draft', 'In Layout', 'Ready', 'Published'], rand),
    createdAt: `${Math.floor(rand() * 20) + 1}d ago`,
    updatedAt: `${Math.floor(rand() * 5)}d ago`,
  }
}

export const books: Book[] = stories.slice(0, 6).map((s, i) => makeBook(s, i))

export function getBook(id: string): Book | undefined {
  return books.find((b) => b.id === id)
}
export function addBook(book: Book) {
  const idx = books.findIndex((b) => b.id === book.id)
  if (idx !== -1) books.splice(idx, 1)
  books.unshift(book)
}
export function updateBook(id: string, patch: Partial<Book>) {
  const idx = books.findIndex((b) => b.id === id)
  if (idx === -1) return
  books[idx] = { ...books[idx], ...patch }
}

export function newBookFromStory(story: Story): Book {
  const rand = seededRandom(Date.now() % 100000)
  const [coverGradientFrom, coverGradientTo] = pick(gradientPairs, rand)
  const pages = story.scenes.length > 0
    ? story.scenes.map((_, si) => makePage(si, story, seededRandom(si + 1)))
    : [makePage(0, { ...story, scenes: [{ id: 's0', title: 'Opening scene', description: 'Write what happens on this page…', setting: bookEnvironments[0] }] }, rand)]
  return {
    id: `book_new_${Date.now()}`,
    title: story.title,
    storyId: story.id,
    characterIds: story.characterIds,
    coverGradientFrom,
    coverGradientTo,
    coverSubtitle: story.theme,
    author: 'PIP Studio',
    description: story.educationalGoal,
    showPageNumbers: true,
    pages: pages.map((p, i) => ({ ...p, hasIllustration: false, pageNumber: i + 1 })),
    status: 'Draft',
    createdAt: 'Just now',
    updatedAt: 'Just now',
  }
}

export function blankPage(pageNumber: number, characterId: string | null): BookPage {
  return {
    id: `page_new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    pageNumber,
    text: '',
    layout: 'image-top',
    characterId,
    illustrationStyle: illustrationStyles[0],
    camera: bookCameraAngles[0],
    lighting: bookLightingStyles[0],
    environment: bookEnvironments[0],
    gradientFrom: '#a78bfa',
    gradientTo: '#7c3aed',
    hasIllustration: false,
    textAlign: 'left',
    textSize: 'md',
  }
}

