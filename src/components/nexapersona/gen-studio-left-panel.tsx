import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { CharacterPicker } from '@/components/nexapersona/character-picker'
import { ComponentMultiSelect } from '@/components/studio/tester/component-multiselect'
import { generationTypeMeta, loraModels, type GenerationType } from '@/data/nexapersona-data'
import { templates } from '@/data/template-data'
import { wardrobeStyles, cameraAngles, lightingStyles, environments } from '@/data/studio-presets'

export interface LeftConfig {
  characterId: string | null
  templateId: string | null
  componentIds: string[]
  wardrobe: string
  camera: string
  lighting: string
  environment: string
  loraId: string | null
  loraWeight: number
}

interface GenStudioLeftPanelProps {
  mediaType: GenerationType
  config: LeftConfig
  onChange: (patch: Partial<LeftConfig>) => void
}

export function GenStudioLeftPanel({ mediaType, config, onChange }: GenStudioLeftPanelProps) {
  const meta = generationTypeMeta[mediaType]
  const relevantTemplates = templates.filter((t) => t.category === (mediaType === 'Talking Head' ? 'Talking Head' : mediaType === 'Lip Sync' ? 'Video' : mediaType)).slice(0, 20)
  const characterLora = config.characterId ? loraModels.filter((l) => l.characterId === config.characterId) : []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
        <span className="flex size-6 items-center justify-center rounded-lg text-white" style={{ backgroundColor: meta.color }}>
          <meta.icon className="size-3.5" />
        </span>
        <p className="text-xs font-medium text-foreground-muted">
          Generating <span className="font-semibold text-foreground">{mediaType}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Character</Label>
        <CharacterPicker value={config.characterId} onChange={(id) => onChange({ characterId: id, loraId: null })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Template</Label>
        <Select value={config.templateId ?? 'none'} onValueChange={(v) => onChange({ templateId: v === 'none' ? null : v })}>
          <SelectTrigger>
            <SelectValue placeholder="No template" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="none">No template</SelectItem>
            {relevantTemplates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Components</Label>
        <ComponentMultiSelect value={config.componentIds} onChange={(ids) => onChange({ componentIds: ids })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Wardrobe</Label>
        <Select value={config.wardrobe} onValueChange={(v) => onChange({ wardrobe: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {wardrobeStyles.map((w) => (
              <SelectItem key={w} value={w}>
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Camera</Label>
        <Select value={config.camera} onValueChange={(v) => onChange({ camera: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cameraAngles.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Lighting</Label>
        <Select value={config.lighting} onValueChange={(v) => onChange({ lighting: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {lightingStyles.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Environment</Label>
        <Select value={config.environment} onValueChange={(v) => onChange({ environment: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {environments.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>LoRA</Label>
        <Select
          value={config.loraId ?? 'none'}
          onValueChange={(v) => onChange({ loraId: v === 'none' ? null : v })}
          disabled={!config.characterId}
        >
          <SelectTrigger>
            <SelectValue placeholder={config.characterId ? 'No LoRA' : 'Select a character first'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No LoRA</SelectItem>
            {characterLora.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name} ({l.status})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {config.loraId && (
          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-foreground-subtle">Weight</Label>
              <span className="text-xs font-semibold tabular-nums text-foreground-muted">{config.loraWeight.toFixed(2)}</span>
            </div>
            <Slider value={[Math.round(config.loraWeight * 100)]} max={150} step={1} onValueChange={([v]) => onChange({ loraWeight: v / 100 })} />
          </div>
        )}
      </div>
    </div>
  )
}
