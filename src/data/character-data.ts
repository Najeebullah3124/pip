export type CharacterStatus = 'Live' | 'Draft' | 'Training' | 'Archived'

export interface Appearance {
  age: string
  gender: string
  ethnicity: string
  bodyType: string
  height: string
  hairColor: string
  hairStyle: string
  eyeColor: string
  skinTone: string
  distinguishingFeatures: string
  referenceImages?: string[]
}

export interface Personality {
  archetype: string
  traits: string[]
  tone: string
  values: string[]
  quirks: string
  backstory: string
  communicationStyle: string
}

export interface Voice {
  provider: string
  voiceId: string
  pitch: number
  speed: number
  stability: number
  accent: string
  sampleLine: string
}

export interface Wardrobe {
  defaultOutfit: string
  style: string
  palette: string[]
  accessories: string[]
  variants: string[]
}

export interface Camera {
  defaultAngle: string
  lens: string
  framing: string
  depthOfField: number
  aspectRatio: string
}

export interface Lighting {
  style: string
  colorTemperature: number
  mood: string
  keyLightIntensity: number
}

export interface Environment {
  defaultSetting: string
  backgroundStyle: string
  timeOfDay: string
  presets: string[]
}

export interface Lora {
  modelName: string
  baseModel: string
  trainingImages: number
  weight: number
  triggerWord: string
  version: string
  status: 'Trained' | 'Training' | 'Queued' | 'Failed'
}

export interface MemoryEntry {
  id: string
  summary: string
  time: string
  application: string
}

export interface Memory {
  retention: number
  longTermFacts: string[]
  entries: MemoryEntry[]
}

export interface Character {
  id: string
  name: string
  tagline: string
  status: CharacterStatus
  portraitImage?: string
  gradientFrom: string
  gradientTo: string
  applications: string[]
  generationCount: number
  lastUsed: string
  createdAt: string
  owner: string
  tags: string[]
  appearance: Appearance
  personality: Personality
  voice: Voice
  wardrobe: Wardrobe
  camera: Camera
  lighting: Lighting
  environment: Environment
  lora: Lora
  memory: Memory
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
  const shuffled = [...arr].sort(() => rand() - 0.5)
  return shuffled.slice(0, count)
}

const names = [
  'Nova', 'Atlas', 'Iris', 'Sable', 'Orion', 'Wren', 'Halcyon', 'Vesper', 'Juno', 'Kestrel',
  'Marlowe', 'Sage', 'Zephyr', 'Indigo', 'Rune',
]
const roles = [
  'Support Guide', 'Sales Concierge', 'Onboarding Host', 'Brand Ambassador', 'Story Narrator',
  'Technical Mentor', 'Wellness Coach', 'Creative Partner', 'News Anchor', 'Community Host',
]
const gradientPairs = [
  ['#a78bfa', '#7c3aed'], ['#f0abfc', '#c026d3'], ['#93c5fd', '#2563eb'], ['#5eead4', '#0891b2'],
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'], ['#86efac', '#16a34a'], ['#c4b5fd', '#6d28d9'],
]
const appList = ['Prompt Studio', 'NexaPersona', 'Animovia', 'Private Platform']
const archetypes = ['The Sage', 'The Caregiver', 'The Explorer', 'The Creator', 'The Everyman', 'The Hero']
const traitPool = ['Empathetic', 'Witty', 'Direct', 'Patient', 'Curious', 'Reassuring', 'Playful', 'Precise', 'Warm', 'Analytical']
const valuePool = ['Honesty', 'Curiosity', 'Kindness', 'Craft', 'Clarity', 'Resilience']
const voiceProviders = ['ElevenLabs', 'PlayHT', 'Azure Neural', 'OpenAI Voice']
const accents = ['Neutral American', 'British RP', 'Australian', 'Neutral Canadian', 'Irish']
const outfitStyles = ['Minimal tailored', 'Streetwear', 'Business casual', 'Editorial avant-garde', 'Soft athleisure']
const palettePool = ['Ink navy', 'Warm sand', 'Charcoal', 'Blush', 'Sage green', 'Ivory', 'Deep plum']
const accessoryPool = ['Thin gold necklace', 'Round glasses', 'Leather satchel', 'Wristwatch', 'Silk scarf', 'Enamel pin']
const cameraAngles = ['Eye-level portrait', 'Three-quarter', 'Low-angle heroic', 'Over-the-shoulder', 'Dutch tilt']
const lenses = ['50mm f/1.4', '85mm f/1.8', '35mm f/2', '24mm wide']
const framings = ['Close-up', 'Medium shot', 'Full body', 'Wide establishing']
const lightingStyles = ['Soft studio softbox', 'Golden hour rim light', 'High-contrast rembrandt', 'Flat even light', 'Neon practical']
const moods = ['Warm & inviting', 'Cinematic & moody', 'Bright & optimistic', 'Cool & clinical']
const settings = ['Modern studio', 'Sunlit loft', 'Urban rooftop', 'Minimal cyclorama', 'Cozy library']
const backgroundStyles = ['Softly blurred bokeh', 'Solid seamless', 'Environmental detail', 'Gradient backdrop']
const timesOfDay = ['Golden hour', 'Midday', 'Blue hour', 'Studio (n/a)']
const baseModels = ['SDXL 1.0', 'Flux.1 Dev', 'SD 3.5 Large']
const loraStatuses: Lora['status'][] = ['Trained', 'Training', 'Queued', 'Trained', 'Trained']

