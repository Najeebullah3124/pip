import { Plus, Sparkles, Wand2, UsersRound, Fingerprint, Clapperboard, ShieldCheck } from 'lucide-react'
import { SystemHealthBadge } from '@/components/dashboard/system-health-badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/lib/auth/auth-context'

const poweredApps = [
  { label: 'Prompt Studio', icon: Wand2 },
  { label: 'Characters', icon: UsersRound },
  { label: 'NexaPersona', icon: Fingerprint },
  { label: 'Animovia', icon: Clapperboard },
  { label: 'Private Platform', icon: ShieldCheck },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function WelcomeHeader() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-gradient-to-br from-card via-card to-accent-soft/40 p-6 shadow-elevation-1 sm:p-7">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-700 text-white shadow-elevation-2">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-foreground-muted">
              PIP is the intelligence layer coordinating every prompt, character, and engine behind your AI
              applications — all from one private control plane.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <SystemHealthBadge />
          <Button size="md">
            <Plus />
            New Prompt
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border/70 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">Powering</p>
        <div className="flex flex-wrap items-center gap-2">
          {poweredApps.map((app) => (
            <Tooltip key={app.label}>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted transition-colors hover:border-accent-200 hover:text-accent-700">
                  <app.icon className="size-3.5" />
                  {app.label}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">Live and connected</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}
