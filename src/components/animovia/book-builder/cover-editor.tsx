import { Sparkles, RotateCcw, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCharacter } from '@/data/character-data'
import type { Book } from '@/data/book-builder-data'

interface CoverEditorProps {
  book: Book
  generating: boolean
  onChangeTitle: (title: string) => void
  onChangeSubtitle: (subtitle: string) => void
  onChangeAuthor: (author: string) => void
  onGenerate: () => void
}

export function CoverEditor({ book, generating, onChangeTitle, onChangeSubtitle, onChangeAuthor, onGenerate }: CoverEditorProps) {
  const characters = book.characterIds.map((id) => getCharacter(id)).filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border p-8 text-center shadow-elevation-1"
        style={{ background: `linear-gradient(135deg, ${book.coverGradientFrom}, ${book.coverGradientTo})` }}
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:18px_18px]" />
        <BookOpen className="relative size-8 text-white/50" />
        <p className="relative text-3xl font-bold leading-tight text-white">{book.title || 'Untitled book'}</p>
        <p className="relative max-w-md text-sm text-white/80">{book.coverSubtitle}</p>
        {characters.length > 0 && (
          <div className="relative flex -space-x-2">
            {characters.map((c) => (
              <div
                key={c!.id}
                className="flex size-9 items-center justify-center rounded-full border-2 border-white/60 text-[11px] font-bold text-white shadow-elevation-1"
                style={{ background: `linear-gradient(135deg, ${c!.gradientFrom}, ${c!.gradientTo})` }}
              >
                {c!.name.slice(0, 1)}
              </div>
            ))}
          </div>
        )}
        <p className="relative mt-2 text-xs font-medium uppercase tracking-wide text-white/60">{book.author}</p>

        <Button variant="secondary" size="sm" onClick={onGenerate} loading={generating} className="relative mt-2">
          {generating ? null : <Sparkles />}
          {generating ? 'Generating cover art…' : 'Generate cover art'}
        </Button>
        {!generating && (
          <Button variant="ghost" size="icon-sm" onClick={onGenerate} aria-label="Shuffle cover palette" className="absolute right-3 top-3 text-white hover:bg-white/20 hover:text-white">
            <RotateCcw />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cover-title">Title</Label>
          <Input id="cover-title" value={book.title} onChange={(e) => onChangeTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cover-author">Author</Label>
          <Input id="cover-author" value={book.author} onChange={(e) => onChangeAuthor(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="cover-subtitle">Subtitle</Label>
          <Input id="cover-subtitle" value={book.coverSubtitle} onChange={(e) => onChangeSubtitle(e.target.value)} />
        </div>
      </div>
    </div>
  )
}
