import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
import { PlaceCard } from '@/components/PlaceCard'
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
    <main className="page">
      <p className="kicker">FAVOURITES</p>
      <h1>Your saved places.</h1>
      {loading ? <AsyncState message="Loading favourites..." /> : error ? <AsyncState message={error} tone="error" /> : places.length === 0 ? <AsyncState message="No favourites saved yet." /> : (
        <section className="grid compact-grid">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              favourite
              onTogglePlan={(placeId) => addPlace(placeId)}
              onToggleFavourite={async (placeId) => {
                await removeFavourite(placeId, token)
                setPlaces((state) => state.filter((item) => item.id !== placeId))
              }}
            />
          ))}
        </section>
      )}
    </main>
  )
}

