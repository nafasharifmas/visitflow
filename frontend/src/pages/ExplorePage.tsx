import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
import { PlaceCard } from '@/components/PlaceCard'
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

  return (
    <main className="page explore-page shell-page">
      <div className="shell section-stack">
        <div className="section-heading section-heading-start">
          <div>
            <p className="kicker">EXPLORE LOCAL PLACES</p>
            <h1>Find your next stop.</h1>
            <p>Search the live tourism catalogue by keyword or category without falling back to bundled sample destinations.</p>
          </div>
        </div>

        <section className="explore-layout">
          <aside className="panel filter-panel">
            <div>
              <p className="kicker">FILTERS</p>
              <h2>Refine your route</h2>
            </div>
            <label className="field-group">
              <span>Search</span>
              <div className="field-inline">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => updateFilters({ search: event.target.value, category })}
                  placeholder="Search places"
                />
              </div>
            </label>
            <label className="field-group">
              <span>Category</span>
              <select
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
              </select>
            </label>
            <button type="button" className="secondary" onClick={() => updateFilters({})}>
              Clear Filters
            </button>
            <div className="chip-row chip-row-selectable">
              {categories.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${item.slug === category ? 'chip-active' : ''}`}
                  onClick={() => updateFilters({ search, category: item.slug === category ? '' : item.slug })}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </aside>

          <section className="results-panel">
            <div className="results-head panel">
              <div>
                <h2>{activeCategory ? activeCategory.name : 'All live places'}</h2>
                <p>{places.length} places found from the live catalogue.</p>
              </div>
              <span className="chip">{search ? `Search: ${search}` : 'Browse mode'}</span>
            </div>

            {loading ? (
              <AsyncState message="Loading places..." />
            ) : error ? (
              <AsyncState message={error} tone="error" actionLabel="Retry" onAction={() => updateFilters({ search, category })} />
            ) : places.length === 0 ? (
              <AsyncState message="No places found." />
            ) : (
              <section className="grid compact-grid results-grid">
                {places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    selected={placeIds.includes(place.id)}
                    onTogglePlan={(placeId) => addPlace(placeId)}
                  />
                ))}
              </section>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}