import { LayoutGrid } from 'lucide-react'
import { categoryMeta, allCategories, type TemplateCategory } from '@/data/template-data'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  value: TemplateCategory | 'all'
  onChange: (value: TemplateCategory | 'all') => void
  counts: Record<string, number>
}

export function CategoryFilter({ value, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onChange('all')}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
          value === 'all' ? 'border-transparent bg-primary text-primary-foreground' : 'border-border text-foreground-muted hover:bg-muted'
        )}
      >
        <LayoutGrid className="size-3" />
        All
        <span className="opacity-70">{counts.all ?? 0}</span>
      </button>
      {allCategories.map((cat) => {
        const meta = categoryMeta[cat]
        const active = value === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              active ? 'border-transparent text-white' : 'border-border text-foreground-muted hover:bg-muted'
            )}
            style={active ? { backgroundColor: meta.color } : undefined}
          >
            <meta.icon className="size-3" />
            {cat}
            <span className="opacity-70">{counts[cat] ?? 0}</span>
          </button>
        )
      })}
    </div>
  )
}
