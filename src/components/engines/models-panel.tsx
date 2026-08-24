import { Star, Layers } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AiEngine } from '@/data/engine-data'

export function ModelsPanel({ engine, onSetDefault }: { engine: AiEngine; onSetDefault: (modelId: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {engine.models.map((model) => {
        const isDefault = model.id === engine.defaultModelId
        return (
          <Card key={model.id} className={cn('flex items-center gap-4 p-4', isDefault && 'border-accent-200 bg-accent-soft/40')}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground-muted">
              <Layers className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{model.name}</p>
                {isDefault && (
                  <Badge variant="accent" className="gap-1">
                    <Star className="size-2.5 fill-current" />
                    Default
                  </Badge>
                )}
                {model.contextWindow && (
                  <Badge variant="outline" className="text-[10px]">
                    {model.contextWindow}
                  </Badge>
                )}
              </div>
              <p className="truncate text-xs text-foreground-subtle">{model.description}</p>
            </div>
            {!isDefault && (
              <Button variant="secondary" size="sm" onClick={() => onSetDefault(model.id)}>
                Set as default
              </Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}
