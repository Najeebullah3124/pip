import {
  Blocks, Shirt, Mic, Layers, Cpu, Package, Share2, Image, type LucideIcon,
} from 'lucide-react'

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

export type PrivateStatus = 'Draft' | 'Active' | 'Testing' | 'Archived'
export const privateStatuses: PrivateStatus[] = ['Draft', 'Active', 'Testing', 'Archived']

// ---------- Prompt templates (Prompt Studio / Builder / Tester / Optimizer / Library) ----------

export type PromptCategory = 'Character Voice' | 'Scene Generation' | 'Marketing Copy' | 'Story Structure' | 'System Instruction'
export const promptCategories: PromptCategory[] = ['Character Voice', 'Scene Generation', 'Marketing Copy', 'Story Structure', 'System Instruction']

export interface PrivatePromptTemplate {
  id: string
  name: string
  category: PromptCategory
  systemPrompt: string
  variables: string[]
  status: PrivateStatus
  version: string
  usageCount: number
  updatedAt: string
}

const promptSeed: { name: string; category: PromptCategory; systemPrompt: string; variables: string[] }[] = [
  {
    name: 'Character voice — warm narrator',
    category: 'Character Voice',
    systemPrompt: 'You are {{character_name}}, speaking in a warm, encouraging tone suited for {{target_age}}. Stay in character at all times and reflect the personality traits: {{traits}}.',
    variables: ['character_name', 'target_age', 'traits'],
  },
  {
    name: 'Scene illustration prompt builder',
    category: 'Scene Generation',
    systemPrompt: 'Compose an illustration prompt for {{character_name}} in a {{environment}} setting, {{lighting}} lighting, {{camera}} camera angle, in the {{illustration_style}} style.',
    variables: ['character_name', 'environment', 'lighting', 'camera', 'illustration_style'],
  },
  {
    name: 'Product hero-shot composition',
    category: 'Marketing Copy',
    systemPrompt: 'Write a scene description placing {{product}} by {{brand}} into a {{placement_style}} composition featuring {{character_name}}. Emphasize: {{marketing_notes}}.',
    variables: ['product', 'brand', 'placement_style', 'character_name', 'marketing_notes'],
  },
  {
    name: 'Story arc scaffolding',
    category: 'Story Structure',
    systemPrompt: 'Given the theme "{{theme}}" and moral lesson "{{moral_lesson}}", outline a {{scene_count}}-scene story arc appropriate for reading level {{reading_level}}.',
    variables: ['theme', 'moral_lesson', 'scene_count', 'reading_level'],
  },
  {
    name: 'Social caption generator — base system',
    category: 'Marketing Copy',
    systemPrompt: 'Generate a {{platform}} caption in a {{tone}} tone for topic "{{topic}}", including a call to action: {{cta}}.',
    variables: ['platform', 'tone', 'topic', 'cta'],
  },
  {
    name: 'Routing engine fallback instruction',
    category: 'System Instruction',
    systemPrompt: 'If the primary engine fails or exceeds {{latency_threshold}}ms, fall back to {{fallback_engine}} and log the reason to the routing audit trail.',
    variables: ['latency_threshold', 'fallback_engine'],
  },
  {
    name: 'Character memory recall',
    category: 'Character Voice',
    systemPrompt: 'Recall {{character_name}}\'s memory of "{{memory_topic}}" and respond consistently with prior established facts: {{known_facts}}.',
    variables: ['character_name', 'memory_topic', 'known_facts'],
  },
  {
    name: 'LoRA training caption template',
    category: 'System Instruction',
    systemPrompt: 'Caption training image {{image_index}} of {{character_name}} emphasizing {{distinguishing_features}} for identity-consistent fine-tuning.',
    variables: ['image_index', 'character_name', 'distinguishing_features'],
  },
]

