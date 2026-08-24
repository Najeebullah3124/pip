import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { CommandPalette } from '@/components/layout/command-palette'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'

export function AppShell() {
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <div className="flex h-dvh w-full overflow-hidden">
          <Sidebar onOpenSearch={() => setSearchOpen(true)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onOpenSearch={() => setSearchOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
        <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  )
}
