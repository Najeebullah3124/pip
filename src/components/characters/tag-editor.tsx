import * as React from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export function TagEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = React.useState('')

  function add() {
    const v = draft.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-foreground-subtle">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <Badge key={v} variant="accent" className="gap-1 pr-1.5">
            {v}
            <button
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="flex size-3.5 cursor-pointer items-center justify-center rounded-full hover:bg-accent-200"
              aria-label={`Remove ${v}`}
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder ?? 'Add and press Enter…'}
          className="h-8 text-xs"
        />
        <button
          onClick={add}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Add tag"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
