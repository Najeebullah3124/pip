import {
  Sparkles, UserRound, Brain, Mic, Shirt, Aperture, Sun, Mountain, Layers, Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CharacterStatusBadge } from '@/components/characters/character-status-badge'
import type { Character } from '@/data/character-data'

const paletteColors: Record<string, string> = {
  'Ink navy': '#1e293b',
  'Warm sand': '#d6b98c',
  Charcoal: '#374151',
  Blush: '#f4c2c2',
  'Sage green': '#87a878',
  Ivory: '#fffff0',
  'Deep plum': '#4c1d3d',
}

function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-accent" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">{label}</p>
        <p className="truncate text-[13px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function CharacterDnaCard({ character }: { character: Character }) {
  const { appearance, personality, voice, wardrobe, camera, lighting, environment, lora } = character
  const portrait = character.portraitImage ?? appearance.referenceImages?.[0]

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-4">
      <div
        className="relative flex flex-col items-center gap-3 px-6 pb-6 pt-8 text-center"
        style={{ background: `linear-gradient(160deg, ${character.gradientFrom}, ${character.gradientTo})` }}
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_15%,white_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          <Sparkles className="size-3" />
          Character DNA
        </div>

        {portrait ? (
          <img
            src={portrait}
            alt={character.name}
            className="relative size-24 rounded-3xl border-4 border-white/70 object-cover shadow-elevation-3"
          />
        ) : (
          <div className="relative flex size-24 items-center justify-center rounded-3xl border-4 border-white/70 text-3xl font-bold text-white shadow-elevation-3">
            {character.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="relative">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-bold text-white">{character.name || 'Unnamed character'}</h3>
            <CharacterStatusBadge status={character.status} className="border-white/30 bg-white/15 text-white" />
          </div>
          <p className="mt-0.5 text-sm text-white/85">{character.tagline || 'No tagline set'}</p>
        </div>

        {character.applications.length > 0 && (
          <div className="relative flex flex-wrap justify-center gap-1.5">
            {character.applications.map((a) => (
              <span key={a} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-6 divide-y divide-border px-6 sm:grid-cols-2 sm:divide-y-0">
        <div className="divide-y divide-border">
          <SpecRow icon={UserRound} label="Appearance" value={`${appearance.age} · ${appearance.gender} · ${appearance.hairColor}, ${appearance.eyeColor} eyes`} />
          <SpecRow icon={Brain} label="Personality" value={`${personality.archetype} · ${personality.tone}`} />
          <SpecRow icon={Mic} label="Voice" value={`${voice.provider} · ${voice.accent}`} />
          <SpecRow icon={Shirt} label="Wardrobe" value={`${wardrobe.style} · ${wardrobe.defaultOutfit}`} />
        </div>
        <div className="divide-y divide-border">
          <SpecRow icon={Aperture} label="Camera" value={`${camera.defaultAngle} · ${camera.lens}`} />
          <SpecRow icon={Sun} label="Lighting" value={`${lighting.style} · ${lighting.colorTemperature}K`} />
          <SpecRow icon={Mountain} label="Environment" value={`${environment.defaultSetting} · ${environment.timeOfDay}`} />
          <SpecRow icon={Layers} label="LoRA model" value={`${lora.modelName} · weight ${lora.weight.toFixed(2)}`} />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-5 pt-4">
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wide text-foreground-subtle">Core traits</p>
          <div className="flex flex-wrap gap-1.5">
            {personality.traits.map((t) => (
              <Badge key={t} variant="accent">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] uppercase tracking-wide text-foreground-subtle">Palette</p>
          <div className="flex flex-wrap gap-2">
            {wardrobe.palette.map((p) => (
              <span key={p} className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pl-1 pr-2.5 text-[11px] font-medium text-foreground-muted">
                <span className="size-3 rounded-full border border-border" style={{ backgroundColor: paletteColors[p] ?? '#a1a1aa' }} />
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-surface-2 px-6 py-3.5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-foreground-subtle">
          <Zap className="size-3.5 text-accent" />
          Trigger word <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{lora.triggerWord}</code>
        </p>
        <p className="text-xs text-foreground-subtle">{character.createdAt}</p>
      </div>
    </div>
  )
}
