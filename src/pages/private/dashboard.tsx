import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Blocks, Cpu } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PrivateBadge } from '@/components/private/private-badge'
import { privateNavItems } from '@/components/private/private-nav-config'
import {
  privatePromptTemplates, privateCharacters, privateAssets, privateMemoryEntries, privateAssetKindMeta, type PrivateStatus,
} from '@/data/private-data'

const toolNavItems = privateNavItems.filter((i) => i.key !== 'dashboard')

const statusVariant: Record<PrivateStatus, 'outline' | 'accent' | 'success' | 'destructive'> = {
  Draft: 'outline',
  Active: 'success',
  Testing: 'accent',
  Archived: 'destructive',
}

export default function PrivateDashboardPage() {
  const activePrompts = privatePromptTemplates.filter((t) => t.status === 'Active').length
  const mediaAssets = privateAssets.filter((a) => a.kind === 'Media')

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Private prompt templates" value={String(privatePromptTemplates.length)} delta={{ value: `${activePrompts} active`, direction: 'up' }} icon={<Sparkles />} />
        <StatCard label="Private characters" value={String(privateCharacters.length)} icon={<Blocks />} />
        <StatCard label="Private catalog assets" value={String(privateAssets.length)} icon={<Cpu />} />
        <StatCard label="Memory entries logged" value={String(privateMemoryEntries.length)} icon={<Sparkles />} />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-foreground">Private tools</h2>
          <PrivateBadge />
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4">
          {toolNavItems.map((tool) => (
            <Link key={tool.key} to={tool.href}>
              <Card className="group flex h-full cursor-pointer flex-col gap-3 border-amber-400/15 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-elevation-2">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <tool.icon className="size-[18px]" />
                  </span>
                  <ArrowUpRight className="size-3.5 text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-sm font-semibold text-foreground">{tool.label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-foreground">Private Media</h2>
          <PrivateBadge />
          <span className="text-xs text-foreground-subtle">— internal reference and QA assets, isolated from the standard Media Library</span>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {mediaAssets.map((asset) => {
            const meta = privateAssetKindMeta[asset.kind]
            return (
              <Card key={asset.id} className="flex flex-col overflow-hidden border-amber-400/15">
                <div className="relative flex h-20 items-center justify-center bg-gradient-to-br from-amber-500/25 to-amber-900/40">
                  <meta.icon className="size-5 text-amber-400" />
                </div>
                <div className="flex flex-col gap-1.5 p-2.5">
                  <p className="truncate text-[11px] font-medium text-foreground">{asset.title}</p>
                  <Badge variant={statusVariant[asset.status]} className="w-fit text-[9px]">
                    {asset.status}
                  </Badge>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
