import type { ComponentType, SVGProps } from 'react'
import { InstagramGlyph, FacebookGlyph, TikTokGlyph, YoutubeGlyph, LinkedinGlyph, XGlyph } from '@/components/nexapersona/platform-icons'
import { characters } from './character-data'

export type Platform = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'X'

export interface PlatformContent {
  caption: string
  title: string
  hashtags: string[]
  seoKeywords: string[]
  cta: string
}

export interface SocialPost {
  id: string
  topic: string
  tone: string
  characterId: string | null
  platforms: Platform[]
  content: Partial<Record<Platform, PlatformContent>>
  gradientFrom: string
  gradientTo: string
  createdAt: string
}

export const platforms: Platform[] = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'X']

export const platformMeta: Record<Platform, { icon: ComponentType<SVGProps<SVGSVGElement>>; color: string; handleFallback: string; mediaAspect: 'square' | 'portrait' | 'landscape' }> = {
  Instagram: { icon: InstagramGlyph, color: '#d6249f', handleFallback: 'yourbrand', mediaAspect: 'square' },
  Facebook: { icon: FacebookGlyph, color: '#1877f2', handleFallback: 'Your Brand', mediaAspect: 'landscape' },
  TikTok: { icon: TikTokGlyph, color: '#010101', handleFallback: 'yourbrand', mediaAspect: 'portrait' },
  YouTube: { icon: YoutubeGlyph, color: '#ff0000', handleFallback: 'Your Brand', mediaAspect: 'landscape' },
  LinkedIn: { icon: LinkedinGlyph, color: '#0a66c2', handleFallback: 'Your Brand', mediaAspect: 'landscape' },
  X: { icon: XGlyph, color: '#000000', handleFallback: 'yourbrand', mediaAspect: 'landscape' },
}

const toneOpeners: Record<string, string[]> = {
  'Playful & energetic': ['Okay this is HUGE 🎉', "You're going to want to see this ✨", 'Drop everything —'],
  'Warm & encouraging': ["We're so excited to share this with you.", 'A little something we made with you in mind.', "Here's to the next step, together."],
  'Crisp & professional': ['Introducing our latest update.', 'Here is what changed.', "We're announcing something new."],
  'Bold & confident': ['This changes everything.', 'No more settling.', "We didn't hold back on this one."],
}

const platformHashtagPool: Record<Platform, string[]> = {
  Instagram: ['reels', 'instagood', 'newdrop', 'aesthetic', 'shopsmall', 'trending'],
  Facebook: ['community', 'newpost', 'shopnow'],
  TikTok: ['fyp', 'foryoupage', 'viral', 'tiktokmademebuyit', 'trending'],
  YouTube: ['newvideo', 'subscribe', 'youtubers'],
  LinkedIn: ['leadership', 'innovation', 'growth'],
  X: ['launch', 'news'],
}

function slugTags(topic: string, max: number): string[] {
  return topic
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ''))
    .filter((w) => w.length > 2)
    .slice(0, max)
    .map((w) => w[0].toUpperCase() + w.slice(1))
}

