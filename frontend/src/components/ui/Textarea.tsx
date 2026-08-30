import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition focus:border-ocean-400 focus:outline-none focus:ring-4 focus:ring-ocean-600/15',
        className,
      )}
      {...props}
    />
  )
}