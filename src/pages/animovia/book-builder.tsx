import * as React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, Info, FileDown, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageListPanel } from '@/components/animovia/book-builder/page-list-panel'
import { PageCanvas } from '@/components/animovia/book-builder/page-canvas'
import { CoverEditor } from '@/components/animovia/book-builder/cover-editor'
import { PageSettingsPanel } from '@/components/animovia/book-builder/page-settings-panel'
import { ExportDialog, type ExportFormat } from '@/components/animovia/book-builder/export-dialog'
import { MetadataDialog } from '@/components/animovia/book-builder/metadata-dialog'
import { PreviewModal } from '@/components/animovia/book-builder/preview-modal'
import { getBook, updateBook, blankPage, type Book, type BookPage, type BookStatus } from '@/data/book-builder-data'
import { getStory, addAnimoviaAsset } from '@/data/animovia-data'
import { useToast } from '@/hooks/use-toast'

const statusVariant: Record<BookStatus, 'outline' | 'accent' | 'success'> = {
  Draft: 'outline',
  'In Layout': 'accent',
  Ready: 'accent',
  Published: 'success',
}

const gradientPairs: [string, string][] = [
  ['#fda4af', '#e11d48'], ['#fde68a', '#d97706'], ['#a78bfa', '#7c3aed'], ['#93c5fd', '#2563eb'],
  ['#86efac', '#16a34a'], ['#f0abfc', '#c026d3'], ['#5eead4', '#0891b2'], ['#c4b5fd', '#6d28d9'],
]
function randomGradient(): [string, string] {
  return gradientPairs[Math.floor(Math.random() * gradientPairs.length)]
}

export default function BookBuilderPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const initialBook = bookId ? getBook(bookId) : undefined

  if (!initialBook) {
    return (
      <Card className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
        <BookOpen className="size-6 text-foreground-subtle" />
        <p className="text-sm font-semibold text-foreground">Book not found</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/animovia/books')}>
          <ArrowLeft />
          Back to books
        </Button>
      </Card>
    )
  }

  return <BookBuilderView key={initialBook.id} initialBook={initialBook} />
}