function makeCharacter(i: number): Character {
  const rand = seededRandom(i * 17 + 3)
  const name = names[i % names.length]
  const role = pick(roles, rand)
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)
  const status: CharacterStatus = i === 0 ? 'Live' : pick(['Live', 'Live', 'Draft', 'Training', 'Archived'] as CharacterStatus[], rand)
  const genCount = Math.floor(rand() * 4200) + 12
  const daysAgo = Math.floor(rand() * 20)

  return {
    id: `char_${(i + 1).toString().padStart(3, '0')}`,
    name,
    tagline: role,
    status,
    gradientFrom,
    gradientTo,
    applications: pickMany(appList, Math.floor(rand() * 3) + 1, rand),
    generationCount: genCount,
    lastUsed: daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`,
    createdAt: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][Math.floor(rand() * 8)]} ${Math.floor(rand() * 27) + 1}, 2026`,
    owner: pick(['Jordan Lee', 'Amara Chen', 'Priya Nair', 'Emerson Sterling'], rand),
    tags: pickMany(['Support', 'Enterprise', 'Voice-enabled', 'Video-ready', 'Multilingual', 'Beta'], Math.floor(rand() * 3) + 1, rand),
    appearance: {
      age: `${Math.floor(rand() * 30) + 24}`,
      gender: pick(['Female', 'Male', 'Non-binary'], rand),
      ethnicity: pick(['Ambiguous / mixed', 'East Asian', 'South Asian', 'Black', 'White', 'Latine'], rand),
      bodyType: pick(['Slim', 'Athletic', 'Average', 'Curvy'], rand),
      height: pick(["5'4\"", "5'7\"", "5'10\"", "6'1\""], rand),
      hairColor: pick(['Jet black', 'Chestnut brown', 'Platinum blonde', 'Auburn', 'Silver'], rand),
      hairStyle: pick(['Long waves', 'Sleek bob', 'Cropped pixie', 'Shoulder-length straight', 'Curly afro'], rand),
      eyeColor: pick(['Deep brown', 'Hazel', 'Steel blue', 'Emerald green', 'Amber'], rand),
      skinTone: pick(['Porcelain', 'Warm olive', 'Deep espresso', 'Golden tan', 'Fair'], rand),
      distinguishingFeatures: pick(['Faint freckles across the nose', 'Small scar above left brow', 'Dimpled smile', 'Beauty mark near jaw', 'None specified'], rand),
    },
    personality: {
      archetype: pick(archetypes, rand),
      traits: pickMany(traitPool, 4, rand),
      tone: pick(['Warm and encouraging', 'Crisp and professional', 'Playful and energetic', 'Calm and grounded'], rand),
      values: pickMany(valuePool, 3, rand),
      quirks: pick(['Uses light humor to defuse tension', 'Always confirms understanding before moving on', 'Occasionally references pop culture', 'Speaks in short, confident sentences'], rand),
      backstory: `${name} was designed as PIP's ${role.toLowerCase()} — grounded in a clear point of view, trained to stay consistent across every touchpoint from chat to video.`,
      communicationStyle: pick(['Conversational, first-person', 'Structured, numbered guidance', 'Story-driven explanations', 'Concise, action-oriented'], rand),
    },
    voice: {
      provider: pick(voiceProviders, rand),
      voiceId: `voice_${Math.random().toString(36).slice(2, 8)}`,
      pitch: Math.round(rand() * 40 + 30),
      speed: Math.round(rand() * 40 + 30),
      stability: Math.round(rand() * 40 + 50),
      accent: pick(accents, rand),
      sampleLine: `Hi, I'm ${name} — I'll be your ${role.toLowerCase()} today. Let's get started.`,
    },
    wardrobe: {
      defaultOutfit: pick(['Charcoal knit blazer over white tee', 'Cream turtleneck with tailored trousers', 'Denim jacket over graphic tee', 'Structured shirt dress'], rand),
      style: pick(outfitStyles, rand),
      palette: pickMany(palettePool, 3, rand),
      accessories: pickMany(accessoryPool, 2, rand),
      variants: pickMany(['Studio formal', 'Casual weekend', 'Outdoor field', 'Evening event'], 3, rand),
    },
    camera: {
      defaultAngle: pick(cameraAngles, rand),
      lens: pick(lenses, rand),
      framing: pick(framings, rand),
      depthOfField: Math.round(rand() * 60 + 20),
      aspectRatio: pick(['1:1', '4:5', '16:9', '9:16'], rand),
    },
    lighting: {
      style: pick(lightingStyles, rand),
      colorTemperature: Math.round(rand() * 3000 + 3200),
      mood: pick(moods, rand),
      keyLightIntensity: Math.round(rand() * 50 + 40),
    },
    environment: {
      defaultSetting: pick(settings, rand),
      backgroundStyle: pick(backgroundStyles, rand),
      timeOfDay: pick(timesOfDay, rand),
      presets: pickMany(settings, 3, rand),
    },
    lora: {
      modelName: `${name.toLowerCase()}-identity-v${Math.floor(rand() * 3) + 1}`,
      baseModel: pick(baseModels, rand),
      trainingImages: Math.floor(rand() * 60) + 20,
      weight: Math.round((rand() * 0.5 + 0.6) * 100) / 100,
      triggerWord: `${name.toLowerCase()}dna`,
      version: `v${Math.floor(rand() * 3) + 1}.${Math.floor(rand() * 9)}`,
      status: pick(loraStatuses, rand),
    },
    memory: {
      retention: Math.round(rand() * 40 + 55),
      longTermFacts: [
        `Prefers to be introduced by full name on first contact`,
        `Remembers user's preferred name across sessions`,
        `Escalates billing questions to a human after 2 failed attempts`,
      ],
      entries: Array.from({ length: 4 }, (_, j) => ({
        id: `mem_${i}_${j}`,
        summary: pick(
          [
            'Resolved a billing dispute for a returning customer',
            'Introduced itself to a new user in NexaPersona',
            'Recorded a voice line for the Animovia intro sequence',
            'Updated tone guidance after a support escalation',
            'Learned a new product name from Prompt Studio context',
          ],
          rand
        ),
        time: `${Math.floor(rand() * 14) + 1}d ago`,
        application: pick(appList, rand),
      })),
    },
  }
}

