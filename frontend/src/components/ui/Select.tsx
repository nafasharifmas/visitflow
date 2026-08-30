import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-11 w-full appearance-none rounded-2xl border border-line bg-white px-4 pr-10 text-sm text-ink transition focus:border-ocean-400 focus:outline-none focus:ring-4 focus:ring-ocean-600/15',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  )
}