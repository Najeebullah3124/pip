import { Image, Video, Mic, MessageSquareText, type LucideIcon } from 'lucide-react'

export type EngineCategory = 'Image' | 'Video' | 'Voice' | 'Language'
export type ConnectionStatus = 'Connected' | 'Attention needed' | 'Disconnected'
export type ApiStatus = 'Operational' | 'Degraded' | 'Down'

export const categoryMeta: Record<EngineCategory, { icon: LucideIcon; color: string }> = {
  Image: { icon: Image, color: 'var(--chart-cat-1)' },
  Video: { icon: Video, color: 'var(--chart-cat-2)' },
  Voice: { icon: Mic, color: 'var(--chart-cat-3)' },
  Language: { icon: MessageSquareText, color: 'var(--chart-cat-4)' },
}
export const categories: EngineCategory[] = ['Image', 'Video', 'Voice', 'Language']

export interface EngineModel {
  id: string
  name: string
  description: string
  contextWindow?: string
}

export interface ParamDef {
  key: string
  label: string
  description: string
  type: 'slider' | 'select'
  value: number | string
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: string[]
}

export interface RateLimits {
  requestsPerMinute: number
  concurrentRequests: number
  monthlyQuota: string
}

export interface AiEngine {
  id: string
  name: string
  vendor: string
  category: EngineCategory
  color: string
  connectionStatus: ConnectionStatus
  apiStatus: ApiStatus
  enabled: boolean
  apiKeyLast4: string
  baseUrl: string
  models: EngineModel[]
  defaultModelId: string
  usagePercent: number
  monthlyUsage: string
  lastTested: string
  createdAt: string
  parameters: ParamDef[]
  rateLimits: RateLimits
  docsUrl: string
}

function maskKey(last4: string) {
  return `pip_live_${'•'.repeat(20)}${last4}`
}

export function maskedApiKey(engine: AiEngine) {
  return maskKey(engine.apiKeyLast4)
}

