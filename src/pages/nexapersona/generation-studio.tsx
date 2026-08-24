import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Download, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GenStudioLeftPanel, type LeftConfig } from '@/components/nexapersona/gen-studio-left-panel'
import { GenStudioRightPanel, type RightConfig } from '@/components/nexapersona/gen-studio-right-panel'
import { PromptPreview } from '@/components/nexapersona/gen-studio-prompt-preview'
import { GenerationQueue, GenerationStatusStrip, type QueueJob } from '@/components/nexapersona/gen-studio-queue'
import { MediaThumbnail } from '@/components/nexapersona/media-thumbnail'
import { MediaCard } from '@/components/nexapersona/media-card'
import { generationTypeMeta, mediaItems, addMediaItem, type GenerationType, type MediaItem } from '@/data/nexapersona-data'
import { getCharacter } from '@/data/character-data'
import { getTemplate } from '@/data/template-data'
import { getComponent } from '@/data/component-data'
import { engines as allEngines } from '@/data/engine-data'
import { loraModels } from '@/data/nexapersona-data'
import { resolutionsByType, aspectRatiosByType, voicePresets, motionPresets } from '@/data/studio-presets'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const tabs: GenerationType[] = ['Image', 'Video', 'Talking Head', 'Voice', 'Lip Sync']

const gradientPairs: [string, string][] = [
  ['#a78bfa', '#7c3aed'], ['#f0abfc', '#c026d3'], ['#93c5fd', '#2563eb'], ['#5eead4', '#0891b2'],
]

function engineCategoryFor(type: GenerationType) {
  if (type === 'Voice') return 'Voice'
  if (type === 'Image') return 'Image'
  return 'Video'
}

function defaultRightConfig(type: GenerationType): RightConfig {
  const category = engineCategoryFor(type)
  const engine = allEngines.find((e) => e.category === category)
  return {
    engineId: engine?.id ?? '',
    modelId: engine?.defaultModelId ?? '',
    resolution: resolutionsByType[type][0],
    aspectRatio: aspectRatiosByType[type]?.[0] ?? '',
    voice: voicePresets[0],
    motion: motionPresets[1],
    quality: 70,
    creativity: 55,
  }
}

const defaultLeftConfig: LeftConfig = {
  characterId: null,
  templateId: null,
  componentIds: [],
  wardrobe: 'Minimal tailored',
  camera: 'Eye-level portrait',
  lighting: 'Soft studio softbox',
  environment: 'Modern studio',
  loraId: null,
  loraWeight: 0.85,
}

