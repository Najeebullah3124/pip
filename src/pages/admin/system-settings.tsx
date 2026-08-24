import * as React from 'react'
import { Save, Building2, ShieldAlert, BellRing, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface SettingRowProps {
  label: string
  description: string
  children: React.ReactNode
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="max-w-md">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function AdminSystemSettingsPage() {
  const [dirty, setDirty] = React.useState(false)
  const [workspaceName, setWorkspaceName] = React.useState('Emerson Sterling Workspace')
  const [require2fa, setRequire2fa] = React.useState(true)
  const [ssoOnly, setSsoOnly] = React.useState(false)
  const [sessionTimeout, setSessionTimeout] = React.useState('12')
  const [emailDigest, setEmailDigest] = React.useState(true)
  const [failureAlerts, setFailureAlerts] = React.useState(true)
  const [productUpdates, setProductUpdates] = React.useState(false)
  const { toast } = useToast()

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v)
      setDirty(true)
    }
  }

  function save() {
    setDirty(false)
    toast({ title: 'Settings saved', description: 'Changes apply workspace-wide.', variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5 pb-20">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-4.5 text-accent" />
            <CardTitle>General</CardTitle>
          </div>
          <CardDescription>Workspace identity and defaults</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow label="Workspace name" description="Shown across PIP and in outbound emails">
            <Input
              value={workspaceName}
              onChange={(e) => markDirty(setWorkspaceName)(e.target.value)}
              className="w-64"
            />
          </SettingRow>
          <SettingRow label="Default timezone" description="Used for scheduling and audit log timestamps">
            <Select defaultValue="utc-8" onValueChange={() => setDirty(true)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                <SelectItem value="utc+0">UTC</SelectItem>
                <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="Default language" description="Applied to new members unless overridden">
            <Select defaultValue="en" onValueChange={() => setDirty(true)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4.5 text-accent" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Authentication and session policy</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow label="Require two-factor authentication" description="All members must enable 2FA to sign in">
            <Switch checked={require2fa} onCheckedChange={markDirty(setRequire2fa)} />
          </SettingRow>
          <SettingRow label="SSO only" description="Disable email/password sign-in workspace-wide">
            <Switch checked={ssoOnly} onCheckedChange={markDirty(setSsoOnly)} />
          </SettingRow>
          <SettingRow label="Session timeout" description="Automatically sign out after inactivity">
            <Select value={sessionTimeout} onValueChange={markDirty(setSessionTimeout)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow label="IP allowlist" description="Restrict access to specific IP ranges">
            <Input placeholder="e.g. 203.0.113.0/24" className="w-64" onChange={() => setDirty(true)} />
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BellRing className="size-4.5 text-accent" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>What the workspace gets notified about</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow label="Weekly email digest" description="Summary of prompt activity and usage sent every Monday">
            <Switch checked={emailDigest} onCheckedChange={markDirty(setEmailDigest)} />
          </SettingRow>
          <SettingRow label="Engine failure alerts" description="Notify admins immediately when a provider goes down">
            <Switch checked={failureAlerts} onCheckedChange={markDirty(setFailureAlerts)} />
          </SettingRow>
          <SettingRow label="Product updates" description="Occasional emails about new PIP features">
            <Switch checked={productUpdates} onCheckedChange={markDirty(setProductUpdates)} />
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="size-4.5 text-accent" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Default look and feel for new members</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingRow label="Default theme" description="Members can still switch individually from the top bar">
            <Select defaultValue="system" onValueChange={() => setDirty(true)}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Match system</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </CardContent>
      </Card>

      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-5 lg:pl-[280px]">
          <div className="flex w-full max-w-2xl items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-elevation-4 animate-fade-in-up">
            <p className="text-sm text-foreground-muted">You have unsaved changes</p>
            <div className="flex items-center gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => setDirty(false)}>
                Discard
              </Button>
              <Button size="sm" onClick={save}>
                <Save />
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
