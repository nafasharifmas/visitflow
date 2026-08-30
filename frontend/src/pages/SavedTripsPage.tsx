import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { deleteTripPlan, getTripPlans, updateTripPlan } from '@/services/tripPlans'
import { useAuthStore } from '@/store/auth'
import type { TripPlan } from '@/types/tripPlan'

export function SavedTripsPage() {
  const { user, token } = useAuthStore()
  const [trips, setTrips] = useState<TripPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    void (async () => {
      try {
        setLoading(true)
        const response = await getTripPlans(token)
        setTrips(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load saved trips.')
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  if (!user || !token) return <Navigate to="/login" replace />

  const authToken = token

  async function renameTrip(trip: TripPlan) {
    const title = window.prompt('Update trip title', trip.title)
    if (!title || title === trip.title) return

    try {
      const response = await updateTripPlan(trip.id, { title }, authToken)
      setTrips((state) => state.map((item) => item.id === trip.id ? response.data : item))
      toast.success('Trip updated.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to update trip.')
    }
  }

  async function removeTrip(trip: TripPlan) {
    try {
      await deleteTripPlan(trip.id, authToken)
      setTrips((state) => state.filter((item) => item.id !== trip.id))
      toast.success('Trip deleted.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to delete trip.')
    }
  }

  return (
    <main className="page">
      <p className="kicker">SAVED TRIPS</p>
      <h1>Your stored itineraries.</h1>
      {loading ? <AsyncState message="Loading saved trips..." /> : error ? <AsyncState message={error} tone="error" /> : trips.length === 0 ? <AsyncState message="No saved trips yet." /> : (
        <div className="stack-list">
          {trips.map((trip) => (
            <article key={trip.id} className="panel">
              <div className="panel-row">
                <div>
                  <h3>{trip.title}</h3>
                  <p>{trip.travel_date} · {trip.items.length} stops · {trip.total_distance} km</p>
                </div>
                <div className="button-row compact-row">
                  <button className="secondary" type="button" onClick={() => renameTrip(trip)}>Rename</button>
                  <button className="secondary" type="button" onClick={() => removeTrip(trip)}>Delete</button>
                </div>
              </div>
              <ul className="preview-list">
                {trip.items.map((item) => (
                  <li key={item.id}>
                    <strong>{item.position}. {item.place.name}</strong>
                    <small>{item.planned_arrival_time || '--'} - {item.planned_departure_time || '--'}</small>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

