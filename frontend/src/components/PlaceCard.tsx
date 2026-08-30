import { Heart, MapPinned, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Place } from '@/types/place'

type PlaceCardProps = {
  place: Place
  selected?: boolean
  favourite?: boolean
  onTogglePlan?: (placeId: number) => void
  onToggleFavourite?: (placeId: number) => void
}

export function PlaceCard({
  place,
  selected = false,
  favourite = false,
  onTogglePlan,
  onToggleFavourite,
}: PlaceCardProps) {
  const image = place.images[0]?.image_url

  return (
    <article className="card place-card">
      <div
        className="image"
        style={
          image
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.55)), url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="image-topline">
          <span>{place.category.name}</span>
          {onToggleFavourite ? (
            <button type="button" className="icon-button" onClick={() => onToggleFavourite(place.id)} aria-label="Toggle favourite">
              <Heart size={15} fill={favourite ? 'currentColor' : 'none'} />
            </button>
          ) : null}
        </div>
        <div className="image-bottomline">
          <small>{place.is_featured ? 'Featured destination' : 'Live catalogue stop'}</small>
        </div>
      </div>
      <div className="copy">
        <small>
          <MapPinned size={13} /> {place.distance_from_home} km away <span className="dot">•</span> <Star size={13} fill="currentColor" />{' '}
          {Number(place.average_rating || 0).toFixed(1)}
        </small>
        <h3>{place.name}</h3>
        <p>{place.short_description}</p>
        <div className="card-actions-row">
          <Link to={`/places/${place.slug}`} className="text-link">
            View details
          </Link>
          <div className="card-actions-inline">
            {onTogglePlan ? (
              <button type="button" onClick={() => onTogglePlan(place.id)}>
                {selected ? 'Remove' : 'Add to plan'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}