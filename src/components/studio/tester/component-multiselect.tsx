import { Blocks, ChevronDown, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { components as libraryComponents, categoryMeta } from '@/data/component-data'
import { cn } from '@/lib/utils'

export function ComponentMultiSelect({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-input bg-surface-2 px-3.5 py-2 text-sm shadow-elevation-1 transition-colors hover:border-border-strong">
          <span className="flex items-center gap-2 text-foreground-muted">
            <Blocks className="size-3.5" />
            {value.length === 0 ? 'Select components' : `${value.length} component${value.length > 1 ? 's' : ''} selected`}
          </span>
          <ChevronDown className="size-4 text-foreground-subtle" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-80 w-80 overflow-y-auto p-2">
        <div className="flex flex-col gap-0.5">
          {libraryComponents.map((c) => {
            const meta = categoryMeta[c.category]
            const active = value.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  active ? 'bg-accent-soft' : 'hover:bg-muted'
                )}
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-md text-white" style={{ backgroundColor: meta.color }}>
                  <meta.icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-[11px] text-foreground-subtle">{c.category}</p>
                </div>
                {active && <Check className="size-3.5 shrink-0 text-accent" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
