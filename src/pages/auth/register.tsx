import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordInput } from '@/components/auth/password-input'
import { PasswordStrength, scorePassword } from '@/components/auth/password-strength'
import { FormAlert, FieldError } from '@/components/auth/form-alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/auth/auth-context'
import { AuthError } from '@/lib/auth/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormState {
  name: string
  email: string
  password: string
  confirm: string
  agree: boolean
}

const initialState: FormState = { name: '', email: '', password: '', confirm: '', agree: false }

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = React.useState<FormState>(initialState)
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({})
  const [formError, setFormError] = React.useState<string>()
  const [loading, setLoading] = React.useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validateField(key: keyof FormState): boolean {
    let message: string | undefined
    if (key === 'name' && !form.name.trim()) message = 'Full name is required'
    if (key === 'email') {
      if (!form.email.trim()) message = 'Email is required'
      else if (!EMAIL_RE.test(form.email)) message = 'Enter a valid email address'
    }
    if (key === 'password') {
      if (!form.password) message = 'Password is required'
      else if (scorePassword(form.password) < 2) message = 'Use at least 8 characters, with a number or symbol'
    }
    if (key === 'confirm') {
      if (!form.confirm) message = 'Confirm your password'
      else if (form.confirm !== form.password) message = 'Passwords don’t match'
    }
    setErrors((e) => ({ ...e, [key]: message }))
    return !message
  }

  function validateAll() {
    const keys: (keyof FormState)[] = ['name', 'email', 'password', 'confirm']
    const results = keys.map(validateField)
    const agreeOk = form.agree
    if (!agreeOk) setErrors((e) => ({ ...e, agree: 'You must accept the terms to continue' }))
    return results.every(Boolean) && agreeOk
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(undefined)
    if (!validateAll()) return

    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`)
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      width="md"
      headline="One workspace for every prompt, character, and engine you manage."
      subheadline="Bring your team into a governed, auditable AI workflow — built for private, enterprise deployment."
    >
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">Start building with PIP in under a minute.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {formError && <FormAlert variant="error">{formError}</FormAlert>}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reg-name">Full name</Label>
          <Input
            id="reg-name"
            autoComplete="name"
            placeholder="Jordan Lee"
            value={form.name}
            invalid={!!errors.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => validateField('name')}
          />
          <FieldError>{errors.name}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reg-email">Work email</Label>
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            invalid={!!errors.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => validateField('email')}
          />
          <FieldError>{errors.email}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reg-password">Password</Label>
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={form.password}
            invalid={!!errors.password}
            onChange={(e) => set('password', e.target.value)}
            onBlur={() => validateField('password')}
          />
          <PasswordStrength password={form.password} />
          <FieldError>{errors.password}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reg-confirm">Confirm password</Label>
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={form.confirm}
            invalid={!!errors.confirm}
            onChange={(e) => set('confirm', e.target.value)}
            onBlur={() => validateField('confirm')}
          />
          <FieldError>{errors.confirm}</FieldError>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="reg-agree"
              className="mt-0.5"
              checked={form.agree}
              onCheckedChange={(v) => {
                set('agree', v === true)
                setErrors((e) => ({ ...e, agree: undefined }))
              }}
            />
            <Label htmlFor="reg-agree" className="cursor-pointer text-sm font-normal leading-snug text-foreground-muted">
              I agree to the <span className="font-medium text-foreground">Terms of Service</span> and{' '}
              <span className="font-medium text-foreground">Privacy Policy</span>.
            </Label>
          </div>
          <FieldError>{errors.agree}</FieldError>
        </div>

        <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-foreground-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
