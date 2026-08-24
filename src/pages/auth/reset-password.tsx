import * as React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, KeyRound, TriangleAlert } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordInput } from '@/components/auth/password-input'
import { PasswordStrength, scorePassword } from '@/components/auth/password-strength'
import { FormAlert, FieldError } from '@/components/auth/form-alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import * as authClient from '@/lib/auth/auth-client'
import { mockDb } from '@/lib/auth/mock-db'
import { AuthError } from '@/lib/auth/types'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const tokenEmail = React.useMemo(() => (token ? mockDb.peekResetToken(token) : null), [token])

  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [passwordError, setPasswordError] = React.useState<string>()
  const [confirmError, setConfirmError] = React.useState<string>()
  const [formError, setFormError] = React.useState<string>()
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  if (!token || !tokenEmail) {
    return (
      <AuthLayout headline="Every reset link is single-use." subheadline="If a link has already been used or has expired, request a new one.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10">
            <TriangleAlert className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Link invalid or expired</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
            This password reset link is no longer valid. Request a new one to continue.
          </p>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link to="/forgot-password">Request a new link</Link>
          </Button>
          <Link to="/login" className="mt-5 text-sm font-medium text-foreground-muted hover:text-foreground">
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout headline="You're back in control." subheadline="Your new password is active on every device.">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-soft text-accent shadow-elevation-1">
            <CheckCircle2 className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Password updated</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">
            Your password has been reset successfully. Sign in with your new password to continue.
          </p>
          <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/login')}>
            Continue to sign in
          </Button>
        </div>
      </AuthLayout>
    )
  }

  function validate() {
    let ok = true
    if (!password) {
      setPasswordError('Password is required')
      ok = false
    } else if (scorePassword(password) < 2) {
      setPasswordError('Use at least 8 characters, with a number or symbol')
      ok = false
    } else {
      setPasswordError(undefined)
    }
    if (!confirm) {
      setConfirmError('Confirm your password')
      ok = false
    } else if (confirm !== password) {
      setConfirmError('Passwords don’t match')
      ok = false
    } else {
      setConfirmError(undefined)
    }
    return ok
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(undefined)
    if (!validate() || !token) return
    setLoading(true)
    try {
      await authClient.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout headline="Choose a password worthy of what you're protecting." subheadline="Prompts, characters, and engine credentials — all behind one key.">
      <div className="mb-7">
        <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-700 text-white shadow-elevation-2">
          <KeyRound className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Set a new password</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          For <span className="font-medium text-foreground">{tokenEmail}</span>
        </p>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {formError && <FormAlert variant="error">{formError}</FormAlert>}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rp-password">New password</Label>
          <PasswordInput
            id="rp-password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={password}
            invalid={!!passwordError}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(undefined)
            }}
            onBlur={validate}
          />
          <PasswordStrength password={password} />
          <FieldError>{passwordError}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rp-confirm">Confirm new password</Label>
          <PasswordInput
            id="rp-confirm"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            invalid={!!confirmError}
            onChange={(e) => {
              setConfirm(e.target.value)
              setConfirmError(undefined)
            }}
            onBlur={validate}
          />
          <FieldError>{confirmError}</FieldError>
        </div>

        <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
          {loading ? 'Updating password…' : 'Reset password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