export const characters: Character[] = Array.from({ length: 15 }, (_, i) => makeCharacter(i))

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id)
}

export function addCharacter(character: Character) {
  characters.unshift(character)
}

export function updateCharacter(id: string, patch: Partial<Character>) {
  const index = characters.findIndex((c) => c.id === id)
  if (index !== -1) characters[index] = { ...characters[index], ...patch }
}

export function buildDefaultDna(): Omit<
  Character,
  'id' | 'name' | 'tagline' | 'status' | 'gradientFrom' | 'gradientTo' | 'applications' | 'generationCount' | 'lastUsed' | 'createdAt' | 'owner' | 'tags'
> {
  return {
    appearance: {
      age: '28',
      gender: 'Non-binary',
      ethnicity: 'Ambiguous / mixed',
      bodyType: 'Average',
      height: "5'7\"",
      hairColor: 'Chestnut brown',
      hairStyle: 'Shoulder-length straight',
      eyeColor: 'Hazel',
      skinTone: 'Warm olive',
      distinguishingFeatures: 'None specified',
    },
    personality: {
      archetype: 'The Everyman',
      traits: ['Warm', 'Patient', 'Curious', 'Direct'],
      tone: 'Warm and encouraging',
      values: ['Clarity', 'Kindness'],
      quirks: 'Always confirms understanding before moving on',
      backstory: 'A newly designed PIP character, ready to be shaped for its role.',
      communicationStyle: 'Conversational, first-person',
    },
    voice: {
      provider: 'ElevenLabs',
      voiceId: `voice_${Math.random().toString(36).slice(2, 8)}`,
      pitch: 50,
      speed: 50,
      stability: 70,
      accent: 'Neutral American',
      sampleLine: 'Hi, thanks for stopping by — how can I help today?',
    },
    wardrobe: {
      defaultOutfit: 'Charcoal knit blazer over white tee',
      style: 'Minimal tailored',
      palette: ['Ink navy', 'Ivory'],
      accessories: ['Wristwatch'],
      variants: ['Studio formal', 'Casual weekend'],
    },
    camera: {
      defaultAngle: 'Eye-level portrait',
      lens: '50mm f/1.4',
      framing: 'Medium shot',
      depthOfField: 45,
      aspectRatio: '4:5',
    },
    lighting: {
      style: 'Soft studio softbox',
      colorTemperature: 5200,
      mood: 'Warm & inviting',
      keyLightIntensity: 60,
    },
    environment: {
      defaultSetting: 'Modern studio',
      backgroundStyle: 'Softly blurred bokeh',
      timeOfDay: 'Studio (n/a)',
      presets: ['Modern studio', 'Sunlit loft'],
    },
    lora: {
      modelName: 'new-character-identity-v1',
      baseModel: 'SDXL 1.0',
      trainingImages: 0,
      weight: 0.85,
      triggerWord: 'newchardna',
      version: 'v0.1',
      status: 'Queued',
    },
    memory: {
      retention: 65,
      longTermFacts: ['Prefers to be introduced by full name on first contact'],
      entries: [],
    },
  }
}
