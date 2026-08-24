import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { categoryMeta, type PromptComponent } from '@/data/component-data'

function exampleFill(content: string) {
  const sample: Record<string, string> = {
    eye_color: 'hazel',
    hair_style: 'shoulder-length waves',
    model_name: 'nova-identity-v3',
    weight: '0.85',
    trigger_word: 'novadna',
    outfit: 'charcoal knit blazer',
    style: 'minimal tailored',
    palette: 'ink navy, ivory',
    angle: 'eye-level portrait',
    lens: '50mm f/1.4',
    framing: 'medium shot',
    dof: '45',
    temperature: '5200',
    mood: 'warm & inviting',
    setting: 'modern studio',
    background_style: 'softly blurred bokeh',
    time_of_day: 'golden hour',
    pose_name: 'confident stance',
    provider: 'ElevenLabs',
    accent: 'neutral American',
    pitch: '50',
    speed: '50',
    setup: 'introduce the problem',
    conflict: 'explore the tension',
    resolution: 'land on the solution',
    integration_style: 'lifestyle context',
    tags: 'support, enterprise',
    rights: 'internal use',
    application: 'prompt-studio',
  }
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => sample[key] ?? key)
}

export function ComponentPreviewDialog({
  component,
  open,
  onOpenChange,
}: {
  component: PromptComponent
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const meta = categoryMeta[component.category]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md text-white" style={{ backgroundColor: meta.color }}>
              <meta.icon className="size-3.5" />
            </span>
            Preview — {component.name}
          </DialogTitle>
          <DialogDescription>How this component resolves when compiled into a live prompt.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Definition template</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-surface-2 p-3.5 text-xs leading-relaxed text-foreground-muted">{component.content}</pre>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Compiled example</p>
          <div className="rounded-xl border border-accent-200 bg-accent-soft p-3.5 text-sm leading-relaxed text-accent-700">
            {exampleFill(component.content)}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {component.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
