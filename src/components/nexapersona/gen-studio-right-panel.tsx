import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { engines as allEngines } from '@/data/engine-data'
import { resolutionsByType, aspectRatiosByType, voicePresets, motionPresets, showVoice, showMotion, showAspectRatio } from '@/data/studio-presets'
import type { GenerationType } from '@/data/nexapersona-data'

export interface RightConfig {
  engineId: string
  modelId: string
  resolution: string
  aspectRatio: string
  voice: string
  motion: string
  quality: number
  creativity: number
}

interface GenStudioRightPanelProps {
  mediaType: GenerationType
  config: RightConfig
  onChange: (patch: Partial<RightConfig>) => void
}

const engineCategoryByType: Record<GenerationType, string> = {
  Image: 'Image',
  Video: 'Video',
  'Talking Head': 'Video',
  Voice: 'Voice',
  'Lip Sync': 'Video',
  'Product Placement': 'Image',
  'Social Media': 'Language',
}

export function GenStudioRightPanel({ mediaType, config, onChange }: GenStudioRightPanelProps) {
  const category = engineCategoryByType[mediaType]
  const availableEngines = allEngines.filter((e) => e.category === category)
  const selectedEngine = availableEngines.find((e) => e.id === config.engineId) ?? availableEngines[0]
  const availableModels = selectedEngine?.models ?? []

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>AI engine</Label>
        <Select
          value={selectedEngine?.id}
          onValueChange={(v) => {
            const eng = availableEngines.find((e) => e.id === v)
            onChange({ engineId: v, modelId: eng?.defaultModelId ?? '' })
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableEngines.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Model</Label>
        <Select value={config.modelId} onValueChange={(v) => onChange({ modelId: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="flex flex-col gap-5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Parameters</p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Quality</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{config.quality}</span>
          </div>
          <Slider value={[config.quality]} max={100} step={1} onValueChange={([v]) => onChange({ quality: v })} />
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <Label>Creativity</Label>
            <span className="text-xs font-semibold tabular-nums text-foreground-muted">{config.creativity}</span>
          </div>
          <Slider value={[config.creativity]} max={100} step={1} onValueChange={([v]) => onChange({ creativity: v })} />
        </div>
      </Card>

      <div className="flex flex-col gap-1.5">
        <Label>Resolution</Label>
        <Select value={config.resolution} onValueChange={(v) => onChange({ resolution: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {resolutionsByType[mediaType].map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showAspectRatio(mediaType) && (
        <div className="flex flex-col gap-1.5">
          <Label>Aspect ratio</Label>
          <Select value={config.aspectRatio} onValueChange={(v) => onChange({ aspectRatio: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(aspectRatiosByType[mediaType] ?? []).map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showVoice(mediaType) && (
        <div className="flex flex-col gap-1.5">
          <Label>Voice</Label>
          <Select value={config.voice} onValueChange={(v) => onChange({ voice: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voicePresets.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showMotion(mediaType) && (
        <div className="flex flex-col gap-1.5">
          <Label>Motion</Label>
          <Select value={config.motion} onValueChange={(v) => onChange({ motion: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {motionPresets.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
