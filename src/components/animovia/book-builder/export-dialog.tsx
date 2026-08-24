import * as React from 'react'
import { FileText, Printer, FileImage, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ExportFormat = 'PDF' | 'Print-ready PDF' | 'PNG pages'

const formats: { key: ExportFormat; label: string; description: string; icon: typeof FileText }[] = [
  { key: 'PDF', label: 'PDF', description: 'Digital-ready, screen resolution, small file size.', icon: FileText },
  { key: 'Print-ready PDF', label: 'Print-ready PDF', description: 'CMYK color, bleed margins, 300dpi for professional printing.', icon: Printer },
  { key: 'PNG pages', label: 'PNG pages', description: 'Every page exported as an individual high-res image.', icon: FileImage },
]

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (format: ExportFormat) => void
  exporting: boolean
}

export function ExportDialog({ open, onOpenChange, onExport, exporting }: ExportDialogProps) {
  const [format, setFormat] = React.useState<ExportFormat>('PDF')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export book</DialogTitle>
          <DialogDescription>Choose an export format for the finished book.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2.5">
          {formats.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFormat(f.key)}
              className={cn(
                'flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all',
                format === f.key ? 'border-accent bg-accent-soft' : 'border-border bg-surface-2 hover:bg-muted'
              )}
            >
              <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', format === f.key ? 'bg-accent text-white' : 'bg-muted text-foreground-muted')}>
                <f.icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-foreground">{f.label}</span>
                <span className="block text-xs text-foreground-subtle">{f.description}</span>
              </span>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => onExport(format)} loading={exporting}>
            <Sparkles />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
