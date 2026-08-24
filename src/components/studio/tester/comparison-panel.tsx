import {
  Sparkles, Zap, Cpu, Blocks, Play, CheckCircle2, TrendingUp, Save, GitCompareArrows, History,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/shared/spinner'
import { cn } from '@/lib/utils'
import type { TestRun } from '@/components/studio/tester/tester-types'
import type { CompiledPackage } from '@/lib/prompt-compile'

interface ComparisonPanelProps {
  run: TestRun
  optimizing: boolean
  testingSide: 'original' | 'optimized' | null
  nextVersionLabel: string
  onOptimize: () => void
  onRunTest: (side: 'original' | 'optimized') => void
  onApplyOptimization: () => void
  onSaveAsNewVersion: () => void
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex size-11 items-center justify-center rounded-full" style={{ background: `conic-gradient(var(--accent) ${score}%, var(--muted) 0)` }}>
        <div className="flex size-9 items-center justify-center rounded-full bg-card text-xs font-bold text-foreground">{score}</div>
      </div>
      <span className="text-xs text-foreground-subtle">quality score</span>
    </div>
  )
}

function SectionBlock({ label, content, changed }: { label: string; content: string; changed?: boolean }) {
  return (
    <div className={cn('rounded-xl border p-3', changed ? 'border-accent-200 bg-accent-soft' : 'border-border bg-surface-2')}>
      <div className="mb-1 flex items-center justify-between">
        <p className={cn('text-[10px] font-semibold uppercase tracking-wide', changed ? 'text-accent-700' : 'text-foreground-subtle')}>{label}</p>
        {changed && <Badge variant="accent" className="text-[9px]">Changed</Badge>}
      </div>
      <p className={cn('text-xs leading-relaxed', changed ? 'text-accent-700' : 'text-foreground-muted')}>{content}</p>
    </div>
  )
}

function PackageColumn({
  title,
  pkg,
  score,
  version,
  changedSections,
  newComponents,
  testResult,
  testing,
  onRunTest,
  accent,
}: {
  title: string
  pkg: CompiledPackage
  score: number
  version: string
  changedSections: string[]
  newComponents: string[]
  testResult: string | null
  testing: boolean
  onRunTest: () => void
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <Badge variant={accent ? 'accent' : 'outline'}>{version}</Badge>
        </div>
        <ScoreRing score={score} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-subtle">
        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
          <Cpu className="size-2.5" />
          {pkg.engine}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
          <Zap className="size-2.5" />
          {pkg.tokens} tokens
        </span>
      </div>

      <SectionBlock label="System" content={pkg.system} />
      <SectionBlock label="Prompt" content={pkg.prompt} changed={changedSections.includes('Prompt')} />
      <SectionBlock label="Negative" content={pkg.negative} changed={changedSections.includes('Negative prompt')} />

      <div>
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">
          <Blocks className="size-3" />
          Components ({pkg.componentNames.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {pkg.componentNames.length === 0 && <span className="text-xs text-foreground-subtle">None</span>}
          {pkg.componentNames.map((name) => (
            <Badge key={name} variant={newComponents.includes(name) ? 'accent' : 'outline'} className="text-[10px]">
              {newComponents.includes(name) && '+ '}
              {name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-1 flex flex-col gap-2">
        <Button variant="secondary" size="sm" onClick={onRunTest} loading={testing}>
          <Play />
          {testing ? 'Running test…' : 'Run test'}
        </Button>
        {testResult && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
            {testResult}
          </div>
        )}
      </div>
    </div>
  )
}

export function ComparisonPanel({ run, optimizing, testingSide, nextVersionLabel, onOptimize, onRunTest, onApplyOptimization, onSaveAsNewVersion }: ComparisonPanelProps) {
  const newComponents = run.optimized ? run.optimized.componentNames.filter((n) => !run.original.componentNames.includes(n)) : []
  const tokenDelta = run.optimized ? run.optimized.tokens - run.original.tokens : 0
  const scoreDelta = run.optimizedScore !== null ? run.optimizedScore - run.originalScore : 0

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="size-4.5 text-accent" />
          <p className="text-[15px] font-semibold text-foreground">{run.label}</p>
        </div>
        <div className="flex items-center gap-1.5" title="Version history for this run">
          <History className="size-3.5 text-foreground-subtle" />
          {run.versions.map((v) => (
            <Badge key={v.version} variant={v.version === run.version ? 'accent' : 'outline'} title={`${v.source} · ${v.createdAt}`}>
              {v.version}
            </Badge>
          ))}
        </div>
      </div>

      {run.improvements.length > 0 && (
        <Card className="flex flex-col gap-2 border-accent-200 bg-accent-soft p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-700">
            <TrendingUp className="size-3.5" />
            Quality improvements {scoreDelta > 0 && <span className="ml-1 rounded-full bg-accent-700 px-2 py-0.5 text-[10px] text-white">+{scoreDelta} pts</span>}
          </p>
          <ul className="flex flex-col gap-1">
            {run.improvements.map((imp) => (
              <li key={imp} className="flex items-start gap-2 text-xs text-accent-700">
                <span className="mt-1 size-1 shrink-0 rounded-full bg-accent-700" />
                {imp}
              </li>
            ))}
          </ul>
          {tokenDelta !== 0 && (
            <p className="text-[11px] text-accent-700/80">Token count {tokenDelta > 0 ? 'increased' : 'decreased'} by {Math.abs(tokenDelta)} ({run.original.tokens} → {run.optimized?.tokens}).</p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PackageColumn
          title="Original Prompt"
          pkg={run.original}
          score={run.originalScore}
          version={run.version}
          changedSections={[]}
          newComponents={[]}
          testResult={run.originalTestResult}
          testing={testingSide === 'original'}
          onRunTest={() => onRunTest('original')}
        />

        {run.optimized ? (
          <PackageColumn
            title="Optimized Prompt"
            pkg={run.optimized}
            score={run.optimizedScore ?? 0}
            version={`${nextVersionLabel} · preview`}
            changedSections={run.changedSections}
            newComponents={newComponents}
            testResult={run.optimizedTestResult}
            testing={testingSide === 'optimized'}
            onRunTest={() => onRunTest('optimized')}
            accent
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-strong bg-surface-2/60 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No optimized version yet</p>
              <p className="mt-1 max-w-xs text-xs text-foreground-subtle">Run the optimizer to generate an improved version with quality guardrails and structural refinements.</p>
            </div>
            <Button onClick={onOptimize} loading={optimizing}>
              {optimizing ? <Spinner size={16} className="text-white" /> : <Sparkles />}
              {optimizing ? 'Optimizing…' : 'Optimize prompt'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border pt-5">
        <Button variant="secondary" onClick={onSaveAsNewVersion}>
          <Save />
          Save as new version
        </Button>
        <Button onClick={onApplyOptimization} disabled={!run.optimized}>
          <CheckCircle2 />
          Apply optimization
        </Button>
      </div>
    </div>
  )
}
