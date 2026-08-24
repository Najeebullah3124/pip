import { cn } from '@/lib/utils'

export function scorePassword(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong']
const colors = ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500']

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const score = scorePassword(password)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all duration-300', i < score ? colors[score] : 'bg-transparent')}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-foreground-subtle">
        Password strength: <span className="font-medium text-foreground-muted">{labels[score]}</span>
      </p>
    </div>
  )
}
