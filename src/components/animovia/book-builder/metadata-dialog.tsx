import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Book } from '@/data/book-builder-data'

interface MetadataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book: Book
  onSave: (patch: Partial<Book>) => void
}

export function MetadataDialog({ open, onOpenChange, book, onSave }: MetadataDialogProps) {
  const [author, setAuthor] = React.useState(book.author)
  const [description, setDescription] = React.useState(book.description)
  const [showPageNumbers, setShowPageNumbers] = React.useState(book.showPageNumbers)

  React.useEffect(() => {
    if (open) {
      setAuthor(book.author)
      setDescription(book.description)
      setShowPageNumbers(book.showPageNumbers)
    }
  }, [open, book])

  function save() {
    onSave({ author, description, showPageNumbers })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book metadata</DialogTitle>
          <DialogDescription>Details attached to this book's cover, exports, and library listing.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meta-author">Author</Label>
            <Input id="meta-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="meta-desc">Description</Label>
            <Textarea id="meta-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3.5 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Show page numbers</p>
              <p className="text-xs text-foreground-subtle">Displays a page number badge on every page.</p>
            </div>
            <Switch checked={showPageNumbers} onCheckedChange={setShowPageNumbers} />
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface-2 p-3.5 text-xs text-foreground-subtle">
            <div>
              <p className="text-[10px] uppercase tracking-wide">Pages</p>
              <p className="text-sm font-medium text-foreground">{book.pages.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide">Status</p>
              <p className="text-sm font-medium text-foreground">{book.status}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={save}>
            Save metadata
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
