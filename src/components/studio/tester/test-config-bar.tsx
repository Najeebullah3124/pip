import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ComponentMultiSelect } from '@/components/studio/tester/component-multiselect'
import { templates } from '@/data/template-data'
import { characters } from '@/data/character-data'
import { aiEngines } from '@/data/template-data'
import type { CompileInput } from '@/lib/prompt-compile'

interface TestConfigBarProps {
  config: CompileInput
  onChange: (patch: Partial<CompileInput>) => void
  onGenerate: () => void
  generating: boolean
}

export function TestConfigBar({ config, onChange, onGenerate, generating }: TestConfigBarProps) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label>Template</Label>
          <Select value={config.templateId ?? undefined} onValueChange={(v) => onChange({ templateId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {templates.slice(0, 40).map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Character</Label>
          <Select value={config.characterId ?? 'none'} onValueChange={(v) => onChange({ characterId: v === 'none' ? null : v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select character" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="none">No character</SelectItem>
              {characters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Components</Label>
          <ComponentMultiSelect value={config.componentIds} onChange={(ids) => onChange({ componentIds: ids })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>AI engine</Label>
          <Select value={config.engine} onValueChange={(v) => onChange({ engine: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiEngines.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {Object.keys(config.variables).length > 0 && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Variables</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(config.variables).map(([name, value]) => (
              <div key={name} className="flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-soft py-1 pl-2.5 pr-1">
                <span className="font-mono text-[11px] text-accent-700">{name}</span>
                <input
                  value={value}
                  onChange={(e) => onChange({ variables: { ...config.variables, [name]: e.target.value } })}
                  placeholder="value…"
                  className="h-6 w-32 rounded-full bg-surface px-2 text-[11px] text-foreground outline-none placeholder:text-foreground-subtle"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onGenerate} loading={generating} disabled={!config.templateId}>
          <Sparkles />
          {generating ? 'Generating…' : 'Generate prompt package'}
        </Button>
      </div>
    </Card>
  )
}
