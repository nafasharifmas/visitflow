import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-7',
}

export function Card({ className, hover = false, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-stone-200 bg-white shadow-xs',
        paddingMap[padding],
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-md',
        className,
      )}
      {...props}
    />
  )
}
