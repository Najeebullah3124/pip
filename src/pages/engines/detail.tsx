import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FlaskConical, Zap, DollarSign, Layers, Clock, Trash2, Cpu } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ConnectionStatusBadge, ApiStatusBadge } from '@/components/engines/engine-status-badges'
import { CredentialsPanel } from '@/components/engines/credentials-panel'
import { ModelsPanel } from '@/components/engines/models-panel'
import { ParametersEditor } from '@/components/engines/parameters-editor'
import { RateLimitsPanel } from '@/components/engines/rate-limits-panel'
import { getEngine, updateEngine, categoryMeta, type AiEngine, type RateLimits } from '@/data/engine-data'
import { useToast } from '@/hooks/use-toast'

export default function EngineDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const source = id ? getEngine(id) : undefined
  const [engine, setEngine] = React.useState<AiEngine | undefined>(source)
  const [testing, setTesting] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  if (!engine) {
    return (
      <EmptyState
        icon={<Cpu />}
        title="Provider not found"
        description="This AI provider may have been removed or the link is incorrect."
        action={<Button onClick={() => navigate('/ai-engines')}>Back to AI Engines</Button>}
      />
    )
  }

  function persist(patch: Partial<AiEngine>) {
    if (!id) return
    updateEngine(id, patch)
    setEngine((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  async function testConnection() {
    setTesting(true)
    await new Promise((r) => setTimeout(r, 1200))
    persist({ connectionStatus: 'Connected', apiStatus: 'Operational', lastTested: 'Just now' })
    setTesting(false)
    toast({ title: 'Connection successful', description: `${engine!.name} responded and is ready to route traffic.`, variant: 'success' })
  }

  function updateParam(key: string, value: number | string) {
    persist({ parameters: engine!.parameters.map((p) => (p.key === key ? { ...p, value } : p)) })
  }

  function saveParams() {
    toast({ title: 'Parameters saved', description: 'New generations will use these defaults.', variant: 'success' })
  }

  const meta = categoryMeta[engine.category]

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'AI Engines', href: '/ai-engines' }, { label: engine.name }]} />

      <Card className="overflow-hidden p-0">
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${engine.color}, ${meta.color})` }} />
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-elevation-2"
              style={{ backgroundColor: engine.color }}
            >
              {engine.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{engine.name}</h1>
                <ConnectionStatusBadge status={engine.connectionStatus} />
                <ApiStatusBadge status={engine.apiStatus} />
              </div>
              <p className="mt-1 text-sm text-foreground-muted">{engine.vendor}</p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground-muted">
                  <meta.icon className="size-3" />
                  {engine.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
              <Switch checked={engine.enabled} onCheckedChange={(v) => persist({ enabled: v })} aria-label="Enable provider" />
              <span className="text-sm font-medium text-foreground">{engine.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <Button onClick={testConnection} loading={testing}>
              <FlaskConical />
              {testing ? 'Testing…' : 'Test connection'}
            </Button>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-destructive hover:bg-red-50" aria-label="Remove provider">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove {engine.name}?</AlertDialogTitle>
                  <AlertDialogDescription>Routing rules pointing to this provider will fall back to the next matching rule. This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      toast({ title: 'Provider removed' })
                      navigate('/ai-engines')
                    }}
                  >
                    Remove provider
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4">
          <MetricCell icon={Zap} label="Usage" value={`${engine.usagePercent}%`} />
          <MetricCell icon={DollarSign} label="Monthly spend" value={engine.monthlyUsage} />
          <MetricCell icon={Layers} label="Models" value={String(engine.models.length)} />
          <MetricCell icon={Clock} label="Last tested" value={engine.lastTested} />
        </div>
      </Card>

      <Tabs defaultValue="credentials">
        <TabsList>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="limits">Rate limits</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials">
          <CredentialsPanel
            engine={engine}
            onUpdateKey={(last4) => persist({ apiKeyLast4: last4 })}
            onUpdateBaseUrl={(url) => persist({ baseUrl: url })}
          />
        </TabsContent>

        <TabsContent value="models">
          <ModelsPanel engine={engine} onSetDefault={(modelId) => { persist({ defaultModelId: modelId }); toast({ title: 'Default model updated', variant: 'success' }) }} />
        </TabsContent>

        <TabsContent value="parameters">
          <Card className="flex flex-col gap-6 p-6">
            <ParametersEditor parameters={engine.parameters} onChange={updateParam} />
            <div className="flex justify-end border-t border-border pt-5">
              <Button size="sm" onClick={saveParams}>
                Save parameters
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <RateLimitsPanel
            limits={engine.rateLimits}
            onSave={(limits: RateLimits) => {
              persist({ rateLimits: limits })
              toast({ title: 'Rate limits updated', variant: 'success' })
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCell({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4">
      <p className="flex items-center gap-1.5 text-xs text-foreground-subtle">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="truncate text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
