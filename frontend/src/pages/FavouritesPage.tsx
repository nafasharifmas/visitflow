import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PlaceGrid, PlaceGridSkeleton } from '@/components/place/PlaceGrid'
import { getFavourites, removeFavourite } from '@/services/favourites'
import { useAuthStore } from '@/store/auth'
import { usePlannerStore } from '@/store/planner'
import type { Place } from '@/types/place'

export function FavouritesPage() {
  const { user, token } = useAuthStore()
  const addPlace = usePlannerStore((state) => state.addPlace)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    void (async () => {
      try {
        setLoading(true)
        const response = await getFavourites(token)
        setPlaces(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load favourites.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  if (!user || !token) return <Navigate to="/login" replace />

  return (
    <main className="shell py-10">
      <div className="mb-8">
        <p className="kicker">Favourites</p>
        <h1 className="heading-1 mt-2">Your saved places.</h1>
        <p className="mt-2 text-stone-500">Places you loved, kept in one place.</p>
      </div>

      {loading ? (
        <PlaceGridSkeleton count={6} />
      ) : error ? (
        <AsyncState message={error} tone="error" />
      ) : places.length === 0 ? (
        <EmptyState
          icon={<Heart size={24} />}
          title="No favourites saved yet"
          description="Tap the heart on any place you love to keep it here."
          action={<Button to="/explore" variant="primary">Explore Places</Button>}
        />
      ) : (
        <PlaceGrid
          places={places}
          selectedIds={[]}
          onTogglePlan={(placeId) => addPlace(placeId)}
          onToggleFavourite={async (placeId) => {
            await removeFavourite(placeId, token)
            setPlaces((state) => state.filter((item) => item.id !== placeId))
          }}
        />
      )}
    </main>
  )
}
