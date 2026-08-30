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
        'flex flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-10 text-center',
        isError ? 'border-danger-500/20 bg-danger-50/60' : 'border-dashed border-stone-300 bg-white/60',
        className,
      )}
    >
      <span
        className={cn(
          'grid h-12 w-12 place-items-center rounded-xl',
          isError ? 'bg-danger-50 text-danger-700' : 'bg-brand-50 text-brand-600',
        )}
      >
        {icon ?? (isError ? <AlertTriangle size={22} /> : <Inbox size={22} />)}
      </span>
      <div>
        <p className="font-semibold text-stone-900">{message}</p>
        {detail ? <p className="mt-1 text-sm text-stone-500">{detail}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'mt-1 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]',
            isError ? 'bg-danger-500 text-white hover:bg-danger-700' : 'bg-brand-600 text-white hover:bg-brand-700',
          )}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
