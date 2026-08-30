import { useEffect, useState } from 'react'
import { CalendarDays, Compass, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { deleteTripPlan, getTripPlans, updateTripPlan } from '@/services/tripPlans'
import { useAuthStore } from '@/store/auth'
import type { TripPlan } from '@/types/tripPlan'

export function SavedTripsPage() {
  const { user, token } = useAuthStore()
  const [trips, setTrips] = useState<TripPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<TripPlan | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleting, setDeleting] = useState<TripPlan | null>(null)

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

  function openRename(trip: TripPlan) {
    setRenaming(trip)
    setRenameValue(trip.title)
  }

  async function confirmRename() {
    if (!renaming || !renameValue.trim() || renameValue === renaming.title) {
      setRenaming(null)
      return
    }

    try {
      const response = await updateTripPlan(renaming.id, { title: renameValue.trim() }, authToken)
      setTrips((state) => state.map((item) => item.id === renaming.id ? response.data : item))
      toast.success('Trip updated.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to update trip.')
    } finally {
      setRenaming(null)
    }
  }

  async function confirmDelete() {
    if (!deleting) return

    try {
      await deleteTripPlan(deleting.id, authToken)
      setTrips((state) => state.filter((item) => item.id !== deleting.id))
      toast.success('Trip deleted.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to delete trip.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="shell py-10">
      <div className="mb-8">
        <p className="kicker">Saved Trips</p>
        <h1 className="heading-1 mt-2">Your stored itineraries.</h1>
        <p className="mt-2 text-stone-500">Plans you built and saved to your account.</p>
      </div>

      {loading ? (
        <AsyncState message="Loading saved trips..." />
      ) : error ? (
        <AsyncState message={error} tone="error" />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={<Compass size={24} />}
          title="No saved trips yet"
          description="Build your first one-day itinerary in the planner."
          action={<Button to="/planner">Open Planner</Button>}
        />
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <Card key={trip.id} padding="lg" className="shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-stone-900">{trip.title}</h3>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-stone-500">
                      <CalendarDays size={14} /> {trip.travel_date} · {trip.items.length} stops · {trip.total_distance} km
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openRename(trip)}>
                    <Pencil size={14} /> Rename
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleting(trip)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>

              <ol className="mt-5 space-y-0 border-t border-stone-100 pt-4">
                {trip.items.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 py-1.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-stone-100 text-[11px] font-semibold text-stone-600">
                      {item.position}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900">{item.place.name}</p>
                      <p className="text-xs text-stone-400">
                        {item.planned_arrival_time || '--'} - {item.planned_departure_time || '--'}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(renaming)}
        onClose={() => setRenaming(null)}
        title="Rename trip"
        description="Update the title of this itinerary."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenaming(null)}>Cancel</Button>
            <Button onClick={confirmRename}>Save</Button>
          </>
        }
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void confirmRename()
          }}
        >
          <Field label="Trip title">
            <Input autoFocus value={renameValue} onChange={(event) => setRenameValue(event.target.value)} />
          </Field>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete trip"
        description="This action cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-stone-600">Are you sure you want to delete "{deleting?.title}"?</p>
      </Modal>
    </main>
  )
}
