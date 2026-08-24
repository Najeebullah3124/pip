import { LockKeyhole, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { privateAssetKindMeta, getPrivateCharacter, type PrivateAsset, type PrivateStatus } from '@/data/private-data'

const statusVariant: Record<PrivateStatus, 'outline' | 'accent' | 'success' | 'destructive'> = {
  Draft: 'outline',
  Active: 'success',
  Testing: 'accent',
  Archived: 'destructive',
}

export function PrivateAssetCard({ asset }: { asset: PrivateAsset }) {
  const meta = privateAssetKindMeta[asset.kind]
  const Icon = meta.icon
  const character = asset.characterId ? getPrivateCharacter(asset.characterId) : undefined

  return (
    <Card className="group flex cursor-pointer flex-col gap-3 overflow-hidden border-amber-400/15 p-4 transition-all hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-elevation-2">
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <Icon className="size-4" />
        </span>
        <LockKeyhole className="size-3 text-amber-400/50" />
      </div>
      <div>
        <p className="line-clamp-1 text-sm font-semibold text-foreground">{asset.title}</p>
        <p className="text-xs text-foreground-subtle">{asset.meta}</p>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <Badge variant={statusVariant[asset.status]} className="text-[10px]">
          {asset.status}
        </Badge>
        {character ? (
          <span className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
            <span
              className="flex size-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${character.gradientFrom}, ${character.gradientTo})` }}
            >
              {character.name.slice(0, 1)}
            </span>
            {character.name}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-foreground-subtle">
            <Clock className="size-2.5" />
            {asset.updatedAt}
          </span>
        )}
      </div>
    </Card>
  )
}
