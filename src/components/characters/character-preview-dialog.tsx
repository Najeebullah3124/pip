import * as React from 'react'
import { Sparkles, RefreshCw, Wand2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/spinner'
import type { Character } from '@/data/character-data'

function buildPromptSummary(c: Character) {
  return [
    `${c.appearance.age}-year-old ${c.appearance.gender.toLowerCase()}, ${c.appearance.bodyType.toLowerCase()} build, ${c.appearance.hairStyle.toLowerCase()} ${c.appearance.hairColor.toLowerCase()} hair, ${c.appearance.eyeColor.toLowerCase()} eyes`,
    `wearing ${c.wardrobe.defaultOutfit.toLowerCase()}`,
    `${c.camera.defaultAngle.toLowerCase()}, ${c.camera.lens}, ${c.camera.framing.toLowerCase()}`,
    `${c.lighting.style.toLowerCase()}, ${c.lighting.mood.toLowerCase()}`,
    `set in a ${c.environment.defaultSetting.toLowerCase()}, ${c.environment.timeOfDay.toLowerCase()}`,
    `LoRA: ${c.lora.triggerWord} @ ${c.lora.weight.toFixed(2)}`,
  ].join(' · ')
}

export function CharacterPreviewDialog({
  character,
  open,
  onOpenChange,
}: {
  character: Character
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [generating, setGenerating] = React.useState(false)
  const [seed, setSeed] = React.useState(0)

  function regenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setSeed((s) => s + 1)
    }, 1400)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4.5 text-accent" />
            Preview — {character.name}
          </DialogTitle>
          <DialogDescription>A compiled render of this character's current DNA configuration.</DialogDescription>
        </DialogHeader>

        <div
          key={seed}
          className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl shadow-elevation-2 animate-fade-in"
          style={{ background: `linear-gradient(140deg, ${character.gradientFrom}, ${character.gradientTo})` }}
        >
          <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:22px_22px]" />
          {generating ? (
            <div className="relative flex flex-col items-center gap-3 text-white">
              <Spinner size={28} className="text-white" />
              <p className="text-sm font-medium">Rendering preview…</p>
            </div>
          ) : character.portraitImage ? (
            <img
              src={character.portraitImage}
              alt={character.name}
              className="relative size-32 rounded-full border-4 border-white/40 object-cover shadow-elevation-3"
            />
          ) : (
            <div className="relative flex size-32 items-center justify-center rounded-full border-4 border-white/40 text-5xl font-bold text-white/90 shadow-elevation-3">
              {character.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-2 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <Wand2 className="size-3.5" />
            Compiled prompt
          </p>
          <p className="text-xs leading-relaxed text-foreground-muted">{buildPromptSummary(character)}</p>
        </div>

        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={regenerate} loading={generating}>
            <RefreshCw />
            {generating ? 'Rendering…' : 'Regenerate preview'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
