import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import {
  createAdminPlace,
  deleteAdminPlace,
  getAdminPlaces,
  updateAdminPlace,
  type AdminPlacePayload,
} from '@/services/admin'
import { useAuthStore } from '@/store/auth'
import type { Category } from '@/types/category'
import type { Place, PlaceFacility } from '@/types/place'

const emptyForm = {
  id: 0,
  category_id: '',
  name: '',
  slug: '',
  short_description: '',
  full_description: '',
  address: '',
  latitude: '6.95',
  longitude: '80.65',
  distance_from_home: '0',
  opening_time: '06:00',
  closing_time: '18:00',
  visit_duration_minutes: '60',
  travel_tips: '',
  status: 'active',
  is_featured: false,
  facilities: [] as number[],
  image_url: '',
  alt_text: '',
}

export function AdminPlacesPage() {
  const { user, token } = useAuthStore()
  const [places, setPlaces] = useState<Place[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [facilities, setFacilities] = useState<PlaceFacility[]>([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || user?.role !== 'admin') return
    void load()
  }, [token, user])

  async function load() {
    if (!token) return

    try {
      setLoading(true)
      const response = await getAdminPlaces(token)
      setPlaces(response.data)
      setCategories(response.meta.categories)
      setFacilities(response.meta.facilities)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load admin places.')
    } finally {
      setLoading(false)
    }
  }

  if (!user || !token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/explore" replace />

  function editPlace(place: Place) {
    setForm({
      id: place.id,
      category_id: String(place.category.id),
      name: place.name,
      slug: place.slug,
      short_description: place.short_description,
      full_description: place.full_description || '',
      address: place.address,
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      distance_from_home: String(place.distance_from_home),
      opening_time: place.opening_time,
      closing_time: place.closing_time,
      visit_duration_minutes: String(place.visit_duration_minutes),
      travel_tips: place.travel_tips || '',
      status: place.status,
      is_featured: place.is_featured,
      facilities: place.facilities.map((facility) => facility.id),
      image_url: place.images[0]?.image_url || '',
      alt_text: place.images[0]?.alt_text || '',
    })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) return

    const payload: AdminPlacePayload = {
      category_id: Number(form.category_id),
      name: form.name,
      slug: form.slug,
      short_description: form.short_description,
      full_description: form.full_description,
      address: form.address,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      distance_from_home: Number(form.distance_from_home),
      opening_time: form.opening_time,
      closing_time: form.closing_time,
      visit_duration_minutes: Number(form.visit_duration_minutes),
      travel_tips: form.travel_tips,
      status: form.status as 'active' | 'inactive',
      is_featured: form.is_featured,
      facilities: form.facilities,
      images: form.image_url
        ? [{ image_url: form.image_url, alt_text: form.alt_text, is_primary: true, sort_order: 0 }]
        : [],
    }

    try {
      if (form.id) {
        await updateAdminPlace(form.id, payload, token)
        toast.success('Place updated.')
      } else {
        await createAdminPlace(payload, token)
        toast.success('Place created.')
      }
      setForm(emptyForm)
      await load()
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to save place.')
    }
  }

  async function remove(placeId: number) {
    if (!token) return

    try {
      await deleteAdminPlace(placeId, token)
      setPlaces((state) => state.filter((place) => place.id !== placeId))
      if (form.id === placeId) setForm(emptyForm)
      toast.success('Place deleted.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to delete place.')
    }
  }

  return (
    <main className="page admin-page">
      <p className="kicker">ADMIN PLACES</p>
      <h1>Manage public catalogue places.</h1>
      {loading ? <AsyncState message="Loading places..." /> : error ? <AsyncState message={error} tone="error" /> : (
        <div className="admin-layout">
          <section className="panel">
            <h2>{form.id ? 'Edit place' : 'Create place'}</h2>
            <form className="auth-form compact-form" onSubmit={submit}>
              <label>
                Category
                <select value={form.category_id} onChange={(event) => setForm((state) => ({ ...state, category_id: event.target.value }))}>
                  <option value="">Select a category</option>
                  {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label>Name<input value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} /></label>
              <label>Slug<input value={form.slug} onChange={(event) => setForm((state) => ({ ...state, slug: event.target.value }))} /></label>
              <label>Short description<textarea rows={3} value={form.short_description} onChange={(event) => setForm((state) => ({ ...state, short_description: event.target.value }))} /></label>
              <label>Full description<textarea rows={5} value={form.full_description} onChange={(event) => setForm((state) => ({ ...state, full_description: event.target.value }))} /></label>
              <label>Address<input value={form.address} onChange={(event) => setForm((state) => ({ ...state, address: event.target.value }))} /></label>
              <label>Latitude<input value={form.latitude} onChange={(event) => setForm((state) => ({ ...state, latitude: event.target.value }))} /></label>
              <label>Longitude<input value={form.longitude} onChange={(event) => setForm((state) => ({ ...state, longitude: event.target.value }))} /></label>
              <label>Distance from home<input value={form.distance_from_home} onChange={(event) => setForm((state) => ({ ...state, distance_from_home: event.target.value }))} /></label>
              <label>Opening time<input type="time" value={form.opening_time} onChange={(event) => setForm((state) => ({ ...state, opening_time: event.target.value }))} /></label>
              <label>Closing time<input type="time" value={form.closing_time} onChange={(event) => setForm((state) => ({ ...state, closing_time: event.target.value }))} /></label>
              <label>Visit duration minutes<input value={form.visit_duration_minutes} onChange={(event) => setForm((state) => ({ ...state, visit_duration_minutes: event.target.value }))} /></label>
              <label>Travel tips<textarea rows={3} value={form.travel_tips} onChange={(event) => setForm((state) => ({ ...state, travel_tips: event.target.value }))} /></label>
              <label>
                Status
                <select value={form.status} onChange={(event) => setForm((state) => ({ ...state, status: event.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label>Image URL<input value={form.image_url} onChange={(event) => setForm((state) => ({ ...state, image_url: event.target.value }))} /></label>
              <label>Image alt text<input value={form.alt_text} onChange={(event) => setForm((state) => ({ ...state, alt_text: event.target.value }))} /></label>
              <label className="checkbox-row"><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm((state) => ({ ...state, is_featured: event.target.checked }))} /> Featured place</label>
              <div>
                <strong>Facilities</strong>
                <div className="chip-row chip-row-selectable">
                  {facilities.map((facility) => (
                    <button
                      key={facility.id}
                      type="button"
                      className={form.facilities.includes(facility.id) ? 'chip chip-active' : 'chip'}
                      onClick={() => setForm((state) => ({
                        ...state,
                        facilities: state.facilities.includes(facility.id)
                          ? state.facilities.filter((id) => id !== facility.id)
                          : [...state.facilities, facility.id],
                      }))}
                    >
                      {facility.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="button-row compact-row">
                <button className="primary" type="submit">{form.id ? 'Update place' : 'Create place'}</button>
                <button className="secondary" type="button" onClick={() => setForm(emptyForm)}>Reset</button>
              </div>
            </form>
          </section>
          <section className="panel">
            <h2>Existing places</h2>
            <div className="stack-list">
              {places.map((place) => (
                <article key={place.id} className="panel panel-nested">
                  <div className="panel-row">
                    <div>
                      <strong>{place.name}</strong>
                      <p>{place.category.name} · {place.status}</p>
                    </div>
                    <div className="button-row compact-row">
                      <button className="secondary" type="button" onClick={() => editPlace(place)}>Edit</button>
                      <button className="secondary" type="button" onClick={() => remove(place.id)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}


