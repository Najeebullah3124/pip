import * as React from 'react'
import { Palette, Sparkles, Inbox, Trash2, Download, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Spinner } from '@/components/shared/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Forms & Inputs' },
  { id: 'cards', label: 'Cards' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'table', label: 'Tables' },
  { id: 'overlays', label: 'Modals & Dialogs' },
  { id: 'feedback', label: 'Toasts & States' },
]

const colorSwatches = [
  { name: 'Primary', className: 'bg-primary', text: 'text-primary-foreground' },
  { name: 'Accent', className: 'bg-accent', text: 'text-accent-foreground' },
  { name: 'Accent 700', className: 'bg-accent-700', text: 'text-white' },
  { name: 'Accent Soft', className: 'bg-accent-soft', text: 'text-accent-700' },
  { name: 'Secondary', className: 'bg-secondary', text: 'text-secondary-foreground' },
  { name: 'Muted', className: 'bg-muted', text: 'text-muted-foreground' },
  { name: 'Destructive', className: 'bg-destructive', text: 'text-destructive-foreground' },
  { name: 'Success', className: 'bg-success', text: 'text-success-foreground' },
  { name: 'Warning', className: 'bg-warning', text: 'text-warning-foreground' },
  { name: 'Info', className: 'bg-info', text: 'text-info-foreground' },
]

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = React.useState('colors')
  const { toast } = useToast()

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Design System"
        description="The reusable visual language and component library powering PIP."
        icon={<Palette />}
        breadcrumbs={[{ label: 'Design System' }]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-0.5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm transition-colors',
                  activeSection === s.id
                    ? 'bg-accent-soft font-semibold text-accent-700'
                    : 'text-foreground-muted hover:bg-muted hover:text-foreground'
                )}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex flex-col gap-14">
          {/* Colors */}
          <Section id="colors" title="Colors" description="Semantic tokens driving every surface, action, and state.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {colorSwatches.map((c) => (
                <div key={c.name} className="flex flex-col gap-2">
                  <div
                    className={cn(
                      'flex h-16 items-end rounded-xl border border-border p-2.5 shadow-elevation-1',
                      c.className,
                      c.text
                    )}
                  >
                    <span className="text-xs font-semibold">Aa</span>
                  </div>
                  <p className="text-xs font-medium text-foreground-muted">{c.name}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section id="typography" title="Typography" description="Plus Jakarta Sans — clear hierarchy at every scale.">
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <p className="text-4xl font-extrabold tracking-tight">Display — 36px / 800</p>
                <p className="text-2xl font-bold tracking-tight">Heading 1 — 24px / 700</p>
                <p className="text-lg font-semibold">Heading 2 — 18px / 600</p>
                <p className="text-base font-medium">Body — 16px / 500</p>
                <p className="text-sm text-foreground-muted">Body muted — 14px / 400</p>
                <p className="text-xs text-foreground-subtle">Caption — 12px / 400</p>
                <p className="text-gradient-accent text-2xl font-extrabold">Gradient accent text</p>
              </div>
            </Card>
          </Section>

          {/* Buttons */}
          <Section id="buttons" title="Buttons" description="Primary actions are black; purple marks AI-forward moments.">
            <Card className="flex flex-col gap-6 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="accent">
                  <Sparkles /> AI Accent
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link button</Button>
              </div>
              <Separator />
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Download">
                  <Download />
                </Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </Card>
          </Section>

          {/* Forms */}
          <Section id="forms" title="Forms & Inputs" description="Labeled fields, helper text, and clear validation states.">
            <Card className="p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ds-name">Prompt name</Label>
                  <Input id="ds-name" placeholder="e.g. Support Triage v3" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ds-engine">AI Engine</Label>
                  <Select defaultValue="opus">
                    <SelectTrigger id="ds-engine">
                      <SelectValue placeholder="Choose an engine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opus">Claude Opus 5</SelectItem>
                      <SelectItem value="sonnet">Claude Sonnet 5</SelectItem>
                      <SelectItem value="haiku">Claude Haiku 4.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label htmlFor="ds-desc">Description</Label>
                  <Textarea id="ds-desc" placeholder="What does this prompt do?" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="ds-invalid">With validation error</Label>
                  <Input id="ds-invalid" invalid defaultValue="not-an-email" />
                  <p className="text-xs text-destructive">Enter a valid email address.</p>
                </div>
                <div className="flex flex-col gap-3 justify-center">
                  <div className="flex items-center gap-2.5">
                    <Checkbox id="ds-check" defaultChecked />
                    <Label htmlFor="ds-check" className="font-normal">Enable auto-evaluation</Label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Switch id="ds-switch" defaultChecked />
                    <Label htmlFor="ds-switch" className="font-normal">Publish to team library</Label>
                  </div>
                </div>
              </div>
            </Card>
          </Section>

          {/* Cards */}
          <Section id="cards" title="Cards" description="Rounded surfaces with soft elevation for grouped content.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Standard card</CardTitle>
                  <CardDescription>Header, content, and footer slots</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">
                    Cards are the base surface for stats, lists, and forms throughout PIP.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">Cancel</Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col items-start gap-3 p-5">
                <Avatar className="size-10">
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Nova Assistant</p>
                  <p className="text-xs text-foreground-muted">Support persona · Live</p>
                </div>
                <Badge variant="success">Active</Badge>
              </Card>
              <Card className="flex flex-col justify-between gap-4 bg-gradient-to-br from-accent to-accent-700 p-5 text-white">
                <Sparkles className="size-5" />
                <div>
                  <p className="text-sm font-semibold">AI-forward card</p>
                  <p className="text-xs text-white/80">Used to highlight AI-generated insights.</p>
                </div>
              </Card>
            </div>
          </Section>

          {/* Tabs */}
          <Section id="tabs" title="Tabs" description="Segmented navigation for related content within a page.">
            <Card className="p-6">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="versions">Versions</TabsTrigger>
                  <TabsTrigger value="evals">Evals</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="text-sm text-foreground-muted">High-level summary of prompt performance and usage.</p>
                </TabsContent>
                <TabsContent value="versions">
                  <p className="text-sm text-foreground-muted">Version history with diffing and rollback support.</p>
                </TabsContent>
                <TabsContent value="evals">
                  <p className="text-sm text-foreground-muted">Automated evaluation runs against your test suite.</p>
                </TabsContent>
              </Tabs>
            </Card>
          </Section>

          {/* Table */}
          <Section id="table" title="Tables" description="Dense data views with row actions and status badges.">
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Engine</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Support Triage v3', engine: 'Opus 5', status: 'Live', score: '94%' },
                    { name: 'Onboarding Draft', engine: 'Sonnet 5', status: 'Draft', score: '—' },
                    { name: 'Copy Rewriter', engine: 'Haiku 4.5', status: 'Live', score: '88%' },
                  ].map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-foreground-muted">{row.engine}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === 'Live' ? 'success' : 'accent'}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{row.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Section>

          {/* Overlays */}
          <Section id="overlays" title="Modals & Dialogs" description="Focused surfaces for creation flows and destructive confirmations.">
            <Card className="flex flex-wrap gap-3 p-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Open modal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new prompt</DialogTitle>
                    <DialogDescription>Give your prompt a name and starting engine.</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <Input placeholder="Prompt name" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an engine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opus">Claude Opus 5</SelectItem>
                        <SelectItem value="sonnet">Claude Sonnet 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button>Create prompt</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 /> Delete prompt
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete "Support Triage v3"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove the prompt and its version history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Tooltips use a dark surface for contrast</TooltipContent>
              </Tooltip>
            </Card>
          </Section>

          {/* Feedback */}
          <Section id="feedback" title="Toasts & States" description="Async feedback, skeletons, and empty states.">
            <div className="flex flex-col gap-5">
              <Card className="flex flex-wrap gap-3 p-6">
                <Button
                  variant="secondary"
                  onClick={() => toast({ title: 'Prompt saved', description: 'Your changes have been saved.', variant: 'success' })}
                >
                  Success toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast({ title: 'Evaluation failed', description: 'Could not reach the AI engine.', variant: 'destructive' })}
                >
                  Error toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast({ title: 'Approaching usage limit', description: '90% of monthly quota used.', variant: 'warning' })}
                >
                  Warning toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast({ title: 'Sync complete', description: 'Library refreshed with 3 new prompts.' })}
                >
                  Default toast
                </Button>
              </Card>

              <Card className="p-6">
                <p className="mb-3 text-sm font-semibold">Loading skeleton</p>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-center rounded-xl border border-border py-8">
                  <Spinner size={22} />
                </div>
              </Card>

              <EmptyState
                icon={<Inbox />}
                title="No prompts yet"
                description="Create your first prompt to see it appear here with performance insights."
                action={
                  <Button size="sm">
                    Create prompt
                    <ChevronRight />
                  </Button>
                }
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-foreground-muted">{description}</p>
      </div>
      {children}
    </section>
  )
}
