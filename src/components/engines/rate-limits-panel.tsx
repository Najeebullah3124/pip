import * as React from 'react'
import { Gauge } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { RateLimits } from '@/data/engine-data'

export function RateLimitsPanel({ limits, onSave }: { limits: RateLimits; onSave: (limits: RateLimits) => void }) {
  const [draft, setDraft] = React.useState(limits)

  React.useEffect(() => setDraft(limits), [limits])

  const dirty = draft.requestsPerMinute !== limits.requestsPerMinute || draft.concurrentRequests !== limits.concurrentRequests || draft.monthlyQuota !== limits.monthlyQuota

  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-2">
        <Gauge className="size-4.5 text-accent" />
        <p className="text-[15px] font-semibold text-foreground">Rate limits</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Requests per minute</Label>
          <Input
            type="number"
            min={1}
            value={draft.requestsPerMinute}
            onChange={(e) => setDraft((d) => ({ ...d, requestsPerMinute: Number(e.target.value) }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Concurrent requests</Label>
          <Input
            type="number"
            min={1}
            value={draft.concurrentRequests}
            onChange={(e) => setDraft((d) => ({ ...d, concurrentRequests: Number(e.target.value) }))}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Monthly quota</Label>
          <Input value={draft.monthlyQuota} onChange={(e) => setDraft((d) => ({ ...d, monthlyQuota: e.target.value }))} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm" disabled={!dirty} onClick={() => onSave(draft)}>
          Save rate limits
        </Button>
      </div>
    </Card>
  )
}
