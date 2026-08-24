import { MoreHorizontal, Copy, Pencil, Archive, Trash2, Zap, Clock, Tag } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ComponentStatusBadge } from '@/components/library/component-status-badge'
import { categoryMeta, type PromptComponent } from '@/data/component-data'
import { cn } from '@/lib/utils'

interface ComponentCardProps {
  component: PromptComponent
  layout: 'grid' | 'list'
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}

export function ComponentCard({ component, layout, onOpen, onEdit, onDuplicate, onArchive, onDelete }: ComponentCardProps) {
  const meta = categoryMeta[component.category]
  const Icon = meta.icon

  // Radix menu content renders in a portal, but React bubbles synthetic events through the
  // component tree rather than the DOM tree — so item clicks still reach the card's onClick
  // unless the whole menu (trigger + portaled content) is wrapped in a stopPropagation boundary.
  const menu = (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(component.id)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(component.id)}>
            <Copy />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onArchive(component.id)}>
            <Archive />
            {component.status === 'Deprecated' ? 'Republish' : 'Deprecate'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(component.id)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  if (layout === 'list') {
    return (
      <Card
        onClick={() => onOpen(component.id)}
        className="flex cursor-pointer items-center gap-4 p-4 transition-all hover:border-accent-200 hover:shadow-elevation-1"
      >
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-elevation-1"
          style={{ backgroundColor: meta.color }}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{component.name}</p>
            <ComponentStatusBadge status={component.status} />
          </div>
          <p className="truncate text-xs text-foreground-subtle">{component.description}</p>
        </div>
        <Badge variant="outline" className="hidden shrink-0 sm:flex">
          {component.category}
        </Badge>
        <p className="hidden w-14 shrink-0 text-right text-xs font-medium tabular-nums text-foreground-muted md:block">{component.version}</p>
        <p className="hidden w-20 shrink-0 items-center justify-end gap-1 text-right text-xs text-foreground-muted lg:flex">
          <Zap className="size-3" />
          {component.usageCount.toLocaleString()}
        </p>
        <p className="hidden w-20 shrink-0 items-center justify-end gap-1 text-right text-xs text-foreground-subtle lg:flex">
          <Clock className="size-3" />
          {component.lastUpdated}
        </p>
        {menu}
      </Card>
    )
  }

  return (
    <Card
      onClick={() => onOpen(component.id)}
      className="group flex cursor-pointer flex-col gap-3.5 p-4 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevation-2"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-elevation-1"
            style={{ backgroundColor: meta.color }}
          >
            <Icon className="size-[18px]" />
          </div>
          <Badge variant="outline" className="text-[10px]">
            {component.category}
          </Badge>
        </div>
        {menu}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <p className="truncate text-[15px] font-semibold text-foreground">{component.name}</p>
        </div>
        <p className={cn('mt-1 text-xs leading-relaxed text-foreground-muted', 'line-clamp-2')}>{component.description}</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {component.tags.map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground-subtle">
            <Tag className="size-2.5" />
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-subtle">
        <ComponentStatusBadge status={component.status} />
        <span className="font-medium tabular-nums text-foreground-muted">{component.version}</span>
        <span className="flex items-center gap-1">
          <Zap className="size-3" />
          {component.usageCount.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {component.lastUpdated}
        </span>
      </div>
    </Card>
  )
}
