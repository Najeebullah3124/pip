import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex min-h-24 w-full rounded-xl border border-input bg-surface-2 px-3.5 py-2.5 text-sm text-foreground shadow-elevation-1 transition-colors duration-150',
          'placeholder:text-foreground-subtle',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
