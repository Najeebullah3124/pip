import * as React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { KeyRound, LogIn, ShieldCheck } from 'lucide-react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordInput } from '@/components/auth/password-input'
import { FormAlert, FieldError } from '@/components/auth/form-alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth/auth-context'
import { AuthError } from '@/lib/auth/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const { loginWithPassword, loginWithApiKey } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [remember, setRemember] = React.useState(true)
  const [emailError, setEmailError] = React.useState<string>()
  const [passwordError, setPasswordError] = React.useState<string>()
  const [formError, setFormError] = React.useState<React.ReactNode>()
  const [loading, setLoading] = React.useState(false)

  const [apiKey, setApiKey] = React.useState('')
  const [apiKeyError, setApiKeyError] = React.useState<string>()
  const [apiKeyLoading, setApiKeyLoading] = React.useState(false)

  function validateEmail() {
    if (!email.trim()) return setEmailError('Email is required'), false
    if (!EMAIL_RE.test(email)) return setEmailError('Enter a valid email address'), false
    setEmailError(undefined)
    return true
  }

  function validatePassword() {
    if (!password) return setPasswordError('Password is required'), false
    setPasswordError(undefined)
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(undefined)
    const validEmail = validateEmail()
    const validPassword = validatePassword()
    if (!validEmail || !validPassword) return

    setLoading(true)
    try {
      await loginWithPassword(email, password, remember)
      navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof AuthError && err.code === 'email_not_verified') {
        setFormError(
          <>
            Please verify your email before signing in.{' '}
            <Link to={`/verify-email?email=${encodeURIComponent(email)}`} className="font-semibold underline underline-offset-2">
              Resend verification
            </Link>
          </>
        )
      } else if (err instanceof AuthError) {
        setFormError(err.message)
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleApiKeySubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiKeyError(undefined)
    if (!apiKey.trim()) {
      setApiKeyError('Enter an API key')
      return
    }
    setApiKeyLoading(true)
    try {
      await loginWithApiKey(apiKey)
      navigate(from, { replace: true })
    } catch (err) {
      setApiKeyError(err instanceof AuthError ? err.message : 'Could not authenticate with this key.')
    } finally {
      setApiKeyLoading(false)
    }
  }

  return (
    <AuthLayout
      headline="Prompt intelligence, engineered for private deployment."
      subheadline="Design, evaluate, and ship AI prompts and characters with the control an enterprise workspace demands."
    >
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">Sign in to continue to your workspace.</p>
      </div>

      <Tabs defaultValue="password">
        <TabsList className="mb-5 grid w-full grid-cols-2">
          <TabsTrigger value="password">
            <LogIn className="size-3.5" />
            Password
          </TabsTrigger>
          <TabsTrigger value="apikey">
            <KeyRound className="size-3.5" />
            API Key
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="mt-0">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {formError && <FormAlert variant="error">{formError}</FormAlert>}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                invalid={!!emailError}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(undefined)
                }}
                onBlur={validateEmail}
              />
              <FieldError>{emailError}</FieldError>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="login-password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                invalid={!!passwordError}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(undefined)
                }}
                onBlur={validatePassword}
              />
              <FieldError>{passwordError}</FieldError>
            </div>

            <div className="flex items-center gap-2.5">
              <Checkbox id="login-remember" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
              <Label htmlFor="login-remember" className="cursor-pointer text-sm font-normal text-foreground-muted">
                Keep me signed in on this device
              </Label>
            </div>

            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-foreground-subtle">
              Demo account — <span className="font-medium text-foreground-muted">demo@pip.ai</span> /{' '}
              <span className="font-medium text-foreground-muted">demo1234</span>
            </p>
          </form>
        </TabsContent>

        <TabsContent value="apikey" className="mt-0">
          <form onSubmit={handleApiKeySubmit} noValidate className="flex flex-col gap-4">
            {apiKeyError && <FormAlert variant="error">{apiKeyError}</FormAlert>}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-apikey">API Key</Label>
              <Input
                id="login-apikey"
                placeholder="pip_live_••••••••••••••••"
                value={apiKey}
                invalid={!!apiKeyError}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-[13px]"
              />
              <p className="flex items-start gap-1.5 text-xs text-foreground-subtle">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                For service accounts and integrations. Sent as a Bearer-style Authorization header, never stored in plaintext by the API.
              </p>
            </div>

            <Button type="submit" size="lg" loading={apiKeyLoading} className="mt-1 w-full">
              {apiKeyLoading ? 'Connecting…' : 'Connect with API Key'}
            </Button>

            <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-foreground-subtle">
              Demo key — <span className="font-medium text-foreground-muted">pip_live_demo_key</span>
            </p>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-7 text-center text-sm text-foreground-muted">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-accent hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
