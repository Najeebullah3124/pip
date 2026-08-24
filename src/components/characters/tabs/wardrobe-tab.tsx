import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DnaField, DnaSection, DnaTagField } from '@/components/characters/dna-field'
import { TagEditor } from '@/components/characters/tag-editor'
import type { Wardrobe } from '@/data/character-data'

interface WardrobeTabProps {
  data: Wardrobe
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Wardrobe>) => void
}

export function WardrobeTab({ data, mode, onChange }: WardrobeTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Wardrobe" description="Default styling and outfit variants used across generated media.">
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
          <DnaField label="Default outfit" value={data.defaultOutfit} />
          <DnaField label="Style" value={data.style} />
        </Card>
        <Card className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <DnaTagField label="Color palette" values={data.palette} />
          <DnaTagField label="Accessories" values={data.accessories} />
        </Card>
        <Card className="p-6">
          <DnaField
            label="Outfit variants"
            value={
              <div className="mt-1 flex flex-wrap gap-1.5">
                {data.variants.map((v) => (
                  <Badge key={v} variant="outline">
                    {v}
                  </Badge>
                ))}
              </div>
            }
          />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Wardrobe" description="Set the default styling this character wears across generated media.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ward-outfit">Default outfit</Label>
          <Input id="ward-outfit" value={data.defaultOutfit} onChange={(e) => onChange?.({ defaultOutfit: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ward-style">Style</Label>
          <Input id="ward-style" value={data.style} onChange={(e) => onChange?.({ style: e.target.value })} />
        </div>
      </Card>
      <Card className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
        <TagEditor label="Color palette" values={data.palette} onChange={(v) => onChange?.({ palette: v })} placeholder="Add a color…" />
        <TagEditor label="Accessories" values={data.accessories} onChange={(v) => onChange?.({ accessories: v })} placeholder="Add an accessory…" />
      </Card>
      <Card className="p-6">
        <TagEditor label="Outfit variants" values={data.variants} onChange={(v) => onChange?.({ variants: v })} placeholder="Add a variant…" />
      </Card>
    </DnaSection>
  )
}
