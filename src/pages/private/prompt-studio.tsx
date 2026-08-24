import { Link } from 'react-router-dom'
import { FlaskConical, TestTube2, SlidersHorizontal, Library, ArrowUpRight, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PrivateBadge } from '@/components/private/private-badge'
import { privatePromptTemplates, promptTestRuns, type PrivateStatus } from '@/data/private-data'

const statusVariant: Record<PrivateStatus, 'outline' | 'accent' | 'success' | 'destructive'> = {
  Draft: 'outline',
  Active: 'success',
  Testing: 'accent',
  Archived: 'destructive',
}

const tools = [
  { key: 'builder', label: 'Prompt Builder', description: 'Write and version system prompts with detected variables.', href: '/private-platform/prompt-builder', icon: FlaskConical },
  { key: 'tester', label: 'Prompt Tester', description: 'Run templates against sample inputs and review output.', href: '/private-platform/prompt-tester', icon: TestTube2 },
  { key: 'optimizer', label: 'Prompt Optimizer', description: 'Get AI-assisted suggestions to harden a template.', href: '/private-platform/prompt-optimizer', icon: SlidersHorizontal },
  { key: 'library', label: 'Prompt Library', description: 'Browse every private prompt template by category.', href: '/private-platform/prompt-library', icon: Library },
]

export default function PrivatePromptStudioPage() {
  const active = privatePromptTemplates.filter((t) => t.status === 'Active').length
  const recent = privatePromptTemplates.slice(0, 6)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-foreground-muted">The private hub for building, testing, and optimizing the prompt assets behind every generation in NexaPersona and Animovia.</p>
        <PrivateBadge />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-1 border-amber-400/15 p-4">
          <p className="text-xs text-foreground-subtle">Templates</p>
          <p className="text-2xl font-bold text-foreground">{privatePromptTemplates.length}</p>
        </Card>
        <Card className="flex flex-col gap-1 border-amber-400/15 p-4">
          <p className="text-xs text-foreground-subtle">Active in production</p>
          <p className="text-2xl font-bold text-foreground">{active}</p>
        </Card>
        <Card className="flex flex-col gap-1 border-amber-400/15 p-4">
          <p className="text-xs text-foreground-subtle">Test runs logged</p>
          <p className="text-2xl font-bold text-foreground">{promptTestRuns.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.key} to={tool.href}>
            <Card className="group flex h-full cursor-pointer flex-col gap-3 border-amber-400/15 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-elevation-2">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <tool.icon className="size-[18px]" />
                </span>
                <ArrowUpRight className="size-3.5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                <p className="mt-1 text-xs text-foreground-subtle">{tool.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Recent templates</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/private-platform/prompt-library">
              View all
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((t) => (
            <Link key={t.id} to={`/private-platform/prompt-builder?template=${t.id}`}>
              <Card className="group flex h-full cursor-pointer flex-col gap-2 border-amber-400/15 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-elevation-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <FileText className="size-3.5" />
                  </span>
                  <Badge variant={statusVariant[t.status]} className="text-[10px]">
                    {t.status}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-[11px] text-foreground-subtle">{t.category} · {t.version}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
