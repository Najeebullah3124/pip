import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Wand2, Dna, Cpu, Fingerprint, Clapperboard, Rocket, ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { StepIndicator } from '@/components/onboarding/step-indicator'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/auth-context'
import { cn } from '@/lib/utils'

interface Step {
  key: string
  eyebrow: string
  title: string
  description: string
  icon: React.ElementType
  bullets?: string[]
}

const steps: Step[] = [
  {
    key: 'welcome',
    eyebrow: 'Welcome to PIP',
    title: 'Your private AI prompt intelligence platform.',
    description:
      'PIP brings prompt design, character modeling, and multi-engine orchestration into one governed workspace — built for teams that can’t compromise on control.',
    icon: Sparkles,
    bullets: ['Enterprise-grade privacy by default', 'One workspace for your whole AI stack', 'Built for teams, not just individuals'],
  },
  {
    key: 'prompt-intelligence',
    eyebrow: 'Prompt Intelligence',
    title: 'Draft, evaluate, and version every prompt with confidence.',
    description:
      'Prompt Studio gives you live model output, automated evaluation scoring, and full version history — so every change is measured, not guessed.',
    icon: Wand2,
    bullets: ['Live testing across connected engines', 'Automated eval scoring on every save', 'Full version history with rollback'],
  },
  {
    key: 'character-dna',
    eyebrow: 'Character DNA',
    title: 'Give every AI persona a consistent, reusable identity.',
    description:
      'Character DNA captures tone, behavior, and knowledge boundaries as a portable profile — reused across prompts, projects, and engines without drift.',
    icon: Dna,
    bullets: ['Voice and behavior locked to spec', 'Reusable across every project', 'Auditable personality boundaries'],
  },
  {
    key: 'ai-engines',
    eyebrow: 'AI Engine Management',
    title: 'Connect and govern every model your team relies on.',
    description:
      'Bring your own model providers, set usage policies, and route workloads intelligently — all from a single control plane.',
    icon: Cpu,
    bullets: ['Bring-your-own-provider support', 'Per-team usage policies and quotas', 'Automatic failover routing'],
  },
  {
    key: 'nexapersona',
    eyebrow: 'NexaPersona',
    title: 'Model identity at a level generic personas can’t reach.',
    description:
      'NexaPersona layers advanced identity modeling on top of Character DNA — for hyper-realistic, deeply consistent AI personas at scale.',
    icon: Fingerprint,
    bullets: ['Deep identity consistency at scale', 'Built on top of Character DNA', 'Tuned for realism-critical use cases'],
  },
  {
    key: 'animovia',
    eyebrow: 'Animovia',
    title: 'Turn your characters into generative video and motion.',
    description:
      'Animovia connects your characters and prompts to generative video pipelines — so your AI personas can move, speak, and perform.',
    icon: Clapperboard,
    bullets: ['Generative video and animation pipelines', 'Directly wired to your characters', 'Render, preview, and iterate in place'],
  },
  {
    key: 'finish',
    eyebrow: 'You’re all set',
    title: 'Your workspace is ready.',
    description:
      'That’s the whole tour. Jump into the Dashboard to create your first prompt, or explore any module from the sidebar whenever you’re ready.',
    icon: Rocket,
  },
]

const stepLabels = ['PIP', 'Prompts', 'Characters', 'Engines', 'NexaPersona', 'Animovia', 'Finish']

export default function OnboardingPage() {
  const [index, setIndex] = React.useState(0)
  const [finishing, setFinishing] = React.useState(false)
  const { completeOnboarding } = useAuth()
  const navigate = useNavigate()

  const step = steps[index]
  const isFirst = index === 0
  const isLast = index === steps.length - 1
  const Icon = step.icon

  async function finish() {
    setFinishing(true)
    await completeOnboarding()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 10%, rgba(124,58,237,0.16) 0%, transparent 42%), radial-gradient(circle at 88% 15%, rgba(196,181,253,0.28) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(139,92,246,0.14) 0%, transparent 45%)',
        }}
      />

      <div className="relative mb-6">
        <Logo />
      </div>

      {!isLast && (
        <button
          onClick={finish}
          className="absolute right-5 top-6 cursor-pointer text-sm font-medium text-foreground-subtle transition-colors hover:text-foreground sm:right-8 sm:top-8"
        >
          Skip for now
        </button>
      )}

      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-7 shadow-elevation-3 sm:p-9">
        <StepIndicator steps={stepLabels} current={index} onStepClick={setIndex} />

        <div key={step.key} className="mt-8 flex flex-col items-center text-center animate-fade-in-up">
          <div
            className={cn(
              'mb-6 flex size-16 items-center justify-center rounded-3xl text-white shadow-elevation-2',
              isLast ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-gradient-to-br from-accent to-accent-700'
            )}
          >
            <Icon className="size-7" />
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-accent">{step.eyebrow}</p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-foreground sm:text-[28px]">
            {step.title}
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-foreground-muted">{step.description}</p>

          {step.bullets && (
            <ul className="mt-6 flex w-full flex-col gap-2.5 text-left">
              {step.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-foreground"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-9 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className={cn(isFirst && 'invisible')}
          >
            <ArrowLeft />
            Back
          </Button>

          {isLast ? (
            <Button size="lg" loading={finishing} onClick={finish} className="min-w-[180px]">
              {finishing ? 'Preparing workspace…' : 'Enter workspace'}
            </Button>
          ) : (
            <Button size="lg" onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))} className="min-w-[140px]">
              Continue
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
