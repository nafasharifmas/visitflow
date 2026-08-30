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
        className={cn('-mx-3.5 -mt-2.5 mb-3 h-24 rounded-t-xl', !image && 'bg-[linear-gradient(135deg,#0284c7,#16a34a_55%,#f97316)]')}
        style={
          image
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.1), rgba(15,23,42,0.5)), url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <Badge variant="nature" className="mb-1.5 flex w-fit items-center gap-1">
        <CategoryGlyph icon={place.category.icon} size={12} />
        {place.category.name}
      </Badge>
      <strong className="block text-sm leading-snug">{place.name}</strong>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
        <span className="inline-flex items-center gap-0.5"><MapPinned size={12} /> {place.distance_from_home} km</span>
        {Number(place.average_rating || 0) > 0 ? (
          <span className="inline-flex items-center gap-0.5"><Star size={12} className="text-sunset-500" fill="currentColor" /> {Number(place.average_rating).toFixed(1)}</span>
        ) : null}
      </p>
      <Link to={`/places/${place.slug}`} className="mt-2 inline-block text-sm font-bold text-ocean-600 hover:text-ocean-700">
        View Details
      </Link>
    </div>
  )
}