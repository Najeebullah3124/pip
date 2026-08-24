import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LibrarySkeleton({ layout, count = 12 }: { layout: 'grid' | 'list'; count?: number }) {
  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="flex items-center gap-4 p-3.5">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="hidden h-3 w-20 sm:block" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <Skeleton className="h-32 w-full rounded-none" />
          <div className="flex flex-col gap-2 p-3.5">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  )
}
