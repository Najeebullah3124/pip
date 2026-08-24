import * as React from 'react'
import { DatabaseBackup, Download, History, RotateCcw, Trash2, HardDrive, CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { StatusBadge } from '@/components/admin/shared/status-badge'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { backups as seedBackups, type BackupRecord } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

export default function AdminBackupRestorePage() {
  const [backups, setBackups] = React.useState<BackupRecord[]>(seedBackups)
  const [creating, setCreating] = React.useState(false)
  const [autoBackup, setAutoBackup] = React.useState(true)
  const { toast } = useToast()

  const totalSize = backups.filter((b) => b.status === 'Complete').length
  const lastBackup = backups[0]

  async function createBackup() {
    setCreating(true)
    await new Promise((r) => setTimeout(r, 1400))
    const record: BackupRecord = {
      id: `bk_${Date.now()}`,
      label: 'Manual snapshot',
      createdAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      size: '4.2 GB',
      type: 'Manual',
      status: 'Complete',
    }
    setBackups((prev) => [record, ...prev])
    setCreating(false)
    toast({ title: 'Backup created', description: 'Your workspace snapshot is ready.', variant: 'success' })
  }

  function restoreBackup(label: string) {
    toast({ title: 'Restore started', description: `Restoring from "${label}" — this may take a few minutes.`, variant: 'success' })
  }

  function deleteBackup(id: string) {
    setBackups((prev) => prev.filter((b) => b.id !== id))
    toast({ title: 'Backup deleted' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total backups" value={String(totalSize)} icon={<DatabaseBackup />} />
        <StatCard label="Last backup" value={lastBackup ? lastBackup.createdAt.split(',')[0] : '—'} icon={<History />} />
        <StatCard label="Storage used" value="24.3 GB" icon={<HardDrive />} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4.5 text-accent" />
            <div>
              <CardTitle>Backup schedule</CardTitle>
              <CardDescription>Automatic snapshots of your entire workspace</CardDescription>
            </div>
          </div>
          <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
        </CardHeader>
        {autoBackup && (
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Retention</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Keep 7 days</SelectItem>
                  <SelectItem value="30">Keep 30 days</SelectItem>
                  <SelectItem value="90">Keep 90 days</SelectItem>
                  <SelectItem value="forever">Keep forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">{backups.length} snapshots available for restore</p>
        <Button loading={creating} onClick={createBackup}>
          <DatabaseBackup />
          {creating ? 'Creating backup…' : 'Create backup now'}
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Snapshot</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.label}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{b.createdAt}</TableCell>
                <TableCell className="text-sm tabular-nums text-foreground-muted">{b.size}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{b.type}</TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="Download backup" disabled={b.status !== 'Complete'}>
                      <Download />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Restore backup" disabled={b.status !== 'Complete'}>
                          <RotateCcw />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Restore from "{b.label}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This replaces current workspace data with the state captured on {b.createdAt}. Active sessions may be interrupted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => restoreBackup(b.label)}>Restore workspace</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete backup" onClick={() => deleteBackup(b.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
