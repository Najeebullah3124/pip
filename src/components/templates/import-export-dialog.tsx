import * as React from 'react'
import { Check, Copy, Download, Upload, FileJson } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { PromptTemplate } from '@/data/template-data'

export function ExportTemplateDialog({
  template,
  open,
  onOpenChange,
}: {
  template: PromptTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [copied, setCopied] = React.useState(false)
  if (!template) return null

  const json = JSON.stringify(template, null, 2)
  const templateId = template.id

  function copy() {
    navigator.clipboard?.writeText(json).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function download() {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateId}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="size-4.5 text-accent" />
            Export "{template.name}"
          </DialogTitle>
          <DialogDescription>Copy or download this template as a portable JSON definition.</DialogDescription>
        </DialogHeader>
        <pre className="max-h-72 overflow-auto rounded-xl border border-border bg-surface-2 p-3.5 text-[11px] leading-relaxed text-foreground-muted">
          {json}
        </pre>
        <DialogFooter>
          <Button variant="secondary" onClick={copy}>
            {copied ? <Check className="text-success" /> : <Copy />}
            {copied ? 'Copied' : 'Copy JSON'}
          </Button>
          <Button onClick={download}>
            <Download />
            Download .json
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ImportTemplateDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (raw: string) => { ok: true } | { ok: false; error: string }
}) {
  const [raw, setRaw] = React.useState('')
  const [error, setError] = React.useState<string>()
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleImport() {
    const result = onImport(raw)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(undefined)
    setRaw('')
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) {
          setRaw('')
          setError(undefined)
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-4.5 text-accent" />
            Import template
          </DialogTitle>
          <DialogDescription>Paste a template's JSON definition, or upload a .json file exported from PIP.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Button variant="secondary" onClick={() => inputRef.current?.click()} className="w-full">
            <Upload />
            Choose a .json file
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) setRaw(await file.text())
              e.target.value = ''
            }}
          />

          <Textarea
            rows={8}
            className="font-mono text-xs"
            placeholder='{ "name": "My Template", "category": "Image", ... }'
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value)
              setError(undefined)
            }}
          />
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!raw.trim()}>
            <Upload />
            Import template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
