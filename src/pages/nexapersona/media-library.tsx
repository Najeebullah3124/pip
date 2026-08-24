import * as React from 'react'
import { Search, Images } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/shared/empty-state'
import { MediaCard } from '@/components/nexapersona/media-card'
import { mediaItems, generationTypeMeta, type GenerationType } from '@/data/nexapersona-data'
import { characters } from '@/data/character-data'

const PAGE_SIZE = 12
const allTypes = Object.keys(generationTypeMeta) as GenerationType[]

export default function NexaMediaLibraryPage() {
  const [search, setSearch] = React.useState('')
  const [type, setType] = React.useState('all')
  const [characterId, setCharacterId] = React.useState('all')
  const [status, setStatus] = React.useState('all')
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    return mediaItems.filter((m) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || m.title.toLowerCase().includes(q)
      const matchesType = type === 'all' || m.type === type
      const matchesCharacter = characterId === 'all' || m.characterId === characterId
      const matchesStatus = status === 'all' || m.status === status
      return matchesSearch && matchesType && matchesCharacter && matchesStatus
    })
  }, [search, type, characterId, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount)
  const pageItems = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE)

  React.useEffect(() => setPage(1), [search, type, characterId, status])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-foreground-subtle" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media…" className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {allTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={characterId} onValueChange={setCharacterId}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Character" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All characters</SelectItem>
            {characters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Complete">Complete</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Images />} title="No media found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {pageItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination page={pageSafe} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}
    </div>
  )
}
