import * as React from 'react'
import { Cpu, CheckCircle2, Layers, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { EngineCard } from '@/components/engines/engine-card'
import { AddEngineDialog, type AddEngineValues } from '@/components/engines/add-engine-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { engines as seedEngines, categories, categoryMeta, type AiEngine } from '@/data/engine-data'
import { useToast } from '@/hooks/use-toast'

export default function EnginesGalleryPage() {
  const { toast } = useToast()
  const [engines, setEngines] = React.useState<AiEngine[]>(seedEngines)
  const [testingId, setTestingId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const connectedCount = engines.filter((e) => e.connectionStatus === 'Connected').length
  const totalSpend = engines.reduce((sum, e) => sum + Number(e.monthlyUsage.replace(/[^0-9.]/g, '') || 0), 0)

  function toggleEnabled(id: string, enabled: boolean) {
    setEngines((prev) => prev.map((e) => (e.id === id ? { ...e, enabled } : e)))
    toast({ title: enabled ? 'Provider enabled' : 'Provider disabled' })
  }

  async function testConnection(id: string) {
    setTestingId(id)
    await new Promise((r) => setTimeout(r, 1100))
    const engine = engines.find((e) => e.id === id)
    setEngines((prev) => prev.map((e) => (e.id === id ? { ...e, connectionStatus: 'Connected', apiStatus: 'Operational', lastTested: 'Just now' } : e)))
    setTestingId(null)
    toast({ title: 'Connection successful', description: `${engine?.name} responded and is ready to route traffic.`, variant: 'success' })
  }

  function handleDelete() {
    if (!deleteId) return
    setEngines((prev) => prev.filter((e) => e.id !== deleteId))
    setDeleteId(null)
    toast({ title: 'Provider removed' })
  }

  function handleAdd(values: AddEngineValues) {
    const engine: AiEngine = {
      id: `eng_${Date.now()}`,
      name: values.name,
      vendor: values.vendor || 'Custom provider',
      category: values.category,
      color: '#7c3aed',
      connectionStatus: 'Attention needed',
      apiStatus: 'Operational',
      enabled: true,
      apiKeyLast4: values.apiKey.slice(-4) || '0000',
      baseUrl: 'https://api.example.com/v1',
      models: [{ id: 'default-model', name: values.modelName || 'Default model', description: 'Newly registered model.' }],
      defaultModelId: 'default-model',
      usagePercent: 0,
      monthlyUsage: '$0',
      lastTested: 'Never',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      parameters: [
        { key: 'temperature', label: 'Temperature', description: 'Higher values increase output randomness.', type: 'slider', value: 70, min: 0, max: 100, step: 1 },
        { key: 'timeout', label: 'Request timeout', description: 'Maximum time to wait for a response.', type: 'slider', value: 30, min: 5, max: 120, step: 5, unit: 's' },
      ],
      rateLimits: { requestsPerMinute: 60, concurrentRequests: 5, monthlyQuota: 'Not yet configured' },
      docsUrl: '#',
    }
    setEngines((prev) => [...prev, engine])
    toast({ title: 'Provider added', description: `${engine.name} is ready to configure and test.`, variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Engines"
        description="Connect, configure, and monitor every model provider powering PIP."
        icon={<Cpu />}
        actions={<AddEngineDialog onSubmit={handleAdd} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total providers" value={String(engines.length)} icon={<Layers />} />
        <StatCard label="Connected" value={`${connectedCount}/${engines.length}`} icon={<CheckCircle2 />} />
        <StatCard label="Categories" value={String(categories.length)} icon={<Cpu />} />
        <StatCard label="Monthly spend" value={`$${totalSpend.toLocaleString()}`} icon={<DollarSign />} />
      </div>

      {categories.map((category) => {
        const meta = categoryMeta[category]
        const items = engines.filter((e) => e.category === category)
        if (items.length === 0) return null
        return (
          <div key={category} className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl text-white" style={{ backgroundColor: meta.color }}>
                <meta.icon className="size-4" />
              </div>
              <h2 className="text-[15px] font-semibold text-foreground">{category}</h2>
              <span className="text-xs text-foreground-subtle">{items.length} provider{items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((engine) => (
                <EngineCard
                  key={engine.id}
                  engine={engine}
                  testing={testingId === engine.id}
                  onToggleEnabled={toggleEnabled}
                  onTest={testConnection}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          </div>
        )
      })}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this provider?</AlertDialogTitle>
            <AlertDialogDescription>
              Routing rules pointing to this provider will fall back to the next matching rule. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Remove provider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
