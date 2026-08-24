import { Link } from 'react-router-dom'
import {
  FilePlus2,
  UserPlus,
  FlaskConical,
  PackagePlus,
  PlugZap,
  Fingerprint,
  Clapperboard,
  ArrowUpRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const actions = [
  { label: 'Create Prompt', description: 'Start a new prompt draft', icon: FilePlus2, href: '/prompt-studio' },
  { label: 'Create Character', description: 'Design a new AI persona', icon: UserPlus, href: '/characters' },
  { label: 'Test Prompt', description: 'Run a live evaluation', icon: FlaskConical, href: '/prompt-studio' },
  { label: 'Generate Package', description: 'Bundle assets for release', icon: PackagePlus, href: '/projects' },
  { label: 'Add AI Engine', description: 'Connect a model provider', icon: PlugZap, href: '/ai-engines' },
  { label: 'Open NexaPersona', description: 'Deep identity modeling', icon: Fingerprint, href: '/nexapersona' },
  { label: 'Open Animovia', description: 'Generative video pipelines', icon: Clapperboard, href: '/animovia' },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-[15px] font-semibold text-foreground">Quick actions</h2>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Card className="group flex h-full cursor-pointer flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevation-2">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent transition-colors group-hover:from-accent group-hover:to-accent-700 group-hover:text-white">
                  <action.icon className="size-[18px]" />
                </div>
                <ArrowUpRight className="size-3.5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="mt-0.5 text-xs text-foreground-muted">{action.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
