import { SlidersHorizontal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { aiEngines } from '@/data/template-data'
import type { StudioPrompt } from '@/components/studio/types'

const maxTokenOptions = ['256', '512', '1024', '2048', '4096', '8192']

interface AiSettingsCardProps {
  aiEngine: string
  settings: StudioPrompt['aiSettings']
  onEngineChange: (engine: string) => void
  onSettingsChange: (patch: Partial<StudioPrompt['aiSettings']>) => void
}

export function AiSettingsCard({ aiEngine, settings, onEngineChange, onSettingsChange }: AiSettingsCardProps) {
  return (
    <Card className="flex flex-col gap-5 p-5">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
        <SlidersHorizontal className="size-3.5" />
        AI settings
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>AI engine</Label>
          <Select value={aiEngine} onValueChange={onEngineChange}>
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
        <div className="flex flex-col gap-1.5">
          <Label>Max tokens</Label>
          <Select value={String(settings.maxTokens)} onValueChange={(v) => onSettingsChange({ maxTokens: Number(v) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {maxTokenOptions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Temperature</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{(settings.temperature / 100).toFixed(2)}</span>
          </div>
          <Slider value={[settings.temperature]} max={100} step={1} onValueChange={([v]) => onSettingsChange({ temperature: v })} />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Top-p</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{(settings.topP / 100).toFixed(2)}</span>
          </div>
          <Slider value={[settings.topP]} max={100} step={1} onValueChange={([v]) => onSettingsChange({ topP: v })} />
        </div>
      </div>
    </Card>
  )
}
