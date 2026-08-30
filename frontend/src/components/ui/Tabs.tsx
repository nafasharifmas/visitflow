import { cn } from '@/lib/utils'

export type TabItem = {
  id: string
  label: string
  icon?: React.ReactNode
}

type TabsProps = {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-xs',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition',
              isActive ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
