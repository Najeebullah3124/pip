import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { allNavItems } from '@/data/nav'
import { cn } from '@/lib/utils'

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)
  const navigate = useNavigate()

  const results = React.useMemo(() => {
    if (!query.trim()) return allNavItems
    return allNavItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  React.useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  function go(href: string) {
    navigate(href)
    onOpenChange(false)
    setQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="top-[18%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="size-4.5 shrink-0 text-foreground-subtle" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, prompts, characters…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-foreground-subtle"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActiveIndex((i) => Math.min(i + 1, results.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActiveIndex((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter' && results[activeIndex]) {
                go(results[activeIndex].href)
              }
            }}
          />
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground-subtle">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Sparkles className="size-5 text-foreground-subtle" />
              <p className="text-sm text-foreground-muted">No results for "{query}"</p>
            </div>
          ) : (
            <>
              <p className="px-2.5 pb-1.5 pt-1 text-xs font-semibold text-foreground-subtle">Pages</p>
              {results.map((item, i) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition-colors',
                      i === activeIndex ? 'bg-accent-soft text-accent-700' : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1 font-medium">{item.label}</span>
                    <ArrowRight className="size-3.5 shrink-0 opacity-50" />
                  </button>
                )
              })}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
