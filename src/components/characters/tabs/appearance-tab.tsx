import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { DnaField, DnaSection } from '@/components/characters/dna-field'
import type { Appearance } from '@/data/character-data'

const fields: { key: keyof Appearance; label: string }[] = [
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  { key: 'ethnicity', label: 'Ethnicity' },
  { key: 'bodyType', label: 'Body type' },
  { key: 'height', label: 'Height' },
  { key: 'hairColor', label: 'Hair color' },
  { key: 'hairStyle', label: 'Hair style' },
  { key: 'eyeColor', label: 'Eye color' },
  { key: 'skinTone', label: 'Skin tone' },
]

interface AppearanceTabProps {
  data: Appearance
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Appearance>) => void
}

export function AppearanceTab({ data, mode, onChange }: AppearanceTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Appearance" description="The permanent physical identity this character maintains across every generation.">
        <Card className="grid grid-cols-2 gap-x-6 gap-y-5 p-6 sm:grid-cols-3">
          {fields.map((f) => (
            <DnaField key={f.key} label={f.label} value={data[f.key]} />
          ))}
        </Card>
        <Card className="p-6">
          <DnaField label="Distinguishing features" value={data.distinguishingFeatures} />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Appearance" description="These attributes anchor identity — changes apply to every future generation.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <Label htmlFor={`app-${f.key}`}>{f.label}</Label>
            <Input
              id={`app-${f.key}`}
              value={data[f.key]}
              onChange={(e) => onChange?.({ [f.key]: e.target.value } as Partial<Appearance>)}
            />
          </div>
        ))}
      </Card>
      <Card className="flex flex-col gap-1.5 p-6">
        <Label htmlFor="app-features">Distinguishing features</Label>
        <Textarea
          id="app-features"
          value={data.distinguishingFeatures}
          onChange={(e) => onChange?.({ distinguishingFeatures: e.target.value })}
          rows={3}
        />
      </Card>
    </DnaSection>
  )
}
