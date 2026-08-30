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
        <label htmlFor={htmlFor} className="text-sm font-medium text-stone-800">
          {label}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="text-xs text-stone-400">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-danger-700">{error}</p> : null}
    </div>
  )
}
