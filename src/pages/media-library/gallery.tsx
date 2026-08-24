import * as React from 'react'
import { Search, LayoutGrid, List, Star, Images } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/shared/empty-state'
import { StatCard } from '@/components/shared/stat-card'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RecordCard } from '@/components/media-library/record-card'
import { PreviewModal } from '@/components/media-library/preview-modal'
import { LibrarySkeleton } from '@/components/media-library/library-skeleton'
import { libraryRecords as seedRecords, libraryMediaTypeMeta, libraryProviders, type LibraryRecord, type LibraryMediaType } from '@/data/media-library-data'
import { characters } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 18
const mediaTypes = Object.keys(libraryMediaTypeMeta) as LibraryMediaType[]

function daysAgo(label: string): number {
  if (label === 'Just now' || label === 'Today') return 0
  if (label === 'Yesterday') return 1
  const match = /^(\d+)d ago$/.exec(label)
  return match ? Number(match[1]) : Infinity
}

export default function MediaLibraryGalleryPage() {
  const { toast } = useToast()
  const [records, setRecords] = React.useState<LibraryRecord[]>(() => [...seedRecords])
  const [loading, setLoading] = React.useState(true)
  const [layout, setLayout] = React.useState<'grid' | 'list'>('grid')
  const [search, setSearch] = React.useState('')
  const [mediaType, setMediaType] = React.useState('all')
  const [characterId, setCharacterId] = React.useState('all')
  const [provider, setProvider] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('all')
  const [favoritesOnly, setFavoritesOnly] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [previewId, setPreviewId] = React.useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<LibraryRecord | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(timer)
  }, [])

  const filtered = React.useMemo(() => {
    return records.filter((r) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q))
      const matchesType = mediaType === 'all' || r.mediaType === mediaType
      const matchesCharacter = characterId === 'all' || r.characterId === characterId
      const matchesProvider = provider === 'all' || r.aiProvider === provider
      const matchesFavorite = !favoritesOnly || r.favorite
      const age = daysAgo(r.generationDate)
      const matchesDate = dateRange === 'all' || (dateRange === 'today' && age === 0) || (dateRange === 'week' && age <= 7) || (dateRange === 'month' && age <= 30)
      return matchesSearch && matchesType && matchesCharacter && matchesProvider && matchesFavorite && matchesDate
    })
  }, [records, search, mediaType, characterId, provider, dateRange, favoritesOnly])

  React.useEffect(() => setPage(1), [search, mediaType, characterId, provider, dateRange, favoritesOnly])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  const previewRecord = previewId ? (records.find((r) => r.id === previewId) ?? null) : null
  const favoriteCount = records.filter((r) => r.favorite).length

  function toggleFavorite(id: string) {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)))
  }

  function handleDownload(record: LibraryRecord) {
    toast({ title: 'Download started', description: `${record.title} will download shortly.`, variant: 'success' })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    if (previewId === deleteTarget.id) setPreviewId(null)
    toast({ title: 'Deleted', description: `${deleteTarget.title} was removed from the Media Library.`, variant: 'success' })
    setDeleteTarget(null)
  }

  const hasFilters = !!search || mediaType !== 'all' || characterId !== 'all' || provider !== 'all' || dateRange !== 'all' || favoritesOnly

  function clearFilters() {
    setSearch('')
    setMediaType('all')
    setCharacterId('all')
    setProvider('all')
    setDateRange('all')
    setFavoritesOnly(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total assets" value={records.length.toLocaleString()} icon={<Images />} />
        <StatCard label="Favorited" value={String(favoriteCount)} icon={<Star />} />
        <StatCard label="From NexaPersona" value={String(records.filter((r) => r.sourceApp === 'NexaPersona').length)} icon={<Images />} />
        <StatCard label="From Animovia" value={String(records.filter((r) => r.sourceApp === 'Animovia').length)} icon={<Images />} />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media, tags…" className="pl-9" />
        </div>
        <Select value={mediaType} onValueChange={setMediaType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {mediaTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={characterId} onValueChange={setCharacterId}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Character" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All characters</SelectItem>
            {characters.slice(0, 15).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All providers</SelectItem>
            {libraryProviders.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => setFavoritesOnly((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
            favoritesOnly ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400' : 'border-border text-foreground-muted hover:bg-muted'
          )}
        >
          <Star className={cn('size-3.5', favoritesOnly && 'fill-amber-400')} />
          Favorites
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-xl bg-muted p-1">
          <button
            onClick={() => setLayout('grid')}
            aria-label="Grid view"
            className={cn('flex size-8 items-center justify-center rounded-lg transition-colors', layout === 'grid' ? 'bg-surface text-foreground shadow-elevation-1' : 'text-foreground-subtle hover:text-foreground')}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setLayout('list')}
            aria-label="List view"
            className={cn('flex size-8 items-center justify-center rounded-lg transition-colors', layout === 'list' ? 'bg-surface text-foreground shadow-elevation-1' : 'text-foreground-subtle hover:text-foreground')}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LibrarySkeleton layout={layout} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Images />}
          title="No media found"
          description={hasFilters ? 'Try adjusting your search or filters.' : 'Generated assets from NexaPersona and Animovia will appear here.'}
          action={
            hasFilters ? (
              <button onClick={clearFilters} className="text-sm font-medium text-accent hover:underline">
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {pageItems.map((r) => (
            <RecordCard key={r.id} record={r} layout="grid" onOpen={setPreviewId} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pageItems.map((r) => (
            <RecordCard key={r.id} record={r} layout="list" onOpen={setPreviewId} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <Pagination page={pageSafe} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}

      <PreviewModal
        record={previewRecord}
        onOpenChange={(open) => !open && setPreviewId(null)}
        onToggleFavorite={toggleFavorite}
        onDownload={handleDownload}
        onDelete={(record) => setDeleteTarget(record)}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>This removes it from the Media Library. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
