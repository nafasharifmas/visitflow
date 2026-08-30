import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? (
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">{icon}</span>
      ) : null}
      <div>
        <p className="font-semibold text-stone-900">{title}</p>
        {description ? <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
