import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'sunset' | 'ghost' | 'danger' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-ocean-600 to-sky-500 text-white shadow-[0_14px_28px_rgba(2,132,199,0.28)] hover:shadow-[0_18px_36px_rgba(2,132,199,0.36)]',
  secondary: 'border border-line bg-white/95 text-ink shadow-sm hover:bg-white',
  sunset:
    'bg-gradient-to-br from-sunset-500 to-orange-400 text-white shadow-[0_14px_28px_rgba(249,115,22,0.28)] hover:shadow-[0_18px_36px_rgba(249,115,22,0.36)]',
  ghost: 'bg-transparent text-ocean-600 hover:bg-ocean-50',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  outline: 'border border-ocean-600 text-ocean-600 hover:bg-ocean-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[0.85rem] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-[0.95rem] gap-2',
}

const baseClasses =
  'inline-flex select-none items-center justify-center rounded-full font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-55'

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = CommonProps & {
  to: string
  href?: undefined
  type?: never
}

type ButtonAsAnchor = CommonProps & {
  href: string
  to?: undefined
  type?: never
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

function resolveClasses(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className)
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props

  if ('to' in props && props.to) {
    return (
      <Link className={resolveClasses(variant, size, className)} to={props.to}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    return (
      <a className={resolveClasses(variant, size, className)} href={props.href}>
        {children}
      </a>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={resolveClasses(variant, size, className)}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </motion.button>
  )
}