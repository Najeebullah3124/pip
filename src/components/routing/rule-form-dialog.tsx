import * as React from 'react'
import { Route, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  applications,
  requestTypes,
  promptLibraries,
  workflows,
  promptBuilders,
  providers,
  providerModels,
  type RoutingRule,
  type Application,
  type RequestType,
} from '@/data/routing-data'

export interface RuleFormValues {
  name: string
  enabled: boolean
  application: Application
  requestType: RequestType
  promptLibrary: string
  workflow: string
  promptBuilder: string
  provider: string
  model: string
}

interface RuleFormDialogProps {
  rule?: RoutingRule
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: RuleFormValues) => void
}

function defaultsFrom(rule?: RoutingRule): RuleFormValues {
  return {
    name: rule?.name ?? '',
    enabled: rule?.enabled ?? true,
    application: rule?.application ?? applications[0],
    requestType: rule?.requestType ?? requestTypes[0],
    promptLibrary: rule?.promptLibrary ?? promptLibraries[0],
    workflow: rule?.workflow ?? workflows[0],
    promptBuilder: rule?.promptBuilder ?? promptBuilders[0],
    provider: rule?.provider ?? providers[0],
    model: rule?.model ?? providerModels[providers[0]][0],
  }
}

export function RuleFormDialog({ rule, open, onOpenChange, onSubmit }: RuleFormDialogProps) {
  const [values, setValues] = React.useState<RuleFormValues>(() => defaultsFrom(rule))
  const [nameError, setNameError] = React.useState<string>()

  React.useEffect(() => {
    if (open) setValues(defaultsFrom(rule))
  }, [open, rule])

  function set<K extends keyof RuleFormValues>(key: K, value: RuleFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'provider') {
        next.model = providerModels[value as string][0]
      }
      return next
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.name.trim()) {
      setNameError('Rule name is required')
      return
    }
    setNameError(undefined)
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="size-4.5 text-accent" />
            {rule ? 'Edit routing rule' : 'Create routing rule'}
          </DialogTitle>
          <DialogDescription>Define an IF condition and the THEN routing action it triggers.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rule-name">Rule name</Label>
            <Input
              id="rule-name"
              placeholder="e.g. NexaPersona → Image generation"
              value={values.name}
              invalid={!!nameError}
              onChange={(e) => {
                set('name', e.target.value)
                setNameError(undefined)
              }}
            />
            {nameError && <p className="text-xs font-medium text-destructive">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border-strong bg-surface-2/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-foreground-subtle">If</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Application</Label>
                <Select value={values.application} onValueChange={(v) => set('application', v as Application)}>
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
                <Select value={values.requestType} onValueChange={(v) => set('requestType', v as RequestType)}>
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

            <div className="flex items-center justify-center py-0.5">
              <ArrowRight className="size-4 rotate-90 text-foreground-subtle" />
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-foreground-subtle">Then</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Prompt library</Label>
                <Select value={values.promptLibrary} onValueChange={(v) => set('promptLibrary', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promptLibraries.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Workflow</Label>
                <Select value={values.workflow} onValueChange={(v) => set('workflow', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Prompt builder</Label>
                <Select value={values.promptBuilder} onValueChange={(v) => set('promptBuilder', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promptBuilders.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>AI provider</Label>
                <Select value={values.provider} onValueChange={(v) => set('provider', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Model</Label>
                <Select value={values.model} onValueChange={(v) => set('model', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providerModels[values.provider].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Enable this rule</p>
              <p className="text-xs text-foreground-subtle">Disabled rules are skipped when resolving a route.</p>
            </div>
            <Switch checked={values.enabled} onCheckedChange={(v) => set('enabled', v)} />
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{rule ? 'Save changes' : 'Create rule'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
