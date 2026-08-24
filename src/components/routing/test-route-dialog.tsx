import * as React from 'react'
import { FlaskConical, ArrowRight, CheckCircle2, TriangleAlert, Play } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/shared/spinner'
import { applications, requestTypes, resolveRoute, type Application, type RequestType, type RoutingRule } from '@/data/routing-data'

export function TestRouteDialog({
  open,
  onOpenChange,
  initialApplication,
  initialRequestType,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialApplication?: Application
  initialRequestType?: RequestType
}) {
  const [application, setApplication] = React.useState<Application>(initialApplication ?? applications[0])
  const [requestType, setRequestType] = React.useState<RequestType>(initialRequestType ?? requestTypes[0])
  const [running, setRunning] = React.useState(false)
  const [result, setResult] = React.useState<{ rule: RoutingRule | null } | null>(null)

  React.useEffect(() => {
    if (open) {
      setApplication(initialApplication ?? applications[0])
      setRequestType(initialRequestType ?? requestTypes[0])
      setResult(null)
    }
  }, [open, initialApplication, initialRequestType])

  function run() {
    setRunning(true)
    setResult(null)
    setTimeout(() => {
      setResult({ rule: resolveRoute(application, requestType) })
      setRunning(false)
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="size-4.5 text-accent" />
            Test route
          </DialogTitle>
          <DialogDescription>Simulate an incoming request and see which rule resolves it.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Application</Label>
            <Select value={application} onValueChange={(v) => setApplication(v as Application)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {applications.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Request type</Label>
            <Select value={requestType} onValueChange={(v) => setRequestType(v as RequestType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={run} loading={running}>
          <Play />
          {running ? 'Resolving…' : 'Run test'}
        </Button>

        {running && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-foreground-muted">
            <Spinner size={18} />
            Evaluating routing rules in priority order…
          </div>
        )}

        {result && !running && (
          <div className="flex flex-col gap-3">
            {result.rule ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Matched rule <span className="font-semibold">"{result.rule.name}"</span> (priority {result.rule.priority})
                </div>
                <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-border-strong bg-surface-2/60 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="accent">{result.rule.promptLibrary}</Badge>
                    <ArrowRight className="size-3.5 text-foreground-subtle" />
                    <Badge variant="accent">{result.rule.workflow}</Badge>
                    <ArrowRight className="size-3.5 text-foreground-subtle" />
                    <Badge variant="accent">{result.rule.promptBuilder}</Badge>
                    <ArrowRight className="size-3.5 text-foreground-subtle" />
                    <Badge variant="outline">{result.rule.provider}</Badge>
                    <ArrowRight className="size-3.5 text-foreground-subtle" />
                    <Badge variant="success">{result.rule.model}</Badge>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                No enabled rule matches <strong>{application}</strong> + <strong>{requestType}</strong>. This request would fall back to default handling.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