function titleCase(topic: string): string {
  return topic
    .split(' ')
    .map((w) => (w.length > 3 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

export function generatePlatformContent(topic: string, tone: string, characterName: string | undefined, platform: Platform, ctaText: string): PlatformContent {
  const opener = toneOpeners[tone]?.[topic.length % (toneOpeners[tone]?.length ?? 1)] ?? 'Here is something new.'
  const voice = characterName ? ` — voiced by ${characterName}` : ''
  const topicTags = slugTags(topic, 3)
  const cta = ctaText.trim() || 'Learn more'

  switch (platform) {
    case 'Instagram':
      return {
        title: titleCase(topic),
        caption: `${opener}\n\n${titleCase(topic)}${voice}. Swipe through to see the full story and let us know what you think in the comments 👇`,
        hashtags: [...topicTags, ...platformHashtagPool.Instagram].slice(0, 12).map((t) => `#${t}`),
        seoKeywords: [topic.toLowerCase(), `${topic.toLowerCase()} ideas`, `best ${topic.toLowerCase()}`, 'social content'],
        cta: `${cta} — tap the link in bio`,
      }
    case 'Facebook':
      return {
        title: titleCase(topic),
        caption: `${opener}\n\n${titleCase(topic)}${voice}. We put a lot of thought into this one and we'd love to hear what you think — drop a comment below or share with someone who'd love it.`,
        hashtags: [...topicTags.slice(0, 1), ...platformHashtagPool.Facebook].slice(0, 5).map((t) => `#${t}`),
        seoKeywords: [topic.toLowerCase(), `${topic.toLowerCase()} community`, 'brand update'],
        cta,
      }
    case 'TikTok':
      return {
        title: `${titleCase(topic)} 👀`,
        caption: `${opener} ${titleCase(topic)}${voice} 🔥 wait for it...`,
        hashtags: [...topicTags, ...platformHashtagPool.TikTok].slice(0, 8).map((t) => `#${t}`),
        seoKeywords: [topic.toLowerCase(), `${topic.toLowerCase()} trend`, 'short form video'],
        cta: `${cta} — link in bio`,
      }
    case 'YouTube':
      return {
        title: `${titleCase(topic)} — Everything You Need to Know`,
        caption: `In this video we break down ${topic.toLowerCase()}${voice}. Timestamps below, and make sure to subscribe for the full series on this topic.\n\n0:00 Intro\n0:45 Overview\n2:10 Deep dive`,
        hashtags: [...topicTags.slice(0, 2), ...platformHashtagPool.YouTube].slice(0, 5).map((t) => `#${t}`),
        seoKeywords: [topic.toLowerCase(), `${topic.toLowerCase()} tutorial`, `${topic.toLowerCase()} explained`, 'how to', 'guide'],
        cta: `${cta} — subscribe for more`,
      }
    case 'LinkedIn':
      return {
        title: titleCase(topic),
        caption: `${opener}\n\nWe've been working on ${topic.toLowerCase()}${voice}, and wanted to share what we learned along the way. Curious how other teams are approaching this — what's worked for you?`,
        hashtags: [...topicTags.slice(0, 2), ...platformHashtagPool.LinkedIn].slice(0, 5).map((t) => `#${t}`),
        seoKeywords: [topic.toLowerCase(), `${topic.toLowerCase()} strategy`, 'industry insights'],
        cta,
      }
    case 'X':
      return {
        title: titleCase(topic),
        caption: `${opener} ${titleCase(topic)}${voice}. Thread below 🧵`,
        hashtags: [...topicTags.slice(0, 1), ...platformHashtagPool.X].slice(0, 3).map((t) => `#${t}`),
        seoKeywords: [topic.toLowerCase(), `${topic.toLowerCase()} update`],
        cta,
      }
  }
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
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'],
]

export const tones = ['Playful & energetic', 'Warm & encouraging', 'Crisp & professional', 'Bold & confident']

const seedTopics = [
  { topic: 'Launch of our new spring collection', platforms: ['Instagram', 'TikTok', 'Facebook'] as Platform[] },
  { topic: 'Behind the scenes at our studio', platforms: ['Instagram', 'YouTube'] as Platform[] },
  { topic: 'Customer success story with Aurora Audio', platforms: ['LinkedIn', 'X'] as Platform[] },
  { topic: 'Weekly product tips and tricks', platforms: ['YouTube', 'TikTok', 'X'] as Platform[] },
  { topic: 'Holiday gift guide', platforms: ['Instagram', 'Facebook'] as Platform[] },
  { topic: 'Team culture and values deep dive', platforms: ['LinkedIn'] as Platform[] },
]

export const socialPosts: SocialPost[] = seedTopics.map((s, i) => {
  const rand = seededRandom(i * 23 + 11)
  const character = pick(characters.slice(0, 10), rand)
  const tone = pick(tones, rand)
  const content: Partial<Record<Platform, PlatformContent>> = {}
  for (const p of s.platforms) {
    content[p] = generatePlatformContent(s.topic, tone, character.name, p, 'Learn more')
  }
  const [gradientFrom, gradientTo] = pick(gradientPairs, rand)
  return {
    id: `social_${(i + 1).toString().padStart(3, '0')}`,
    topic: s.topic,
    tone,
    characterId: character.id,
    platforms: s.platforms,
    content,
    gradientFrom,
    gradientTo,
    createdAt: `${Math.floor(rand() * 10) + 1}d ago`,
  }
})

export function addSocialPost(post: SocialPost) {
  socialPosts.unshift(post)
}
