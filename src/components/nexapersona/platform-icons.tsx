import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function InstagramGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.15" cy="6.85" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.5 21v-7.4h2.5l.4-2.9h-2.9V8.8c0-.85.24-1.43 1.46-1.43H17.5V4.77c-.26-.04-1.16-.11-2.2-.11-2.18 0-3.68 1.33-3.68 3.77v2.1H9.1v2.9h2.52V21h2.88Z" />
    </svg>
  )
}

export function TikTokGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v2.6c-1.5.05-2.85-.4-4-1.25v6.4c0 3.3-2.68 5.85-5.9 5.35-2.5-.4-4.35-2.65-4.28-5.25.08-2.85 2.5-5.1 5.35-5.02.3 0 .58.03.86.08v2.75a2.6 2.6 0 0 0-.86-.15 2.55 2.55 0 1 0 2.55 2.75V3h2.28Z" />
    </svg>
  )
}

export function YoutubeGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth={1.8} />
      <path d="M10.4 9.2v5.6l4.9-2.8-4.9-2.8Z" />
    </svg>
  )
}

export function LinkedinGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill="none" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="8" cy="8.4" r="1.15" />
      <path d="M7 11h2v7H7v-7Zm4 0h1.9v1c.55-.75 1.35-1.2 2.4-1.2 1.85 0 3.2 1.25 3.2 3.7V18h-2v-3.2c0-1.15-.55-1.85-1.55-1.85-.8 0-1.4.55-1.65 1.1-.1.2-.1.45-.1.75V18H11v-7Z" />
    </svg>
  )
}

export function XGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5 4.5 10.6 12 5.3 19.5H7.6l3.9-5.5 3.4 5.5H19l-5.85-8 5-6.99h-2.3l-3.6 5.05-3.15-5.05H5Z" />
    </svg>
  )
}
