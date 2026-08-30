import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Clock3, MapPinned, Route } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { getPlaces } from '@/services/places'
import { previewTrip } from '@/services/planner'
import { createTripPlan } from '@/services/tripPlans'
import { useAuthStore } from '@/store/auth'
import { usePlannerStore } from '@/store/planner'
import type { Place } from '@/types/place'

function todayValue() {
  return new Date().toISOString().slice(0, 10)
}

export function PlannerPage() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { placeIds, togglePlace, removePlace, clearPlaces, preview, setPreview } = usePlannerStore()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    title: 'My Visit Flow Plan',
    travel_date: todayValue(),
    start_latitude: '6.95',
    start_longitude: '80.65',
    start_address: 'Starting point',
    start_time: '08:00',
    end_time: '18:00',
  })

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getPlaces({ perPage: 50, sort: 'distance_asc' })
        setPlaces(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load places. Please try again.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const selectedPlaces = useMemo(() => places.filter((place) => placeIds.includes(place.id)), [places, placeIds])

  async function handlePreview() {
    if (placeIds.length === 0) return

    setBusy(true)
    try {
      const response = await previewTrip({
        place_ids: placeIds,
        start_latitude: Number(form.start_latitude),
        start_longitude: Number(form.start_longitude),
        start_time: form.start_time,
        end_time: form.end_time,
      })
      setPreview(response.data)
      toast.success('Itinerary preview generated.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to preview this itinerary.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSave() {
    if (!token || !user) {
      navigate('/login')
      return
    }

    if (!preview) {
      toast.error('Generate an itinerary preview before saving.')
      return
    }

    setBusy(true)
    try {
      await createTripPlan(
        {
          title: form.title,
          travel_date: form.travel_date,
          start_latitude: Number(form.start_latitude),
          start_longitude: Number(form.start_longitude),
          start_address: form.start_address,
          start_time: form.start_time,
          end_time: form.end_time,
          total_distance: preview.total_distance,
          total_travel_minutes: preview.total_travel_minutes,
          items: preview.stops.map((stop, index) => ({
            place_id: stop.place.id,
            position: index + 1,
            planned_arrival_time: stop.arrival_time,
            planned_departure_time: stop.departure_time,
            travel_minutes: stop.travel_minutes,
            visit_minutes: stop.place.visit_duration_minutes,
            distance_from_previous: stop.distance_km,
          })),
        },
        token,
      )
      toast.success('Trip plan saved.')
      navigate('/saved-trips')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to save this trip.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page shell-page">
      <div className="shell section-stack">
        <div className="section-heading section-heading-start">
          <div>
            <p className="kicker">ONE-DAY PLANNER</p>
            <h1>Build a better day out.</h1>
            <p>Select real places from the API, preview the route on the backend, and save the final plan to your account.</p>
          </div>
        </div>

        {loading ? (
          <AsyncState message="Loading planner places..." />
        ) : error ? (
          <AsyncState message={error} tone="error" />
        ) : (
          <div className="planner planner-wide premium-planner">
            <section className="panel planner-catalogue">
              <div className="panel-heading">
                <div>
                  <p className="kicker">SELECTED STOPS</p>
                  <h2>Available places</h2>
                </div>
                <span className="chip">{selectedPlaces.length} chosen</span>
              </div>
              <div className="stack-list planner-stop-list">
                {places.map((place) => (
                  <button className={`stop ${placeIds.includes(place.id) ? 'stop-active' : ''}`} key={place.id} type="button" onClick={() => togglePlace(place.id)}>
                    <span>{place.name}</span>
                    <small>
                      {place.category.name} · {place.distance_from_home} km · {place.visit_duration_minutes} minutes
                    </small>
                  </button>
                ))}
              </div>
            </section>

            <aside className="planner-sidebar">
              <section className="panel planner-form-panel">
                <div className="panel-heading">
                  <div>
                    <p className="kicker">PLAN SETTINGS</p>
                    <h2>Your day</h2>
                  </div>
                </div>
                <div className="auth-form compact-form planner-form-grid">
                  <label>
                    Plan title
                    <input value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} />
                  </label>
                  <label>
                    Travel date
                    <input type="date" value={form.travel_date} onChange={(event) => setForm((state) => ({ ...state, travel_date: event.target.value }))} />
                  </label>
                  <label>
                    Start latitude
                    <input value={form.start_latitude} onChange={(event) => setForm((state) => ({ ...state, start_latitude: event.target.value }))} />
                  </label>
                  <label>
                    Start longitude
                    <input value={form.start_longitude} onChange={(event) => setForm((state) => ({ ...state, start_longitude: event.target.value }))} />
                  </label>
                  <label>
                    Start address
                    <input value={form.start_address} onChange={(event) => setForm((state) => ({ ...state, start_address: event.target.value }))} />
                  </label>
                  <label>
                    Start time
                    <input type="time" value={form.start_time} onChange={(event) => setForm((state) => ({ ...state, start_time: event.target.value }))} />
                  </label>
                  <label>
                    End time
                    <input type="time" value={form.end_time} onChange={(event) => setForm((state) => ({ ...state, end_time: event.target.value }))} />
                  </label>
                </div>
              </section>

              <section className="panel planner-selection-panel">
                <div className="panel-heading">
                  <div>
                    <p className="kicker">TRIP TIMELINE</p>
                    <h2>Selected places</h2>
                  </div>
                </div>
                {selectedPlaces.length === 0 ? (
                  <p>Select places to build your itinerary.</p>
                ) : (
                  <ol className="selected-list timeline-list">
                    {selectedPlaces.map((place) => (
                      <li key={place.id}>
                        <div className="timeline-node" />
                        <div>
                          <strong>{place.name}</strong>
                          <small>{place.category.name}</small>
                        </div>
                        <button type="button" onClick={() => removePlace(place.id)}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ol>
                )}

                <div className="button-row planner-actions">
                  <button className="primary" type="button" disabled={busy || selectedPlaces.length === 0} onClick={handlePreview}>
                    {busy ? 'Generating...' : 'Generate itinerary'}
                  </button>
                  <button className="secondary" type="button" onClick={clearPlaces}>
                    Clear selection
                  </button>
                  <button className="secondary" type="button" onClick={handleSave} disabled={busy || !preview}>
                    {user ? 'Save plan' : 'Sign in to save'}
                  </button>
                </div>
              </section>

              {preview ? (
                <section className="panel planner-preview-card">
                  <div className="panel-heading">
                    <div>
                      <p className="kicker">ROUTE SUMMARY</p>
                      <h2>Preview</h2>
                    </div>
                  </div>
                  <div className="route-summary-grid">
                    <article>
                      <Route size={18} />
                      <strong>{preview.total_distance} km</strong>
                      <span>Total distance</span>
                    </article>
                    <article>
                      <Clock3 size={18} />
                      <strong>{preview.total_travel_minutes} mins</strong>
                      <span>Travel time</span>
                    </article>
                    <article>
                      <CalendarDays size={18} />
                      <strong>{preview.stops.length}</strong>
                      <span>Confirmed stops</span>
                    </article>
                    <article>
                      <MapPinned size={18} />
                      <strong>{preview.skipped.length}</strong>
                      <span>Skipped stops</span>
                    </article>
                  </div>
                  <ul className="preview-list timeline-list preview-timeline">
                    {preview.stops.map((stop) => (
                      <li key={stop.place.id}>
                        <div className="timeline-node" />
                        <div>
                          <strong>{stop.place.name}</strong>
                          <small>
                            {stop.arrival_time} - {stop.departure_time} · {stop.travel_minutes} min travel · {stop.distance_km} km
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {preview.skipped.length > 0 ? (
                    <div className="stack-list">
                      {preview.skipped.map((item, index) => (
                        <div key={`${item.place}-${index}`} className="panel panel-warning panel-nested">
                          <strong>{item.place}</strong>
                          <p>{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}