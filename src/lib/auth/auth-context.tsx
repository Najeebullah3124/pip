import * as React from 'react'
import * as authClient from './auth-client'
import { mockDb } from './mock-db'
import type { AuthCredential, AuthStatus, AuthUser, RegisterInput } from './types'

const SESSION_KEY = 'pip.auth.session'

interface StoredSession {
  email: string
  credential: AuthCredential
}

interface AuthContextValue {
  status: AuthStatus
  user: AuthUser | null
  credential: AuthCredential | null
  loginWithPassword: (email: string, password: string, remember?: boolean) => Promise<void>
  loginWithApiKey: (key: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
  refreshUser: () => void
  completeOnboarding: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

function saveSession(session: StoredSession, remember: boolean) {
  const raw = JSON.stringify(session)
  if (remember) {
    localStorage.setItem(SESSION_KEY, raw)
  } else {
    sessionStorage.setItem(SESSION_KEY, raw)
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>('loading')
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [credential, setCredential] = React.useState<AuthCredential | null>(null)

  React.useEffect(() => {
    // Simulates the app's initial "validate my session" round trip.
    const timer = setTimeout(() => {
      const session = loadSession()
      if (!session) {
        setStatus('unauthenticated')
        return
      }
      const record = mockDb.findByEmail(session.email)
      if (!record) {
        clearSession()
        setStatus('unauthenticated')
        return
      }
      setUser(mockDb.toPublic(record))
      setCredential(session.credential)
      setStatus('authenticated')
    }, 650)
    return () => clearTimeout(timer)
  }, [])

  const loginWithPassword = React.useCallback(async (email: string, password: string, remember = true) => {
    const { user: loggedInUser, credential: cred } = await authClient.loginWithPassword(email, password)
    saveSession({ email: loggedInUser.email, credential: cred }, remember)
    setUser(loggedInUser)
    setCredential(cred)
    setStatus('authenticated')
  }, [])

  const loginWithApiKey = React.useCallback(async (key: string) => {
    const { user: loggedInUser, credential: cred } = await authClient.loginWithApiKey(key)
    saveSession({ email: loggedInUser.email, credential: cred }, true)
    setUser(loggedInUser)
    setCredential(cred)
    setStatus('authenticated')
  }, [])

  const register = React.useCallback(async (input: RegisterInput) => {
    await authClient.register(input)
  }, [])

  const logout = React.useCallback(() => {
    clearSession()
    setUser(null)
    setCredential(null)
    setStatus('unauthenticated')
  }, [])

  const refreshUser = React.useCallback(() => {
    if (!user) return
    const record = mockDb.findByEmail(user.email)
    if (record) setUser(mockDb.toPublic(record))
  }, [user])

  const completeOnboarding = React.useCallback(async () => {
    if (!user) return
    await authClient.markOnboarded(user.email)
    setUser({ ...user, onboarded: true })
  }, [user])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      credential,
      loginWithPassword,
      loginWithApiKey,
      register,
      logout,
      refreshUser,
      completeOnboarding,
    }),
    [status, user, credential, loginWithPassword, loginWithApiKey, register, logout, refreshUser, completeOnboarding]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
