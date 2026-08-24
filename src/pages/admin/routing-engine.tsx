import * as React from 'react'
import { Plus, FlaskConical, Route as RouteIcon, CheckCircle2, Zap, ScrollText } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
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
import { RuleCard } from '@/components/routing/rule-card'
import { RuleFormDialog, type RuleFormValues } from '@/components/routing/rule-form-dialog'
import { TestRouteDialog } from '@/components/routing/test-route-dialog'
import { ExecutionHistoryTable } from '@/components/routing/execution-history-table'
import {
  routingRules as seedRules,
  executionHistory,
  type RoutingRule,
  type Application,
  type RequestType,
} from '@/data/routing-data'
import { useToast } from '@/hooks/use-toast'

const PAGE_SIZE = 10

export default function AdminRoutingEnginePage() {
  const { toast } = useToast()
  const [rules, setRules] = React.useState<RoutingRule[]>(seedRules)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingRule, setEditingRule] = React.useState<RoutingRule | undefined>(undefined)
  const [testOpen, setTestOpen] = React.useState(false)
  const [testSeed, setTestSeed] = React.useState<{ application?: Application; requestType?: RequestType }>({})
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const [historySearch, setHistorySearch] = React.useState('')
  const [historyStatus, setHistoryStatus] = React.useState('all')
  const [historyPage, setHistoryPage] = React.useState(1)

  const sortedRules = React.useMemo(() => [...rules].sort((a, b) => a.priority - b.priority), [rules])

  const activeCount = rules.filter((r) => r.enabled).length
  const totalMatches = rules.reduce((s, r) => s + r.matchCount, 0)
  const failedCount = executionHistory.filter((e) => e.status === 'Failed').length

  function openCreate() {
    setEditingRule(undefined)
    setFormOpen(true)
  }
  function openEdit(id: string) {
    setEditingRule(rules.find((r) => r.id === id))
    setFormOpen(true)
  }

  function handleSubmit(values: RuleFormValues) {
    if (editingRule) {
      setRules((prev) => prev.map((r) => (r.id === editingRule.id ? { ...r, ...values, lastModified: 'Today' } : r)))
      toast({ title: 'Rule updated', description: `"${values.name}" was saved.`, variant: 'success' })
    } else {
      const nextPriority = rules.length ? Math.max(...rules.map((r) => r.priority)) + 1 : 1
      const rule: RoutingRule = {
        id: `rule_${Date.now()}`,
        ...values,
        priority: nextPriority,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastModified: 'Today',
        matchCount: 0,
      }
      setRules((prev) => [...prev, rule])
      toast({ title: 'Rule created', description: `"${values.name}" is now active.`, variant: 'success' })
    }
    setFormOpen(false)
  }

  function toggleEnabled(id: string, enabled: boolean) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)))
    toast({ title: enabled ? 'Rule enabled' : 'Rule disabled' })
  }

  function moveRule(id: string, direction: 'up' | 'down') {
    setRules((prev) => {
      const sorted = [...prev].sort((a, b) => a.priority - b.priority)
      const index = sorted.findIndex((r) => r.id === id)
      const swapWith = direction === 'up' ? index - 1 : index + 1
      if (swapWith < 0 || swapWith >= sorted.length) return prev
      const a = sorted[index]
      const b = sorted[swapWith]
      const aPriority = a.priority
      a.priority = b.priority
      b.priority = aPriority
      return prev.map((r) => (r.id === a.id ? { ...r, priority: a.priority } : r.id === b.id ? { ...r, priority: b.priority } : r))
    })
  }

  function duplicateRule(id: string) {
    const source = rules.find((r) => r.id === id)
    if (!source) return
    const nextPriority = Math.max(...rules.map((r) => r.priority)) + 1
    const copy: RoutingRule = {
      ...source,
      id: `rule_copy_${Date.now()}`,
      name: `${source.name} Copy`,
      priority: nextPriority,
      matchCount: 0,
      enabled: false,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastModified: 'Today',
    }
    setRules((prev) => [...prev, copy])
    toast({ title: 'Rule duplicated', description: `"${copy.name}" was added as disabled.`, variant: 'success' })
  }

  function handleDelete() {
    if (!deleteId) return
    setRules((prev) => prev.filter((r) => r.id !== deleteId))
    setDeleteId(null)
    toast({ title: 'Rule deleted' })
  }

  function openTest(id?: string) {
    const rule = id ? rules.find((r) => r.id === id) : undefined
    setTestSeed(rule ? { application: rule.application, requestType: rule.requestType } : {})
    setTestOpen(true)
  }

  const filteredHistory = React.useMemo(() => {
    return executionHistory.filter((e) => {
      const q = historySearch.trim().toLowerCase()
      const matchesSearch =
        !q ||
        e.application.toLowerCase().includes(q) ||
        e.requestType.toLowerCase().includes(q) ||
        (e.matchedRule ?? '').toLowerCase().includes(q)
      const matchesStatus = historyStatus === 'all' || e.status === historyStatus
      return matchesSearch && matchesStatus
    })
  }, [historySearch, historyStatus])

  const historyPageCount = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE))
  const historyPageSafe = Math.min(historyPage, historyPageCount)
  const historyItems = filteredHistory.slice((historyPageSafe - 1) * PAGE_SIZE, historyPageSafe * PAGE_SIZE)

  React.useEffect(() => setHistoryPage(1), [historySearch, historyStatus])

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total rules" value={String(rules.length)} icon={<RouteIcon />} />
        <StatCard label="Active rules" value={String(activeCount)} delta={{ value: `${rules.length - activeCount} disabled`, direction: 'up' }} icon={<CheckCircle2 />} />
        <StatCard label="Total matches" value={totalMatches.toLocaleString()} icon={<Zap />} />
        <StatCard label="Failed executions (7d)" value={String(failedCount)} icon={<ScrollText />} />
      </div>

      <Tabs defaultValue="rules">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="history">Execution history</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" onClick={() => openTest()}>
              <FlaskConical />
              Test route
            </Button>
            <Button onClick={openCreate}>
              <Plus />
              Create rule
            </Button>
          </div>
        </div>

        <TabsContent value="rules" className="flex flex-col gap-4">
          <p className="text-xs text-foreground-subtle">
            Rules evaluate in priority order (lowest first) — the first enabled rule matching a request's application and type wins. Routing stays fully configuration-driven; no code changes required.
          </p>
          {sortedRules.length === 0 ? (
            <EmptyState icon={<RouteIcon />} title="No routing rules yet" description="Create your first rule to start directing requests to the right workflow and model." />
          ) : (
            <div className="flex flex-col gap-4">
              {sortedRules.map((rule, i) => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  isFirst={i === 0}
                  isLast={i === sortedRules.length - 1}
                  onToggleEnabled={toggleEnabled}
                  onMove={moveRule}
                  onEdit={openEdit}
                  onDuplicate={duplicateRule}
                  onDelete={(id) => setDeleteId(id)}
                  onTest={openTest}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search by application, type, or rule…"
              className="max-w-xs"
            />
            <Select value={historyStatus} onValueChange={setHistoryStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Routed">Routed</SelectItem>
                <SelectItem value="Fallback">Fallback</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ExecutionHistoryTable entries={historyItems} />

          {filteredHistory.length > 0 && (
            <Pagination page={historyPageSafe} pageCount={historyPageCount} pageSize={PAGE_SIZE} total={filteredHistory.length} onPageChange={setHistoryPage} />
          )}
        </TabsContent>
      </Tabs>

      <RuleFormDialog rule={editingRule} open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} />
      <TestRouteDialog open={testOpen} onOpenChange={setTestOpen} initialApplication={testSeed.application} initialRequestType={testSeed.requestType} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
            <AlertDialogDescription>Requests that would have matched this rule will fall through to the next matching rule, or the default fallback. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
