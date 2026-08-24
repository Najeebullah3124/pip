import { Image as ImageIcon } from 'lucide-react'
import type { BookPage } from '@/data/book-builder-data'
import { cn } from '@/lib/utils'

export function PageThumbnail({ page, className }: { page: BookPage; className?: string }) {
  return (
    <div className={cn('relative flex shrink-0 flex-col overflow-hidden rounded-lg border border-border', className)}>
      {page.layout === 'text-only' ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 bg-surface-2 p-1.5">
          <span className="h-0.5 w-4/5 rounded-full bg-border" />
          <span className="h-0.5 w-3/5 rounded-full bg-border" />
        </div>
      ) : (
        <div
          className="relative flex h-full w-full items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${page.gradientFrom}, ${page.gradientTo})` }}
        >
          {!page.hasIllustration && <ImageIcon className="size-3 text-white/60" />}
        </div>
      )}
    </div>
  )
}
