import * as React from 'react'
import { Plus, PlugZap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { categories, type EngineCategory } from '@/data/engine-data'

export interface AddEngineValues {
  name: string
  vendor: string
  category: EngineCategory
  apiKey: string
  modelName: string
}

export function AddEngineDialog({ onSubmit }: { onSubmit: (values: AddEngineValues) => void }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [vendor, setVendor] = React.useState('')
  const [category, setCategory] = React.useState<EngineCategory>('Language')
  const [apiKey, setApiKey] = React.useState('')
  const [modelName, setModelName] = React.useState('')
  const [nameError, setNameError] = React.useState<string>()

  function reset() {
    setName('')
    setVendor('')
    setCategory('Language')
    setApiKey('')
    setModelName('')
    setNameError(undefined)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Provider name is required')
      return
    }
    onSubmit({ name, vendor, category, apiKey, modelName })
    setOpen(false)
    reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add provider
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlugZap className="size-4.5 text-accent" />
            Add AI provider
          </DialogTitle>
          <DialogDescription>
            New providers are registered through configuration only — no client application changes are required to start routing to them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="eng-name">Provider name</Label>
              <Input
                id="eng-name"
                placeholder="e.g. Luma AI"
                value={name}
                invalid={!!nameError}
                onChange={(e) => {
                  setName(e.target.value)
                  setNameError(undefined)
                }}
              />
              {nameError && <p className="text-xs font-medium text-destructive">{nameError}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="eng-vendor">Vendor</Label>
              <Input id="eng-vendor" placeholder="e.g. Luma Labs Inc." value={vendor} onChange={(e) => setVendor(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eng-category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EngineCategory)}>
              <SelectTrigger id="eng-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eng-model">Initial model name</Label>
            <Input id="eng-model" placeholder="e.g. Dream Machine v2" value={modelName} onChange={(e) => setModelName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eng-key">API key</Label>
            <Input
              id="eng-key"
              type="password"
              placeholder="sk-••••••••••••••••"
              className="font-mono text-[13px]"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-foreground-subtle">Stored securely — only the last 4 characters are ever displayed after saving.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add provider</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
