import { Loader2, TriangleAlert, PenLine } from 'lucide-react'
import { libraryMediaTypeMeta, type LibraryRecord } from '@/data/media-library-data'
import { cn } from '@/lib/utils'

export function RecordThumbnail({ record, className }: { record: LibraryRecord; className?: string }) {
  const meta = libraryMediaTypeMeta[record.mediaType]
  const Icon = meta.icon

  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{ background: `linear-gradient(135deg, ${record.gradientFrom}, ${record.gradientTo})` }}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
      {record.status === 'Processing' ? (
        <Loader2 className="relative size-6 animate-spin text-white/90" />
      ) : record.status === 'Failed' ? (
        <TriangleAlert className="relative size-6 text-white/90" />
      ) : record.status === 'Draft' ? (
        <PenLine className="relative size-6 text-white/90" />
      ) : (
        <Icon className="relative size-6 text-white/90" />
      )}
    </div>
  )
}
