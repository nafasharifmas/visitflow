import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, Clock3, MapPinned, Route } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
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

  const stats = preview
    ? [
        { icon: <Route size={18} />, value: `${preview.total_distance} km`, label: 'Total distance' },
        { icon: <Clock3 size={18} />, value: `${preview.total_travel_minutes} mins`, label: 'Travel time' },
        { icon: <CalendarDays size={18} />, value: String(preview.stops.length), label: 'Confirmed stops' },
        { icon: <MapPinned size={18} />, value: String(preview.skipped.length), label: 'Skipped stops' },
      ]
    : []

  return (
    <main className="shell py-10">
      <div className="mb-8">
        <p className="kicker">One-Day Planner</p>
        <h1 className="heading-1 mt-2">Build a better day out.</h1>
        <p className="mt-2 max-w-2xl text-stone-500">
          Select real places from the API, preview the route on the backend, and save the final plan to your account.
        </p>
      </div>

      {loading ? (
        <AsyncState message="Loading planner places..." />
      ) : error ? (
        <AsyncState message={error} tone="error" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="kicker">Available Places</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Choose your stops</h2>
              </div>
              <Badge variant="brand">{selectedPlaces.length} chosen</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {places.map((place) => {
                const selected = placeIds.includes(place.id)
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => togglePlace(place.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition ${
                        selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-stone-300 bg-white text-transparent'
                      }`}
                    >
                      <Check size={14} />
                    </span>
                    <Avatar name={place.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-900">{place.name}</p>
                      <p className="truncate text-xs text-stone-500">
                        {place.category.name} · {place.distance_from_home} km · {place.visit_duration_minutes} minutes
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card padding="lg" className="shadow-sm">
              <p className="kicker">Plan Settings</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Your day</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Plan title"><Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} /></Field>
                <Field label="Travel date"><Input type="date" value={form.travel_date} onChange={(e) => setForm((s) => ({ ...s, travel_date: e.target.value }))} /></Field>
                <Field label="Start latitude"><Input value={form.start_latitude} onChange={(e) => setForm((s) => ({ ...s, start_latitude: e.target.value }))} /></Field>
                <Field label="Start longitude"><Input value={form.start_longitude} onChange={(e) => setForm((s) => ({ ...s, start_longitude: e.target.value }))} /></Field>
                <Field label="Start address"><Input value={form.start_address} onChange={(e) => setForm((s) => ({ ...s, start_address: e.target.value }))} /></Field>
                <Field label="Start time"><Input type="time" value={form.start_time} onChange={(e) => setForm((s) => ({ ...s, start_time: e.target.value }))} /></Field>
                <Field label="End time"><Input type="time" value={form.end_time} onChange={(e) => setForm((s) => ({ ...s, end_time: e.target.value }))} /></Field>
              </div>
            </Card>

            <Card padding="lg" className="shadow-sm">
              <p className="kicker">Trip Timeline</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Selected places</h2>
              {selectedPlaces.length === 0 ? (
                <EmptyState className="mt-4 py-8" title="No stops selected" description="Choose places on the left to build your itinerary." />
              ) : (
                <ol className="mt-4 space-y-0">
                  {selectedPlaces.map((place, index) => (
                    <li key={place.id} className="relative flex items-center gap-3 pb-4">
                      {index < selectedPlaces.length - 1 ? (
                        <span className="absolute left-[11px] top-6 h-full w-px bg-stone-200" />
                      ) : null}
                      <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-stone-900">{place.name}</p>
                        <p className="text-xs text-stone-500">{place.category.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePlace(place.id)}
                        className="text-xs font-medium text-danger-700 transition hover:text-danger-500"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-4 grid gap-2">
                <Button className="w-full" onClick={handlePreview} disabled={busy || selectedPlaces.length === 0}>
                  {busy ? 'Generating...' : 'Generate itinerary'}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={clearPlaces}>Clear selection</Button>
                  <Button variant="outline" onClick={handleSave} disabled={busy || !preview}>
                    {user ? 'Save plan' : 'Sign in to save'}
                  </Button>
                </div>
              </div>
            </Card>

            {preview ? (
              <Card padding="lg" className="shadow-sm">
                <p className="kicker">Route Summary</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">Preview</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">{stat.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{stat.value}</p>
                        <p className="text-xs text-stone-400">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <ol className="mt-4 space-y-0">
                  {preview.stops.map((stop, index) => (
                    <li key={stop.place.id} className="relative flex items-start gap-3 pb-4">
                      {index < preview.stops.length - 1 ? (
                        <span className="absolute left-[11px] top-6 h-full w-px bg-stone-200" />
                      ) : null}
                      <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-stone-200 text-[11px] font-semibold text-stone-600">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">{stop.place.name}</p>
                        <p className="text-xs text-stone-500">
                          {stop.arrival_time} - {stop.departure_time} · {stop.travel_minutes} min travel · {stop.distance_km} km
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                {preview.skipped.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {preview.skipped.map((item, index) => (
                      <div key={`${item.place}-${index}`} className="rounded-lg border border-warning-500/20 bg-warning-50 p-3">
                        <p className="text-sm font-medium text-warning-700">{item.place}</p>
                        <p className="text-xs text-stone-500">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            ) : null}
          </aside>
        </div>
      )}
    </main>
  )
}
