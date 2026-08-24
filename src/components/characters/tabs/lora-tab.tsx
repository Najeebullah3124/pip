import { Layers, RefreshCw, Images } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DnaField, DnaSection } from '@/components/characters/dna-field'
import type { Lora } from '@/data/character-data'

const baseModels = ['SDXL 1.0', 'Flux.1 Dev', 'SD 3.5 Large']

const statusVariant = {
  Trained: 'success',
  Training: 'warning',
  Queued: 'accent',
  Failed: 'destructive',
} as const

interface LoraTabProps {
  data: Lora
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Lora>) => void
}

export function LoraTab({ data, mode, onChange }: LoraTabProps) {
  if (mode === 'view') {
    return (
      <DnaSection title="LoRA configuration" description="The fine-tuned identity model that keeps this character visually consistent.">
        <Card className="flex items-center gap-4 p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent">
            <Layers className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-semibold text-foreground">{data.modelName}</p>
            <p className="text-xs text-foreground-subtle">{data.baseModel} · {data.version}</p>
          </div>
          <Badge variant={statusVariant[data.status]}>{data.status}</Badge>
        </Card>
        <Card className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <DnaField label="Training images" value={data.trainingImages} />
          <DnaField label="Weight" value={data.weight.toFixed(2)} />
          <DnaField label="Trigger word" value={<code className="rounded bg-muted px-1.5 py-0.5 text-xs">{data.triggerWord}</code>} />
          <DnaField label="Version" value={data.version} />
        </Card>
      </DnaSection>
    )
  }

  return (
    <DnaSection title="LoRA configuration" description="Manage the fine-tuned identity model for this character.">
      <Card className="flex items-center gap-4 p-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent">
          <Layers className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-semibold text-foreground">{data.modelName}</p>
          <p className="text-xs text-foreground-subtle">Trained on {data.trainingImages} reference images</p>
        </div>
        <Badge variant={statusVariant[data.status]}>{data.status}</Badge>
        <Button variant="secondary" size="sm">
          <RefreshCw />
          Retrain
        </Button>
        <Button variant="secondary" size="sm">
          <Images />
          Manage images
        </Button>
      </Card>

      <Card className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lora-name">Model name</Label>
          <Input id="lora-name" className="font-mono text-sm" value={data.modelName} onChange={(e) => onChange?.({ modelName: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lora-base">Base model</Label>
          <Select value={data.baseModel} onValueChange={(v) => onChange?.({ baseModel: v })}>
            <SelectTrigger id="lora-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {baseModels.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lora-trigger">Trigger word</Label>
          <Input id="lora-trigger" className="font-mono text-sm" value={data.triggerWord} onChange={(e) => onChange?.({ triggerWord: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lora-version">Version</Label>
          <Input id="lora-version" value={data.version} onChange={(e) => onChange?.({ version: e.target.value })} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Weight</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{data.weight.toFixed(2)}</span>
          </div>
          <Slider
            value={[Math.round(data.weight * 100)]}
            max={150}
            step={1}
            onValueChange={([v]) => onChange?.({ weight: Math.round(v) / 100 })}
          />
          <p className="text-xs text-foreground-subtle">Higher weight increases identity fidelity but can reduce prompt flexibility.</p>
        </div>
      </Card>
    </DnaSection>
  )
}
