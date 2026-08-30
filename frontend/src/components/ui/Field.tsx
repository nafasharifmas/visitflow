import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FieldProps = {
  label?: string
  htmlFor?: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-sm font-bold text-ink">
          {label}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  )
}