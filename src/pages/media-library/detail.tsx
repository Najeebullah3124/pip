import * as React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Download, Trash2, ArrowUpRight, Cpu, Calendar, Tag, History, CheckCircle2, Loader2, TriangleAlert, PenLine, Images } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { EmptyState } from '@/components/shared/empty-state'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RecordThumbnail } from '@/components/media-library/record-thumbnail'
import { RecordStatusBadge } from '@/components/media-library/record-status-badge'
import { getLibraryRecord, getLibraryCharacter, historyFor, type LibraryStatus } from '@/data/media-library-data'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const historyIcon: Record<LibraryStatus, typeof CheckCircle2> = {
  Complete: CheckCircle2,
  Processing: Loader2,
  Failed: TriangleAlert,
  Draft: PenLine,
}

export default function MediaLibraryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const record = id ? getLibraryRecord(id) : undefined
  const [favorite, setFavorite] = React.useState(record?.favorite ?? false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  if (!record) {
    return (
      <div className="flex flex-col gap-5">
        <Breadcrumbs items={[{ label: 'Media Library', href: '/media-library' }, { label: 'Not found' }]} />
        <EmptyState
          icon={<Images />}
          title="Asset not found"
          description="This media asset may have been deleted or the link is incorrect."
          action={
            <Button size="sm" onClick={() => navigate('/media-library')}>
              Back to Media Library
            </Button>
          }
        />
      </div>
    )
  }

  const character = getLibraryCharacter(record.characterId)
  const history = historyFor(record)

  function handleDelete() {
    toast({ title: 'Deleted', description: `${record!.title} was removed from the Media Library.`, variant: 'success' })
    setDeleteOpen(false)
    navigate('/media-library')
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: 'Media Library', href: '/media-library' }, { label: record.title }]} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <RecordThumbnail record={record} className="aspect-[4/3] w-full rounded-2xl" />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setFavorite((v) => !v)}>
              <Star className={cn('size-4', favorite && 'fill-amber-400 text-amber-400')} />
              {favorite ? 'Favorited' : 'Favorite'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => toast({ title: 'Download started', description: `${record.title} will download shortly.`, variant: 'success' })}>
              <Download />
              Download
            </Button>
            <Button variant="secondary" size="sm" className="hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 />
              Delete
            </Button>
            <Button size="sm" asChild className="ml-auto">
              <Link to={record.sourceHref}>
                Open in {record.sourceApp}
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{record.title}</h1>
              <RecordStatusBadge status={record.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline">{record.mediaType}</Badge>
              <Badge variant="outline">{record.sourceApp}</Badge>
            </div>
          </div>

          <Card className="grid grid-cols-2 gap-4 p-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">Character</p>
              {character ? (
                <div className="mt-1 flex items-center gap-1.5">
                  <div
                    className="flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
                  >
                    {character.name.slice(0, 1)}
                  </div>
                  <span className="text-sm font-medium text-foreground">{character.name}</span>
                </div>
              ) : (
                <p className="mt-1 text-sm font-medium text-foreground">—</p>
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-subtle">Prompt version</p>
              <p className="mt-1 text-sm font-medium text-foreground">{record.promptVersion}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground-subtle">
                <Cpu className="size-2.5" />
                AI provider
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{record.aiProvider}</p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground-subtle">
                <Calendar className="size-2.5" />
                Generation date
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{record.generationDate}</p>
            </div>
          </Card>

          <div className="flex flex-wrap items-center gap-1.5">
            <Tag className="size-3 text-foreground-subtle" />
            {record.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground-subtle">
                {t}
              </span>
            ))}
          </div>

          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
              <History className="size-3.5" />
              Generation history
            </p>
            <Card className="flex flex-col divide-y divide-border p-0">
              {history.map((h, i) => {
                const Icon = historyIcon[h.status]
                return (
                  <div key={i} className="flex items-center gap-3 p-3.5">
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full',
                        h.status === 'Complete' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
                        h.status === 'Processing' && 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
                        h.status === 'Failed' && 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',
                        h.status === 'Draft' && 'bg-muted text-foreground-subtle'
                      )}
                    >
                      <Icon className={cn('size-3.5', h.status === 'Processing' && 'animate-spin')} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{h.note}</p>
                      <p className="text-xs text-foreground-subtle">
                        {h.version} · {h.date}
                      </p>
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{record.title}"?</AlertDialogTitle>
            <AlertDialogDescription>This removes it from the Media Library. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
