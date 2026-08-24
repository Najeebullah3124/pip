import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ShieldCheck, LockKeyhole } from 'lucide-react'
import { privateNavItems } from '@/components/private/private-nav-config'
import { privatePromptTemplates, privateCharacters } from '@/data/private-data'
import { PrivateBadge } from '@/components/private/private-badge'
import { cn } from '@/lib/utils'

export function PrivateLayout() {
  const location = useLocation()
  const current = privateNavItems.find((item) => (item.end ? location.pathname === item.href : location.pathname.startsWith(item.href)))

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 shadow-elevation-2">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 10% 10%, rgba(251,191,36,0.16) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(251,146,60,0.12) 0%, transparent 45%), linear-gradient(135deg, #0a0a0c, #1c1712 55%, #0a0a0c)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(135deg,white_0px,white_1px,transparent_1px,transparent_14px)]" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0" />

        <div className="relative flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-400">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white">Private Owner Platform</h1>
                  <PrivateBadge />
                </div>
                <p className="mt-1 max-w-lg text-sm text-white/60">
                  Internal workspace for building, testing, optimizing, and managing the prompt assets that power NexaPersona and Animovia. Not visible to standard workspace members.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-white">{privatePromptTemplates.length}</p>
                <p className="text-[11px] text-white/50">private prompts</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-right">
                <p className="text-lg font-bold text-white">{privateCharacters.length}</p>
                <p className="text-[11px] text-white/50">private characters</p>
              </div>
            </div>
          </div>

          <nav className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1">
            {privateNavItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all',
                    isActive ? 'bg-amber-400 text-ink-950 shadow-elevation-1' : 'text-white/60 hover:bg-white/10 hover:text-white'
                  )
                }
              >
                <item.icon className="size-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-400/40 bg-amber-500/[0.06] px-4 py-2.5 text-xs text-amber-700 dark:text-amber-400">
        <LockKeyhole className="size-3.5 shrink-0" />
        Everything in this workspace is isolated from standard PIP libraries — private prompts, characters, and media never appear in NexaPersona, Animovia, or shared galleries.
      </div>

      <div key={current?.key}>
        <Outlet />
      </div>
    </div>
  )
}
