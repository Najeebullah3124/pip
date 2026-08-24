import { Link } from 'react-router-dom'
import { Star, Download, Trash2, ArrowUpRight, Cpu, Calendar, Tag } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RecordThumbnail } from '@/components/media-library/record-thumbnail'
import { RecordStatusBadge } from '@/components/media-library/record-status-badge'
import { getLibraryCharacter, type LibraryRecord } from '@/data/media-library-data'
import { cn } from '@/lib/utils'

interface PreviewModalProps {
  record: LibraryRecord | null
  onOpenChange: (open: boolean) => void
  onToggleFavorite: (id: string) => void
  onDownload: (record: LibraryRecord) => void
  onDelete: (record: LibraryRecord) => void
}

export function PreviewModal({ record, onOpenChange, onToggleFavorite, onDownload, onDelete }: PreviewModalProps) {
  const character = record ? getLibraryCharacter(record.characterId) : undefined

  return (
    <Dialog open={!!record} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {record && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-2 pr-6">
                <DialogTitle className="line-clamp-2">{record.title}</DialogTitle>
                <button
                  onClick={() => onToggleFavorite(record.id)}
                  aria-label={record.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted"
                >
                  <Star className={cn('size-4', record.favorite && 'fill-amber-400 text-amber-400')} />
                </button>
              </div>
            </DialogHeader>

            <RecordThumbnail record={record} className="h-56 w-full rounded-2xl" />

            <div className="flex flex-wrap items-center gap-1.5">
              <RecordStatusBadge status={record.status} />
              <Badge variant="outline">{record.mediaType}</Badge>
              <Badge variant="outline">{record.sourceApp}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface-2 p-3.5 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">Character</p>
                <p className="mt-0.5 font-medium text-foreground">{character?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">Prompt version</p>
                <p className="mt-0.5 font-medium text-foreground">{record.promptVersion}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground-subtle">
                  <Cpu className="size-2.5" />
                  AI provider
                </p>
                <p className="mt-0.5 font-medium text-foreground">{record.aiProvider}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground-subtle">
                  <Calendar className="size-2.5" />
                  Generated
                </p>
                <p className="mt-0.5 font-medium text-foreground">{record.generationDate}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="size-3 text-foreground-subtle" />
              {record.tags.map((t) => (
                <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground-subtle">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <Button size="sm" variant="secondary" onClick={() => onDownload(record)}>
                <Download />
                Download
              </Button>
              <Button size="sm" variant="secondary" className="hover:text-destructive" onClick={() => onDelete(record)}>
                <Trash2 />
                Delete
              </Button>
              <Button size="sm" asChild className="ml-auto">
                <Link to={`/media-library/${record.id}`}>
                  View details
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
