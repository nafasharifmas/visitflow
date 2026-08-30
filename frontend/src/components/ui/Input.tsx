import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink placeholder:text-muted/70 transition focus:border-ocean-400 focus:outline-none focus:ring-4 focus:ring-ocean-600/15',
        className,
      )}
      {...props}
    />
  )
}