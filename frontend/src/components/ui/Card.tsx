import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]',
        hover &&
          'transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_30px_70px_rgba(15,23,42,0.16)]',
        className,
      )}
      {...props}
    />
  )
}