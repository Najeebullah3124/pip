import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, BookOpen, Wand2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { books as seedBooks, addBook, newBookFromStory, type Book, type BookStatus } from '@/data/book-builder-data'
import { stories, getStory } from '@/data/animovia-data'

const statusVariant: Record<BookStatus, 'outline' | 'accent' | 'success'> = {
  Draft: 'outline',
  'In Layout': 'accent',
  Ready: 'accent',
  Published: 'success',
}

export default function BooksPage() {
  const navigate = useNavigate()
  const [books, setBooks] = React.useState<Book[]>(() => [...seedBooks])
  const [open, setOpen] = React.useState(false)
  const [storyId, setStoryId] = React.useState<string | null>(null)

  function createBook(e: React.FormEvent) {
    e.preventDefault()
    if (!storyId) return
    const story = getStory(storyId)
    if (!story) return
    const book = newBookFromStory(story)
    addBook(book)
    setBooks((prev) => [book, ...prev])
    setOpen(false)
    setStoryId(null)
    navigate(`/animovia/book-builder/${book.id}`)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">Laid-out storybooks — combine scenes, illustrations, and text into finished pages in the Book Builder.</p>
        <Button onClick={() => setOpen(true)}>
          <Plus />
          New book
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <Link key={book.id} to={`/animovia/book-builder/${book.id}`}>
            <Card className="group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-elevation-2">
              <div
                className="relative flex h-28 items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${book.coverGradientFrom}, ${book.coverGradientTo})` }}
              >
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
                <BookOpen className="relative size-7 text-white/80" />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{book.title}</p>
                  <Badge variant={statusVariant[book.status]} className="shrink-0">
                    {book.status}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-xs text-foreground-subtle">{book.coverSubtitle}</p>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-[11px] text-foreground-subtle">
                  <span>{book.pages.length} pages</span>
                  <span>Updated {book.updatedAt}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New book</DialogTitle>
            <DialogDescription>Pick a story to lay out — its scenes become your first draft of pages.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createBook} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Story</Label>
              <Select value={storyId ?? undefined} onValueChange={setStoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a story" />
                </SelectTrigger>
                <SelectContent>
                  {stories.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!storyId}>
                <Wand2 />
                Create book
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
