import { AlertTriangle, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AsyncStateProps = {
  message: string
  detail?: string
  actionLabel?: string
  onAction?: () => void
  tone?: 'default' | 'error'
  className?: string
  icon?: ReactNode
}

export function AsyncState({ message, detail, actionLabel, onAction, tone = 'default', className, icon }: AsyncStateProps) {
  const isError = tone === 'error'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-3xl border px-6 py-10 text-center',
        isError
          ? 'border-red-200/70 bg-red-50/80'
          : 'border-dashed border-line bg-white/70',
        className,
      )}
    >
      <span
        className={cn(
          'grid h-12 w-12 place-items-center rounded-2xl',
          isError ? 'bg-red-100 text-red-600' : 'bg-ocean-50 text-ocean-600',
        )}
      >
        {icon ?? (isError ? <AlertTriangle size={22} /> : <Inbox size={22} />)}
      </span>
      <div>
        <p className="font-bold text-ink">{message}</p>
        {detail ? <p className="mt-1 text-sm text-muted">{detail}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'mt-1 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-bold transition-all hover:scale-105',
            isError ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-ocean-600 text-white hover:bg-ocean-700',
          )}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}