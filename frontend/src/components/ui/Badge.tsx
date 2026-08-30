import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'dark'

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-1 ring-success-500/20',
  warning: 'bg-warning-50 text-warning-700 ring-1 ring-warning-500/25',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-danger-500/20',
  neutral: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200',
  dark: 'bg-stone-800/70 text-white backdrop-blur',
}

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
