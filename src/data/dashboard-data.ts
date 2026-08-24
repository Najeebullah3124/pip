export const promptUsageSeries = [
  { date: 'Aug 1', prompts: 210 },
  { date: 'Aug 4', prompts: 268 },
  { date: 'Aug 7', prompts: 241 },
  { date: 'Aug 10', prompts: 312 },
  { date: 'Aug 13', prompts: 356 },
  { date: 'Aug 16', prompts: 329 },
  { date: 'Aug 19', prompts: 402 },
  { date: 'Aug 22', prompts: 388 },
  { date: 'Aug 25', prompts: 447 },
  { date: 'Aug 28', prompts: 431 },
  { date: 'Aug 31', prompts: 486 },
]

export const generationVolumeSeries = [
  { date: 'Mon', generations: 142 },
  { date: 'Tue', generations: 168 },
  { date: 'Wed', generations: 155 },
  { date: 'Thu', generations: 201 },
  { date: 'Fri', generations: 224 },
  { date: 'Sat', generations: 118 },
  { date: 'Sun', generations: 96 },
]

export const providerUsage = [
  { name: 'Anthropic Claude', value: 48, color: 'var(--chart-cat-1)' },
  { name: 'OpenAI GPT', value: 24, color: 'var(--chart-cat-2)' },
  { name: 'Google Gemini', value: 14, color: 'var(--chart-cat-3)' },
  { name: 'Mistral', value: 9, color: 'var(--chart-cat-4)' },
  { name: 'Local / self-hosted', value: 5, color: 'var(--chart-cat-5)' },
]

export const applicationUsage = [
  { name: 'Prompt Studio', value: 39, color: 'var(--chart-cat-1)' },
  { name: 'Characters', value: 22, color: 'var(--chart-cat-2)' },
  { name: 'NexaPersona', value: 18, color: 'var(--chart-cat-3)' },
  { name: 'Animovia', value: 14, color: 'var(--chart-cat-4)' },
  { name: 'Private Platform', value: 7, color: 'var(--chart-cat-5)' },
]

export interface RecentGeneration {
  id: string
  title: string
  type: 'Image' | 'Video' | 'Text' | 'Audio'
  source: string
  time: string
  thumbnailFrom: string
  thumbnailTo: string
}

export const recentGenerations: RecentGeneration[] = [
  { id: 'g1', title: 'Nova — hero portrait', type: 'Image', source: 'NexaPersona', time: '6m ago', thumbnailFrom: '#a78bfa', thumbnailTo: '#7c3aed' },
  { id: 'g2', title: 'Product launch teaser', type: 'Video', source: 'Animovia', time: '22m ago', thumbnailFrom: '#f0abfc', thumbnailTo: '#a78bfa' },
  { id: 'g3', title: 'Support macro — refunds', type: 'Text', source: 'Prompt Studio', time: '41m ago', thumbnailFrom: '#93c5fd', thumbnailTo: '#6366f1' },
  { id: 'g4', title: 'Nova — welcome VO', type: 'Audio', source: 'NexaPersona', time: '1h ago', thumbnailFrom: '#5eead4', thumbnailTo: '#0ea5e9' },
  { id: 'g5', title: 'Holiday campaign clip', type: 'Video', source: 'Animovia', time: '2h ago', thumbnailFrom: '#fda4af', thumbnailTo: '#f472b6' },
  { id: 'g6', title: 'Onboarding illustration', type: 'Image', source: 'Media Library', time: '3h ago', thumbnailFrom: '#fde68a', thumbnailTo: '#f59e0b' },
]

export interface ApiActivityEntry {
  id: string
  endpoint: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  status: number
  latencyMs: number
  time: string
  actor: string
}

export const apiActivity: ApiActivityEntry[] = [
  { id: 'a1', endpoint: '/v1/prompts/run', method: 'POST', status: 200, latencyMs: 842, time: '1m ago', actor: 'Prompt Studio' },
  { id: 'a2', endpoint: '/v1/characters/nova', method: 'GET', status: 200, latencyMs: 118, time: '4m ago', actor: 'NexaPersona' },
  { id: 'a3', endpoint: '/v1/engines/gpt-4o/health', method: 'GET', status: 200, latencyMs: 63, time: '9m ago', actor: 'System' },
  { id: 'a4', endpoint: '/v1/media/render', method: 'POST', status: 202, latencyMs: 1240, time: '15m ago', actor: 'Animovia' },
  { id: 'a5', endpoint: '/v1/prompts/eval', method: 'POST', status: 500, latencyMs: 2310, time: '27m ago', actor: 'Prompt Studio' },
  { id: 'a6', endpoint: '/v1/keys/rotate', method: 'PATCH', status: 200, latencyMs: 204, time: '52m ago', actor: 'Administration' },
]

export const activityFeed = [
  { id: 'f1', user: 'Jordan Lee', action: 'published a new character', target: 'Nova — Support Guide', time: '12m ago' },
  { id: 'f2', user: 'Amara Chen', action: 'ran an eval on', target: 'Support Triage v3', time: '48m ago' },
  { id: 'f3', user: 'You', action: 'created a new project', target: 'Holiday Campaign', time: '2h ago' },
  { id: 'f4', user: 'Priya Nair', action: 'added 3 components to', target: 'Onboarding Kit', time: 'Yesterday' },
  { id: 'f5', user: 'System', action: 'rotated API credentials for', target: 'Google Gemini', time: 'Yesterday' },
]
