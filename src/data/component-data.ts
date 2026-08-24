import {
  Dna, Layers, Shirt, Aperture, Sun, Mountain, PersonStanding, Mic, BookOpen, Package, Ban, Tags,
  type LucideIcon,
} from 'lucide-react'

export type ComponentCategory =
  | 'Character DNA'
  | 'LoRA'
  | 'Wardrobe'
  | 'Camera'
  | 'Lighting'
  | 'Environment'
  | 'Pose'
  | 'Voice'
  | 'Story Structure'
  | 'Product Placement'
  | 'Negative Prompt'
  | 'Metadata'

export type ComponentStatus = 'Published' | 'Draft' | 'Deprecated'

export const categoryMeta: Record<ComponentCategory, { icon: LucideIcon; color: string }> = {
  'Character DNA': { icon: Dna, color: 'var(--chart-cat-1)' },
  LoRA: { icon: Layers, color: 'var(--chart-cat-2)' },
  Wardrobe: { icon: Shirt, color: 'var(--chart-cat-3)' },
  Camera: { icon: Aperture, color: 'var(--chart-cat-4)' },
  Lighting: { icon: Sun, color: 'var(--chart-cat-5)' },
  Environment: { icon: Mountain, color: 'var(--chart-cat-1)' },
  Pose: { icon: PersonStanding, color: 'var(--chart-cat-2)' },
  Voice: { icon: Mic, color: 'var(--chart-cat-3)' },
  'Story Structure': { icon: BookOpen, color: 'var(--chart-cat-4)' },
  'Product Placement': { icon: Package, color: 'var(--chart-cat-5)' },
  'Negative Prompt': { icon: Ban, color: 'var(--chart-cat-1)' },
  Metadata: { icon: Tags, color: 'var(--chart-cat-2)' },
}

export const allCategories = Object.keys(categoryMeta) as ComponentCategory[]

