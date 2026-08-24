import { Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookPage } from '@/data/book-builder-data'
import { cn } from '@/lib/utils'

interface PageCanvasProps {
  page: BookPage
  showPageNumber: boolean
  editable?: boolean
  generating?: boolean
  onChangeText?: (text: string) => void
  onGenerateIllustration?: () => void
}

const textSizeClass = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' } as const
const textAlignClass = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

function Illustration({ page, editable, generating, onGenerateIllustration, className }: { page: BookPage; editable?: boolean; generating?: boolean; onGenerateIllustration?: () => void; className?: string }) {
  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{ background: `linear-gradient(135deg, ${page.gradientFrom}, ${page.gradientTo})` }}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:16px_16px]" />
      {!page.hasIllustration ? (
        editable ? (
          <Button variant="secondary" size="sm" onClick={onGenerateIllustration} loading={generating} className="relative">
            <Sparkles />
            Generate illustration
          </Button>
        ) : (
          <Sparkles className="relative size-6 text-white/70" />
        )
      ) : (
        editable && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onGenerateIllustration}
            loading={generating}
            aria-label="Regenerate illustration"
            className="absolute right-2 top-2 text-white hover:bg-white/20 hover:text-white"
          >
            <RotateCcw />
          </Button>
        )
      )}
    </div>
  )
}

function TextBlock({ page, editable, onChangeText }: { page: BookPage; editable?: boolean; onChangeText?: (text: string) => void }) {
  const cls = cn('w-full resize-none bg-transparent leading-relaxed text-foreground outline-none placeholder:text-foreground-subtle', textSizeClass[page.textSize], textAlignClass[page.textAlign])
  if (editable) {
    return <textarea value={page.text} onChange={(e) => onChangeText?.(e.target.value)} placeholder="Write what happens on this page…" className={cn(cls, 'h-full min-h-24')} />
  }
  return <p className={cls}>{page.text || 'Write what happens on this page…'}</p>
}

export function PageCanvas({ page, showPageNumber, editable, generating, onChangeText, onGenerateIllustration }: PageCanvasProps) {
  const illustrationProps = { page, editable, generating, onGenerateIllustration }

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-elevation-1">
      {page.layout === 'full-bleed' && (
        <div className="relative h-full w-full">
          <Illustration {...illustrationProps} className="absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-10">
            <TextBlock page={{ ...page, textAlign: page.textAlign }} editable={editable} onChangeText={onChangeText} />
          </div>
        </div>
      )}

      {page.layout === 'image-top' && (
        <div className="flex h-full flex-col">
          <Illustration {...illustrationProps} className="h-3/5 w-full" />
          <div className="flex-1 overflow-y-auto p-5">
            <TextBlock page={page} editable={editable} onChangeText={onChangeText} />
          </div>
        </div>
      )}

      {page.layout === 'image-bottom' && (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-5">
            <TextBlock page={page} editable={editable} onChangeText={onChangeText} />
          </div>
          <Illustration {...illustrationProps} className="h-3/5 w-full" />
        </div>
      )}

      {page.layout === 'split-left' && (
        <div className="flex h-full">
          <Illustration {...illustrationProps} className="h-full w-1/2" />
          <div className="flex-1 overflow-y-auto p-5">
            <TextBlock page={page} editable={editable} onChangeText={onChangeText} />
          </div>
        </div>
      )}

      {page.layout === 'split-right' && (
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto p-5">
            <TextBlock page={page} editable={editable} onChangeText={onChangeText} />
          </div>
          <Illustration {...illustrationProps} className="h-full w-1/2" />
        </div>
      )}

      {page.layout === 'text-only' && (
        <div className="flex h-full flex-col justify-center bg-surface-2 p-8">
          <TextBlock page={page} editable={editable} onChangeText={onChangeText} />
        </div>
      )}

      {showPageNumber && (
        <span className="absolute bottom-2.5 right-3 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          Page {page.pageNumber}
        </span>
      )}
    </div>
  )
}