export default function GenerationStudioPage() {
  const { toast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = tabs.find((t) => t === searchParams.get('type')) ?? 'Image'
  const [mediaType, setMediaType] = React.useState<GenerationType>(initialTab)
  const [left, setLeft] = React.useState<LeftConfig>(defaultLeftConfig)
  const [right, setRight] = React.useState<RightConfig>(() => defaultRightConfig(initialTab))
  const [jobs, setJobs] = React.useState<QueueJob[]>([])
  const [activeResult, setActiveResult] = React.useState<MediaItem | null>(null)
  const [history, setHistory] = React.useState<MediaItem[]>(() => mediaItems.filter((m) => m.type === initialTab))

  function selectTab(type: GenerationType) {
    setMediaType(type)
    setRight(defaultRightConfig(type))
    setActiveResult(null)
    setHistory(mediaItems.filter((m) => m.type === type))
    setSearchParams({ type }, { replace: true })
  }

  function patchLeft(patch: Partial<LeftConfig>) {
    setLeft((prev) => ({ ...prev, ...patch }))
  }
  function patchRight(patch: Partial<RightConfig>) {
    setRight((prev) => ({ ...prev, ...patch }))
  }

  const character = left.characterId ? getCharacter(left.characterId) : undefined
  const template = left.templateId ? getTemplate(left.templateId) : undefined
  const componentNames = left.componentIds.map((id) => getComponent(id)?.name).filter(Boolean) as string[]
  const loraModel = left.loraId ? loraModels.find((l) => l.id === left.loraId) : undefined
  const engine = allEngines.find((e) => e.id === right.engineId)
  const model = engine?.models.find((m) => m.id === right.modelId)

  const promptText = React.useMemo(() => {
    const lines: string[] = []
    if (template) lines.push(template.content)
    lines.push(`Character: ${character?.name ?? 'Unassigned'}`)
    lines.push(`Wardrobe: ${left.wardrobe} · Camera: ${left.camera}`)
    lines.push(`Lighting: ${left.lighting} · Environment: ${left.environment}`)
    if (componentNames.length) lines.push(`Components: ${componentNames.join(', ')}`)
    if (loraModel) lines.push(`LoRA: ${loraModel.name} @ ${left.loraWeight.toFixed(2)}`)
    lines.push(`Engine: ${engine?.name ?? '—'} (${model?.name ?? '—'}) · ${right.resolution}${right.aspectRatio ? ` · ${right.aspectRatio}` : ''}`)
    return lines.join('\n')
  }, [template, character, left, componentNames, loraModel, engine, model, right])

  const activeJob = jobs.find((j) => (j.status === 'Queued' || j.status === 'Processing') && j.type === mediaType)
  const canGenerate = !!character && !activeJob

  function generate() {
    if (!character) return
    const jobId = `job_${Date.now()}`
    const job: QueueJob = { id: jobId, type: mediaType, characterName: character.name, status: 'Queued', progress: 0, createdAt: 'Just now' }
    setJobs((prev) => [job, ...prev])

    setTimeout(() => {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'Processing' } : j)))
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.round(Math.random() * 20 + 12)
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          const [gradientFrom, gradientTo] = gradientPairs[Math.floor(Math.random() * gradientPairs.length)]
          const item: MediaItem = {
            id: `media_gen_${Date.now()}`,
            type: mediaType,
            title: `${character.name} — ${template?.name ?? mediaType} generation`,
            characterId: character.id,
            status: 'Complete',
            engine: engine?.name ?? 'Unknown engine',
            createdAt: 'Just now',
            gradientFrom,
            gradientTo,
            meta: right.resolution,
          }
          addMediaItem(item)
          setHistory((prev) => [item, ...prev])
          setActiveResult(item)
          setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'Complete', progress: 100 } : j)))
          toast({ title: `${mediaType} generated`, description: 'Preview is ready in the canvas.', variant: 'success' })
        } else {
          setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, progress } : j)))
        }
      }, 380)
    }, 500)
  }

  function cancelJob(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  function saveResult() {
    toast({ title: 'Saved to media library', variant: 'success' })
  }

  const statusForStrip: QueueJob['status'] | 'Idle' = activeJob?.status ?? (activeResult ? 'Complete' : 'Idle')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-elevation-1">
        {tabs.map((t) => {
          const meta = generationTypeMeta[t]
          const active = t === mediaType
          return (
            <button
              key={t}
              onClick={() => selectTab(t)}
              className={cn(
                'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                active ? 'text-white shadow-elevation-1' : 'text-foreground-muted hover:bg-muted'
              )}
              style={active ? { backgroundColor: meta.color } : undefined}
            >
              <meta.icon className="size-3.5" />
              {t}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_1fr_280px]">
        <Card className="p-5">
          <GenStudioLeftPanel mediaType={mediaType} config={left} onChange={patchLeft} />
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="relative flex min-h-[380px] flex-1 flex-col items-center justify-center overflow-hidden p-6">
            {activeJob?.status === 'Processing' || activeJob?.status === 'Queued' ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative flex size-16 items-center justify-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="var(--muted)" strokeWidth="5" />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - activeJob.progress / 100)}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="text-sm font-bold text-foreground">{activeJob.status === 'Queued' ? '·' : `${activeJob.progress}%`}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{activeJob.status === 'Queued' ? 'Waiting in queue…' : `Generating ${mediaType.toLowerCase()}…`}</p>
              </div>
            ) : activeResult ? (
              <div className="flex w-full flex-col gap-4">
                <MediaThumbnail item={activeResult} className="h-72 w-full rounded-2xl" />
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{activeResult.title}</p>
                    <p className="text-xs text-foreground-subtle">
                      {activeResult.engine} · {activeResult.meta}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="secondary" size="icon-sm" onClick={generate} aria-label="Regenerate">
                      <RotateCcw />
                    </Button>
                    <Button variant="secondary" size="icon-sm" aria-label="Download">
                      <Download />
                    </Button>
                    <Button size="sm" onClick={saveResult}>
                      <Save />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent">
                  <Sparkles className="size-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">Ready when you are</p>
                <p className="max-w-xs text-xs text-foreground-subtle">Configure the panels on either side, then generate to preview your {mediaType.toLowerCase()} here.</p>
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <GenerationStatusStrip status={statusForStrip} />
              <span className="text-[11px] text-foreground-subtle">
                {character ? character.name : 'No character selected'}
              </span>
            </div>
            <PromptPreview text={promptText} />
          </Card>

          <Button size="lg" onClick={generate} disabled={!canGenerate} className="w-full">
            <Sparkles />
            {activeJob ? 'Generating…' : `Generate ${mediaType}`}
          </Button>
        </div>

        <Card className="p-5">
          <GenStudioRightPanel mediaType={mediaType} config={right} onChange={patchRight} />
        </Card>
      </div>

      <GenerationQueue jobs={jobs} onCancel={cancelJob} />

      {history.length > 0 && (
        <div>
          <h3 className="mb-3 text-[15px] font-semibold text-foreground">Generation history — {mediaType}</h3>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {history.slice(0, 12).map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
