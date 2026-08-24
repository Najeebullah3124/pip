import { Logo } from '@/components/layout/logo'

export function SessionLoadingScreen({ label = 'Securing your session…' }: { label?: string }) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-6 bg-background">
      <div className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-3xl bg-accent/25" />
        <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-100 to-accent-soft shadow-elevation-2" />
        <div className="relative flex size-12 items-center justify-center">
          <Logo mark className="scale-125" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-foreground-muted">{label}</p>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-accent to-accent-700" />
        </div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(320%); }
        }
      `}</style>
    </div>
  )
}
