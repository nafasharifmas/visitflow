import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-lg border border-stone-200 bg-white px-3.5 pr-9 text-sm text-stone-900 shadow-xs transition focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
    </div>
  )
}
