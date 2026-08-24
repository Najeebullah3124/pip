import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { pageLayouts, illustrationStyles, bookCameraAngles, bookLightingStyles, bookEnvironments, type BookPage, type PageLayout, type TextAlign, type TextSize } from '@/data/book-builder-data'
import { characters } from '@/data/character-data'
import { cn } from '@/lib/utils'

interface PageSettingsPanelProps {
  page: BookPage
  onChange: (patch: Partial<BookPage>) => void
}

const textSizes: { key: TextSize; label: string }[] = [
  { key: 'sm', label: 'Small' },
  { key: 'md', label: 'Medium' },
  { key: 'lg', label: 'Large' },
]

export function PageSettingsPanel({ page, onChange }: PageSettingsPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Page settings</p>

      <div className="flex flex-col gap-2">
        <Label>Layout</Label>
        <div className="grid grid-cols-3 gap-2">
          {pageLayouts.map((l) => {
            const active = page.layout === l.key
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => onChange({ layout: l.key as PageLayout })}
                title={l.label}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 transition-all',
                  active ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface-2 text-foreground-muted hover:bg-muted'
                )}
              >
                <l.icon className="size-4" />
                <span className="text-[10px] font-medium leading-tight">{l.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Character</Label>
        <Select value={page.characterId ?? '__none__'} onValueChange={(v) => onChange({ characterId: v === '__none__' ? null : v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">No character</SelectItem>
            {characters.slice(0, 15).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Illustration style</Label>
        <Select value={page.illustrationStyle} onValueChange={(v) => onChange({ illustrationStyle: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {illustrationStyles.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Camera</Label>
        <Select value={page.camera} onValueChange={(v) => onChange({ camera: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bookCameraAngles.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Lighting</Label>
        <Select value={page.lighting} onValueChange={(v) => onChange({ lighting: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bookLightingStyles.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Environment</Label>
        <Select value={page.environment} onValueChange={(v) => onChange({ environment: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {bookEnvironments.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-border pt-4">
        <Label>Text settings</Label>
        <div className="flex items-center gap-1.5">
          {(['left', 'center', 'right'] as TextAlign[]).map((align) => {
            const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
            return (
              <Button key={align} type="button" variant={page.textAlign === align ? 'accent' : 'secondary'} size="icon-sm" onClick={() => onChange({ textAlign: align })} aria-label={`Align ${align}`}>
                <Icon />
              </Button>
            )
          })}
          <div className="ml-auto flex items-center gap-1.5">
            {textSizes.map((s) => (
              <Button key={s.key} type="button" variant={page.textSize === s.key ? 'accent' : 'secondary'} size="sm" onClick={() => onChange({ textSize: s.key })}>
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
