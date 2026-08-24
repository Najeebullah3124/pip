import * as React from 'react'
import { Plus, Copy, Trash2, ChevronUp, ChevronDown, MapPin, BookImage, UsersRound, MoreHorizontal } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PageThumbnail } from '@/components/animovia/book-builder/page-thumbnail'
import { getCharacter } from '@/data/character-data'
import type { Book } from '@/data/book-builder-data'
import type { Story } from '@/data/animovia-data'
import { cn } from '@/lib/utils'

interface PageListPanelProps {
  book: Book
  story: Story | undefined
  selectedView: string
  onSelectView: (view: string) => void
  onAddPage: () => void
  onDuplicatePage: (pageId: string) => void
  onDeletePage: (pageId: string) => void
  onMovePage: (pageId: string, dir: -1 | 1) => void
  onInsertScene: (sceneIndex: number) => void
}

export function PageListPanel({ book, story, selectedView, onSelectView, onAddPage, onDuplicatePage, onDeletePage, onMovePage, onInsertScene }: PageListPanelProps) {
  const [tab, setTab] = React.useState('pages')

  function handleTabChange(v: string) {
    setTab(v)
    if (v === 'cover') onSelectView('cover')
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="scenes">Scenes</TabsTrigger>
          <TabsTrigger value="cover">Cover</TabsTrigger>
          <TabsTrigger value="cast">Cast</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="flex flex-col gap-2.5">
          <Button variant="secondary" size="sm" onClick={onAddPage} className="w-full">
            <Plus />
            Add page
          </Button>
          <div className="flex max-h-[480px] flex-col gap-1.5 overflow-y-auto pr-1">
            {book.pages.map((page, i) => (
              <div
                key={page.id}
                onClick={() => onSelectView(page.id)}
                className={cn(
                  'group flex cursor-pointer items-center gap-2.5 rounded-xl border px-2 py-2 transition-colors',
                  selectedView === page.id ? 'border-accent bg-accent-soft' : 'border-transparent hover:bg-muted'
                )}
              >
                <PageThumbnail page={page} className="h-10 w-10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">Page {page.pageNumber}</p>
                  <p className="truncate text-[11px] text-foreground-subtle">{page.text || 'Empty page'}</p>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled={i === 0} onClick={() => onMovePage(page.id, -1)}>
                        <ChevronUp />
                        Move up
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={i === book.pages.length - 1} onClick={() => onMovePage(page.id, 1)}>
                        <ChevronDown />
                        Move down
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicatePage(page.id)}>
                        <Copy />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" disabled={book.pages.length <= 1} onClick={() => onDeletePage(page.id)}>
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenes" className="flex flex-col gap-2">
          {!story ? (
            <p className="py-4 text-center text-xs text-foreground-subtle">This book isn't linked to a story.</p>
          ) : (
            <div className="flex max-h-[480px] flex-col gap-1.5 overflow-y-auto pr-1">
              {story.scenes.map((scene, i) => (
                <div key={scene.id} className="flex items-start gap-2.5 rounded-xl border border-border px-2.5 py-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground-muted">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{scene.title}</p>
                    <p className="flex items-center gap-1 truncate text-[10px] text-foreground-subtle">
                      <MapPin className="size-2.5" />
                      {scene.setting}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => onInsertScene(i)} aria-label="Insert as page">
                    <Plus />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cover">
          <div
            onClick={() => onSelectView('cover')}
            className={cn(
              'flex cursor-pointer flex-col gap-2 rounded-xl border p-3 transition-colors',
              selectedView === 'cover' ? 'border-accent bg-accent-soft' : 'border-border hover:bg-muted'
            )}
          >
            <div className="flex items-center gap-2">
              <BookImage className="size-4 text-accent" />
              <p className="text-sm font-medium text-foreground">Book cover</p>
            </div>
            <p className="text-xs text-foreground-subtle">{book.title}</p>
          </div>
        </TabsContent>

        <TabsContent value="cast" className="flex flex-col gap-2">
          {book.characterIds.length === 0 ? (
            <p className="py-4 text-center text-xs text-foreground-subtle">No characters linked to this book yet.</p>
          ) : (
            book.characterIds.map((id) => {
              const c = getCharacter(id)
              if (!c) return null
              return (
                <div key={id} className="flex items-center gap-2.5 rounded-xl border border-border px-2.5 py-2">
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})` }}
                  >
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{c.name}</p>
                    <p className="truncate text-[10px] text-foreground-subtle">{c.tagline}</p>
                  </div>
                </div>
              )
            })
          )}
          <p className="mt-1 flex items-center gap-1 text-[10px] text-foreground-subtle">
            <UsersRound className="size-2.5" />
            Assign per-page characters in Page settings.
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
