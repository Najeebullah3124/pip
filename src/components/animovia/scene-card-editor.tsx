import { ChevronUp, ChevronDown, Trash2, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Scene } from '@/data/animovia-data'

interface SceneCardEditorProps {
  scene: Scene
  index: number
  total: number
  gradient: [string, string]
  onChange: (patch: Partial<Scene>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

export function SceneCardEditor({ scene, index, total, gradient, onChange, onMove, onRemove }: SceneCardEditorProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative flex h-16 items-center gap-3 px-4" style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:14px_14px]" />
        <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold text-white backdrop-blur-sm">
          {index + 1}
        </span>
        <p className="relative truncate text-sm font-semibold text-white">Scene {index + 1}</p>
        <div className="relative ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/20 hover:text-white" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
            <ChevronUp />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/20 hover:text-white" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Move down">
            <ChevronDown />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/20 hover:text-white" onClick={onRemove} aria-label="Remove scene" disabled={total <= 1}>
            <Trash2 />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <Label>Scene title</Label>
          <Input value={scene.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. The Call to Adventure" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-1">
            <MapPin className="size-3" />
            Setting
          </Label>
          <Input value={scene.setting} onChange={(e) => onChange({ setting: e.target.value })} placeholder="e.g. Edge of the forest" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>What happens</Label>
          <Textarea value={scene.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Describe what happens in this scene…" className="min-h-20" />
        </div>
      </div>
    </Card>
  )
}
