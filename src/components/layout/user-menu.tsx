import { useNavigate } from 'react-router-dom'
import { ChevronsUpDown, Settings, User, LogOut, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth/auth-context'
import { cn } from '@/lib/utils'

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UserMenu({ collapsed }: { collapsed?: boolean }) {
  const navigate = useNavigate()
  const { user, credential, logout } = useAuth()

  const name = user?.name ?? 'Guest'
  const email = user?.email ?? ''
  const plan = credential?.type === 'apiKey' ? 'API key session' : 'Pro workspace'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex w-full cursor-pointer items-center gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-muted',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="size-8">
            <AvatarFallback>{initialsOf(name)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight text-foreground">{name}</p>
                <p className="truncate text-xs leading-tight text-foreground-subtle">{email}</p>
              </div>
              <ChevronsUpDown className="size-3.5 shrink-0 text-foreground-subtle" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2 py-2 normal-case">
          <Avatar className="size-9">
            <AvatarFallback>{initialsOf(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs text-foreground-subtle">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/administration')}>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/administration')}>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Sparkles />
          {plan}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
