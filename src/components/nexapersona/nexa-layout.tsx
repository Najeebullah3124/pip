import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Fingerprint, Sparkles } from 'lucide-react'
import { nexaNavItems } from '@/components/nexapersona/nexa-nav-config'
import { mediaItems } from '@/data/nexapersona-data'
import { characters } from '@/data/character-data'
import { cn } from '@/lib/utils'

export function NexaLayout() {
  const location = useLocation()
  const current = nexaNavItems.find((item) => (item.end ? location.pathname === item.href : location.pathname.startsWith(item.href)))

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevation-2">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(196,181,253,0.55) 0%, transparent 45%), radial-gradient(circle at 85% 0%, rgba(244,114,182,0.45) 0%, transparent 40%), radial-gradient(circle at 60% 100%, rgba(139,92,246,0.5) 0%, transparent 50%), linear-gradient(135deg, #1a1030, #2b1354 55%, #1a1030)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

        <div className="relative flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
                <Fingerprint className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white">NexaPersona</h1>
                  <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                    <Sparkles className="size-3" />
                    AI Creator Studio
                  </span>
                </div>
                <p className="mt-1 max-w-lg text-sm text-white/70">
                  Bring your PIP characters to life — generate imagery, video, voice, and social content with a single, deeply consistent identity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-white">{characters.length}</p>
                <p className="text-[11px] text-white/60">characters</p>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-right">
                <p className="text-lg font-bold text-white">{mediaItems.length.toLocaleString()}</p>
                <p className="text-[11px] text-white/60">generations</p>
              </div>
            </div>
          </div>

          <nav className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1">
            {nexaNavItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white text-ink-950 shadow-elevation-1'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
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

      <div key={current?.key}>
        <Outlet />
      </div>
    </div>
  )
}
