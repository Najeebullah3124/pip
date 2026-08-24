import * as React from 'react'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlacementCanvasProps {
  environmentGradient: [string, string]
  markerX: number
  markerY: number
  scale: number
  product: string
  cta: string
  onMove: (x: number, y: number) => void
  className?: string
}

export function PlacementCanvas({ environmentGradient, markerX, markerY, scale, product, cta, onMove, className }: PlacementCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const draggingRef = React.useRef(false)

  function updateFromEvent(e: { clientX: number; clientY: number }) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(96, Math.max(4, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.min(94, Math.max(6, ((e.clientY - rect.top) / rect.height) * 100))
    onMove(Math.round(x), Math.round(y))
  }

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true
    ;(e.target as Element).setPointerCapture(e.pointerId)
    updateFromEvent(e)
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return
    updateFromEvent(e)
  }
  function handlePointerUp() {
    draggingRef.current = false
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full touch-none select-none overflow-hidden rounded-2xl', className)}
      style={{ background: `linear-gradient(135deg, ${environmentGradient[0]}, ${environmentGradient[1]})` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:16px_16px]" />

      <div
        className="absolute flex cursor-grab flex-col items-center gap-1.5 active:cursor-grabbing"
        style={{ left: `${markerX}%`, top: `${markerY}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
        onPointerDown={(e) => {
          e.stopPropagation()
          handlePointerDown(e)
        }}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-white/70 bg-white/25 text-white shadow-elevation-2 backdrop-blur-sm">
          <Package className="size-6" />
        </div>
        <span className="max-w-[120px] truncate rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {product || 'Your product'}
        </span>
      </div>

      {cta && (
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink-900 shadow-elevation-1">{cta}</div>
      )}
    </div>
  )
}
