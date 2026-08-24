import { cn } from '@/lib/utils'

export function Logo({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="pip-logo-g" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </radialGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#pip-logo-g)" />
        <circle cx="16" cy="16" r="7" fill="white" fillOpacity="0.92" />
        <circle cx="16" cy="16" r="3.2" fill="#7C3AED" />
      </svg>
      {!mark && (
        <span className="text-[17px] font-extrabold tracking-tight text-foreground">
          PIP
        </span>
      )}
    </div>
  )
}
