import * as React from 'react'
import { Bell, CheckCheck, Sparkles, FolderKanban, UsersRound } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  icon: React.ElementType
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Prompt optimization complete',
    description: '"Support Triage v3" scored 94% on your eval set.',
    time: '2m ago',
    read: false,
    icon: Sparkles,
  },
  {
    id: '2',
    title: 'New project invite',
    description: 'Jordan added you to "Holiday Campaign".',
    time: '1h ago',
    read: false,
    icon: FolderKanban,
  },
  {
    id: '3',
    title: 'Character published',
    description: '"Nova — Support Guide" is now live.',
    time: 'Yesterday',
    read: true,
    icon: UsersRound,
  },
]

export function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-foreground-muted transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-accent ring-2 ring-surface" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-foreground-muted"
            onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto p-1.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-muted',
                !n.read && 'bg-accent-soft/40'
              )}
              onClick={() =>
                setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
              }
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-700 [&_svg]:size-4">
                <n.icon />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-[13px] font-semibold leading-snug text-foreground">{n.title}</p>
                <p className="text-xs leading-snug text-foreground-muted">{n.description}</p>
                <p className="text-[11px] text-foreground-subtle">{n.time}</p>
              </div>
              {!n.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
