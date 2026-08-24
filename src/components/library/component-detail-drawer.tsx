import * as React from 'react'
import { Pencil, Copy, Eye, Trash2, RotateCcw, Zap, Clock, User, Calendar } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ComponentStatusBadge } from '@/components/library/component-status-badge'
import { UsageChart } from '@/components/library/usage-chart'
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
import { categoryMeta, type PromptComponent } from '@/data/component-data'
import { useToast } from '@/hooks/use-toast'

interface ComponentDetailDrawerProps {
  component: PromptComponent | null
  onOpenChange: (open: boolean) => void
  onEdit: (id: string) => void
  onPreview: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onRestoreVersion: (id: string, version: string) => void
}

export function ComponentDetailDrawer({
  component,
  onOpenChange,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onRestoreVersion,
}: ComponentDetailDrawerProps) {
  const { toast } = useToast()

  return (
    <Sheet open={!!component} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        {component && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-elevation-1"
                  style={{ backgroundColor: categoryMeta[component.category].color }}
                >
                  {React.createElement(categoryMeta[component.category].icon, { className: 'size-5' })}
                </div>
                <div className="min-w-0">
                  <SheetTitle className="truncate">{component.name}</SheetTitle>
                  <SheetDescription className="truncate">{component.category}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <SheetBody className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <ComponentStatusBadge status={component.status} />
                <Badge variant="outline">{component.version}</Badge>
                {component.tags.map((t) => (
                  <Badge key={t} variant="accent">
                    {t}
                  </Badge>
                ))}
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="versions">Versions</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="flex flex-col gap-5">
                  <p className="text-sm leading-relaxed text-foreground-muted">{component.description}</p>

                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Definition</p>
                    <pre className="overflow-x-auto rounded-xl border border-border bg-surface-2 p-3.5 text-xs leading-relaxed text-foreground-muted">
                      {component.content}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={User} label="Owner" value={component.owner} />
                    <InfoRow icon={Calendar} label="Created" value={component.createdAt} />
                    <InfoRow icon={Clock} label="Last updated" value={component.lastUpdated} />
                    <InfoRow icon={Zap} label="Total uses" value={component.usageCount.toLocaleString()} />
                  </div>

                  <Separator />

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Used by</p>
                    <div className="flex flex-col gap-1.5">
                      {component.usedBy.map((u) => (
                        <div key={u} className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-2 text-sm text-foreground">
                          <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                          {u}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="versions" className="flex flex-col gap-1">
                  {component.versions.map((v, i) => (
                    <div key={v.version} className="flex items-start gap-3 rounded-xl px-2.5 py-3 transition-colors hover:bg-muted">
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent-700">
                        {v.version.replace('v', '')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{v.version}</p>
                          {i === 0 && <Badge variant="success">Current</Badge>}
                        </div>
                        <p className="text-xs text-foreground-muted">{v.changelog}</p>
                        <p className="mt-0.5 text-[11px] text-foreground-subtle">
                          {v.updatedBy} · {v.updatedAt}
                        </p>
                      </div>
                      {i !== 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onRestoreVersion(component.id, v.version)
                            toast({ title: `Restored ${v.version}`, description: `${component.name} rolled back successfully.`, variant: 'success' })
                          }}
                        >
                          <RotateCcw />
                          Restore
                        </Button>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="usage" className="flex flex-col gap-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Usage over time</p>
                    <UsageChart data={component.usageHistory} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={Zap} label="Total uses" value={component.usageCount.toLocaleString()} />
                    <InfoRow icon={Clock} label="Last used" value={component.lastUpdated} />
                  </div>
                </TabsContent>
              </Tabs>
            </SheetBody>

            <SheetFooter className="justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-destructive hover:bg-red-50">
                    <Trash2 />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{component.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes the component and its version history. Prompts referencing it will need a replacement.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => onDelete(component.id)}>
                      Delete component
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex items-center gap-2.5">
                <Button variant="secondary" onClick={() => onDuplicate(component.id)}>
                  <Copy />
                  Duplicate
                </Button>
                <Button variant="secondary" onClick={() => onPreview(component.id)}>
                  <Eye />
                  Preview
                </Button>
                <Button onClick={() => onEdit(component.id)}>
                  <Pencil />
                  Edit
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground-muted">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-foreground-subtle">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
