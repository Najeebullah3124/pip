import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormAlert, FieldError } from '@/components/auth/form-alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as authClient from '@/lib/auth/auth-client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_COOLDOWN = 30

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [emailError, setEmailError] = React.useState<string>()
  const [formError, setFormError] = React.useState<string>()
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [devToken, setDevToken] = React.useState<string>()
  const [cooldown, setCooldown] = React.useState(0)

  React.useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  function validate() {
    if (!email.trim()) return setEmailError('Email is required'), false
    if (!EMAIL_RE.test(email)) return setEmailError('Enter a valid email address'), false
    setEmailError(undefined)
    return true
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(undefined)
    if (!validate()) return
    setLoading(true)
    try {
      const { devToken } = await authClient.requestPasswordReset(email)
      setDevToken(devToken)
      setSent(true)
      setCooldown(RESEND_COOLDOWN)
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout headline="Password recovery, without the risk." subheadline="Reset links expire quickly and are single-use by design.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1">
            <MailCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your email</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a link to reset your password.
          </p>

          {devToken && (
            <Link
              to={`/reset-password?token=${devToken}`}
              className="mt-5 w-full rounded-xl border border-dashed border-border-strong bg-surface-2 px-3.5 py-2.5 text-xs text-foreground-muted transition-colors hover:border-accent hover:text-accent"
            >
              Preview environment — open reset link →
            </Link>
          )}

          <Button
            variant="secondary"
            className="mt-6 w-full"
            disabled={cooldown > 0}
            onClick={async () => {
              setLoading(true)
              const { devToken } = await authClient.requestPasswordReset(email)
              setDevToken(devToken)
              setCooldown(RESEND_COOLDOWN)
              setLoading(false)
            }}
            loading={loading}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
          </Button>

          <Link to="/login" className="mt-5 flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout headline="Password recovery, without the risk." subheadline="Reset links expire quickly and are single-use by design.">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot your password?</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {formError && <FormAlert variant="error">{formError}</FormAlert>}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fp-email">Email</Label>
          <Input
            id="fp-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            invalid={!!emailError}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(undefined)
            }}
            onBlur={validate}
          />
          <FieldError>{emailError}</FieldError>
        </div>

        <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
          {loading ? 'Sending link…' : 'Send reset link'}
        </Button>
      </form>

      <Link to="/login" className="mt-7 flex items-center justify-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </AuthLayout>
  )
}
