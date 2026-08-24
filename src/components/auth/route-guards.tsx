import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth/auth-context'

/** Gate for the main app: requires a session, and a completed onboarding pass. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (status === 'authenticated' && user && !user.onboarded) {
    return <Navigate to="/onboarding" replace />
  }
  return <>{children}</>
}

/** Gate for auth pages (login/register/...): bounce signed-in users onward. */
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth()

  if (status === 'authenticated') {
    return <Navigate to={user && !user.onboarded ? '/onboarding' : '/'} replace />
  }
  return <>{children}</>
}

/** Onboarding itself: needs a session, but shouldn't re-run once complete. */
export function RequireOnboardingAccess({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth()

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }
  if (status === 'authenticated' && user?.onboarded) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
