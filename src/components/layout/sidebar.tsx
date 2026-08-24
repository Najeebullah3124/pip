import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Plus, Search, X } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { UserMenu } from '@/components/layout/user-menu'
import { useSidebar } from '@/components/layout/sidebar-context'
import { primaryNav, bottomNav } from '@/data/nav'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onOpenSearch: () => void
}

export function Sidebar({ onOpenSearch }: SidebarProps) {
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar()

  function renderContent(collapsed: boolean) {
    return (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-2 px-4 pt-4', collapsed ? 'justify-center px-2' : 'justify-between')}>
        {!collapsed && <Logo />}
        {collapsed && <Logo mark />}
        <button
          onClick={toggle}
          className={cn(
            'hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground lg:flex',
            collapsed && 'absolute -right-3 top-5 z-10 border border-border bg-surface shadow-elevation-1'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle hover:bg-muted lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className={cn('mt-4 px-3', collapsed && 'px-2')}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elevation-1 transition-opacity hover:opacity-90">
                <Plus className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">New Prompt</TooltipContent>
          </Tooltip>
        ) : (
          <button className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-elevation-1 transition-opacity hover:opacity-90 active:scale-[0.98]">
            <Plus className="size-4" />
            New Prompt
          </button>
        )}
      </div>

      <div className={cn('mt-3 px-3', collapsed && 'px-2')}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOpenSearch}
                className="flex h-9 w-full cursor-pointer items-center justify-center rounded-xl text-foreground-subtle transition-colors hover:bg-muted"
              >
                <Search className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Search</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-3 text-sm text-foreground-subtle transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Search className="size-3.5" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3 pb-2" aria-label="Main navigation">
        {primaryNav.map((section) => (
          <div key={section.label} className="space-y-1">
            {section.label && !collapsed && (
              <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
                {section.label}
              </p>
            )}
            {section.label && collapsed && <Separator className="mx-1 mb-2" />}
            {section.items.map((item) => (
              <SidebarLink key={item.href} item={item} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
            ))}
          </div>
        ))}
      </nav>

      <div className={cn('space-y-1 px-3 pb-2', collapsed && 'px-2')}>
        <Separator className="mb-2" />
        {bottomNav.map((section) =>
          section.items.map((item) => (
            <SidebarLink key={item.href} item={item} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
          ))
        )}
      </div>

      <div className={cn('border-t border-sidebar-border p-3', collapsed && 'px-2')}>
        <UserMenu collapsed={collapsed} />
      </div>
    </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'relative hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out lg:block',
          collapsed ? 'w-[76px]' : 'w-[264px]'
        )}
      >
        {renderContent(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 h-full w-[280px] animate-fade-in-up bg-sidebar shadow-elevation-4">
            {renderContent(false)}
          </aside>
        </div>
      )}
    </>
  )
}

function SidebarLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: (typeof primaryNav)[number]['items'][number]
  collapsed: boolean
  onNavigate: () => void
}) {
  const Icon = item.icon
  const link = (
    <NavLink
      to={item.href}
      onClick={onNavigate}
      end={item.href === '/'}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
          collapsed && 'justify-center px-0 py-2.5',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('size-[18px] shrink-0', isActive && 'text-accent')} />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-700">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}
