import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DnaField, DnaSection } from '@/components/characters/dna-field'
import type { Lighting } from '@/data/character-data'

const styles = ['Soft studio softbox', 'Golden hour rim light', 'High-contrast rembrandt', 'Flat even light', 'Neon practical']
const moods = ['Warm & inviting', 'Cinematic & moody', 'Bright & optimistic', 'Cool & clinical']

function kelvinColor(k: number) {
  if (k < 4000) return '#ffb46b'
  if (k < 5500) return '#fff1d6'
  if (k < 6500) return '#ffffff'
  return '#c9dcff'
}

interface LightingTabProps {
  data: Lighting
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Lighting>) => void
}

export function LightingTab({ data, mode, onChange }: LightingTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Lighting" description="Default lighting setup used to keep visual mood consistent.">
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
          <DnaField label="Style" value={data.style} />
          <DnaField label="Mood" value={data.mood} />
        </Card>
        <Card className="flex items-center gap-4 p-6">
          <span
            className="size-10 shrink-0 rounded-full border border-border shadow-elevation-1"
            style={{ backgroundColor: kelvinColor(data.colorTemperature) }}
          />
          <DnaField label="Color temperature" value={`${data.colorTemperature}K`} />
          <div className="ml-auto">
            <DnaField label="Key light intensity" value={`${data.keyLightIntensity}%`} />
          </div>
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Lighting" description="Configure the default lighting setup for this character.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="light-style">Style</Label>
          <Select value={data.style} onValueChange={(v) => onChange?.({ style: v })}>
            <SelectTrigger id="light-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styles.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="light-mood">Mood</Label>
          <Select value={data.mood} onValueChange={(v) => onChange?.({ mood: v })}>
            <SelectTrigger id="light-mood">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {moods.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <span className="size-3 rounded-full border border-border" style={{ backgroundColor: kelvinColor(data.colorTemperature) }} />
              Color temperature
            </Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{data.colorTemperature}K</span>
          </div>
          <Slider
            value={[data.colorTemperature]}
            min={2000}
            max={8000}
            step={100}
            onValueChange={([v]) => onChange?.({ colorTemperature: v })}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Key light intensity</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{data.keyLightIntensity}%</span>
          </div>
          <Slider value={[data.keyLightIntensity]} max={100} step={1} onValueChange={([v]) => onChange?.({ keyLightIntensity: v })} />
        </div>
      </Card>
    </DnaSection>
  )
}
