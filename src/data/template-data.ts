import {
  Image, Video, MessageSquareText, Mic, BookOpen, Book, Clapperboard, Package, Share2,
  type LucideIcon,
} from 'lucide-react'

export type TemplateCategory =
  | 'Image'
  | 'Video'
  | 'Talking Head'
  | 'Voice'
  | 'Story'
  | 'Book'
  | 'Book-to-Video'
  | 'Product Placement'
  | 'Social Media'

export type TemplateStatus = 'Published' | 'Draft' | 'Testing' | 'Archived'

export const categoryMeta: Record<TemplateCategory, { icon: LucideIcon; color: string }> = {
  Image: { icon: Image, color: 'var(--chart-cat-1)' },
  Video: { icon: Video, color: 'var(--chart-cat-2)' },
  'Talking Head': { icon: MessageSquareText, color: 'var(--chart-cat-3)' },
  Voice: { icon: Mic, color: 'var(--chart-cat-4)' },
  Story: { icon: BookOpen, color: 'var(--chart-cat-5)' },
  Book: { icon: Book, color: 'var(--chart-cat-1)' },
  'Book-to-Video': { icon: Clapperboard, color: 'var(--chart-cat-2)' },
  'Product Placement': { icon: Package, color: 'var(--chart-cat-3)' },
  'Social Media': { icon: Share2, color: 'var(--chart-cat-4)' },
}

export const allCategories = Object.keys(categoryMeta) as TemplateCategory[]
export const aiEngines = ['Claude Opus 5', 'Claude Sonnet 5', 'Claude Haiku 4.5', 'GPT-4o', 'Gemini 2.5 Pro']

export interface TemplateVersion {
  version: string
  changelog: string
  updatedBy: string
  updatedAt: string
  content: string
}

export interface UsagePoint {
  label: string
  count: number
}

export interface TestRun {
  id: string
  input: string
  output: string
  engine: string
  timestamp: string
  rating: 'good' | 'bad' | null
}

export interface PromptTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string
  status: TemplateStatus
  version: string
  aiEngine: string
  componentsUsed: string[]
  usageCount: number
  lastUpdated: string
  createdAt: string
  owner: string
  tags: string[]
  favorite: boolean
  content: string
  versions: TemplateVersion[]
  usageHistory: UsagePoint[]
  testRuns: TestRun[]
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}
function pickMany<T>(arr: T[], count: number, rand: () => number): T[] {
  return [...arr].sort(() => rand() - 0.5).slice(0, count)
}

const namesByCategory: Record<TemplateCategory, string[]> = {
  Image: ['Studio Portrait Generator', 'Product Hero Shot', 'Editorial Fashion Frame', 'Concept Art Explorer'],
  Video: ['Product Launch Teaser', 'Brand Story Reel', 'Explainer Sequence', 'Social Ad Cutdown'],
  'Talking Head': ['Support Guide Intro', 'Executive Update', 'Course Lecture Segment', 'FAQ Response Clip'],
  Voice: ['Narrator Voiceover', 'IVR Greeting Script', 'Audiobook Chapter Read', 'Podcast Intro Bumper'],
  Story: ['Three-Act Explainer', 'Customer Success Narrative', 'Origin Story Arc', 'Problem/Solution Pitch'],
  Book: ['Chapter Outline Builder', 'Character Bible Entry', 'Nonfiction Section Draft', 'Short Story Seed'],
  'Book-to-Video': ['Chapter-to-Scene Adapter', 'Audiobook-to-Trailer', 'Storyboard From Manuscript', 'Serialized Episode Pack'],
  'Product Placement': ['Hero Product Integration', 'Lifestyle Scene Placement', 'Unboxing Sequence', 'Comparison Table Shot'],
  'Social Media': ['Carousel Post Generator', 'Short-Form Hook Writer', 'Caption & Hashtag Pack', 'Thread Starter Kit'],
}

const descriptionsByCategory: Record<TemplateCategory, string> = {
  Image: 'Generates a single polished still image from a structured subject and style brief.',
  Video: 'Produces a short-form generative video sequence from a scene and shot list.',
  'Talking Head': 'Scripts and renders a presenter-style talking head segment with a character.',
  Voice: 'Produces a voiceover script and audio rendering for narration or IVR use.',
  Story: 'Builds a narrative arc scaffold for scripted or long-form generations.',
  Book: 'Drafts structured long-form book or chapter content from an outline brief.',
  'Book-to-Video': 'Adapts existing book or manuscript content into a video-ready scene sequence.',
  'Product Placement': 'Composes a product into a generated scene with brand-safe framing.',
  'Social Media': 'Produces platform-ready social copy and creative from a campaign brief.',
}

const contentByCategory: Record<TemplateCategory, string> = {
  Image: 'Generate a {{style}} image of {{subject}}, {{framing}}, {{lighting}} lighting, aspect ratio {{aspect_ratio}}.',
  Video: 'Produce a {{duration}}s video: {{scene_description}}, {{camera_movement}}, music: {{music_mood}}.',
  'Talking Head': '{{character}} delivers: "{{script}}" — {{framing}}, {{background}}, tone: {{tone}}.',
  Voice: 'Voice: {{voice_preset}} reads: "{{script}}" — pace {{pace}}, emotion: {{emotion}}.',
  Story: 'Act 1: {{setup}} → Act 2: {{conflict}} → Act 3: {{resolution}}. Protagonist: {{protagonist}}.',
  Book: 'Chapter {{chapter_number}}: {{chapter_title}} — {{outline}}, tone: {{tone}}, length: {{word_count}} words.',
  'Book-to-Video': 'Adapt chapter "{{chapter_title}}" into {{scene_count}} scenes, style: {{visual_style}}.',
  'Product Placement': 'Place {{product_name}} in {{scene_setting}}, {{integration_style}}, label visible: {{label_visible}}.',
  'Social Media': 'Write a {{platform}} post about {{topic}}, tone: {{tone}}, include hashtags: {{hashtags}}.',
}

