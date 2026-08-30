import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const palette = [
  'bg-brand-500',
  'bg-success-500',
  'bg-warning-500',
  'bg-danger-500',
  'bg-stone-500',
  'bg-brand-700',
]

export function initialsOf(name: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string
  src?: string | null
  size?: number
}

export function Avatar({ name, src, size = 40, className, ...props }: AvatarProps) {
  const color = palette[(name.charCodeAt(0) + name.length) % palette.length]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className={cn('shrink-0 rounded-full object-cover ring-2 ring-stone-100', className)}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(color, 'grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-white', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      {...props}
    >
      {initialsOf(name)}
    </div>
  )
}
