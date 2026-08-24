import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DnaField, DnaSection } from '@/components/characters/dna-field'
import { TagEditor } from '@/components/characters/tag-editor'
import type { Environment } from '@/data/character-data'

const settings = ['Modern studio', 'Sunlit loft', 'Urban rooftop', 'Minimal cyclorama', 'Cozy library']
const backgroundStyles = ['Softly blurred bokeh', 'Solid seamless', 'Environmental detail', 'Gradient backdrop']
const timesOfDay = ['Golden hour', 'Midday', 'Blue hour', 'Studio (n/a)']

interface EnvironmentTabProps {
  data: Environment
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Environment>) => void
}

export function EnvironmentTab({ data, mode, onChange }: EnvironmentTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Environment" description="Default settings and backdrops this character appears in.">
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-3">
          <DnaField label="Default setting" value={data.defaultSetting} />
          <DnaField label="Background style" value={data.backgroundStyle} />
          <DnaField label="Time of day" value={data.timeOfDay} />
        </Card>
        <Card className="p-6">
          <DnaField
            label="Preset environments"
            value={
              <div className="mt-1 flex flex-wrap gap-1.5">
                {data.presets.map((p) => (
                  <span key={p} className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-700">
                    {p}
                  </span>
                ))}
              </div>
            }
          />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Environment" description="Set the default settings and backdrops this character appears in.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="env-setting">Default setting</Label>
          <Select value={data.defaultSetting} onValueChange={(v) => onChange?.({ defaultSetting: v })}>
            <SelectTrigger id="env-setting">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {settings.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="env-bg">Background style</Label>
          <Select value={data.backgroundStyle} onValueChange={(v) => onChange?.({ backgroundStyle: v })}>
            <SelectTrigger id="env-bg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {backgroundStyles.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="env-time">Time of day</Label>
          <Select value={data.timeOfDay} onValueChange={(v) => onChange?.({ timeOfDay: v })}>
            <SelectTrigger id="env-time">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timesOfDay.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      <Card className="p-6">
        <TagEditor label="Preset environments" values={data.presets} onChange={(v) => onChange?.({ presets: v })} placeholder="Add a preset…" />
      </Card>
    </DnaSection>
  )
}
