export interface AuthUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  onboarded: boolean
}

/**
 * PIP's API accepts either a short-lived Bearer token (interactive sessions,
 * obtained via /auth/login) or a long-lived API Key (service/integration
 * accounts, obtained from Administration -> API Keys). Every authenticated
 * request should carry exactly one of these as the Authorization credential.
 */
export type AuthCredential = { type: 'bearer'; token: string } | { type: 'apiKey'; key: string }

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export class AuthError extends Error {
  code: 'invalid_credentials' | 'email_not_verified' | 'email_taken' | 'invalid_token' | 'not_found' | 'unknown'

  constructor(code: AuthError['code'], message: string) {
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}
