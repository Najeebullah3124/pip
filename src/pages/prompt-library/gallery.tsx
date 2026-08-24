import * as React from 'react'
import { Library, LayoutGrid, List, Search, Star, Upload, Plus, Layers as LayersIcon, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import { ChartCard } from '@/components/dashboard/analytics/chart-card'
import { RankedBarList } from '@/components/dashboard/analytics/ranked-bar-list'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { TemplateCard } from '@/components/templates/template-card'
import { CategoryFilter } from '@/components/templates/category-filter'
import { TemplateFormDialog } from '@/components/templates/template-form-dialog'
import { ExportTemplateDialog, ImportTemplateDialog } from '@/components/templates/import-export-dialog'
import {
  templates as seedTemplates,
  categoryMeta,
  allCategories,
  type PromptTemplate,
  type TemplateCategory,
} from '@/data/template-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12

export default function PromptLibraryGalleryPage() {
  const [templates, setTemplates] = React.useState<PromptTemplate[]>(seedTemplates)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<TemplateCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [favoritesOnly, setFavoritesOnly] = React.useState(false)
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid')
  const [page, setPage] = React.useState(1)
  const [exportId, setExportId] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [importOpen, setImportOpen] = React.useState(false)
  const { toast } = useToast()

  const filtered = React.useMemo(() => {
    return templates.filter((t) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q))
      const matchesCategory = category === 'all' || t.category === category
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      const matchesFavorite = !favoritesOnly || t.favorite
      return matchesSearch && matchesCategory && matchesStatus && matchesFavorite
    })
  }, [templates, search, category, statusFilter, favoritesOnly])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  React.useEffect(() => setPage(1), [search, category, statusFilter, favoritesOnly])

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: templates.length }
    allCategories.forEach((c) => (counts[c] = templates.filter((x) => x.category === c).length))
    return counts
  }, [templates])

  const published = templates.filter((t) => t.status === 'Published').length
  const favoriteCount = templates.filter((t) => t.favorite).length
  const totalUsage = templates.reduce((s, t) => s + t.usageCount, 0)
  const topCategories = React.useMemo(() => {
    const byCategory = allCategories.map((c) => ({
      name: c,
      value: templates.filter((x) => x.category === c).reduce((s, x) => s + x.usageCount, 0),
      color: categoryMeta[c].color,
    }))
    const max = Math.max(...byCategory.map((c) => c.value), 1)
    return byCategory
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((c) => ({ ...c, value: Math.round((c.value / max) * 100) }))
  }, [templates])

  function updateOne(id: string, patch: Partial<PromptTemplate>) {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  function handleToggleFavorite(id: string) {
    const t = templates.find((x) => x.id === id)
    if (!t) return
    updateOne(id, { favorite: !t.favorite })
  }

  function handleDuplicate(id: string) {
    const source = templates.find((t) => t.id === id)
    if (!source) return
    const copy: PromptTemplate = {
      ...source,
      id: `tpl_copy_${Date.now()}`,
      name: `${source.name} Copy`,
      status: 'Draft',
      usageCount: 0,
      favorite: false,
      version: 'v1.0',
      versions: [{ version: 'v1.0', changelog: `Duplicated from ${source.name}`, updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: source.content }],
    }
    setTemplates((prev) => [copy, ...prev])
    toast({ title: 'Template duplicated', description: `"${copy.name}" was added as a draft.`, variant: 'success' })
  }

  function handleArchiveToggle(id: string) {
    const t = templates.find((x) => x.id === id)
    if (!t) return
    updateOne(id, { status: t.status === 'Archived' ? 'Draft' : 'Archived' })
    toast({ title: t.status === 'Archived' ? 'Template restored' : 'Template archived', variant: 'success' })
  }

  function handleDelete() {
    if (!deleteId) return
    setTemplates((prev) => prev.filter((t) => t.id !== deleteId))
    setDeleteId(null)
    toast({ title: 'Template deleted' })
  }

  function handleCreate(values: Parameters<React.ComponentProps<typeof TemplateFormDialog>['onSubmit']>[0]) {
    const record: PromptTemplate = {
      id: `tpl_new_${Date.now()}`,
      name: values.name,
      category: values.category,
      description: values.description,
      status: values.status,
      version: 'v1.0',
      aiEngine: values.aiEngine,
      componentsUsed: [],
      usageCount: 0,
      lastUpdated: 'Today',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: 'Emerson Sterling',
      tags: values.tags,
      favorite: false,
      content: values.content,
      versions: [{ version: 'v1.0', changelog: 'Initial version', updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: values.content }],
      usageHistory: [
        { label: 'Wk 1', count: 0 },
        { label: 'Wk 2', count: 0 },
        { label: 'Wk 3', count: 0 },
        { label: 'Wk 4', count: 0 },
      ],
      testRuns: [],
    }
    setTemplates((prev) => [record, ...prev])
    toast({ title: 'Template created', description: `"${record.name}" is ready to test and publish.`, variant: 'success' })
  }

  function handleImport(raw: string): { ok: true } | { ok: false; error: string } {
    let parsed: Partial<PromptTemplate>
    try {
      parsed = JSON.parse(raw)
    } catch {
      return { ok: false, error: 'That doesn’t look like valid JSON. Check the format and try again.' }
    }
    if (!parsed.name || typeof parsed.name !== 'string') {
      return { ok: false, error: 'The template JSON must include a "name" field.' }
    }
    const category: TemplateCategory = allCategories.includes(parsed.category as TemplateCategory) ? (parsed.category as TemplateCategory) : 'Image'
    const record: PromptTemplate = {
      id: `tpl_import_${Date.now()}`,
      name: parsed.name,
      category,
      description: parsed.description ?? 'Imported template',
      status: 'Draft',
      version: 'v1.0',
      aiEngine: parsed.aiEngine ?? 'Claude Opus 5',
      componentsUsed: parsed.componentsUsed ?? [],
      usageCount: 0,
      lastUpdated: 'Today',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: 'Emerson Sterling',
      tags: parsed.tags ?? ['Imported'],
      favorite: false,
      content: parsed.content ?? '',
      versions: [{ version: 'v1.0', changelog: 'Imported', updatedBy: 'Emerson Sterling', updatedAt: 'Today', content: parsed.content ?? '' }],
      usageHistory: [
        { label: 'Wk 1', count: 0 },
        { label: 'Wk 2', count: 0 },
        { label: 'Wk 3', count: 0 },
        { label: 'Wk 4', count: 0 },
      ],
      testRuns: [],
    }
    setTemplates((prev) => [record, ...prev])
    toast({ title: 'Template imported', description: `"${record.name}" was added as a draft.`, variant: 'success' })
    return { ok: true }
  }

  const exportTemplate = exportId ? templates.find((t) => t.id === exportId) ?? null : null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Prompt Library"
        description="Reusable templates for image, video, story, and social generations."
        icon={<Library />}
        actions={
          <>
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              <Upload />
              Import
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus />
              Create template
            </Button>
            <TemplateFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreate} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total templates" value={String(templates.length)} icon={<LayersIcon />} />
        <StatCard label="Published" value={String(published)} delta={{ value: `${templates.length - published} other`, direction: 'up' }} icon={<CheckCircle2 />} />
        <StatCard label="Total uses" value={totalUsage.toLocaleString()} icon={<TrendingUp />} />
        <StatCard label="Favorited" value={String(favoriteCount)} icon={<Sparkles />} />
      </div>

      <ChartCard title="Most-used categories" description="Total generation usage by template category">
        <RankedBarList items={topCategories} />
      </ChartCard>

      <div className="flex flex-col gap-3">
        <CategoryFilter value={category} onChange={setCategory} counts={categoryCounts} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <div className="relative max-w-xs flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates…" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => setFavoritesOnly((v) => !v)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors',
                favoritesOnly ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400' : 'border-border text-foreground-muted hover:bg-muted'
              )}
            >
              <Star className={cn('size-3.5', favoritesOnly && 'fill-amber-400')} />
              Favorites
            </button>
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
          icon={<Library />}
          title="No templates found"
          description="Try adjusting your search or filters, or create a new template to get started."
          action={<Button onClick={() => setCreateOpen(true)}>Create template</Button>}
        />
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              layout="grid"
              onToggleFavorite={handleToggleFavorite}
              onDuplicate={handleDuplicate}
              onArchive={handleArchiveToggle}
              onExport={setExportId}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {pageItems.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              layout="list"
              onToggleFavorite={handleToggleFavorite}
              onDuplicate={handleDuplicate}
              onArchive={handleArchiveToggle}
              onExport={setExportId}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination page={pageSafe} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}

      <ExportTemplateDialog template={exportTemplate} open={!!exportId} onOpenChange={(open) => !open && setExportId(null)} />
      <ImportTemplateDialog open={importOpen} onOpenChange={setImportOpen} onImport={handleImport} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this template?</AlertDialogTitle>
            <AlertDialogDescription>This removes the template and its version history. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