export const privatePromptTemplates: PrivatePromptTemplate[] = promptSeed.map((p, i) => {
  const rand = seededRandom(i * 11 + 3)
  return {
    id: `priv_prompt_${(i + 1).toString().padStart(3, '0')}`,
    ...p,
    status: pick(privateStatuses, rand),
    version: `v${Math.floor(rand() * 3) + 1}.${Math.floor(rand() * 9)}`,
    usageCount: Math.floor(rand() * 900) + 20,
    updatedAt: `${Math.floor(rand() * 20) + 1}d ago`,
  }
})

export function getPromptTemplate(id: string): PrivatePromptTemplate | undefined {
  return privatePromptTemplates.find((p) => p.id === id)
}
export function addPromptTemplate(t: PrivatePromptTemplate) {
  privatePromptTemplates.unshift(t)
}
export function updatePromptTemplate(id: string, patch: Partial<PrivatePromptTemplate>) {
  const idx = privatePromptTemplates.findIndex((p) => p.id === id)
  if (idx === -1) return
  privatePromptTemplates[idx] = { ...privatePromptTemplates[idx], ...patch }
}

export interface PromptTestRun {
  id: string
  templateId: string
  input: Record<string, string>
  output: string
  createdAt: string
}
export const promptTestRuns: PromptTestRun[] = []
export function addTestRun(run: PromptTestRun) {
  promptTestRuns.unshift(run)
}

// ---------- Private characters, wardrobes, voices, memory ----------

export interface PrivateCharacter {
  id: string
  name: string
  archetype: string
  tagline: string
  gradientFrom: string
  gradientTo: string
  status: PrivateStatus
  updatedAt: string
}

const archetypes = ['Prototype mascot', 'Experimental narrator', 'Internal test persona', 'Brand voice draft', 'Unreleased ambassador']
const privateGradients: [string, string][] = [
  ['#fbbf24', '#b45309'], ['#f97316', '#7c2d12'], ['#facc15', '#854d0e'], ['#fb923c', '#9a3412'],
  ['#fde047', '#a16207'], ['#fdba74', '#c2410c'],
]

export const privateCharacters: PrivateCharacter[] = Array.from({ length: 6 }, (_, i) => {
  const rand = seededRandom(i * 19 + 7)
  const [gradientFrom, gradientTo] = pick(privateGradients, rand)
  return {
    id: `priv_char_${(i + 1).toString().padStart(3, '0')}`,
    name: `Prototype ${['Echo', 'Vale', 'Rune', 'Nyx', 'Fable', 'Ash'][i]}`,
    archetype: pick(archetypes, rand),
    tagline: 'Internal-only identity, not yet published to NexaPersona or Animovia.',
    gradientFrom,
    gradientTo,
    status: pick(privateStatuses, rand),
    updatedAt: `${Math.floor(rand() * 10) + 1}d ago`,
  }
})

export interface PrivateMemoryEntry {
  id: string
  characterId: string
  content: string
  importance: 'Low' | 'Medium' | 'High'
  createdAt: string
}

const memoryPool = [
  'Prefers to be addressed with a nickname during casual scenes.',
  'Has an established backstory involving a childhood by the coast.',
  'Should never reference competitor brands in generated copy.',
  'Recently corrected: favorite color is teal, not blue.',
  'Voice pitch was tuned down 8% after user testing feedback.',
  'Consistently avoids slang when addressing younger audiences.',
  'Has a running joke about losing a pet turtle — callback often well received.',
  'Wardrobe default changed from casual to semi-formal for brand alignment.',
]

export const privateMemoryEntries: PrivateMemoryEntry[] = Array.from({ length: 14 }, (_, i) => {
  const rand = seededRandom(i * 29 + 5)
  return {
    id: `priv_mem_${(i + 1).toString().padStart(3, '0')}`,
    characterId: pick(privateCharacters, rand).id,
    content: pick(memoryPool, rand),
    importance: pick<'Low' | 'Medium' | 'High'>(['Low', 'Medium', 'High'], rand),
    createdAt: `${Math.floor(rand() * 25) + 1}d ago`,
  }
})

// ---------- Unified private catalog (Components, Wardrobes, Voices, LoRA, Engines, Product Templates, Social Templates, Media) ----------

