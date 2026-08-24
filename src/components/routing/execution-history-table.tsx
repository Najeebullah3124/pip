import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/shared/empty-state'
import { ScrollText } from 'lucide-react'
import type { RoutingExecution, ExecutionStatus } from '@/data/routing-data'

const statusVariant: Record<ExecutionStatus, BadgeProps['variant']> = {
  Routed: 'success',
  Fallback: 'warning',
  Failed: 'destructive',
}

export function ExecutionHistoryTable({ entries }: { entries: RoutingExecution[] }) {
  if (entries.length === 0) {
    return <EmptyState icon={<ScrollText />} title="No execution history" description="Routed requests will appear here once traffic starts flowing." />
  }

  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Application</TableHead>
            <TableHead>Request type</TableHead>
            <TableHead>Matched rule</TableHead>
            <TableHead>Workflow → Model</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="whitespace-nowrap text-sm text-foreground-muted">{e.timestamp}</TableCell>
              <TableCell className="text-sm text-foreground">{e.application}</TableCell>
              <TableCell className="text-sm text-foreground-muted">{e.requestType}</TableCell>
              <TableCell className="text-sm text-foreground-muted">{e.matchedRule ?? '—'}</TableCell>
              <TableCell className="text-xs text-foreground-subtle">
                {e.workflow ? (
                  <>
                    {e.workflow} <span className="mx-1">→</span> {e.model}
                  </>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="text-sm tabular-nums text-foreground-muted">{e.latencyMs}ms</TableCell>
              <TableCell>
                <Badge variant={statusVariant[e.status]}>{e.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
