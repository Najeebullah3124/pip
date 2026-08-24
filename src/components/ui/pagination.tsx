import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

function pageWindow(page: number, pageCount: number): (number | 'ellipsis')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const pages = new Set([1, pageCount, page, page - 1, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b)
  const out: (number | 'ellipsis')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) out.push('ellipsis')
    out.push(p)
  })
  return out
}

export function Pagination({ page, pageCount, pageSize, total, onPageChange, className }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className={cn('flex flex-col items-center justify-between gap-3 sm:flex-row', className)}>
      <p className="text-xs text-foreground-subtle">
        Showing <span className="font-medium text-foreground-muted">{from}–{to}</span> of{' '}
        <span className="font-medium text-foreground-muted">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        {pageWindow(page, pageCount).map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-1.5 text-xs text-foreground-subtle">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-colors',
                p === page ? 'bg-primary text-primary-foreground' : 'text-foreground-muted hover:bg-muted'
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
