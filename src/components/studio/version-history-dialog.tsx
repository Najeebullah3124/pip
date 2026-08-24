import { History, RotateCcw } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { StudioVersion } from '@/components/studio/types'

export function VersionHistoryDialog({
  open,
  onOpenChange,
  versions,
  onRestore,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  versions: StudioVersion[]
  onRestore: (version: StudioVersion) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4.5 text-accent" />
            Version history
          </DialogTitle>
          <DialogDescription>Every saved snapshot of this prompt — restore any of them instantly.</DialogDescription>
        </DialogHeader>
        <div className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
          {versions.map((v, i) => (
            <div key={v.version} className="flex items-start gap-3 rounded-xl px-2.5 py-3 transition-colors hover:bg-muted">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-700">
                {v.version.replace('v', '')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{v.version}</p>
                  {i === 0 && <Badge variant="success">Current</Badge>}
                </div>
                <p className="text-xs text-foreground-muted">{v.changelog}</p>
                <p className="mt-0.5 text-[11px] text-foreground-subtle">{v.updatedAt}</p>
              </div>
              {i !== 0 && (
                <Button variant="ghost" size="sm" onClick={() => onRestore(v)}>
                  <RotateCcw />
                  Restore
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
