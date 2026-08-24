import * as React from 'react'
import { Check, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { permissionDefs, roleDefs } from '@/data/admin-data'
import { useToast } from '@/hooks/use-toast'

const categories = ['Prompts', 'Characters', 'Engines', 'Projects', 'Administration'] as const

export default function AdminPermissionsPage() {
  const editableRoles = roleDefs.filter((r) => r.key !== 'Owner')
  const [matrix, setMatrix] = React.useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(editableRoles.map((r) => [r.key, new Set(r.permissions)]))
  )
  const [dirty, setDirty] = React.useState(false)
  const { toast } = useToast()

  function toggle(roleKey: string, permissionKey: string) {
    setMatrix((prev) => {
      const next = { ...prev, [roleKey]: new Set(prev[roleKey]) }
      if (next[roleKey].has(permissionKey)) next[roleKey].delete(permissionKey)
      else next[roleKey].add(permissionKey)
      return next
    })
    setDirty(true)
  }

  function save() {
    setDirty(false)
    toast({ title: 'Permission matrix saved', description: 'Changes apply to all members with these roles.', variant: 'success' })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground-muted">
          Owner always has full access. Toggle permissions per role — changes apply to every member with that role.
        </p>
        <Button size="sm" disabled={!dirty} onClick={save}>
          <Save />
          Save changes
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  Permission
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                  Owner
                </th>
                {editableRoles.map((r) => (
                  <th key={r.key} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-foreground-subtle">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat}>
                  <tr>
                    <td colSpan={editableRoles.length + 2} className="bg-surface-2 px-4 py-1.5 text-xs font-semibold text-foreground-muted">
                      {cat}
                    </td>
                  </tr>
                  {permissionDefs
                    .filter((p) => p.category === cat)
                    .map((p) => (
                      <tr key={p.key} className="border-b border-border last:border-0 hover:bg-muted/40">
                        <td className="sticky left-0 z-10 bg-card px-4 py-3">
                          <p className="text-sm font-medium text-foreground">{p.label}</p>
                          <p className="text-xs text-foreground-subtle">{p.description}</p>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Check className="mx-auto size-4 text-accent" />
                        </td>
                        {editableRoles.map((r) => (
                          <td key={r.key} className="px-3 py-3 text-center">
                            <Checkbox
                              checked={matrix[r.key].has(p.key)}
                              onCheckedChange={() => toggle(r.key, p.key)}
                              aria-label={`${p.label} for ${r.name}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
