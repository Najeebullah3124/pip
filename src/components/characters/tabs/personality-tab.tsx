import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { DnaField, DnaSection, DnaTagField } from '@/components/characters/dna-field'
import { TagEditor } from '@/components/characters/tag-editor'
import type { Personality } from '@/data/character-data'

interface PersonalityTabProps {
  data: Personality
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Personality>) => void
}

export function PersonalityTab({ data, mode, onChange }: PersonalityTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Personality" description="Voice of character — how this persona thinks, values, and communicates.">
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
          <DnaField label="Archetype" value={data.archetype} />
          <DnaField label="Tone" value={data.tone} />
          <DnaField label="Communication style" value={data.communicationStyle} />
          <DnaField label="Quirks" value={data.quirks} />
        </Card>
        <Card className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <DnaTagField label="Core traits" values={data.traits} />
          <DnaTagField label="Values" values={data.values} />
        </Card>
        <Card className="p-6">
          <DnaField label="Backstory" value={<span className="leading-relaxed">{data.backstory}</span>} />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Personality" description="Define how this character thinks and communicates — this steers every prompt.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pers-archetype">Archetype</Label>
          <Input id="pers-archetype" value={data.archetype} onChange={(e) => onChange?.({ archetype: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pers-tone">Tone</Label>
          <Input id="pers-tone" value={data.tone} onChange={(e) => onChange?.({ tone: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pers-comm">Communication style</Label>
          <Input id="pers-comm" value={data.communicationStyle} onChange={(e) => onChange?.({ communicationStyle: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pers-quirks">Quirks</Label>
          <Input id="pers-quirks" value={data.quirks} onChange={(e) => onChange?.({ quirks: e.target.value })} />
        </div>
      </Card>
      <Card className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
        <TagEditor label="Core traits" values={data.traits} onChange={(v) => onChange?.({ traits: v })} placeholder="Add a trait…" />
        <TagEditor label="Values" values={data.values} onChange={(v) => onChange?.({ values: v })} placeholder="Add a value…" />
      </Card>
      <Card className="flex flex-col gap-1.5 p-6">
        <Label htmlFor="pers-backstory">Backstory</Label>
        <Textarea id="pers-backstory" rows={4} value={data.backstory} onChange={(e) => onChange?.({ backstory: e.target.value })} />
      </Card>
    </DnaSection>
  )
}
