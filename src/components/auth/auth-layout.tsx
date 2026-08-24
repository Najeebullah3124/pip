import * as React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/logo'
import { AuthVisualPanel } from '@/components/auth/auth-visual-panel'

interface AuthLayoutProps {
  children: React.ReactNode
  headline: React.ReactNode
  subheadline?: string
  /** Card width — narrow forms (login) vs wider forms (register). */
  width?: 'sm' | 'md'
}

export function AuthLayout({ children, headline, subheadline, width = 'sm' }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full">
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 15% 0%, rgba(124,58,237,0.16) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(196,181,253,0.22) 0%, transparent 38%)',
            }}
          />
        </div>

        <div className="relative mb-8 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className={`relative w-full ${width === 'sm' ? 'max-w-[400px]' : 'max-w-[460px]'}`}>{children}</div>
      </div>

      <AuthVisualPanel headline={headline} subheadline={subheadline} />
    </div>
  )
}
