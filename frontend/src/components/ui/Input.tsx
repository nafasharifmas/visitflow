import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-stone-200 bg-white px-3.5 text-sm text-stone-900 shadow-xs placeholder:text-stone-400 transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10',
        className,
      )}
      {...props}
    />
  )
}
