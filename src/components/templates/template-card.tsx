import { Link } from 'react-router-dom'
import { MoreHorizontal, Copy, Archive, Trash2, Star, Zap, Clock, Cpu, Blocks, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TemplateStatusBadge } from '@/components/templates/template-status-badge'
import { categoryMeta, type PromptTemplate } from '@/data/template-data'
import { cn } from '@/lib/utils'

interface TemplateCardProps {
  template: PromptTemplate
  layout: 'grid' | 'list'
  onToggleFavorite: (id: string) => void
  onDuplicate: (id: string) => void
  onArchive: (id: string) => void
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export function TemplateCard({ template, layout, onToggleFavorite, onDuplicate, onArchive, onExport, onDelete }: TemplateCardProps) {
  const meta = categoryMeta[template.category]
  const Icon = meta.icon

  // The dropdown's content renders in a portal; React still bubbles its synthetic events
  // through the component tree, so the whole menu (trigger + content) needs to sit inside
  // one stopPropagation boundary or its clicks would also fire the card's Link navigation.
  const menu = (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
            <Copy />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport(template.id)}>
            <Download />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onArchive(template.id)}>
            <Archive />
            {template.status === 'Archived' ? 'Restore' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(template.id)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const favoriteButton = (
    <button
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onToggleFavorite(template.id)
      }}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-amber-500"
      aria-label={template.favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={cn('size-4', template.favorite && 'fill-amber-400 text-amber-500')} />
    </button>
  )

  if (layout === 'list') {
    return (
      <Card className="relative transition-all hover:border-accent-200 hover:shadow-elevation-1">
        <Link to={`/prompt-library/${template.id}`} className="flex items-center gap-4 p-4 pr-24">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-elevation-1" style={{ backgroundColor: meta.color }}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{template.name}</p>
              <TemplateStatusBadge status={template.status} />
            </div>
            <p className="truncate text-xs text-foreground-subtle">{template.description}</p>
          </div>
          <Badge variant="outline" className="hidden shrink-0 sm:flex">
            {template.category}
          </Badge>
          <p className="hidden w-28 shrink-0 truncate text-right text-xs text-foreground-muted md:block">{template.aiEngine}</p>
          <p className="hidden w-12 shrink-0 text-right text-xs font-medium tabular-nums text-foreground-muted lg:block">{template.version}</p>
          <p className="hidden w-16 shrink-0 items-center justify-end gap-1 text-right text-xs text-foreground-muted lg:flex">
            <Zap className="size-3" />
            {template.usageCount.toLocaleString()}
          </p>
          <p className="hidden w-20 shrink-0 items-center justify-end gap-1 text-right text-xs text-foreground-subtle xl:flex">
            <Clock className="size-3" />
            {template.lastUpdated}
          </p>
        </Link>
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {favoriteButton}
          {menu}
        </div>
      </Card>
    )
  }

  return (
    <Card className="group relative flex flex-col gap-3.5 p-4 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevation-2">
      <Link to={`/prompt-library/${template.id}`} className="flex flex-1 flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-elevation-1" style={{ backgroundColor: meta.color }}>
              <Icon className="size-[18px]" />
            </div>
            <Badge variant="outline" className="text-[10px]">
              {template.category}
            </Badge>
          </div>
        </div>

        <div>
          <p className="truncate pr-14 text-[15px] font-semibold text-foreground">{template.name}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground-muted">{template.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-subtle">
          <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
            <Cpu className="size-2.5" />
            {template.aiEngine}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
            <Blocks className="size-2.5" />
            {template.componentsUsed.length} components
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-foreground-subtle">
          <TemplateStatusBadge status={template.status} />
          <span className="font-medium tabular-nums text-foreground-muted">{template.version}</span>
          <span className="flex items-center gap-1">
            <Zap className="size-3" />
            {template.usageCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {template.lastUpdated}
          </span>
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex items-center gap-1">
        {favoriteButton}
        {menu}
      </div>
    </Card>
  )
}
