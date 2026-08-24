import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ComponentMultiSelect } from '@/components/studio/tester/component-multiselect'
import { templates, aiEngines } from '@/data/template-data'
import { characters } from '@/data/character-data'
import type { NodeKey, PipelineState } from '@/components/studio/pipeline/pipeline-types'
import type { CompiledPackage } from '@/lib/prompt-compile'
import { PackageViewer } from '@/components/studio/pipeline/package-viewer'

const maxTokenOptions = ['256', '512', '1024', '2048', '4096', '8192']

interface NodeConfigDialogProps {
  nodeKey: NodeKey | null
  state: PipelineState
  onChange: (patch: Partial<PipelineState>) => void
  onOpenChange: (open: boolean) => void
  compiledPackage: CompiledPackage | null
}

const nodeMeta: Record<NodeKey, { title: string; description: string }> = {
  request: { title: 'Request', description: 'The raw natural-language request that starts the pipeline.' },
  template: { title: 'Template', description: 'The prompt template selected to structure this request.' },
  character: { title: 'Character DNA', description: 'The character identity applied to this generation.' },
  components: { title: 'Components', description: 'Reusable prompt components attached to this request.' },
  settings: { title: 'AI settings', description: 'The engine and generation parameters used.' },
  package: { title: 'Prompt package', description: 'The final structured package sent for generation.' },
}

export function NodeConfigDialog({ nodeKey, state, onChange, onOpenChange, compiledPackage }: NodeConfigDialogProps) {
  const meta = nodeKey ? nodeMeta[nodeKey] : null

  return (
    <Dialog open={!!nodeKey} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="max-w-lg">
        {meta && (
          <>
            <DialogHeader>
              <DialogTitle>{meta.title}</DialogTitle>
              <DialogDescription>{meta.description}</DialogDescription>
            </DialogHeader>

            {nodeKey === 'request' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pipeline-request">Request</Label>
                <Textarea
                  id="pipeline-request"
                  rows={4}
                  value={state.request}
                  onChange={(e) => onChange({ request: e.target.value })}
                  placeholder="e.g. Generate a hero product shot for our new wireless headphones…"
                />
              </div>
            )}

            {nodeKey === 'template' && (
              <div className="flex flex-col gap-1.5">
                <Label>Template</Label>
                <Select value={state.templateId ?? undefined} onValueChange={(v) => onChange({ templateId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {templates.slice(0, 40).map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {nodeKey === 'character' && (
              <div className="flex flex-col gap-1.5">
                <Label>Character</Label>
                <Select value={state.characterId ?? 'none'} onValueChange={(v) => onChange({ characterId: v === 'none' ? null : v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a character" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="none">No character</SelectItem>
                    {characters.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {nodeKey === 'components' && (
              <div className="flex flex-col gap-1.5">
                <Label>Components</Label>
                <ComponentMultiSelect value={state.componentIds} onChange={(ids) => onChange({ componentIds: ids })} />
              </div>
            )}

            {nodeKey === 'settings' && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>AI engine</Label>
                    <Select value={state.engine} onValueChange={(v) => onChange({ engine: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiEngines.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Max tokens</Label>
                    <Select value={String(state.maxTokens)} onValueChange={(v) => onChange({ maxTokens: Number(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {maxTokenOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <Label>Temperature</Label>
                    <span className="text-xs font-semibold tabular-nums text-foreground-muted">{(state.temperature / 100).toFixed(2)}</span>
                  </div>
                  <Slider value={[state.temperature]} max={100} step={1} onValueChange={([v]) => onChange({ temperature: v })} />
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <Label>Top-p</Label>
                    <span className="text-xs font-semibold tabular-nums text-foreground-muted">{(state.topP / 100).toFixed(2)}</span>
                  </div>
                  <Slider value={[state.topP]} max={100} step={1} onValueChange={([v]) => onChange({ topP: v })} />
                </div>
              </div>
            )}

            {nodeKey === 'package' &&
              (compiledPackage ? (
                <PackageViewer pkg={compiledPackage} />
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Badge variant="outline">Not generated yet</Badge>
                  <p className="text-sm text-foreground-subtle">Run the pipeline to compile the final prompt package.</p>
                </div>
              ))}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
