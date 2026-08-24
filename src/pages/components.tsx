import * as React from 'react'
import { Blocks, LayoutGrid, List, Search, Layers as LayersIcon, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { ChartCard } from '@/components/dashboard/analytics/chart-card'
import { RankedBarList } from '@/components/dashboard/analytics/ranked-bar-list'
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
import { ComponentCard } from '@/components/library/component-card'
import { CategoryFilter } from '@/components/library/category-filter'
import { ComponentDetailDrawer } from '@/components/library/component-detail-drawer'
import { ComponentFormDialog } from '@/components/library/component-form-dialog'
import { ComponentPreviewDialog } from '@/components/library/component-preview-dialog'
import {
  components as seedComponents,
  categoryMeta,
  allCategories,
  getComponent,
  type PromptComponent,
  type ComponentCategory,
} from '@/data/component-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12

export default function ComponentsPage() {
  const [components, setComponents] = React.useState<PromptComponent[]>(seedComponents)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<ComponentCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid')
  const [page, setPage] = React.useState(1)
  const [drawerId, setDrawerId] = React.useState<string | null>(null)
  const [editId, setEditId] = React.useState<string | null>(null)
  const [previewId, setPreviewId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const { toast } = useToast()

  const filtered = React.useMemo(() => {
    return components.filter((c) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))
      const matchesCategory = category === 'all' || c.category === category
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [components, search, category, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  React.useEffect(() => setPage(1), [search, category, statusFilter])

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: components.length }
    allCategories.forEach((c) => (counts[c] = components.filter((x) => x.category === c).length))
    return counts
  }, [components])

  const published = components.filter((c) => c.status === 'Published').length
  const totalUsage = components.reduce((s, c) => s + c.usageCount, 0)
  const avgUsage = components.length ? Math.round(totalUsage / components.length) : 0
  const topCategories = React.useMemo(() => {
    const byCategory = allCategories.map((c) => ({
      name: c,
      value: components.filter((x) => x.category === c).reduce((s, x) => s + x.usageCount, 0),
      color: categoryMeta[c].color,
    }))
    const max = Math.max(...byCategory.map((c) => c.value), 1)
    return byCategory
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((c) => ({ ...c, value: Math.round((c.value / max) * 100) }))
  }, [components])

  function updateOne(id: string, patch: Partial<PromptComponent>) {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function handleDuplicate(id: string) {
    const source = components.find((c) => c.id === id)
    if (!source) return
    const copy: PromptComponent = {
      ...source,
      id: `cmp_copy_${Date.now()}`,
      name: `${source.name} Copy`,
      status: 'Draft',
      usageCount: 0,
      version: 'v1.0',
      versions: [{ version: 'v1.0', changelog: `Duplicated from ${source.name}`, updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: source.content }],
    }
    setComponents((prev) => [copy, ...prev])
    toast({ title: 'Component duplicated', description: `"${copy.name}" was added as a draft.`, variant: 'success' })
  }

  function handleArchiveToggle(id: string) {
    const c = components.find((x) => x.id === id)
    if (!c) return
    updateOne(id, { status: c.status === 'Deprecated' ? 'Published' : 'Deprecated' })
    toast({ title: c.status === 'Deprecated' ? 'Component republished' : 'Component deprecated', variant: 'success' })
  }

  function handleDelete() {
    if (!deleteId) return
    setComponents((prev) => prev.filter((c) => c.id !== deleteId))
    setDeleteId(null)
    setDrawerId(null)
    toast({ title: 'Component deleted' })
  }

  function handleCreate(values: Parameters<React.ComponentProps<typeof ComponentFormDialog>['onSubmit']>[0]) {
    const record: PromptComponent = {
      id: `cmp_new_${Date.now()}`,
      name: values.name,
      category: values.category,
      description: values.description,
      status: values.status,
      version: 'v1.0',
      usageCount: 0,
      lastUpdated: 'Today',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: 'Emerson Sterling',
      tags: values.tags,
      content: values.content,
      versions: [{ version: 'v1.0', changelog: 'Initial version', updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: values.content }],
      usageHistory: [
        { label: 'Wk 1', count: 0 },
        { label: 'Wk 2', count: 0 },
        { label: 'Wk 3', count: 0 },
        { label: 'Wk 4', count: 0 },
      ],
      usedBy: [],
    }
    setComponents((prev) => [record, ...prev])
    toast({ title: 'Component created', description: `"${record.name}" is ready to use in prompts.`, variant: 'success' })
  }

  function handleEditSubmit(values: Parameters<React.ComponentProps<typeof ComponentFormDialog>['onSubmit']>[0]) {
    if (!editId) return
    const current = components.find((c) => c.id === editId)
    if (!current) return
    const nextVersionNum = parseFloat(current.version.replace('v', '')) + 1
    const nextVersion = `v${nextVersionNum}.0`
    updateOne(editId, {
      ...values,
      version: nextVersion,
      lastUpdated: 'Today',
      versions: [
        { version: nextVersion, changelog: 'Updated via editor', updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: values.content },
        ...current.versions,
      ],
    })
    toast({ title: 'Component updated', description: `Saved as ${nextVersion}.`, variant: 'success' })
    setEditId(null)
  }

  function handleRestoreVersion(id: string, version: string) {
    const current = components.find((c) => c.id === id)
    const target = current?.versions.find((v) => v.version === version)
    if (!current || !target) return
    updateOne(id, { version: target.version, content: target.content, lastUpdated: 'Today' })
  }

  const drawerComponent = drawerId ? getComponent(drawerId) ?? components.find((c) => c.id === drawerId) ?? null : null
  const editComponent = editId ? components.find((c) => c.id === editId) ?? null : null
  const previewComponent = previewId ? components.find((c) => c.id === previewId) ?? null : null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Components"
        description="Reusable prompt building blocks — Character DNA, LoRA, wardrobe, camera, and more."
        icon={<Blocks />}
        actions={<ComponentFormDialog mode="create" onSubmit={handleCreate} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total components" value={String(components.length)} icon={<LayersIcon />} />
        <StatCard label="Published" value={String(published)} delta={{ value: `${components.length - published} other`, direction: 'up' }} icon={<CheckCircle2 />} />
        <StatCard label="Total uses" value={totalUsage.toLocaleString()} icon={<TrendingUp />} />
        <StatCard label="Avg. uses per component" value={String(avgUsage)} icon={<Sparkles />} />
      </div>

      <ChartCard title="Most-used categories" description="Total generation usage by component category">
        <RankedBarList items={topCategories} />
      </ChartCard>

      <div className="flex flex-col gap-3">
        <CategoryFilter value={category} onChange={setCategory} counts={categoryCounts} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2.5">
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search components…" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-2 p-1">
            <button
              onClick={() => setLayout('grid')}
              className={cn('flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors', layout === 'grid' ? 'bg-surface shadow-elevation-1 text-foreground' : 'text-foreground-subtle hover:text-foreground')}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={cn('flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors', layout === 'list' ? 'bg-surface shadow-elevation-1 text-foreground' : 'text-foreground-subtle hover:text-foreground')}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Blocks />}
          title="No components found"
          description="Try adjusting your search or filters, or create a new component to get started."
        />
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((c) => (
            <ComponentCard
              key={c.id}
              component={c}
              layout="grid"
              onOpen={setDrawerId}
              onEdit={setEditId}
              onDuplicate={handleDuplicate}
              onArchive={handleArchiveToggle}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {pageItems.map((c) => (
            <ComponentCard
              key={c.id}
              component={c}
              layout="list"
              onOpen={setDrawerId}
              onEdit={setEditId}
              onDuplicate={handleDuplicate}
              onArchive={handleArchiveToggle}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination page={pageSafe} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}

      <ComponentDetailDrawer
        component={drawerComponent}
        onOpenChange={(open) => !open && setDrawerId(null)}
        onEdit={(id) => {
          setDrawerId(null)
          setEditId(id)
        }}
        onPreview={(id) => setPreviewId(id)}
        onDuplicate={handleDuplicate}
        onDelete={(id) => setDeleteId(id)}
        onRestoreVersion={handleRestoreVersion}
      />

      {editComponent && (
        <ComponentFormDialog
          mode="edit"
          component={editComponent}
          open={!!editId}
          onOpenChange={(open) => !open && setEditId(null)}
          onSubmit={handleEditSubmit}
        />
      )}

      {previewComponent && <ComponentPreviewDialog component={previewComponent} open={!!previewId} onOpenChange={(open) => !open && setPreviewId(null)} />}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this component?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the component and its version history. Prompts referencing it will need a replacement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete component
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
