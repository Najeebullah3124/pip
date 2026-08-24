import * as React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, MailOpen, TriangleAlert } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormAlert } from '@/components/auth/form-alert'
import { Spinner } from '@/components/shared/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as authClient from '@/lib/auth/auth-client'
import { AuthError } from '@/lib/auth/types'

const RESEND_COOLDOWN = 30

type Stage = 'verifying' | 'verified' | 'invalid' | 'pending'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')
  const emailParam = params.get('email') ?? ''

  const [stage, setStage] = React.useState<Stage>(token ? 'verifying' : 'pending')
  const [email, setEmail] = React.useState(emailParam)
  const [cooldown, setCooldown] = React.useState(0)
  const [resending, setResending] = React.useState(false)
  const [devToken, setDevToken] = React.useState<string>()
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    if (!token) return
    let cancelled = false
    authClient
      .verifyEmail(token)
      .then(({ email }) => {
        if (cancelled) return
        setEmail(email)
        setStage('verified')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof AuthError ? err.message : 'Verification failed.')
        setStage('invalid')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  React.useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  async function resend() {
    setResending(true)
    try {
      const { devToken } = await authClient.requestEmailVerification(email)
      setDevToken(devToken)
      setCooldown(RESEND_COOLDOWN)
    } finally {
      setResending(false)
    }
  }

  if (stage === 'verifying') {
    return (
      <AuthLayout headline="Confirming this is really you." subheadline="This only takes a moment.">
        <div className="flex flex-col items-center py-8 text-center">
          <Spinner size={28} />
          <p className="mt-4 text-sm text-foreground-muted">Verifying your email…</p>
        </div>
      </AuthLayout>
    )
  }

  if (stage === 'verified') {
    return (
      <AuthLayout headline="You're verified. Let's set up your workspace." subheadline="Next, a short tour of what PIP can do.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1">
            <CheckCircle2 className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Email verified</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
            <span className="font-medium text-foreground">{email}</span> is now confirmed. Sign in to continue.
          </p>
          <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/login')}>
            Continue to sign in
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (stage === 'invalid') {
    return (
      <AuthLayout headline="Links expire — your account doesn't." subheadline="Request a fresh verification email in seconds.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10">
            <TriangleAlert className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification failed</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">{error}</p>
          <Button variant="secondary" size="lg" className="mt-6 w-full" loading={resending} onClick={resend} disabled={!email}>
            Send a new link
          </Button>
          <Link to="/login" className="mt-5 text-sm font-medium text-foreground-muted hover:text-foreground">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // pending
  return (
    <AuthLayout headline="One inbox check away from your workspace." subheadline="Verification keeps every prompt and engine credential tied to a real, confirmed owner.">
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1">
          <MailOpen className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Verify your email</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
          {email ? (
            <>
              We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to
              activate your account.
            </>
          ) : (
            'Enter your email below and we’ll resend the confirmation link.'
          )}
        </p>

        {!emailParam && (
          <Input
            className="mt-5"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {devToken && (
          <Link
            to={`/verify-email?token=${devToken}`}
            className="mt-5 w-full rounded-xl border border-dashed border-border-strong bg-surface-2 px-3.5 py-2.5 text-xs text-foreground-muted transition-colors hover:border-accent hover:text-accent"
          >
            Preview environment — open verification link →
          </Link>
        )}

        <Button
          variant="secondary"
          size="lg"
          className="mt-6 w-full"
          disabled={cooldown > 0 || !email}
          loading={resending}
          onClick={resend}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
        </Button>

        {error && (
          <div className="mt-4 w-full">
            <FormAlert variant="error">{error}</FormAlert>
          </div>
        )}

        <Link to="/login" className="mt-5 text-sm font-medium text-foreground-muted hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
