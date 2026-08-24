import * as React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormAlertProps {
  variant?: 'error' | 'success'
  children: React.ReactNode
  className?: string
}

export function FormAlert({ variant = 'error', children, className }: FormAlertProps) {
  const Icon = variant === 'error' ? AlertCircle : CheckCircle2
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm animate-fade-in-up',
        variant === 'error'
          ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="leading-snug">{children}</div>
    </div>
  )
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p className="flex items-center gap-1 text-xs font-medium text-destructive animate-fade-in">
      <AlertCircle className="size-3" />
      {children}
    </p>
  )
}
