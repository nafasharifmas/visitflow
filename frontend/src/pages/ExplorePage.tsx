import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
import { PlaceGrid, PlaceGridSkeleton } from '@/components/place/PlaceGrid'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { getCategories } from '@/services/categories'
import { getPlaces } from '@/services/places'
import { usePlannerStore } from '@/store/planner'
import type { Category } from '@/types/category'
import type { Place } from '@/types/place'

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const addPlace = usePlannerStore((state) => state.addPlace)
  const placeIds = usePlannerStore((state) => state.placeIds)
  const search = searchParams.get('search') ?? ''
  const category = searchParams.get('category') ?? ''
  const [categories, setCategories] = useState<Category[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const response = await getCategories()
        setCategories(response.data)
      } catch {
        setCategories([])
      }
    })()
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getPlaces({
          search: search || undefined,
          category: category || undefined,
          perPage: 24,
        })
        setPlaces(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load places. Please try again.')
      } finally {
        setLoading(false)
      }
    })()
  }, [search, category])

  function updateFilters(next: { search?: string; category?: string }) {
    const params = new URLSearchParams()
    if (next.search) params.set('search', next.search)
    if (next.category) params.set('category', next.category)
    setSearchParams(params)
  }

  const activeCategory = useMemo(
    () => categories.find((item) => item.slug === category) ?? null,
    [categories, category],
  )

  const hasFilters = Boolean(search || category)

  return (
    <main className="shell py-10">
      <div className="mb-8">
        <p className="kicker">Explore Local Places</p>
        <h1 className="heading-1 mt-2">Find your next stop.</h1>
        <p className="mt-2 max-w-xl text-stone-500">
          Search the live tourism catalogue by keyword or category.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-stone-400" />
              <h2 className="font-semibold text-stone-900">Refine your route</h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-700">Search</span>
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    value={search}
                    onChange={(event) => updateFilters({ search: event.target.value, category })}
                    placeholder="Search places"
                    className="pl-9"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-stone-700">Category</span>
                <Select
                  aria-label="Category"
                  value={category}
                  onChange={(event) => updateFilters({ search, category: event.target.value })}
                >
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((item) => {
                  const active = item.slug === category
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateFilters({ search, category: active ? '' : item.slug })}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? 'bg-brand-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                })}
              </div>
              {hasFilters ? (
                <Button variant="ghost" size="sm" className="w-full" onClick={() => updateFilters({})}>
                  Clear Filters <X size={14} />
                </Button>
              ) : null}
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                {activeCategory ? activeCategory.name : 'All live places'}
              </h2>
              <p className="text-sm text-stone-500">{places.length} places found</p>
            </div>
            {search ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">
                Search: {search}
              </span>
            ) : null}
          </div>

          {loading ? (
            <PlaceGridSkeleton count={9} />
          ) : error ? (
            <AsyncState message={error} tone="error" actionLabel="Retry" onAction={() => updateFilters({ search, category })} />
          ) : places.length === 0 ? (
            <AsyncState message="No places found." />
          ) : (
            <PlaceGrid places={places} selectedIds={placeIds} onTogglePlan={(id) => addPlace(id)} />
          )}
        </section>
      </div>
    </main>
  )
}
