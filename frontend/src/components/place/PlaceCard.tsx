import { motion } from 'framer-motion'
import { Heart, MapPinned, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CategoryGlyph } from '@/lib/categoryIcon'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

type PlaceCardProps = {
  place: Place
  selected?: boolean
  favourite?: boolean
  onTogglePlan?: (placeId: number) => void
  onToggleFavourite?: (placeId: number) => void
  className?: string
}

export function placeImageStyle(place: Pick<Place, 'images'>) {
  const image = place.images[0]?.image_url
  if (!image) return undefined
  return {
    backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.55)), url(${image})`,
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
  }
}

export function PlaceCard({
  place,
  selected = false,
  favourite = false,
  onTogglePlan,
  onToggleFavourite,
  className,
}: PlaceCardProps) {
  const image = place.images[0]?.image_url

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
      <Card hover className={cn('h-full', className)}>
        <div
          className={cn('relative flex h-52 flex-col justify-between p-4', !image && 'bg-[linear-gradient(135deg,#0284c7,#16a34a_55%,#f97316)]')}
          style={placeImageStyle(place)}
          role="img"
          aria-label={place.images[0]?.alt_text || place.name}
        >
          <div className="flex items-start justify-between gap-2">
            <Badge variant="dark" className="flex items-center gap-1.5">
              <CategoryGlyph icon={place.category.icon} size={13} />
              {place.category.name}
            </Badge>
            {onToggleFavourite ? (
              <button
                type="button"
                onClick={() => onToggleFavourite(place.id)}
                aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
                aria-pressed={favourite}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full shadow-md transition-all hover:scale-110',
                  favourite ? 'bg-sunset-500 text-white' : 'bg-white/90 text-ink',
                )}
              >
                <Heart size={16} fill={favourite ? 'currentColor' : 'none'} />
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              <MapPinned size={13} /> {place.distance_from_home} km away
            </span>
            {Number(place.average_rating || 0) > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink">
                <Star size={13} fill="currentColor" className="text-sunset-500" /> {Number(place.average_rating).toFixed(1)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="nature">{place.category.name}</Badge>
            {place.is_featured ? <Badge variant="sunset">Featured</Badge> : null}
          </div>
          <h3 className="mt-3 text-[20px] font-semibold leading-snug tracking-tight">{place.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{place.short_description}</p>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
            <Link to={`/places/${place.slug}`} className="text-sm font-bold text-ocean-600 transition-colors hover:text-ocean-700">
              View Details
            </Link>
            {onTogglePlan ? (
              <Button size="sm" variant={selected ? 'secondary' : 'sunset'} onClick={() => onTogglePlan(place.id)}>
                {selected ? 'Added ✓' : 'Add to Plan'}
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}