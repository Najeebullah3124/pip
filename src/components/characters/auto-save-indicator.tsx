import * as React from 'react'
import { Check, Loader2, CloudOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function AutoSaveIndicator({ state, savedAt }: { state: SaveState; savedAt: number | null }) {
  const [, forceTick] = React.useReducer((c) => c + 1, 0)

  React.useEffect(() => {
    const t = setInterval(forceTick, 1000)
    return () => clearInterval(t)
  }, [])

  const secondsAgo = savedAt ? Math.max(0, Math.round((Date.now() - savedAt) / 1000)) : null

  let label = 'Not saved yet'
  if (state === 'saving') label = 'Saving…'
  else if (state === 'error') label = 'Save failed'
  else if (state === 'saved' && secondsAgo !== null) {
    label = secondsAgo < 3 ? 'Saved just now' : secondsAgo < 60 ? `Saved ${secondsAgo}s ago` : `Saved ${Math.floor(secondsAgo / 60)}m ago`
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-xs font-medium',
        state === 'error' ? 'text-destructive' : 'text-foreground-subtle'
      )}
    >
      {state === 'saving' && <Loader2 className="size-3.5 animate-spin" />}
      {state === 'saved' && <Check className="size-3.5 text-success" />}
      {state === 'error' && <CloudOff className="size-3.5" />}
      {label}
    </div>
  )
}
