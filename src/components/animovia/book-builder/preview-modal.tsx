import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PageCanvas } from '@/components/animovia/book-builder/page-canvas'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import type { Book } from '@/data/book-builder-data'

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: Book
}

export function PreviewModal({ open, onOpenChange, book }: PreviewModalProps) {
  const total = book.pages.length + 1
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  const isCover = index === 0
  const page = !isCover ? book.pages[index - 1] : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{book.title} — Preview</DialogTitle>
        </DialogHeader>

        {isCover ? (
          <div
            className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border p-8 text-center"
            style={{ background: `linear-gradient(135deg, ${book.coverGradientFrom}, ${book.coverGradientTo})` }}
          >
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:18px_18px]" />
            <BookOpen className="relative size-8 text-white/50" />
            <p className="relative text-3xl font-bold leading-tight text-white">{book.title}</p>
            <p className="relative max-w-md text-sm text-white/80">{book.coverSubtitle}</p>
            <p className="relative mt-2 text-xs font-medium uppercase tracking-wide text-white/60">{book.author}</p>
          </div>
        ) : (
          page && <PageCanvas page={page} showPageNumber={book.showPageNumbers} />
        )}

        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
            <ChevronLeft />
            Previous
          </Button>
          <p className="text-xs font-medium text-foreground-subtle">
            {isCover ? 'Cover' : `Page ${page?.pageNumber}`} · {index + 1} of {total}
          </p>
          <Button variant="secondary" size="sm" onClick={() => setIndex((i) => Math.min(total - 1, i + 1))} disabled={index === total - 1}>
            Next
            <ChevronRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
