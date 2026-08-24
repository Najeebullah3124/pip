import * as React from 'react'
import { Eye, Fingerprint, Blocks, Cpu, Package, Play, X, Copy, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/spinner'
import { getComponent } from '@/data/component-data'
import { getCharacter } from '@/data/character-data'
import type { StudioPrompt } from '@/components/studio/types'

interface StudioRightPanelProps {
  prompt: StudioPrompt
  compiledPrompt: string
  onRemoveComponent: (id: string) => void
  onClearCharacter: () => void
  onTest: () => void
  testing: boolean
  testOutput: string | null
}

export function StudioRightPanel({ prompt, compiledPrompt, onRemoveComponent, onClearCharacter, onTest, testing, testOutput }: StudioRightPanelProps) {
  const [copied, setCopied] = React.useState(false)
  const character = prompt.characterId ? getCharacter(prompt.characterId) : undefined

  const pkg = {
    name: prompt.name,
    engine: prompt.aiEngine,
    settings: prompt.aiSettings,
    system: prompt.systemInstructions,
    prompt: compiledPrompt,
    negative: prompt.negativePrompt,
    variables: prompt.variables,
    components: prompt.componentIds.map((id) => getComponent(id)?.name).filter(Boolean),
    character: character?.name ?? null,
  }
  const pkgJson = JSON.stringify(pkg, null, 2)

  function copyPackage() {
    navigator.clipboard?.writeText(pkgJson).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <Card className="p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
          <Eye className="size-3.5" />
          Live preview
        </p>
        <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-foreground-muted">
          {compiledPrompt || <span className="text-foreground-subtle">Start writing to see a live preview…</span>}
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <Fingerprint className="size-3.5" />
            Character DNA
          </p>
          {character && (
            <button onClick={onClearCharacter} className="cursor-pointer text-foreground-subtle hover:text-foreground" aria-label="Clear character">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        {character ? (
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
            >
              {character.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{character.name}</p>
              <p className="truncate text-xs text-foreground-subtle">{character.personality.archetype} · {character.voice.provider}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-foreground-subtle">No character selected — pick one from the Characters tab.</p>
        )}
      </Card>

      <Card className="p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
          <Blocks className="size-3.5" />
          Selected components ({prompt.componentIds.length})
        </p>
        {prompt.componentIds.length === 0 ? (
          <p className="text-xs text-foreground-subtle">None yet — drag components from the left panel into the editor.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {prompt.componentIds.map((id) => {
              const c = getComponent(id)
              if (!c) return null
              return (
                <div key={id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/60 px-2.5 py-1.5">
                  <span className="truncate text-xs font-medium text-foreground">{c.name}</span>
                  <button onClick={() => onRemoveComponent(id)} className="cursor-pointer text-foreground-subtle hover:text-destructive" aria-label={`Remove ${c.name}`}>
                    <X className="size-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
          <Cpu className="size-3.5" />
          AI engine
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{prompt.aiEngine}</Badge>
          <span className="text-[11px] text-foreground-subtle">
            temp {(prompt.aiSettings.temperature / 100).toFixed(2)} · top-p {(prompt.aiSettings.topP / 100).toFixed(2)}
          </span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <Package className="size-3.5" />
            Generated prompt package
          </p>
          <button onClick={copyPackage} className="cursor-pointer text-foreground-subtle hover:text-foreground" aria-label="Copy package JSON">
            {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
          </button>
        </div>
        <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-ink-950 p-3 text-[10px] leading-relaxed text-emerald-300">{pkgJson}</pre>
      </Card>

      <Button onClick={onTest} loading={testing} size="lg" className="w-full">
        <Play />
        {testing ? 'Running test…' : 'Test prompt'}
      </Button>

      {testOutput && (
        <Card className="border-accent-200 bg-accent-soft p-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent-700">Test output</p>
          <p className="text-sm leading-relaxed text-accent-700">{testOutput}</p>
        </Card>
      )}

      {testing && (
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-foreground-muted">
          <Spinner size={18} />
          Compiling with {prompt.aiEngine}…
        </div>
      )}
    </div>
  )
}
