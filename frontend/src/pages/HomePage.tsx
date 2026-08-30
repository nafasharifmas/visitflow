import { motion } from 'framer-motion'
import { ArrowRight, Compass, Heart, MapPinned, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
import { PlaceGrid, PlaceGridSkeleton } from '@/components/place/PlaceGrid'
import { TouristMap } from '@/components/map/TouristMap'
import { Button } from '@/components/ui/Button'
import { CategoryGlyph } from '@/lib/categoryIcon'
import { getCategories } from '@/services/categories'
import { getFeaturedPlaces, getPlaces } from '@/services/places'
import { usePlannerStore } from '@/store/planner'
import type { Category } from '@/types/category'
import type { Place } from '@/types/place'

function useFeaturedData() {
  const [places, setPlaces] = useState<Place[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [mapPlaces, setMapPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useMemo(() => {
    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const [featured, cats, forMap] = await Promise.all([
          getFeaturedPlaces(),
          getCategories(),
          getPlaces({ perPage: 10, sort: 'distance_asc' }),
        ])
        setPlaces(featured.data)
        setCategories(cats.data)
        setMapPlaces(forMap.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load places. Please try again.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { places, categories, mapPlaces, loading, error }
}

export function HomePage() {
  const { places, categories, mapPlaces, loading, error } = useFeaturedData()
  const addPlace = usePlannerStore((state) => state.addPlace)
  const placeIds = usePlannerStore((state) => state.placeIds)
  const [search, setSearch] = useState('')

  const heroImage = places[0]?.images[0]?.image_url
  const children = useMemo(() => [...categories, ...[...categories].reverse()].slice(0, 12), [categories])

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    window.location.assign(query ? `/explore?search=${encodeURIComponent(query)}` : '/explore')
  }

  return (
    <>
      <section className="relative flex min-h-[620px] items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={
            heroImage
              ? {
                  backgroundImage: `linear-gradient(90deg, rgba(28,25,23,0.82) 0%, rgba(28,25,23,0.5) 50%, rgba(28,25,23,0.25) 100%), url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-stone-900/60" />

        <div className="shell relative z-10 py-24">
          <div className="max-w-2xl text-white">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-200 ring-1 ring-white/15 backdrop-blur"
            >
              <Sparkles size={14} />
              Local tourism, designed like a product
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-6 text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Discover hidden gems around you.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/80"
            >
              Find beaches, culture, nature, and hidden local places — then plan a perfect one-day escape.
            </motion.p>

            <motion.form
              onSubmit={submitSearch}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              role="search"
              className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 pr-1.5 shadow-2xl"
            >
              <Search size={20} className="ml-4 shrink-0 text-stone-400" />
              <input
                aria-label="Search places"
                placeholder="Search beaches, culture, nature, and local places..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
              />
              <Button type="submit" className="shrink-0">
                Search
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Button to="/explore" size="lg">
                Explore Places <ArrowRight size={18} />
              </Button>
              <Link
                to="/planner"
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition-all hover:scale-[1.02] hover:bg-white/20"
              >
                <MapPinned size={18} />
                Create Itinerary
              </Link>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                { value: loading ? '—' : places.length, label: 'featured places' },
                { value: loading ? '—' : categories.length, label: 'live categories' },
                { value: 'API', label: 'driven travel data' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur">
                  <strong className="block text-xl font-bold text-white">{stat.value}</strong>
                  <span className="text-xs font-medium uppercase tracking-wide text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      <main id="main-content" className="shell pb-16">
        <section className="py-16">
          <div className="mb-8">
            <p className="kicker">Category Explorer</p>
            <h2 className="heading-2 mt-2">Start with the kind of day you want.</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl bg-stone-200/70" />
              ))}
            </div>
          ) : (
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
              {children.map((category) => (
                <Link
                  key={category.id}
                  to={`/explore?category=${category.slug}`}
                  className="group min-w-[150px] snap-start rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-stone-300 hover:shadow-md"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-transform group-hover:scale-110">
                    <CategoryGlyph icon={category.icon} size={22} />
                  </span>
                  <strong className="mt-3 block text-sm font-semibold leading-snug">{category.name}</strong>
                  <small className="mt-1 line-clamp-2 block text-xs text-stone-400">{category.description}</small>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Featured Destinations</p>
              <h2 className="heading-2 mt-2">Places ready for today.</h2>
              <p className="mt-2 max-w-xl text-stone-500">Curated from places currently marked as featured in the live catalogue.</p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700">
              Browse all places <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8">
            {loading ? (
              <PlaceGridSkeleton />
            ) : error ? (
              <AsyncState message={error} tone="error" actionLabel="Retry" onAction={() => window.location.reload()} />
            ) : places.length === 0 ? (
              <AsyncState message="No featured places available right now." />
            ) : (
              <PlaceGrid places={places} selectedIds={placeIds} onTogglePlan={(id) => addPlace(id)} />
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: <Compass size={22} />, title: 'Explore', body: 'Find verified local attractions and hidden stops around your region.' },
              { icon: <MapPinned size={22} />, title: 'Plan', body: 'Create your perfect day trip with a realistic itinerary preview.' },
              { icon: <Heart size={22} />, title: 'Save', body: 'Keep favourite places and saved plans tied to your account.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-stone-200 bg-white p-7 shadow-xs"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-stone-500">{feature.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Map Preview</p>
              <h2 className="heading-2 mt-2">See where your day can take you.</h2>
              <p className="mt-2 max-w-xl text-stone-500">Live markers straight from the same place API used across the whole app.</p>
            </div>
            <Button to="/map" variant="outline" size="lg">
              Open Full Map
            </Button>
          </div>
          <div className="mt-8 h-[440px]">
            <TouristMap places={mapPlaces} center={[7.4129, 81.8271]} zoom={12} />
          </div>
        </section>
      </main>
    </>
  )
}
