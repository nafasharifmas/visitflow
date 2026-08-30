import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900',
  danger: 'bg-danger-500 text-white hover:bg-danger-700',
  outline: 'border border-brand-200 text-brand-700 hover:bg-brand-50',
  success: 'bg-success-500 text-white hover:bg-success-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[0.82rem] gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
}

const baseClasses =
  'inline-flex select-none items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55'

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
      whileTap={{ scale: 0.98 }}
      className={resolveClasses(variant, size, className)}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  )
}
