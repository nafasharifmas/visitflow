import { Badge } from '@/components/ui/Badge'
import { CategoryGlyph } from '@/lib/categoryIcon'
import { placeImageStyle } from '@/components/place/PlaceCard'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function PlaceHero({
  image,
  alt,
  categoryName,
  categoryIcon,
  title,
  gradient = false,
  children,
  className,
}: {
  image?: string | null
  alt?: string
  categoryName?: string
  categoryIcon?: string | null
  title: string
  gradient?: boolean
  children?: ReactNode
  className?: string
}) {
  const style = image
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.72) 100%), url(${image})`,
        backgroundSize: 'cover' as const,
        backgroundPosition: 'center' as const,
      }
    : undefined

  return (
    <section
      role="img"
      aria-label={alt || title}
      className={cn(
        'relative flex min-h-[300px] items-end overflow-hidden rounded-[28px] border border-line',
        gradient || !image ? 'bg-[linear-gradient(135deg,#0284c7,#16a34a_55%,#f97316)]' : undefined,
        className,
      )}
      style={style}
    >
      <div className="w-full p-7 md:p-10">
        {categoryName ? (
          <Badge variant="dark" className="mb-3 flex w-fit items-center gap-1.5">
            <CategoryGlyph icon={categoryIcon} size={13} />
            {categoryName}
          </Badge>
        ) : null}
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </section>
  )
}

export { placeImageStyle }