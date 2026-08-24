import { Heart, MessageCircle, Repeat2, Share2, Bookmark, ThumbsUp, Send, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { platformMeta, type Platform, type PlatformContent } from '@/data/social-content'
import { cn } from '@/lib/utils'

interface PlatformPreviewCardProps {
  platform: Platform
  content: PlatformContent
  gradientFrom: string
  gradientTo: string
  characterName?: string
  handle: string
}

function Avatar({ gradientFrom, gradientTo, name, size = 'size-9' }: { gradientFrom: string; gradientTo: string; name: string; size?: string }) {
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white', size)}
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

function MediaBlock({
  gradientFrom,
  gradientTo,
  aspect,
  showPlay,
  className,
}: {
  gradientFrom: string
  gradientTo: string
  aspect: 'square' | 'portrait' | 'landscape'
  showPlay?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        aspect === 'square' && 'aspect-square',
        aspect === 'portrait' && 'aspect-[9/16] max-h-72',
        aspect === 'landscape' && 'aspect-video',
        className
      )}
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
      {showPlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <Play className="size-5 fill-current" />
          </div>
        </div>
      )}
    </div>
  )
}

function CaptionText({ caption, hashtags }: { caption: string; hashtags: string[] }) {
  return (
    <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground">
      {caption}
      {hashtags.length > 0 && (
        <>
          {' '}
          <span className="text-accent">{hashtags.join(' ')}</span>
        </>
      )}
    </p>
  )
}

export function PlatformPreviewCard({ platform, content, gradientFrom, gradientTo, characterName, handle }: PlatformPreviewCardProps) {
  const meta = platformMeta[platform]
  const Icon = meta.icon
  const name = characterName ?? handle

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-elevation-1">
        {platform === 'Instagram' && (
          <>
            <div className="flex items-center gap-2.5 px-3.5 py-3">
              <Avatar gradientFrom={gradientFrom} gradientTo={gradientTo} name={name} />
              <p className="text-[13px] font-semibold text-foreground">{handle}</p>
            </div>
            <MediaBlock gradientFrom={gradientFrom} gradientTo={gradientTo} aspect="square" />
            <div className="flex items-center gap-3 px-3.5 pt-3 text-foreground-muted">
              <Heart className="size-5" />
              <MessageCircle className="size-5" />
              <Send className="size-5" />
              <Bookmark className="ml-auto size-5" />
            </div>
            <div className="flex flex-col gap-1.5 px-3.5 pb-3.5 pt-2">
              <p className="text-[13px] font-semibold text-foreground">{handle}</p>
              <CaptionText caption={content.caption} hashtags={content.hashtags} />
            </div>
          </>
        )}

        {platform === 'Facebook' && (
          <div className="flex flex-col gap-3 p-3.5">
            <div className="flex items-center gap-2.5">
              <Avatar gradientFrom={gradientFrom} gradientTo={gradientTo} name={name} />
              <div>
                <p className="text-[13px] font-semibold text-foreground">{handle}</p>
                <p className="text-[11px] text-foreground-subtle">Just now · 🌐</p>
              </div>
            </div>
            <CaptionText caption={content.caption} hashtags={content.hashtags} />
            <MediaBlock gradientFrom={gradientFrom} gradientTo={gradientTo} aspect="landscape" className="rounded-xl" />
            <div className="flex items-center gap-4 border-t border-border pt-2.5 text-[12px] font-medium text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="size-4" />
                Like
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="size-4" />
                Comment
              </span>
              <span className="flex items-center gap-1.5">
                <Share2 className="size-4" />
                Share
              </span>
            </div>
          </div>
        )}

        {platform === 'TikTok' && (
          <div className="relative">
            <MediaBlock gradientFrom={gradientFrom} gradientTo={gradientTo} aspect="portrait" showPlay />
            <div className="absolute right-2.5 bottom-3 flex flex-col items-center gap-3.5 text-white">
              <Avatar gradientFrom={gradientFrom} gradientTo={gradientTo} name={name} size="size-8" />
              <div className="flex flex-col items-center gap-0.5">
                <Heart className="size-6" />
                <span className="text-[10px] font-semibold">42.1K</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <MessageCircle className="size-6" />
                <span className="text-[10px] font-semibold">891</span>
              </div>
              <Share2 className="size-6" />
            </div>
            <div className="absolute bottom-3 left-3 right-16 flex flex-col gap-1 text-white">
              <p className="text-[13px] font-semibold">@{handle}</p>
              <p className="line-clamp-2 text-[12px] leading-snug">
                {content.caption} <span className="opacity-90">{content.hashtags.join(' ')}</span>
              </p>
            </div>
          </div>
        )}

        {platform === 'YouTube' && (
          <>
            <MediaBlock gradientFrom={gradientFrom} gradientTo={gradientTo} aspect="landscape" showPlay />
            <div className="flex gap-2.5 p-3.5">
              <Avatar gradientFrom={gradientFrom} gradientTo={gradientTo} name={name} />
              <div className="min-w-0">
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">{content.title}</p>
                <p className="mt-0.5 text-[11px] text-foreground-subtle">{handle} · 1.2K views · Just now</p>
              </div>
            </div>
          </>
        )}

        {platform === 'LinkedIn' && (
          <div className="flex flex-col gap-3 p-3.5">
            <div className="flex items-center gap-2.5">
              <Avatar gradientFrom={gradientFrom} gradientTo={gradientTo} name={name} />
              <div>
                <p className="text-[13px] font-semibold text-foreground">{handle}</p>
                <p className="text-[11px] text-foreground-subtle">Creator · Just now</p>
              </div>
            </div>
            <CaptionText caption={content.caption} hashtags={content.hashtags} />
            <MediaBlock gradientFrom={gradientFrom} gradientTo={gradientTo} aspect="landscape" className="rounded-xl" />
            <div className="flex items-center gap-4 border-t border-border pt-2.5 text-[12px] font-medium text-foreground-muted">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="size-4" />
                Like
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="size-4" />
                Comment
              </span>
              <span className="flex items-center gap-1.5">
                <Repeat2 className="size-4" />
                Repost
              </span>
              <span className="flex items-center gap-1.5">
                <Send className="size-4" />
                Send
              </span>
            </div>
          </div>
        )}

        {platform === 'X' && (
          <div className="flex gap-2.5 p-3.5">
            <Avatar gradientFrom={gradientFrom} gradientTo={gradientTo} name={name} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px]">
                <span className="font-semibold text-foreground">{name}</span>{' '}
                <span className="text-foreground-subtle">@{handle} · now</span>
              </p>
              <CaptionText caption={content.caption} hashtags={content.hashtags} />
              <MediaBlock gradientFrom={gradientFrom} gradientTo={gradientTo} aspect="landscape" className="mt-2.5 rounded-2xl border border-border" />
              <div className="mt-2.5 flex items-center gap-5 text-foreground-muted">
                <MessageCircle className="size-4" />
                <Repeat2 className="size-4" />
                <Heart className="size-4" />
                <Share2 className="size-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface-2 p-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">
          <Icon className="size-3.5" style={{ color: meta.color }} />
          {platform} post details
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">Title</p>
          <p className="text-sm font-medium text-foreground">{content.title}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-foreground-subtle">SEO keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {content.seoKeywords.map((kw) => (
              <Badge key={kw} variant="outline">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">CTA</p>
          <Badge variant="accent">{content.cta}</Badge>
        </div>
      </div>
    </div>
  )
}