export interface ComponentVersion {
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

export interface PromptComponent {
  id: string
  name: string
  category: ComponentCategory
  description: string
  status: ComponentStatus
  version: string
  usageCount: number
  lastUpdated: string
  createdAt: string
  owner: string
  tags: string[]
  content: string
  versions: ComponentVersion[]
  usageHistory: UsagePoint[]
  usedBy: string[]
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

const namesByCategory: Record<ComponentCategory, string[]> = {
  'Character DNA': ['Consistent Identity Core', 'Portrait Anchor', 'Facial Continuity Set', 'Identity Lock v2'],
  LoRA: ['Studio Portrait LoRA', 'Realistic Skin LoRA', 'Cinematic Face LoRA', 'Brand Mascot LoRA'],
  Wardrobe: ['Business Casual Kit', 'Streetwear Pack', 'Editorial Formal Set', 'Athleisure Base'],
  Camera: ['85mm Portrait Rig', 'Wide Establishing Shot', 'Handheld Documentary', 'Macro Detail Lens'],
  Lighting: ['Golden Hour Rim', 'Studio Softbox Standard', 'High-Contrast Noir', 'Flat Product Light'],
  Environment: ['Modern Loft Backdrop', 'Urban Rooftop Scene', 'Minimal Cyclorama', 'Cozy Library Set'],
  Pose: ['Confident Stance', 'Relaxed Seated', 'Dynamic Action Pose', 'Editorial Lean'],
  Voice: ['Warm Narrator Preset', 'Crisp Corporate Voice', 'Playful Energetic Voice', 'Calm Assistant Tone'],
  'Story Structure': ['Three-Act Explainer', 'Problem/Solution Arc', 'Hero Journey Short', 'Before/After Framework'],
  'Product Placement': ['Hero Product Shot', 'Lifestyle Integration', 'Unboxing Sequence', 'Comparison Layout'],
  'Negative Prompt': ['Standard Quality Guard', 'No Extra Limbs Guard', 'Anti-Watermark Set', 'Clean Background Guard'],
  Metadata: ['SEO Tag Bundle', 'Compliance Footer', 'Rights & Attribution', 'Platform Routing Tags'],
}

const descriptionsByCategory: Record<ComponentCategory, string> = {
  'Character DNA': 'Locks facial structure and identity markers so a character stays recognizable across every generation.',
  LoRA: 'A fine-tuned identity or style model applied at generation time for consistent visual output.',
  Wardrobe: 'A reusable outfit and styling definition — fabric, palette, and accessory details.',
  Camera: 'Framing, lens, and angle configuration applied to image and video generations.',
  Lighting: 'A lighting recipe — direction, color temperature, and mood — for consistent visual tone.',
  Environment: 'A backdrop and setting definition, including time of day and background treatment.',
  Pose: 'A body position and gesture reference used to guide subject posture.',
  Voice: 'A vocal identity preset — provider, accent, pitch, and delivery style.',
  'Story Structure': 'A narrative scaffold for scripted or long-form generations.',
  'Product Placement': 'Defines how a product is composed and integrated into a scene.',
  'Negative Prompt': 'A guard-rail snippet that suppresses unwanted artifacts or attributes.',
  Metadata: 'Structured tags and routing information attached to generation output.',
}

const contentByCategory: Record<ComponentCategory, string> = {
  'Character DNA': 'maintain consistent facial structure, {{eye_color}} eyes, {{hair_style}} across all frames, identity_weight=0.9',
  LoRA: '<lora:{{model_name}}:{{weight}}>, trigger word: {{trigger_word}}',
  Wardrobe: 'wearing {{outfit}}, {{style}} styling, palette: {{palette}}',
  Camera: '{{angle}}, {{lens}}, {{framing}}, depth of field {{dof}}%',
  Lighting: '{{style}} lighting, {{temperature}}K, mood: {{mood}}',
  Environment: 'set in a {{setting}}, {{background_style}}, {{time_of_day}}',
  Pose: '{{pose_name}}, weight distribution natural, hands relaxed',
  Voice: 'voice: {{provider}}, accent: {{accent}}, pitch {{pitch}}%, speed {{speed}}%',
  'Story Structure': 'Act 1: {{setup}} → Act 2: {{conflict}} → Act 3: {{resolution}}',
  'Product Placement': 'product centered, {{integration_style}}, label clearly visible, no occlusion',
  'Negative Prompt': 'lowres, blurry, watermark, extra limbs, deformed hands, bad anatomy',
  Metadata: 'tags: {{tags}}, rights: {{rights}}, route: {{application}}',
}

const owners = ['Jordan Lee', 'Amara Chen', 'Priya Nair', 'Emerson Sterling', 'Tobias Farouk']
const statuses: ComponentStatus[] = ['Published', 'Published', 'Published', 'Draft', 'Deprecated']

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

function buildVersions(name: string, rand: () => number, currentVersion: number): ComponentVersion[] {
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
              ['Refined default parameters', 'Fixed inconsistent output at high weight', 'Expanded template variables', 'Improved compatibility across engines', 'Minor wording adjustments'],
              rand
            ),
      updatedBy: authors[i % authors.length],
      updatedAt: formatDate(daysAgo),
      content: `${name} definition (v${v}.0)`,
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

const usedByPool = ['Support Triage v3', 'Nova — Support Guide', 'Onboarding Kit', 'Holiday Campaign', 'Product Launch Teaser', 'Contract Summarizer']

function makeComponent(category: ComponentCategory, index: number, globalIndex: number): PromptComponent {
  const rand = seededRandom(globalIndex * 31 + 7)
  const name = namesByCategory[category][index % namesByCategory[category].length]
  const currentVersion = Math.floor(rand() * 3) + 1
  const usageCount = Math.floor(rand() * 900) + 5
  const daysAgo = Math.floor(rand() * 60)
  const createdDaysAgo = daysAgo + Math.floor(rand() * 200) + 20

  return {
    id: `cmp_${globalIndex.toString().padStart(3, '0')}`,
    name,
    category,
    description: descriptionsByCategory[category],
    status: globalIndex === 0 ? 'Published' : pick(statuses, rand),
    version: `v${currentVersion}.0`,
    usageCount,
    lastUpdated: formatRelative(daysAgo),
    createdAt: formatDate(createdDaysAgo),
    owner: pick(owners, rand),
    tags: pickMany(['Core', 'Enterprise', 'Beta', 'Multilingual', 'High-fidelity', 'Lightweight'], Math.floor(rand() * 2) + 1, rand),
    content: contentByCategory[category],
    versions: buildVersions(name, rand, currentVersion),
    usageHistory: buildUsageHistory(rand, usageCount),
    usedBy: pickMany(usedByPool, Math.floor(rand() * 3) + 1, rand),
  }
}

export const components: PromptComponent[] = allCategories.flatMap((category, ci) =>
  Array.from({ length: 4 }, (_, i) => makeComponent(category, i, ci * 4 + i))
)

export function getComponent(id: string): PromptComponent | undefined {
  return components.find((c) => c.id === id)
}

export function addComponent(component: PromptComponent) {
  components.unshift(component)
}

export function updateComponent(id: string, patch: Partial<PromptComponent>) {
  const index = components.findIndex((c) => c.id === id)
  if (index !== -1) components[index] = { ...components[index], ...patch }
}

export function removeComponent(id: string) {
  const index = components.findIndex((c) => c.id === id)
  if (index !== -1) components.splice(index, 1)
}
