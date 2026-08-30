import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
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
    <main className="shell py-10">
      <header>
        <p className="kicker">Admin Places</p>
        <h1 className="heading-1 mt-2">Manage public catalogue places.</h1>
        <p className="mt-3 max-w-2xl text-stone-500">
          Create, edit and remove the places that make up the live tourism catalogue.
        </p>
      </header>

      {loading ? (
        <div className="mt-10"><AsyncState message="Loading places..." /></div>
      ) : error ? (
        <div className="mt-10"><AsyncState message={error} tone="error" /></div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="heading-3">Existing places</h2>
              <Badge variant="neutral">{places.length} total</Badge>
            </div>
            <DataTable<Place>
              columns={[
                {
                  key: 'name',
                  header: 'Place',
                  render: (place) => <span className="font-medium text-stone-900">{place.name}</span>,
                },
                { key: 'category', header: 'Category', render: (place) => place.category.name },
                {
                  key: 'status',
                  header: 'Status',
                  render: (place) => (
                    <Badge variant={place.status === 'active' ? 'success' : 'neutral'}>{place.status}</Badge>
                  ),
                },
                {
                  key: 'distance',
                  header: 'Distance',
                  align: 'right',
                  render: (place) => <span className="text-stone-600">{place.distance_from_home} km</span>,
                },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  render: (place) => (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => editPlace(place)}>
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => remove(place.id)}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={places}
              rowKey={(place) => place.id}
              emptyMessage="No places yet. Create the first one using the form."
            />
          </section>

          <Card padding="lg" className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="heading-3">{form.id ? 'Edit place' : 'Create place'}</h2>
            <p className="mt-1 text-sm text-stone-500">
              {form.id ? 'Update the details below and save your changes.' : 'Fill in the details below to add a new place.'}
            </p>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
              <Field htmlFor="category_id" label="Category">
                <Select id="category_id" value={form.category_id} onChange={(event) => setForm((state) => ({ ...state, category_id: event.target.value }))}>
                  <option value="">Select a category</option>
                  {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </Select>
              </Field>
              <Field htmlFor="name" label="Name">
                <Input id="name" value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} />
              </Field>
              <Field htmlFor="slug" label="Slug">
                <Input id="slug" value={form.slug} onChange={(event) => setForm((state) => ({ ...state, slug: event.target.value }))} />
              </Field>
              <Field htmlFor="short_description" label="Short description" className="sm:col-span-2">
                <Textarea id="short_description" rows={3} value={form.short_description} onChange={(event) => setForm((state) => ({ ...state, short_description: event.target.value }))} />
              </Field>
              <Field htmlFor="full_description" label="Full description" className="sm:col-span-2">
                <Textarea id="full_description" rows={5} value={form.full_description} onChange={(event) => setForm((state) => ({ ...state, full_description: event.target.value }))} />
              </Field>
              <Field htmlFor="address" label="Address" className="sm:col-span-2">
                <Input id="address" value={form.address} onChange={(event) => setForm((state) => ({ ...state, address: event.target.value }))} />
              </Field>
              <Field htmlFor="latitude" label="Latitude">
                <Input id="latitude" value={form.latitude} onChange={(event) => setForm((state) => ({ ...state, latitude: event.target.value }))} />
              </Field>
              <Field htmlFor="longitude" label="Longitude">
                <Input id="longitude" value={form.longitude} onChange={(event) => setForm((state) => ({ ...state, longitude: event.target.value }))} />
              </Field>
              <Field htmlFor="distance_from_home" label="Distance from home">
                <Input id="distance_from_home" value={form.distance_from_home} onChange={(event) => setForm((state) => ({ ...state, distance_from_home: event.target.value }))} />
              </Field>
              <Field htmlFor="opening_time" label="Opening time">
                <Input id="opening_time" type="time" value={form.opening_time} onChange={(event) => setForm((state) => ({ ...state, opening_time: event.target.value }))} />
              </Field>
              <Field htmlFor="closing_time" label="Closing time">
                <Input id="closing_time" type="time" value={form.closing_time} onChange={(event) => setForm((state) => ({ ...state, closing_time: event.target.value }))} />
              </Field>
              <Field htmlFor="visit_duration_minutes" label="Visit duration minutes">
                <Input id="visit_duration_minutes" value={form.visit_duration_minutes} onChange={(event) => setForm((state) => ({ ...state, visit_duration_minutes: event.target.value }))} />
              </Field>
              <Field htmlFor="travel_tips" label="Travel tips" className="sm:col-span-2">
                <Textarea id="travel_tips" rows={3} value={form.travel_tips} onChange={(event) => setForm((state) => ({ ...state, travel_tips: event.target.value }))} />
              </Field>
              <Field htmlFor="status" label="Status">
                <Select id="status" value={form.status} onChange={(event) => setForm((state) => ({ ...state, status: event.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </Field>
              <Field htmlFor="image_url" label="Image URL" className="sm:col-span-2">
                <Input id="image_url" value={form.image_url} onChange={(event) => setForm((state) => ({ ...state, image_url: event.target.value }))} />
              </Field>
              <Field htmlFor="alt_text" label="Image alt text" className="sm:col-span-2">
                <Input id="alt_text" value={form.alt_text} onChange={(event) => setForm((state) => ({ ...state, alt_text: event.target.value }))} />
              </Field>
              <label className="flex items-center gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) => setForm((state) => ({ ...state, is_featured: event.target.checked }))}
                  className="h-4 w-4 rounded border-stone-300 accent-brand-600"
                />
                <span className="text-sm font-medium text-stone-800">Featured place</span>
              </label>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-stone-800">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {facilities.map((facility) => {
                    const isActive = form.facilities.includes(facility.id)
                    return (
                      <button
                        key={facility.id}
                        type="button"
                        className={
                          isActive
                            ? 'rounded-full border border-brand-600 bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition'
                            : 'rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50'
                        }
                        onClick={() => setForm((state) => ({
                          ...state,
                          facilities: state.facilities.includes(facility.id)
                            ? state.facilities.filter((id) => id !== facility.id)
                            : [...state.facilities, facility.id],
                        }))}
                      >
                        {facility.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <Button type="submit">{form.id ? 'Update place' : 'Create place'}</Button>
                <Button type="button" variant="secondary" onClick={() => setForm(emptyForm)}>Reset</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  )
}