import * as React from 'react'
import { Sparkles, Fingerprint, Cpu, Wand2 } from 'lucide-react'
import { Logo } from '@/components/layout/logo'

const floatingChips = [
  { label: 'Prompt Intelligence', icon: Wand2, className: 'left-[8%] top-[18%]', delay: '0s' },
  { label: 'Character DNA', icon: Fingerprint, className: 'right-[6%] top-[38%]', delay: '0.6s' },
  { label: 'AI Engines', icon: Cpu, className: 'left-[14%] bottom-[16%]', delay: '1.1s' },
]

interface AuthVisualPanelProps {
  headline: React.ReactNode
  subheadline?: string
}

export function AuthVisualPanel({ headline, subheadline }: AuthVisualPanelProps) {
  return (
    <div className="relative hidden overflow-hidden bg-ink-950 lg:flex lg:w-[46%] xl:w-1/2">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 15%, rgba(196,181,253,0.35) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(124,58,237,0.45) 0%, transparent 40%), radial-gradient(circle at 50% 90%, rgba(139,92,246,0.35) 0%, transparent 50%), #0b0b12',
        }}
      />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]" />

      {floatingChips.map((chip) => (
        <div
          key={chip.label}
          className={`absolute hidden animate-fade-in-up items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-medium text-white/90 shadow-elevation-3 backdrop-blur-md xl:flex ${chip.className}`}
          style={{ animationDelay: chip.delay, animationFillMode: 'backwards' }}
        >
          <chip.icon className="size-3.5 text-accent-200" />
          {chip.label}
        </div>
      ))}

      <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
        <Logo className="[&_span]:text-white" />

        <div className="max-w-md">
          <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
            <Sparkles className="size-5" />
          </div>
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white">{headline}</h2>
          {subheadline && <p className="mt-3 text-[15px] leading-relaxed text-white/60">{subheadline}</p>}
        </div>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} PIP — Private AI Prompt Intelligence Platform</p>
      </div>
    </div>
  )
}