function BookBuilderView({ initialBook }: { initialBook: Book }) {
  const { toast } = useToast()

  const [book, setBook] = React.useState<Book>(initialBook)
  const [view, setView] = React.useState<string>(book.pages[0]?.id ?? 'cover')
  const [generatingIllustration, setGeneratingIllustration] = React.useState(false)
  const [generatingCover, setGeneratingCover] = React.useState(false)
  const [exportOpen, setExportOpen] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const [metadataOpen, setMetadataOpen] = React.useState(false)
  const [previewOpen, setPreviewOpen] = React.useState(false)

  const story = book.storyId ? getStory(book.storyId) : undefined
  const currentPage = book.pages.find((p) => p.id === view)

  function patchBook(patch: Partial<Book>) {
    setBook((b) => {
      const next = { ...b, ...patch, updatedAt: 'Just now' }
      updateBook(b.id, patch)
      return next
    })
  }

  function patchPage(pageId: string, patch: Partial<BookPage>) {
    patchBook({ pages: book.pages.map((p) => (p.id === pageId ? { ...p, ...patch } : p)) })
  }

  function addPage() {
    const newPage = blankPage(book.pages.length + 1, book.characterIds[0] ?? null)
    patchBook({ pages: [...book.pages, newPage] })
    setView(newPage.id)
  }

  function duplicatePage(pageId: string) {
    const idx = book.pages.findIndex((p) => p.id === pageId)
    if (idx === -1) return
    const copy: BookPage = { ...book.pages[idx], id: `page_dup_${Date.now()}` }
    const pages = [...book.pages.slice(0, idx + 1), copy, ...book.pages.slice(idx + 1)].map((p, i) => ({ ...p, pageNumber: i + 1 }))
    patchBook({ pages })
    setView(copy.id)
  }

  function deletePage(pageId: string) {
    if (book.pages.length <= 1) return
    const pages = book.pages.filter((p) => p.id !== pageId).map((p, i) => ({ ...p, pageNumber: i + 1 }))
    patchBook({ pages })
    if (view === pageId) setView(pages[0]?.id ?? 'cover')
  }

  function movePage(pageId: string, dir: -1 | 1) {
    const idx = book.pages.findIndex((p) => p.id === pageId)
    const target = idx + dir
    if (idx === -1 || target < 0 || target >= book.pages.length) return
    const pages = [...book.pages]
    ;[pages[idx], pages[target]] = [pages[target], pages[idx]]
    patchBook({ pages: pages.map((p, i) => ({ ...p, pageNumber: i + 1 })) })
  }

  function insertScene(sceneIndex: number) {
    if (!story) return
    const scene = story.scenes[sceneIndex]
    const newPage = blankPage(book.pages.length + 1, book.characterIds[0] ?? null)
    newPage.text = scene.description
    patchBook({ pages: [...book.pages, newPage] })
    setView(newPage.id)
  }

  function generateIllustration() {
    if (!currentPage) return
    setGeneratingIllustration(true)
    setTimeout(() => {
      const [gradientFrom, gradientTo] = randomGradient()
      patchPage(currentPage.id, { hasIllustration: true, gradientFrom, gradientTo })
      setGeneratingIllustration(false)
      toast({ title: 'Illustration generated', description: `Page ${currentPage.pageNumber} artwork is ready.`, variant: 'success' })
    }, 1300)
  }

  function generateCover() {
    setGeneratingCover(true)
    setTimeout(() => {
      const [coverGradientFrom, coverGradientTo] = randomGradient()
      patchBook({ coverGradientFrom, coverGradientTo })
      setGeneratingCover(false)
      toast({ title: 'Cover art generated', description: 'Your book cover is ready.', variant: 'success' })
    }, 1300)
  }

  function handleExport(format: ExportFormat) {
    setExporting(true)
    setTimeout(() => {
      const metaByFormat: Record<ExportFormat, string> = {
        PDF: `PDF · ${(book.pages.length * 0.4 + 1).toFixed(1)}MB`,
        'Print-ready PDF': `Print-ready PDF · ${(book.pages.length * 1.2 + 4).toFixed(0)}MB`,
        'PNG pages': `PNG pages · ${book.pages.length + 1} files`,
      }
      addAnimoviaAsset({
        id: `asset_export_${Date.now()}`,
        kind: 'Export',
        title: `${book.title} — Export`,
        characterId: book.characterIds[0] ?? null,
        storyId: book.storyId,
        status: 'Complete',
        engine: 'Animovia Export Engine',
        createdAt: 'Just now',
        gradientFrom: book.coverGradientFrom,
        gradientTo: book.coverGradientTo,
        meta: metaByFormat[format],
      })
      patchBook({ status: 'Ready' })
      setExporting(false)
      setExportOpen(false)
      toast({ title: 'Export ready', description: `${book.title} exported as ${format}.`, variant: 'success' })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/animovia/books">
            <ArrowLeft />
            All books
          </Link>
        </Button>
        <div className="h-4 w-px bg-border" />
        <p className="text-sm font-semibold text-foreground">{book.title}</p>
        <Badge variant={statusVariant[book.status]}>{book.status}</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setMetadataOpen(true)}>
            <Info />
            Metadata
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye />
            Preview
          </Button>
          <Button size="sm" onClick={() => setExportOpen(true)}>
            <FileDown />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr_300px]">
        <PageListPanel
          book={book}
          story={story}
          selectedView={view}
          onSelectView={setView}
          onAddPage={addPage}
          onDuplicatePage={duplicatePage}
          onDeletePage={deletePage}
          onMovePage={movePage}
          onInsertScene={insertScene}
        />

        <Card className="p-4 sm:p-5">
          {view === 'cover' ? (
            <CoverEditor
              book={book}
              generating={generatingCover}
              onChangeTitle={(title) => patchBook({ title })}
              onChangeSubtitle={(coverSubtitle) => patchBook({ coverSubtitle })}
              onChangeAuthor={(author) => patchBook({ author })}
              onGenerate={generateCover}
            />
          ) : currentPage ? (
            <PageCanvas
              page={currentPage}
              showPageNumber={book.showPageNumbers}
              editable
              generating={generatingIllustration}
              onChangeText={(text) => patchPage(currentPage.id, { text })}
              onGenerateIllustration={generateIllustration}
            />
          ) : null}
        </Card>

        <Card className="p-4 sm:p-5">
          {view === 'cover' ? (
            <p className="text-xs text-foreground-subtle">Cover details are edited directly on the canvas. Select a page from the left to edit its illustration, layout, and text settings.</p>
          ) : currentPage ? (
            <PageSettingsPanel page={currentPage} onChange={(patch) => patchPage(currentPage.id, patch)} />
          ) : null}
        </Card>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} onExport={handleExport} exporting={exporting} />
      <MetadataDialog open={metadataOpen} onOpenChange={setMetadataOpen} book={book} onSave={patchBook} />
      <PreviewModal open={previewOpen} onOpenChange={setPreviewOpen} book={book} />
    </div>
  )
}
