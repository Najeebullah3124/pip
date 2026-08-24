import { Check } from 'lucide-react'
import { characters } from '@/data/character-data'
import { cn } from '@/lib/utils'

export function CharacterPicker({ value, onChange }: { value: string | null; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {characters.slice(0, 12).map((c) => {
        const active = value === c.id
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              'group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2 transition-all',
              active ? 'border-accent bg-accent-soft' : 'border-transparent hover:bg-muted'
            )}
          >
            <div
              className="relative flex size-11 items-center justify-center rounded-xl text-xs font-bold text-white shadow-elevation-1"
              style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}
            >
              {c.name.slice(0, 2).toUpperCase()}
              {active && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-white ring-2 ring-surface">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
              )}
            </div>
            <span className={cn('max-w-[64px] truncate text-[11px] font-medium', active ? 'text-accent-700' : 'text-foreground-muted')}>
              {c.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
