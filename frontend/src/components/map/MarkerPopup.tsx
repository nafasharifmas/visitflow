import { MapPinned, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { CategoryGlyph } from '@/lib/categoryIcon'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

export function MarkerPopup({ place, className }: { place: Place; className?: string }) {
  const image = place.images[0]?.image_url

  return (
    <div className={cn('w-56', className)}>
      <div
        className={cn('-mx-3.5 -mt-2.5 mb-3 h-24 rounded-t-xl', !image && 'bg-gradient-to-br from-brand-600 to-brand-800')}
        style={
          image
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(28,25,23,0.1), rgba(28,25,23,0.5)), url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <Badge variant="brand" className="mb-1.5 flex w-fit items-center gap-1">
        <CategoryGlyph icon={place.category.icon} size={12} />
        {place.category.name}
      </Badge>
      <strong className="block text-sm leading-snug">{place.name}</strong>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500">
        <span className="inline-flex items-center gap-0.5"><MapPinned size={12} /> {place.distance_from_home} km</span>
        {Number(place.average_rating || 0) > 0 ? (
          <span className="inline-flex items-center gap-0.5"><Star size={12} className="text-warning-500" fill="currentColor" /> {Number(place.average_rating).toFixed(1)}</span>
        ) : null}
      </p>
      <Link to={`/places/${place.slug}`} className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
        View Details
      </Link>
    </div>
  )
}
