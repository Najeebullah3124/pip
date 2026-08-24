import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DnaField, DnaSection } from '@/components/characters/dna-field'
import type { Camera } from '@/data/character-data'

const angles = ['Eye-level portrait', 'Three-quarter', 'Low-angle heroic', 'Over-the-shoulder', 'Dutch tilt']
const lensOptions = ['50mm f/1.4', '85mm f/1.8', '35mm f/2', '24mm wide']
const framings = ['Close-up', 'Medium shot', 'Full body', 'Wide establishing']
const ratios = ['1:1', '4:5', '16:9', '9:16']

interface CameraTabProps {
  data: Camera
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Camera>) => void
}

export function CameraTab({ data, mode, onChange }: CameraTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="Camera" description="Default framing and lens characteristics for image and video generation.">
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <DnaField label="Default angle" value={data.defaultAngle} />
          <DnaField label="Lens" value={data.lens} />
          <DnaField label="Framing" value={data.framing} />
          <DnaField label="Aspect ratio" value={data.aspectRatio} />
        </Card>
        <Card className="p-6">
          <DnaField label="Depth of field" value={`${data.depthOfField}% blur`} />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="Camera" description="Set the default framing and lens characteristics for this character.">
      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cam-angle">Default angle</Label>
          <Select value={data.defaultAngle} onValueChange={(v) => onChange?.({ defaultAngle: v })}>
            <SelectTrigger id="cam-angle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {angles.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cam-lens">Lens</Label>
          <Select value={data.lens} onValueChange={(v) => onChange?.({ lens: v })}>
            <SelectTrigger id="cam-lens">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lensOptions.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cam-framing">Framing</Label>
          <Select value={data.framing} onValueChange={(v) => onChange?.({ framing: v })}>
            <SelectTrigger id="cam-framing">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {framings.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cam-ratio">Aspect ratio</Label>
          <Select value={data.aspectRatio} onValueChange={(v) => onChange?.({ aspectRatio: v })}>
            <SelectTrigger id="cam-ratio">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ratios.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Depth of field</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{data.depthOfField}% blur</span>
          </div>
          <Slider value={[data.depthOfField]} max={100} step={1} onValueChange={([v]) => onChange?.({ depthOfField: v })} />
        </div>
      </Card>
    </DnaSection>
  )
}
