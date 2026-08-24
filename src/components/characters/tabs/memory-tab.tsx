import * as React from 'react'
import { Trash2, BookOpen, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { DnaSection } from '@/components/characters/dna-field'
import { TagEditor } from '@/components/characters/tag-editor'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { Memory } from '@/data/character-data'
import { useToast } from '@/hooks/use-toast'

interface MemoryTabProps {
  data: Memory
  mode: 'view' | 'edit'
  onChange?: (patch: Partial<Memory>) => void
}

export function MemoryTab({ data, mode, onChange }: MemoryTabProps) {
  const [entries, setEntries] = React.useState(data.entries)
  const { toast } = useToast()

  function clearMemory() {
    setEntries([])
    toast({ title: 'Session memory cleared', description: 'Long-term facts are preserved.', variant: 'success' })
  }

  return (
    <DnaSection title="Character memory" description="What this character remembers across sessions and applications.">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Label>Memory retention</Label>
          <span className="text-xs font-semibold tabular-nums text-foreground-muted">{data.retention}%</span>
        </div>
        {mode === 'edit' ? (
          <Slider className="mt-2.5" value={[data.retention]} max={100} step={1} onValueChange={([v]) => onChange?.({ retention: v })} />
        ) : (
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-700" style={{ width: `${data.retention}%` }} />
          </div>
        )}
        <p className="mt-2 text-xs text-foreground-subtle">How much context this character carries between conversations.</p>
      </Card>

      <Card className="p-6">
        {mode === 'edit' ? (
          <TagEditor
            label="Long-term facts"
            values={data.longTermFacts}
            onChange={(v) => onChange?.({ longTermFacts: v })}
            placeholder="Add a fact this character should always remember…"
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
              <BookOpen className="size-3.5" />
              Long-term facts
            </p>
            {data.longTermFacts.map((f) => (
              <div key={f} className="flex items-start gap-2.5 rounded-xl bg-muted/60 px-3.5 py-2.5 text-sm text-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {f}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
            <Clock className="size-3.5" />
            Recent episodic memory
          </p>
          {mode === 'edit' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-red-50" disabled={entries.length === 0}>
                  <Trash2 />
                  Clear session memory
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear session memory?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes recent episodic memory across all applications. Long-term facts are preserved. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={clearMemory}>
                    Clear memory
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground-subtle">No recent episodic memory.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-muted">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{e.summary}</p>
                  <p className="text-xs text-foreground-subtle">{e.time}</p>
                </div>
                <Badge variant="outline">{e.application}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DnaSection>
  )
}
