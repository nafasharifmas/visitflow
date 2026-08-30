import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'nature' | 'ocean' | 'sunset' | 'neutral' | 'dark'

const variantClasses: Record<BadgeVariant, string> = {
  nature: 'bg-nature-50 text-nature-700 ring-1 ring-nature-600/20',
  ocean: 'bg-ocean-50 text-ocean-700 ring-1 ring-ocean-600/20',
  sunset: 'bg-sunset-50 text-sunset-700 ring-1 ring-sunset-500/25',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-300/40',
  dark: 'bg-ink/60 text-white backdrop-blur',
}

type BadgeProps = {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'nature', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold', variantClasses[variant], className)}>
      {children}
    </span>
  )
}