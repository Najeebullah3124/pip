import * as React from 'react'
import {
  Wand2, Save, Copy, Play, Sparkles, Eye, Rocket, History, Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { StudioLeftPanel } from '@/components/studio/studio-left-panel'
import { StudioRightPanel } from '@/components/studio/studio-right-panel'
import { HighlightedEditor } from '@/components/studio/highlighted-editor'
import { AiSettingsCard } from '@/components/studio/ai-settings-card'
import { VersionHistoryDialog } from '@/components/studio/version-history-dialog'
import type { StudioPrompt, StudioVersion } from '@/components/studio/types'
import { getTemplate } from '@/data/template-data'
import { components as libraryComponents } from '@/data/component-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const VAR_RE = /\{\{(\w+)\}\}/g

function extractVariableNames(...texts: string[]): string[] {
  const names = new Set<string>()
  for (const text of texts) {
    for (const match of text.matchAll(VAR_RE)) names.add(match[1])
  }
  return [...names]
}

function insertAtPosition(current: string, insertText: string, pos: number) {
  const safePos = Math.min(Math.max(pos, 0), current.length)
  return current.slice(0, safePos) + insertText + current.slice(safePos)
}

function initialPrompt(): StudioPrompt {
  return {
    name: 'Untitled prompt',
    status: 'Draft',
    version: 'v1.0',
    promptBody:
      'Generate a {{shot_type}} of {{subject}}, incorporating [[Consistent Identity Core]] and [[Studio Portrait LoRA]] for consistent identity. Style: {{style}}. Aspect ratio {{aspect_ratio}}.',
    systemInstructions: 'You are generating on-brand visual content for PIP. Always maintain character identity consistency and follow brand wardrobe guidelines.',
    negativePrompt: 'blurry, watermark, extra limbs, deformed hands, low resolution, inconsistent facial features',
    variables: {
      shot_type: 'medium close-up',
      subject: 'Nova greeting a new customer',
      style: 'cinematic editorial',
      aspect_ratio: '4:5',
    },
    componentIds: ['cmp_000', 'cmp_004'],
    characterId: 'char_001',
    aiEngine: 'Claude Opus 5',
    aiSettings: { temperature: 70, topP: 90, maxTokens: 2048 },
    versions: [
      {
        version: 'v1.0',
        changelog: 'Initial draft',
        updatedAt: 'Today',
        snapshot: { promptBody: '', systemInstructions: '', negativePrompt: '', variables: {} },
      },
    ],
  }
}

export function PromptEditorWorkspace() {
  const { toast } = useToast()
  const [prompt, setPrompt] = React.useState<StudioPrompt>(initialPrompt)
  const [bodyCursor, setBodyCursor] = React.useState(0)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [pendingTemplateId, setPendingTemplateId] = React.useState<string | null>(null)
  const [testing, setTesting] = React.useState(false)
  const [testOutput, setTestOutput] = React.useState<string | null>(null)
  const [optimizing, setOptimizing] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const variableNames = React.useMemo(
    () => extractVariableNames(prompt.promptBody, prompt.systemInstructions, prompt.negativePrompt),
    [prompt.promptBody, prompt.systemInstructions, prompt.negativePrompt]
  )
  const allVariableNames = React.useMemo(
    () => [...new Set([...variableNames, ...Object.keys(prompt.variables)])],
    [variableNames, prompt.variables]
  )

  const compiledPrompt = React.useMemo(
    () => prompt.promptBody.replace(VAR_RE, (_, name) => prompt.variables[name] || `[${name}]`),
    [prompt.promptBody, prompt.variables]
  )

  function patch(p: Partial<StudioPrompt>) {
    setPrompt((prev) => ({ ...prev, ...p }))
  }

  function insertIntoBody(text: string, pos?: number) {
    setPrompt((prev) => ({ ...prev, promptBody: insertAtPosition(prev.promptBody, text, pos ?? bodyCursor) }))
  }

  function handleAddComponent(componentId: string) {
    const already = prompt.componentIds.includes(componentId)
    if (already) {
      patch({ componentIds: prompt.componentIds.filter((id) => id !== componentId) })
    } else {
      const c = libraryComponents.find((x) => x.id === componentId)
      patch({ componentIds: [...prompt.componentIds, componentId] })
      if (c) insertIntoBody(`[[${c.name}]]`)
    }
  }

  function handleDropText(text: string, pos: number) {
    insertIntoBody(text, pos)
    const nameMatch = text.match(/^\[\[(.+)\]\]$/)
    if (nameMatch) {
      const c = libraryComponents.find((x) => x.name === nameMatch[1])
      if (c && !prompt.componentIds.includes(c.id)) {
        patch({ componentIds: [...prompt.componentIds, c.id] })
      }
    }
  }

  function handleSelectCharacter(characterId: string) {
    patch({ characterId: prompt.characterId === characterId ? null : characterId })
  }

  function handleInsertVariable(name: string) {
    insertIntoBody(`{{${name}}}`)
  }

  function handleAddVariable(name: string) {
    patch({ variables: { ...prompt.variables, [name]: prompt.variables[name] ?? '' } })
    insertIntoBody(`{{${name}}}`)
  }

  function confirmLoadTemplate(templateId: string) {
    if (prompt.promptBody.trim()) {
      setPendingTemplateId(templateId)
    } else {
      applyTemplate(templateId)
    }
  }

  function applyTemplate(templateId: string) {
    const t = getTemplate(templateId)
    if (!t) return
    patch({ promptBody: t.content, aiEngine: t.aiEngine, name: t.name })
    setPendingTemplateId(null)
    toast({ title: 'Template loaded', description: `"${t.name}" was loaded into the editor.`, variant: 'success' })
  }

  function saveVersion(changelog: string) {
    const nextVersionNum = parseFloat(prompt.version.replace('v', '')) + 1
    const nextVersion = `v${nextVersionNum}.0`
    const versionEntry: StudioVersion = {
      version: nextVersion,
      changelog,
      updatedAt: 'Today',
      snapshot: {
        promptBody: prompt.promptBody,
        systemInstructions: prompt.systemInstructions,
        negativePrompt: prompt.negativePrompt,
        variables: prompt.variables,
      },
    }
    patch({ version: nextVersion, versions: [versionEntry, ...prompt.versions] })
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    const nextVersionNum = parseFloat(prompt.version.replace('v', '')) + 1
    saveVersion('Manual save')
    setSaving(false)
    toast({ title: 'Prompt saved', description: `Saved as v${nextVersionNum}.0.`, variant: 'success' })
  }

  function handleDuplicate() {
    setPrompt((prev) => ({
      ...prev,
      name: `${prev.name} Copy`,
      status: 'Draft',
      version: 'v1.0',
      versions: [{ version: 'v1.0', changelog: 'Duplicated', updatedAt: 'Today', snapshot: prev.versions[0].snapshot }],
    }))
    toast({ title: 'Prompt duplicated', description: 'Working on a fresh copy now.', variant: 'success' })
  }

  async function handleTest() {
    setTesting(true)
    setTestOutput(null)
    await new Promise((r) => setTimeout(r, 1400))
    setTestOutput('Generation complete — output matches the compiled brief with strong fidelity to identity, wardrobe, and framing instructions.')
    setTesting(false)
    toast({ title: 'Test run complete', variant: 'success' })
  }

  async function handleOptimize() {
    setOptimizing(true)
    await new Promise((r) => setTimeout(r, 1300))
    const guardrails = ['oversaturated', 'harsh shadows', 'text artifacts']
    const missing = guardrails.filter((g) => !prompt.negativePrompt.includes(g))
    if (missing.length) {
      patch({ negativePrompt: `${prompt.negativePrompt}, ${missing.join(', ')}` })
    }
    setOptimizing(false)
    toast({ title: 'Prompt optimized', description: 'Added quality guardrails to your negative prompt.', variant: 'success' })
  }

  function handlePublish() {
    if (!prompt.promptBody.trim()) {
      toast({ title: 'Add prompt content before publishing', variant: 'destructive' })
      return
    }
    patch({ status: 'Published' })
    saveVersion('Published')
    toast({ title: 'Prompt published', description: `${prompt.name} is now live.`, variant: 'success' })
  }

  function restoreVersion(v: StudioVersion) {
    patch({
      version: v.version,
      promptBody: v.snapshot.promptBody || prompt.promptBody,
      systemInstructions: v.snapshot.systemInstructions || prompt.systemInstructions,
      negativePrompt: v.snapshot.negativePrompt || prompt.negativePrompt,
      variables: Object.keys(v.snapshot.variables).length ? v.snapshot.variables : prompt.variables,
    })
    setHistoryOpen(false)
    toast({ title: `Restored ${v.version}`, variant: 'success' })
  }

  return (
    <div className="flex h-[calc(100dvh-280px)] min-h-[600px] flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-elevation-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-700 text-white shadow-elevation-1">
            <Wand2 className="size-[18px]" />
          </div>
          <Input
            value={prompt.name}
            onChange={(e) => patch({ name: e.target.value })}
            className="h-9 max-w-xs border-transparent bg-transparent text-[15px] font-semibold shadow-none hover:border-input focus-visible:border-input"
          />
          <Badge variant={prompt.status === 'Published' ? 'success' : 'accent'}>{prompt.status}</Badge>
          <Badge variant="outline">{prompt.version}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
            <History />
            History
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDuplicate}>
            <Copy />
            Duplicate
          </Button>
          <Button variant="secondary" size="sm" loading={saving} onClick={handleSave}>
            <Save />
            Save
          </Button>
          <Button variant="secondary" size="sm" loading={optimizing} onClick={handleOptimize}>
            {optimizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Optimize
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye />
            Preview
          </Button>
          <Button size="sm" loading={testing} onClick={handleTest}>
            <Play />
            Test
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Rocket />
            Publish
          </Button>
        </div>
      </div>

      {/* Workspace */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[240px_1fr_340px]">
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-1 xl:block">
          <StudioLeftPanel
            selectedComponentIds={prompt.componentIds}
            selectedCharacterId={prompt.characterId}
            variableNames={allVariableNames}
            onLoadTemplate={confirmLoadTemplate}
            onAddComponent={handleAddComponent}
            onSelectCharacter={handleSelectCharacter}
            onInsertVariable={handleInsertVariable}
            onAddVariable={handleAddVariable}
          />
        </div>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-elevation-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Prompt editor</Label>
              <span className="text-[11px] text-foreground-subtle">{prompt.promptBody.length} chars</span>
            </div>
            <HighlightedEditor
              value={prompt.promptBody}
              onChange={(v) => patch({ promptBody: v })}
              onCursorMove={setBodyCursor}
              onDropText={handleDropText}
              minHeight={180}
              placeholder="Describe what you want to generate — drag components in, or type {{variables}}…"
            />
          </div>

          {allVariableNames.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Variables</Label>
              <div className="flex flex-wrap gap-2">
                {allVariableNames.map((name) => (
                  <div key={name} className="flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-soft py-1 pl-2.5 pr-1">
                    <span className="font-mono text-[11px] text-accent-700">{name}</span>
                    <input
                      value={prompt.variables[name] ?? ''}
                      onChange={(e) => patch({ variables: { ...prompt.variables, [name]: e.target.value } })}
                      placeholder="value…"
                      className="h-6 w-28 rounded-full bg-surface px-2 text-[11px] text-foreground outline-none placeholder:text-foreground-subtle"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="system-instructions" className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
              System instructions
            </Label>
            <HighlightedEditor value={prompt.systemInstructions} onChange={(v) => patch({ systemInstructions: v })} minHeight={80} placeholder="Set the model's role and behavioral guardrails…" />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Negative prompt</Label>
            <HighlightedEditor value={prompt.negativePrompt} onChange={(v) => patch({ negativePrompt: v })} minHeight={64} placeholder="What to avoid in generation…" />
          </div>

          <AiSettingsCard
            aiEngine={prompt.aiEngine}
            settings={prompt.aiSettings}
            onEngineChange={(engine) => patch({ aiEngine: engine })}
            onSettingsChange={(s) => patch({ aiSettings: { ...prompt.aiSettings, ...s } })}
          />
        </div>

        <div className={cn('overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-1')}>
          <StudioRightPanel
            prompt={prompt}
            compiledPrompt={compiledPrompt}
            onRemoveComponent={handleAddComponent}
            onClearCharacter={() => patch({ characterId: null })}
            onTest={handleTest}
            testing={testing}
            testOutput={testOutput}
          />
        </div>
      </div>

      <VersionHistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} versions={prompt.versions} onRestore={restoreVersion} />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-4.5 text-accent" />
              Preview — {prompt.name}
            </DialogTitle>
            <DialogDescription>The fully compiled prompt PIP will send to {prompt.aiEngine}.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border bg-surface-2 p-3.5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">System</p>
              <p className="text-sm text-foreground-muted">{prompt.systemInstructions}</p>
            </div>
            <div className="rounded-xl border border-accent-200 bg-accent-soft p-3.5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent-700">Prompt</p>
              <p className="text-sm text-accent-700">{compiledPrompt}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-3.5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Negative</p>
              <p className="text-sm text-foreground-muted">{prompt.negativePrompt}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingTemplateId} onOpenChange={(open) => !open && setPendingTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace current prompt content?</AlertDialogTitle>
            <AlertDialogDescription>Loading this template will overwrite your current editor content. This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingTemplateId && applyTemplate(pendingTemplateId)}>Load template</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
