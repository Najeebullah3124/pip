import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

const icons = {
  default: Info,
  success: CheckCircle2,
  destructive: XCircle,
  warning: AlertTriangle,
}

const iconClass = {
  default: 'text-accent',
  success: 'text-emerald-600',
  destructive: 'text-red-600',
  warning: 'text-amber-600',
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, action, variant = 'default', open, ...props }) => {
        const Icon = icons[variant]
        return (
          <Toast
            key={id}
            variant={variant}
            open={open}
            onOpenChange={(next) => {
              if (!next) dismiss(id)
            }}
            {...props}
          >
            <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass[variant]}`} />
            <div className="grid flex-1 gap-0.5">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
