import { useNavigate } from 'react-router-dom'
import { Menu, Search, Settings } from 'lucide-react'
import { useSidebar } from '@/components/layout/sidebar-context'
import { NotificationsPopover } from '@/components/layout/notifications-popover'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Logo } from '@/components/layout/logo'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function Topbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { setMobileOpen } = useSidebar()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-foreground-muted hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-[18px]" />
      </button>
      <div className="lg:hidden">
        <Logo mark />
      </div>

      <button
        onClick={onOpenSearch}
        className="ml-1 hidden max-w-sm flex-1 cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-foreground-subtle transition-colors hover:border-border-strong md:flex"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search anything…</span>
        <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onOpenSearch}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-foreground-muted transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Search"
        >
          <Search className="size-[18px]" />
        </button>
        <ThemeToggle />
        <NotificationsPopover />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate('/administration')}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-foreground-muted transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="size-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Settings</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
