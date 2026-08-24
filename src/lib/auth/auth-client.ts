/**
 * Auth transport layer.
 *
 * Every function below is a placeholder for a real HTTP call against the
 * PIP API. They're written to the shape that call will have — same inputs,
 * same return type, same thrown errors — so wiring up the backend later is
 * a matter of replacing the body of `request()`, not touching any caller.
 *
 * The API supports two credential types on every authenticated request:
 *   - Bearer token: `Authorization: Bearer <token>`   (interactive sessions)
 *   - API key:      `Authorization: ApiKey <key>`     (service accounts)
 * `authHeader()` below is the single place that decision gets made.
 */
import { mockDb } from './mock-db'
import { AuthError, type AuthCredential, type AuthUser, type RegisterInput } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export function authHeader(credential: AuthCredential | null): Record<string, string> {
  if (!credential) return {}
  if (credential.type === 'bearer') return { Authorization: `Bearer ${credential.token}` }
  return { Authorization: `ApiKey ${credential.key}` }
}

function delay(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Real implementation, once the backend exists:
 *
 *   async function request(path, init) {
 *     const res = await fetch(`${API_BASE_URL}${path}`, {
 *       ...init,
 *       headers: { 'Content-Type': 'application/json', ...init?.headers },
 *     })
 *     if (!res.ok) throw await AuthError.fromResponse(res)
 *     return res.json()
 *   }
 */
void API_BASE_URL

export async function loginWithPassword(email: string, password: string): Promise<{ user: AuthUser; credential: AuthCredential }> {
  await delay()
  const record = mockDb.findByEmail(email)
  if (!record || record.password !== password) {
    throw new AuthError('invalid_credentials', 'That email and password combination doesn’t match our records.')
  }
  if (!record.emailVerified) {
    throw new AuthError('email_not_verified', 'Please verify your email before signing in.')
  }
  return {
    user: mockDb.toPublic(record),
    credential: { type: 'bearer', token: `mock_bearer_${record.id}_${Math.random().toString(36).slice(2, 10)}` },
  }
}

export async function loginWithApiKey(key: string): Promise<{ user: AuthUser; credential: AuthCredential }> {
  await delay(500)
  const trimmed = key.trim()
  if (!trimmed.startsWith('pip_')) {
    throw new AuthError('invalid_credentials', 'API keys start with "pip_". Check the key and try again.')
  }
  const record = mockDb.findByEmail('demo@pip.ai')!
  return { user: mockDb.toPublic(record), credential: { type: 'apiKey', key: trimmed } }
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  await delay()
  if (mockDb.findByEmail(input.email)) {
    throw new AuthError('email_taken', 'An account with this email already exists.')
  }
  const record = mockDb.createUser(input)
  return mockDb.toPublic(record)
}

export async function requestPasswordReset(email: string): Promise<{ devToken?: string }> {
  await delay()
  const record = mockDb.findByEmail(email)
  if (!record) return {} // Never reveal whether an account exists.
  const token = mockDb.createResetToken(email)
  return { devToken: token }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await delay()
  const email = mockDb.peekResetToken(token)
  if (!email) throw new AuthError('invalid_token', 'This reset link is invalid or has expired.')
  mockDb.consumeResetToken(token)
  mockDb.setPassword(email, newPassword)
}

export async function requestEmailVerification(email: string): Promise<{ devToken?: string }> {
  await delay(500)
  const record = mockDb.findByEmail(email)
  if (!record) return {}
  const token = mockDb.createVerifyToken(email)
  return { devToken: token }
}

export async function verifyEmail(token: string): Promise<{ email: string }> {
  await delay()
  const email = mockDb.consumeVerifyToken(token)
  if (!email) throw new AuthError('invalid_token', 'This verification link is invalid or has expired.')
  mockDb.setEmailVerified(email, true)
  return { email }
}

export async function markOnboarded(email: string): Promise<void> {
  await delay(300)
  mockDb.setOnboarded(email, true)
}
