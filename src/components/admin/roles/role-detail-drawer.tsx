import * as React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { permissionDefs, type RoleDef } from '@/data/admin-data'

const categories = ['Prompts', 'Characters', 'Engines', 'Projects', 'Administration'] as const

export function RoleDetailDrawer({
  role,
  onOpenChange,
  onSave,
}: {
  role: RoleDef | null
  onOpenChange: (open: boolean) => void
  onSave: (key: string, permissions: string[]) => void
}) {
  const [permissions, setPermissions] = React.useState<string[]>([])

  React.useEffect(() => {
    if (role) setPermissions(role.permissions)
  }, [role])

  function toggle(key: string, checked: boolean) {
    setPermissions((prev) => (checked ? [...prev, key] : prev.filter((p) => p !== key)))
  }

  return (
    <Sheet open={!!role} onOpenChange={onOpenChange}>
      <SheetContent>
        {role && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <SheetTitle>{role.name}</SheetTitle>
                {role.builtIn && <Badge variant="outline">Built-in</Badge>}
              </div>
              <SheetDescription>{role.description}</SheetDescription>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-6">
              <p className="text-xs text-foreground-subtle">
                {role.memberCount} member{role.memberCount === 1 ? '' : 's'} currently have this role.
              </p>
              {categories.map((cat) => {
                const items = permissionDefs.filter((p) => p.category === cat)
                return (
                  <div key={cat} className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">{cat}</p>
                    <div className="flex flex-col gap-2.5">
                      {items.map((p) => (
                        <div key={p.key} className="flex items-start gap-2.5">
                          <Checkbox
                            id={p.key}
                            className="mt-0.5"
                            checked={permissions.includes(p.key)}
                            onCheckedChange={(v) => toggle(p.key, v === true)}
                          />
                          <Label htmlFor={p.key} className="cursor-pointer font-normal">
                            <span className="block text-sm font-medium text-foreground">{p.label}</span>
                            <span className="block text-xs text-foreground-subtle">{p.description}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </SheetBody>
            <SheetFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSave(role.key, permissions)
                  onOpenChange(false)
                }}
              >
                Save changes
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
