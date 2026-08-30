import { PlaceCard } from '@/components/place/PlaceCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

export function PlaceGrid({
  places,
  selectedIds = [],
  onTogglePlan,
  onToggleFavourite,
  className,
}: {
  places: Place[]
  selectedIds?: number[]
  onTogglePlan?: (placeId: number) => void
  onToggleFavourite?: (placeId: number) => void
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          selected={selectedIds.includes(place.id)}
          onTogglePlan={onTogglePlan}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  )
}

export function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
      <Skeleton className="h-52 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PlaceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  )
}