const componentPool = [
  'Consistent Identity Core', 'Studio Portrait LoRA', 'Business Casual Kit', '85mm Portrait Rig',
  'Golden Hour Rim', 'Modern Loft Backdrop', 'Confident Stance', 'Warm Narrator Preset',
  'Three-Act Explainer', 'Hero Product Shot', 'Standard Quality Guard', 'SEO Tag Bundle',
]

const owners = ['Jordan Lee', 'Amara Chen', 'Priya Nair', 'Emerson Sterling', 'Tobias Farouk']
const statuses: TemplateStatus[] = ['Published', 'Published', 'Published', 'Draft', 'Testing', 'Archived']

function formatDate(daysAgo: number) {
  const d = new Date(2026, 7, 17)
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function formatRelative(daysAgo: number) {
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  if (daysAgo < 30) return `${daysAgo}d ago`
  return `${Math.floor(daysAgo / 30)}mo ago`
}

function buildVersions(rand: () => number, currentVersion: number): TemplateVersion[] {
  const authors = pickMany(owners, 3, rand)
  return Array.from({ length: currentVersion }, (_, i) => {
    const v = currentVersion - i
    const daysAgo = i * (Math.floor(rand() * 20) + 8)
    return {
      version: `v${v}.0`,
      changelog:
        v === currentVersion
          ? 'Current version'
          : pick(
              ['Improved variable coverage', 'Fixed inconsistent output at edge cases', 'Tuned for new engine defaults', 'Clarified instructions', 'Adjusted tone guidance'],
              rand
            ),
      updatedBy: authors[i % authors.length],
      updatedAt: formatDate(daysAgo),
      content: `Template definition snapshot (v${v}.0)`,
    }
  })
}

function buildUsageHistory(rand: () => number, base: number): UsagePoint[] {
  const labels = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6']
  let value = Math.max(2, Math.round(base / 8))
  return labels.map((label) => {
    value = Math.max(0, Math.round(value + (rand() - 0.35) * (base / 6)))
    return { label, count: value }
  })
}

function buildTestRuns(rand: () => number, content: string): TestRun[] {
  return Array.from({ length: 3 }, (_, i) => ({
    id: `run_${i}`,
    input: content.replace(/\{\{(\w+)\}\}/g, (_, k) => `[${k}]`),
    output: pick(
      [
        'Generated output matched the brief with strong consistency across identity markers.',
        'Output required a follow-up pass to correct framing, otherwise on-brief.',
        'High-fidelity result, ready for publish without further edits.',
        'Tone landed slightly off-brand; adjusted temperature and re-ran successfully.',
      ],
      rand
    ),
    engine: pick(aiEngines, rand),
    timestamp: formatRelative(Math.floor(rand() * 10)),
    rating: pick(['good', 'good', 'bad', null] as const, rand),
  }))
}

function makeTemplate(category: TemplateCategory, index: number, globalIndex: number): PromptTemplate {
  const rand = seededRandom(globalIndex * 43 + 11)
  const name = namesByCategory[category][index % namesByCategory[category].length]
  const currentVersion = Math.floor(rand() * 3) + 1
  const usageCount = Math.floor(rand() * 1400) + 8
  const daysAgo = Math.floor(rand() * 60)
  const createdDaysAgo = daysAgo + Math.floor(rand() * 220) + 20
  const content = contentByCategory[category]

  return {
    id: `tpl_${globalIndex.toString().padStart(3, '0')}`,
    name,
    category,
    description: descriptionsByCategory[category],
    status: globalIndex === 0 ? 'Published' : pick(statuses, rand),
    version: `v${currentVersion}.0`,
    aiEngine: pick(aiEngines, rand),
    componentsUsed: pickMany(componentPool, Math.floor(rand() * 3) + 2, rand),
    usageCount,
    lastUpdated: formatRelative(daysAgo),
    createdAt: formatDate(createdDaysAgo),
    owner: pick(owners, rand),
    tags: pickMany(['Core', 'Enterprise', 'Beta', 'Multilingual', 'High-fidelity', 'Fast'], Math.floor(rand() * 2) + 1, rand),
    favorite: rand() > 0.8,
    content,
    versions: buildVersions(rand, currentVersion),
    usageHistory: buildUsageHistory(rand, usageCount),
    testRuns: buildTestRuns(rand, content),
  }
}

export const templates: PromptTemplate[] = allCategories.flatMap((category, ci) =>
  Array.from({ length: 4 }, (_, i) => makeTemplate(category, i, ci * 4 + i))
)

export function getTemplate(id: string): PromptTemplate | undefined {
  return templates.find((t) => t.id === id)
}
export function addTemplate(template: PromptTemplate) {
  templates.unshift(template)
}
export function updateTemplate(id: string, patch: Partial<PromptTemplate>) {
  const index = templates.findIndex((t) => t.id === id)
  if (index !== -1) templates[index] = { ...templates[index], ...patch }
}
export function removeTemplate(id: string) {
  const index = templates.findIndex((t) => t.id === id)
  if (index !== -1) templates.splice(index, 1)
}
