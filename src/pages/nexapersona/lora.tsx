import * as React from 'react'
import { Link } from 'react-router-dom'
import { Layers, Plus, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CharacterPicker } from '@/components/nexapersona/character-picker'
import { loraModels as seedLora, type LoraModel } from '@/data/nexapersona-data'
import { getCharacter } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'

const statusVariant: Record<LoraModel['status'], 'success' | 'accent' | 'warning' | 'destructive'> = {
  Trained: 'success',
  Training: 'accent',
  Queued: 'warning',
  Failed: 'destructive',
}

export default function NexaLoraPage() {
  const { toast } = useToast()
  const [models, setModels] = React.useState<LoraModel[]>(seedLora)
  const [open, setOpen] = React.useState(false)
  const [characterId, setCharacterId] = React.useState<string | null>(null)
  const [baseModel, setBaseModel] = React.useState('Flux.1 Dev')

  function startTraining(e: React.FormEvent) {
    e.preventDefault()
    if (!characterId) return
    const character = getCharacter(characterId)
    const model: LoraModel = {
      id: `lora_new_${Date.now()}`,
      name: `${character?.name.toLowerCase()}-identity-v1`,
      characterId,
      baseModel,
      status: 'Queued',
      trainingImages: character?.appearance.referenceImages?.length ?? 0,
      weight: 0.85,
      version: 'v1.0',
      createdAt: 'Just now',
    }
    setModels((prev) => [model, ...prev])
    setOpen(false)
    setCharacterId(null)
    toast({ title: 'Training queued', description: `${character?.name}'s identity model will begin training shortly.`, variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">LoRA models keep every generation visually consistent with a character's trained identity.</p>
        <Button onClick={() => setOpen(true)}>
          <Plus />
          Train new LoRA
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="size-4.5 text-accent" />
                Train a new LoRA
              </DialogTitle>
              <DialogDescription>Select a character and base model to queue a new identity training run.</DialogDescription>
            </DialogHeader>
            <form onSubmit={startTraining} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Character</Label>
                <CharacterPicker value={characterId} onChange={setCharacterId} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Base model</Label>
                <Select value={baseModel} onValueChange={setBaseModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SDXL 1.0">SDXL 1.0</SelectItem>
                    <SelectItem value="Flux.1 Dev">Flux.1 Dev</SelectItem>
                    <SelectItem value="SD 3.5 Large">SD 3.5 Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!characterId}>
                  Start training
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => {
          const character = getCharacter(model.characterId)
          return (
            <Card key={model.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                {character && (
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-elevation-1"
                    style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
                  >
                    {character.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm font-semibold text-foreground">{model.name}</p>
                  {character && (
                    <Link to={`/characters/${character.id}`} className="truncate text-xs text-accent hover:underline">
                      {character.name}
                    </Link>
                  )}
                </div>
                <Badge variant={statusVariant[model.status]}>{model.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-foreground-subtle">
                <div>
                  <p className="text-[10px] uppercase tracking-wide">Base model</p>
                  <p className="text-sm font-medium text-foreground">{model.baseModel}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide">Version</p>
                  <p className="text-sm font-medium text-foreground">{model.version}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide">Training images</p>
                  <p className="text-sm font-medium text-foreground">{model.trainingImages}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide">Weight</p>
                  <p className="text-sm font-medium text-foreground">{model.weight.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] text-foreground-subtle">
                <span className="flex items-center gap-1">
                  <Sparkles className="size-3" />
                  Trained {model.createdAt}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
