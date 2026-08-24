import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: string[]
  current: number
  onStepClick?: (index: number) => void
}

export function StepIndicator({ steps, current, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        {steps.map((label, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'upcoming'
          const clickable = onStepClick && i < current
          return (
            <button
              key={label}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(i)}
              aria-label={`${label}${state === 'current' ? ' (current step)' : ''}`}
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn(
                'h-1.5 flex-1 overflow-hidden rounded-full bg-muted transition-colors',
                clickable && 'cursor-pointer'
              )}
            >
              <span
                className={cn(
                  'block h-full rounded-full bg-gradient-to-r from-accent to-accent-700 transition-transform duration-500 ease-out',
                  state === 'upcoming' ? 'w-full -translate-x-full' : 'w-full translate-x-0'
                )}
              />
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-foreground-subtle">
          Step {current + 1} of {steps.length}
        </p>
        <p className="flex items-center gap-1 text-xs font-semibold text-accent">
          {current === steps.length - 1 ? (
            <Check className="size-3.5" />
          ) : null}
          {steps[current]}
        </p>
      </div>
    </div>
  )
}