export const engines: AiEngine[] = [
  {
    id: 'eng_flux',
    name: 'FLUX',
    vendor: 'Black Forest Labs',
    category: 'Image',
    color: '#7c3aed',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: '9a2c',
    baseUrl: 'https://api.bfl.ai/v1',
    models: [
      { id: 'flux-1-pro', name: 'FLUX.1 Pro', description: 'Highest fidelity, best for hero shots and campaign imagery.' },
      { id: 'flux-1-dev', name: 'FLUX.1 Dev', description: 'Faster, cost-efficient variant for iteration and drafts.' },
    ],
    defaultModelId: 'flux-1-pro',
    usagePercent: 34,
    monthlyUsage: '$2,180',
    lastTested: '2h ago',
    createdAt: 'Feb 3, 2026',
    parameters: [
      { key: 'steps', label: 'Inference steps', description: 'Higher values improve detail at the cost of latency.', type: 'slider', value: 32, min: 10, max: 50, step: 1 },
      { key: 'guidance', label: 'Guidance scale', description: 'How strictly the model follows the prompt.', type: 'slider', value: 65, min: 0, max: 100, step: 1 },
      { key: 'resolution', label: 'Default resolution', description: 'Output image dimensions.', type: 'select', value: '1024x1024', options: ['512x512', '1024x1024', '1536x1536', '2048x2048'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a generation.', type: 'slider', value: 45, min: 10, max: 120, step: 5, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 60, concurrentRequests: 8, monthlyQuota: '50,000 generations' },
    docsUrl: 'https://docs.bfl.ai',
  },
  {
    id: 'eng_sd',
    name: 'Stable Diffusion',
    vendor: 'Stability AI',
    category: 'Image',
    color: '#0ea5e9',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: '6f10',
    baseUrl: 'https://api.stability.ai/v2',
    models: [
      { id: 'sd-3.5-large', name: 'Stable Diffusion 3.5 Large', description: 'High-fidelity general-purpose image generation.' },
      { id: 'sd-3.5-turbo', name: 'Stable Diffusion 3.5 Turbo', description: 'Low-latency variant for rapid iteration.' },
    ],
    defaultModelId: 'sd-3.5-large',
    usagePercent: 18,
    monthlyUsage: '$864',
    lastTested: '5h ago',
    createdAt: 'Feb 3, 2026',
    parameters: [
      { key: 'steps', label: 'Inference steps', description: 'Higher values improve detail at the cost of latency.', type: 'slider', value: 28, min: 10, max: 50, step: 1 },
      { key: 'cfg', label: 'CFG scale', description: 'Classifier-free guidance strength.', type: 'slider', value: 50, min: 0, max: 100, step: 1 },
      { key: 'resolution', label: 'Default resolution', description: 'Output image dimensions.', type: 'select', value: '1024x1024', options: ['512x512', '1024x1024', '1536x1536'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a generation.', type: 'slider', value: 40, min: 10, max: 120, step: 5, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 45, concurrentRequests: 6, monthlyQuota: '30,000 generations' },
    docsUrl: 'https://platform.stability.ai/docs',
  },
  {
    id: 'eng_veo',
    name: 'Google Veo',
    vendor: 'Google DeepMind',
    category: 'Video',
    color: '#4285f4',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: '33be',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    models: [
      { id: 'veo-3', name: 'Veo 3', description: 'Cinematic text-to-video with native audio generation.' },
      { id: 'veo-2', name: 'Veo 2', description: 'Prior-generation model, lower cost per second.' },
    ],
    defaultModelId: 'veo-3',
    usagePercent: 41,
    monthlyUsage: '$3,420',
    lastTested: '1h ago',
    createdAt: 'Mar 18, 2026',
    parameters: [
      { key: 'duration', label: 'Default duration', description: 'Length of generated clips.', type: 'select', value: '8s', options: ['4s', '8s', '16s'] },
      { key: 'resolution', label: 'Default resolution', description: 'Output video resolution.', type: 'select', value: '1080p', options: ['720p', '1080p', '4K'] },
      { key: 'fps', label: 'Frame rate', description: 'Frames per second for output video.', type: 'select', value: '24', options: ['24', '30', '60'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a render.', type: 'slider', value: 180, min: 30, max: 300, step: 10, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 20, concurrentRequests: 3, monthlyQuota: '4,000 render minutes' },
    docsUrl: 'https://ai.google.dev/veo',
  },
  {
    id: 'eng_kling',
    name: 'Kling',
    vendor: 'Kling AI',
    category: 'Video',
    color: '#f97316',
    connectionStatus: 'Attention needed',
    apiStatus: 'Degraded',
    enabled: true,
    apiKeyLast4: 'a71d',
    baseUrl: 'https://api.klingai.com/v1',
    models: [
      { id: 'kling-1.5', name: 'Kling 1.5', description: 'High-motion-fidelity video generation.' },
      { id: 'kling-1.0', name: 'Kling 1.0', description: 'Original release, stable fallback.' },
    ],
    defaultModelId: 'kling-1.5',
    usagePercent: 12,
    monthlyUsage: '$690',
    lastTested: '1d ago',
    createdAt: 'Apr 22, 2026',
    parameters: [
      { key: 'duration', label: 'Default duration', description: 'Length of generated clips.', type: 'select', value: '5s', options: ['5s', '10s'] },
      { key: 'resolution', label: 'Default resolution', description: 'Output video resolution.', type: 'select', value: '1080p', options: ['720p', '1080p'] },
      { key: 'fps', label: 'Frame rate', description: 'Frames per second for output video.', type: 'select', value: '30', options: ['24', '30'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a render.', type: 'slider', value: 200, min: 30, max: 300, step: 10, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 15, concurrentRequests: 2, monthlyQuota: '2,000 render minutes' },
    docsUrl: 'https://klingai.com/docs',
  },
  {
    id: 'eng_runway',
    name: 'Runway',
    vendor: 'Runway AI',
    category: 'Video',
    color: '#0f172a',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: 'e582',
    baseUrl: 'https://api.runwayml.com/v1',
    models: [
      { id: 'gen-3-alpha', name: 'Gen-3 Alpha', description: 'Flagship model for cinematic motion and control.' },
      { id: 'gen-3-turbo', name: 'Gen-3 Turbo', description: 'Faster, lower-cost generation for iteration.' },
    ],
    defaultModelId: 'gen-3-alpha',
    usagePercent: 22,
    monthlyUsage: '$1,540',
    lastTested: '3h ago',
    createdAt: 'Mar 30, 2026',
    parameters: [
      { key: 'duration', label: 'Default duration', description: 'Length of generated clips.', type: 'select', value: '10s', options: ['5s', '10s'] },
      { key: 'resolution', label: 'Default resolution', description: 'Output video resolution.', type: 'select', value: '1080p', options: ['720p', '1080p'] },
      { key: 'motion', label: 'Motion strength', description: 'Amount of camera and subject motion.', type: 'slider', value: 55, min: 0, max: 100, step: 1 },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a render.', type: 'slider', value: 150, min: 30, max: 300, step: 10, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 18, concurrentRequests: 3, monthlyQuota: '3,000 render minutes' },
    docsUrl: 'https://docs.runwayml.com',
  },
  {
    id: 'eng_elevenlabs',
    name: 'ElevenLabs',
    vendor: 'ElevenLabs Inc.',
    category: 'Voice',
    color: '#0b0b0f',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: 'c418',
    baseUrl: 'https://api.elevenlabs.io/v1',
    models: [
      { id: 'multilingual-v2', name: 'Multilingual v2', description: 'High-fidelity narration across 29 languages.' },
      { id: 'turbo-v2.5', name: 'Turbo v2.5', description: 'Low-latency variant for real-time use cases.' },
    ],
    defaultModelId: 'multilingual-v2',
    usagePercent: 27,
    monthlyUsage: '$412',
    lastTested: '4h ago',
    createdAt: 'Jan 28, 2026',
    parameters: [
      { key: 'stability', label: 'Stability', description: 'Higher values produce more consistent, less expressive delivery.', type: 'slider', value: 60, min: 0, max: 100, step: 1 },
      { key: 'similarity', label: 'Similarity boost', description: 'How closely output matches the reference voice.', type: 'slider', value: 75, min: 0, max: 100, step: 1 },
      { key: 'speed', label: 'Speaking rate', description: 'Playback speed relative to natural pace.', type: 'slider', value: 50, min: 0, max: 100, step: 1 },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for audio synthesis.', type: 'slider', value: 30, min: 10, max: 90, step: 5, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 90, concurrentRequests: 10, monthlyQuota: '2,000,000 characters' },
    docsUrl: 'https://elevenlabs.io/docs',
  },
  {
    id: 'eng_gpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    category: 'Language',
    color: '#10a37f',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: 'a91c',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Flagship multimodal model.', contextWindow: '128K tokens' },
      { id: 'gpt-4o-mini', name: 'GPT-4o mini', description: 'Lower-cost variant for high-volume tasks.', contextWindow: '128K tokens' },
    ],
    defaultModelId: 'gpt-4o',
    usagePercent: 24,
    monthlyUsage: '$2,104',
    lastTested: '1h ago',
    createdAt: 'Jan 12, 2026',
    parameters: [
      { key: 'temperature', label: 'Temperature', description: 'Higher values increase output randomness.', type: 'slider', value: 70, min: 0, max: 100, step: 1 },
      { key: 'topP', label: 'Top-p', description: 'Nucleus sampling threshold.', type: 'slider', value: 90, min: 0, max: 100, step: 1 },
      { key: 'maxTokens', label: 'Max output tokens', description: 'Upper bound on response length.', type: 'select', value: '2048', options: ['512', '1024', '2048', '4096', '8192'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a completion.', type: 'slider', value: 30, min: 5, max: 90, step: 5, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 500, concurrentRequests: 40, monthlyQuota: '50,000,000 tokens' },
    docsUrl: 'https://platform.openai.com/docs',
  },
  {
    id: 'eng_claude',
    name: 'Claude',
    vendor: 'Anthropic',
    category: 'Language',
    color: '#d97757',
    connectionStatus: 'Connected',
    apiStatus: 'Operational',
    enabled: true,
    apiKeyLast4: '7f2a',
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-opus-5', name: 'Claude Opus 5', description: 'Highest-capability model for complex reasoning.', contextWindow: '500K tokens' },
      { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', description: 'Balanced performance and cost for everyday tasks.', contextWindow: '500K tokens' },
      { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', description: 'Fastest, most cost-efficient model.', contextWindow: '200K tokens' },
    ],
    defaultModelId: 'claude-opus-5',
    usagePercent: 48,
    monthlyUsage: '$4,218',
    lastTested: '15m ago',
    createdAt: 'Jan 12, 2026',
    parameters: [
      { key: 'temperature', label: 'Temperature', description: 'Higher values increase output randomness.', type: 'slider', value: 65, min: 0, max: 100, step: 1 },
      { key: 'topP', label: 'Top-p', description: 'Nucleus sampling threshold.', type: 'slider', value: 90, min: 0, max: 100, step: 1 },
      { key: 'maxTokens', label: 'Max output tokens', description: 'Upper bound on response length.', type: 'select', value: '4096', options: ['512', '1024', '2048', '4096', '8192'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a completion.', type: 'slider', value: 30, min: 5, max: 90, step: 5, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 1000, concurrentRequests: 80, monthlyQuota: '100,000,000 tokens' },
    docsUrl: 'https://docs.anthropic.com',
  },
  {
    id: 'eng_gemini',
    name: 'Gemini',
    vendor: 'Google',
    category: 'Language',
    color: '#4285f4',
    connectionStatus: 'Disconnected',
    apiStatus: 'Down',
    enabled: false,
    apiKeyLast4: '10dd',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'High-capability multimodal reasoning model.', contextWindow: '2M tokens' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Low-latency variant for high-throughput tasks.', contextWindow: '1M tokens' },
    ],
    defaultModelId: 'gemini-2.5-pro',
    usagePercent: 3,
    monthlyUsage: '$32',
    lastTested: '6d ago',
    createdAt: 'May 6, 2026',
    parameters: [
      { key: 'temperature', label: 'Temperature', description: 'Higher values increase output randomness.', type: 'slider', value: 70, min: 0, max: 100, step: 1 },
      { key: 'topP', label: 'Top-p', description: 'Nucleus sampling threshold.', type: 'slider', value: 90, min: 0, max: 100, step: 1 },
      { key: 'maxTokens', label: 'Max output tokens', description: 'Upper bound on response length.', type: 'select', value: '2048', options: ['512', '1024', '2048', '4096', '8192'] },
      { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a completion.', type: 'slider', value: 30, min: 5, max: 90, step: 5, unit: 's' },
    ],
    rateLimits: { requestsPerMinute: 300, concurrentRequests: 20, monthlyQuota: '20,000,000 tokens' },
    docsUrl: 'https://ai.google.dev/docs',
  },
]

export function getEngine(id: string): AiEngine | undefined {
  return engines.find((e) => e.id === id)
}
export function updateEngine(id: string, patch: Partial<AiEngine>) {
  const i = engines.findIndex((e) => e.id === id)
  if (i !== -1) engines[i] = { ...engines[i], ...patch }
}
export function addEngine(engine: AiEngine) {
  engines.push(engine)
}
export function removeEngine(id: string) {
  const i = engines.findIndex((e) => e.id === id)
  if (i !== -1) engines.splice(i, 1)
}
