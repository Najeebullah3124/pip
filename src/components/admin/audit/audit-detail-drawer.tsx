import { Monitor, MapPin, Clock, User, Boxes, Activity } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import type { AuditLogEntry } from '@/data/admin-data'

export function AuditDetailDrawer({ entry, onOpenChange }: { entry: AuditLogEntry | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={!!entry} onOpenChange={onOpenChange}>
      <SheetContent>
        {entry && (
          <>
            <SheetHeader>
              <SheetTitle>{entry.action}</SheetTitle>
              <SheetDescription>Log ID {entry.id}</SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <StatusBadge status={entry.status} />
              </div>

              <div className="flex flex-col gap-4">
                <Row icon={User} label="User" value={`${entry.user} (${entry.userEmail})`} />
                <Row icon={Boxes} label="Resource" value={`${entry.resource} · ${entry.resourceType}`} />
                <Row icon={Clock} label="Timestamp" value={entry.timestamp} />
                <Row icon={MapPin} label="IP address" value={entry.ip} />
                <Row icon={Monitor} label="Device" value={entry.device} />
              </div>

              <Separator />

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  <Activity className="size-3.5" />
                  Raw event
                </p>
                <pre className="overflow-x-auto rounded-xl bg-ink-950 p-3.5 text-[11px] leading-relaxed text-emerald-300">
{`{
  "id": "${entry.id}",
  "actor": "${entry.userEmail}",
  "action": "${entry.action.toLowerCase().replace(/ /g, '_')}",
  "resource": "${entry.resource}",
  "resource_type": "${entry.resourceType.toLowerCase()}",
  "status": "${entry.status.toLowerCase()}",
  "ip": "${entry.ip}",
  "user_agent": "${entry.device}"
}`}
                </pre>
              </div>
            </SheetBody>
            <SheetFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground-muted">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-foreground-subtle">{label}</p>
        <p className="break-words text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