export type PrivateAssetKind = 'Component' | 'Wardrobe' | 'Voice' | 'LoRA' | 'Engine' | 'Product Template' | 'Social Template' | 'Media'

export const privateAssetKindMeta: Record<PrivateAssetKind, { icon: LucideIcon; metaPool: string[] }> = {
  Component: { icon: Blocks, metaPool: ['Prompt fragment', 'Style modifier', 'Safety guardrail', 'Tone adjuster'] },
  Wardrobe: { icon: Shirt, metaPool: ['Editorial avant-garde', 'Soft athleisure', 'Business casual', 'Streetwear'] },
  Voice: { icon: Mic, metaPool: ['ElevenLabs draft', 'Pitch experiment', 'Accent variant', 'Unreleased voice ID'] },
  LoRA: { icon: Layers, metaPool: ['Identity v0.1', 'Training in progress', 'Experimental weights', 'Base model swap test'] },
  Engine: { icon: Cpu, metaPool: ['Unreleased model', 'Cost benchmark', 'Latency benchmark', 'Vendor evaluation'] },
  'Product Template': { icon: Package, metaPool: ['Hero shot template', 'Unboxing template', 'Comparison layout', 'Lifestyle template'] },
  'Social Template': { icon: Share2, metaPool: ['Caption template', 'Hashtag pack', 'CTA library', 'Platform preset'] },
  Media: { icon: Image, metaPool: ['Reference image', 'Internal test render', 'QA sample', 'Benchmark asset'] },
}

export interface PrivateAsset {
  id: string
  kind: PrivateAssetKind
  title: string
  characterId: string | null
  status: PrivateStatus
  meta: string
  updatedAt: string
}

const titlesByKind: Record<PrivateAssetKind, string[]> = {
  Component: ['Guardrail: no medical claims', 'Tone: playful energetic', 'Style: cinematic lighting', 'Safety: brand-safe filter'],
  Wardrobe: ['Autumn capsule', 'Studio neutrals', 'Weekend casual', 'Launch-day look'],
  Voice: ['Warm narrator v2', 'Crisp professional draft', 'Playful energetic test', 'Calm assistant tuning'],
  LoRA: ['identity-draft-v1', 'identity-retrain-v2', 'style-transfer-test', 'base-swap-experiment'],
  Engine: ['NextGen Diffusion (preview)', 'Internal TTS benchmark', 'Latency-optimized router', 'Cost-reduced fallback model'],
  'Product Template': ['Headphones hero template', 'Skincare macro template', 'Footwear motion template', 'Beverage lifestyle template'],
  'Social Template': ['Launch announcement pack', 'Weekly tips caption set', 'Behind-the-scenes template', 'Testimonial highlight set'],
  Media: ['QA render batch 1', 'Reference photo set', 'Benchmark comparison grid', 'Internal style test'],
}

const kinds: PrivateAssetKind[] = ['Component', 'Wardrobe', 'Voice', 'LoRA', 'Engine', 'Product Template', 'Social Template', 'Media']

export const privateAssets: PrivateAsset[] = kinds.flatMap((kind, ki) =>
  Array.from({ length: 6 }, (_, i) => {
    const rand = seededRandom(ki * 53 + i * 7 + 9)
    return {
      id: `priv_asset_${kind.replace(/\s+/g, '')}_${(i + 1).toString().padStart(2, '0')}`,
      kind,
      title: titlesByKind[kind][i % titlesByKind[kind].length],
      characterId: rand() > 0.4 ? pick(privateCharacters, rand).id : null,
      status: pick(privateStatuses, rand),
      meta: pick(privateAssetKindMeta[kind].metaPool, rand),
      updatedAt: `${Math.floor(rand() * 15) + 1}d ago`,
    }
  })
)

export function addPrivateAsset(asset: PrivateAsset) {
  privateAssets.unshift(asset)
}

export function getPrivateCharacter(id: string): PrivateCharacter | undefined {
  return privateCharacters.find((c) => c.id === id)
}
