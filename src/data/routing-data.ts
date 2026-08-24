export const applications = ['Prompt Studio', 'NexaPersona', 'Animovia', 'Private Platform'] as const
export type Application = (typeof applications)[number]

export const requestTypes = [
  'Image',
  'Video',
  'Illustration',
  'Story',
  'Voice',
  'Talking Head',
  'Product Placement',
  'Social Media',
] as const
export type RequestType = (typeof requestTypes)[number]

export const promptLibraries = ['Core Library', 'Enterprise Library', 'Beta Library', 'Character Library'] as const
export const promptBuilders = ['Structured Builder', 'Freeform Builder', 'Character-Aware Builder', 'Multi-Modal Builder'] as const

export const workflows = [
  'Image Workflow',
  'Video Workflow',
  'Illustration Workflow',
  'Story Workflow',
  'Voice Workflow',
  'Talking Head Workflow',
  'Product Placement Workflow',
  'Social Media Workflow',
] as const

export const providerModels: Record<string, string[]> = {
  Anthropic: ['Claude Opus 5', 'Claude Sonnet 5', 'Claude Haiku 4.5'],
  OpenAI: ['GPT-4o', 'GPT-4o mini', 'DALL-E 3'],
  Google: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'Veo 3'],
  'Black Forest Labs': ['FLUX.1 Pro', 'FLUX.1 Dev'],
  'Stability AI': ['Stable Diffusion 3.5'],
  Runway: ['Gen-3 Alpha', 'Gen-3 Turbo'],
  'Kling AI': ['Kling 1.5'],
  ElevenLabs: ['Multilingual v2', 'Turbo v2.5'],
  PlayHT: ['PlayHT 2.0'],
}
export const providers = Object.keys(providerModels)

export interface RoutingRule {
  id: string
  name: string
  enabled: boolean
  priority: number
  application: Application
  requestType: RequestType
  promptLibrary: string
  workflow: string
  promptBuilder: string
  provider: string
  model: string
  createdAt: string
  lastModified: string
  matchCount: number
}

export const routingRules: RoutingRule[] = [
  {
    id: 'rule_001',
    name: 'NexaPersona → Image generation',
    enabled: true,
    priority: 1,
    application: 'NexaPersona',
    requestType: 'Image',
    promptLibrary: 'Character Library',
    workflow: 'Image Workflow',
    promptBuilder: 'Character-Aware Builder',
    provider: 'Black Forest Labs',
    model: 'FLUX.1 Pro',
    createdAt: 'Jun 12, 2026',
    lastModified: '3d ago',
    matchCount: 1842,
  },
  {
    id: 'rule_002',
    name: 'NexaPersona → Video generation',
    enabled: true,
    priority: 2,
    application: 'NexaPersona',
    requestType: 'Video',
    promptLibrary: 'Character Library',
    workflow: 'Video Workflow',
    promptBuilder: 'Character-Aware Builder',
    provider: 'Google',
    model: 'Veo 3',
    createdAt: 'Jun 12, 2026',
    lastModified: '3d ago',
    matchCount: 964,
  },
  {
    id: 'rule_003',
    name: 'Animovia → Story generation',
    enabled: true,
    priority: 3,
    application: 'Animovia',
    requestType: 'Story',
    promptLibrary: 'Core Library',
    workflow: 'Story Workflow',
    promptBuilder: 'Structured Builder',
    provider: 'Anthropic',
    model: 'Claude Opus 5',
    createdAt: 'Jun 15, 2026',
    lastModified: '1w ago',
    matchCount: 573,
  },
  {
    id: 'rule_004',
    name: 'Animovia → Illustration generation',
    enabled: true,
    priority: 4,
    application: 'Animovia',
    requestType: 'Illustration',
    promptLibrary: 'Enterprise Library',
    workflow: 'Illustration Workflow',
    promptBuilder: 'Multi-Modal Builder',
    provider: 'Stability AI',
    model: 'Stable Diffusion 3.5',
    createdAt: 'Jun 15, 2026',
    lastModified: '1w ago',
    matchCount: 311,
  },
  {
    id: 'rule_005',
    name: 'Prompt Studio → Voice generation',
    enabled: true,
    priority: 5,
    application: 'Prompt Studio',
    requestType: 'Voice',
    promptLibrary: 'Core Library',
    workflow: 'Voice Workflow',
    promptBuilder: 'Freeform Builder',
    provider: 'ElevenLabs',
    model: 'Multilingual v2',
    createdAt: 'Jul 2, 2026',
    lastModified: '2w ago',
    matchCount: 208,
  },
  {
    id: 'rule_006',
    name: 'Private Platform → Social media (draft)',
    enabled: false,
    priority: 6,
    application: 'Private Platform',
    requestType: 'Social Media',
    promptLibrary: 'Beta Library',
    workflow: 'Social Media Workflow',
    promptBuilder: 'Freeform Builder',
    provider: 'OpenAI',
    model: 'GPT-4o',
    createdAt: 'Aug 10, 2026',
    lastModified: '2d ago',
    matchCount: 0,
  },
]

export function addRoutingRule(rule: RoutingRule) {
  routingRules.push(rule)
}
export function updateRoutingRule(id: string, patch: Partial<RoutingRule>) {
  const i = routingRules.findIndex((r) => r.id === id)
  if (i !== -1) routingRules[i] = { ...routingRules[i], ...patch }
}
export function removeRoutingRule(id: string) {
  const i = routingRules.findIndex((r) => r.id === id)
  if (i !== -1) routingRules.splice(i, 1)
}

export function resolveRoute(application: Application, requestType: RequestType): RoutingRule | null {
  const candidates = routingRules.filter((r) => r.enabled && r.application === application && r.requestType === requestType)
  if (candidates.length === 0) return null
  return [...candidates].sort((a, b) => a.priority - b.priority)[0]
}

export type ExecutionStatus = 'Routed' | 'Fallback' | 'Failed'

export interface RoutingExecution {
  id: string
  timestamp: string
  application: Application
  requestType: RequestType
  matchedRule: string | null
  workflow: string | null
  provider: string | null
  model: string | null
  status: ExecutionStatus
  latencyMs: number
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

export const executionHistory: RoutingExecution[] = Array.from({ length: 40 }, (_, i) => {
  const rand = seededRandom(i * 13 + 5)
  const application = pick(applications, rand)
  const requestType = pick(requestTypes, rand)
  const rule = resolveRoute(application, requestType)
  const failed = rand() > 0.93
  const daysAgo = Math.floor(rand() * 6)
  const hh = Math.floor(rand() * 24)
  const mm = Math.floor(rand() * 60)

  return {
    id: `exec_${(i + 1).toString().padStart(3, '0')}`,
    timestamp: daysAgo === 0 ? `Today, ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}` : `${daysAgo}d ago, ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
    application,
    requestType,
    matchedRule: failed ? null : (rule?.name ?? null),
    workflow: failed ? null : (rule?.workflow ?? null),
    provider: failed ? null : (rule?.provider ?? null),
    model: failed ? null : (rule?.model ?? null),
    status: (failed ? 'Failed' : rule ? 'Routed' : 'Fallback') as ExecutionStatus,
    latencyMs: Math.floor(rand() * 180) + 40,
  }
}).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
