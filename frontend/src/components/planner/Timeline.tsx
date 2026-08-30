import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export type TimelineItem = {
  id: string
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  node?: 'ocean' | 'sunset' | 'default'
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < items.length - 1 ? <span aria-hidden className="absolute left-[5px] top-4 h-full w-px bg-line" /> : null}
          <motion.span
            aria-hidden
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={
              item.node === 'sunset'
                ? 'mt-1 h-3 w-3 shrink-0 rounded-full bg-gradient-to-br from-sunset-500 to-orange-400 shadow-[0_0_0_5px_rgba(249,115,22,0.15)]'
                : item.node === 'ocean'
                  ? 'mt-1 h-3 w-3 shrink-0 rounded-full bg-ocean-600 shadow-[0_0_0_5px_rgba(2,132,199,0.14)]'
                  : 'mt-1 h-3 w-3 shrink-0 rounded-full bg-gradient-to-br from-ocean-600 to-nature-600 shadow-[0_0_0_5px_rgba(2,132,199,0.12)]'
            }
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold leading-snug">{item.title}</div>
            {item.subtitle ? <div className="mt-0.5 text-sm leading-relaxed text-muted">{item.subtitle}</div> : null}
            {item.meta ? <div className="mt-1.5">{item.meta}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}