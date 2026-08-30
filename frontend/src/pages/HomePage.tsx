import { motion } from 'framer-motion'
import { ArrowRight, Compass, Heart, MapPinned, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AsyncState } from '@/components/AsyncState'
import { PlaceGrid, PlaceGridSkeleton } from '@/components/place/PlaceGrid'
import { TouristMap } from '@/components/map/TouristMap'
import { Button } from '@/components/ui/Button'
import { CategoryGlyph } from '@/lib/categoryIcon'
import TouristScene from '@/components/three/TouristScene'
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
      <section className="relative flex min-h-[650px] items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={
            heroImage
              ? {
                  backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.78) 0%, rgba(15,23,42,0.55) 45%, rgba(2,132,199,0.35) 100%), url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,132,199,0.85),rgba(15,23,42,0.72)_50%,rgba(249,115,22,0.55))]" />

        <div className="shell relative z-10 grid items-center gap-10 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="text-white">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-ocean-200 backdrop-blur"
            >
              <Sparkles size={14} />
              Local tourism, designed like a product
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-6 text-[2.25rem] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[64px]"
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
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 pr-1 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            >
              <Search size={20} className="ml-4 shrink-0 text-muted" />
              <input
                aria-label="Search places"
                placeholder="Search beaches, culture, nature, and local places..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
              />
              <Button type="submit" className="shrink-0">
                Explore places
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-7 flex flex-wrap items-center gap-4"
            >
              <Button to="/explore" size="lg">
                Explore Places <ArrowRight size={18} />
              </Button>
              <Link
                to="/planner"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 text-[0.95rem] font-bold text-white backdrop-blur transition-all hover:scale-105 hover:bg-white/20"
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
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur">
                  <strong className="block text-xl font-extrabold">{stat.value}</strong>
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative hidden h-[420px] lg:block"
          >
            <div className="animate-[float_7s_ease-in-out_infinite] absolute inset-0 overflow-hidden rounded-[32px] border border-white/25 bg-white/10 shadow-[0_40px_90px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <div className="absolute inset-0">
                <TouristScene />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4">
                <p className="text-sm font-semibold text-white">Your local day trip, visualised</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
      </section>

      <main id="main-content" className="shell pb-16">
        <section className="py-16">
          <div className="mb-8">
            <p className="kicker">CATEGORY EXPLORER</p>
            <h2 className="heading-2 mt-2">Start with the kind of day you want.</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-3xl bg-slate-200/70" />
              ))}
            </div>
          ) : (
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
              {children.map((category) => (
                <Link
                  key={category.id}
                  to={`/explore?category=${category.slug}`}
                  className="group min-w-[150px] snap-start rounded-3xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ocean-50 to-nature-50 text-ocean-600 transition-transform group-hover:scale-110">
                    <CategoryGlyph icon={category.icon} size={22} />
                  </span>
                  <strong className="mt-3 block text-sm font-bold leading-snug">{category.name}</strong>
                  <small className="mt-1 line-clamp-2 block text-xs text-muted">{category.description}</small>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">FEATURED DESTINATIONS</p>
              <h2 className="heading-2 mt-2">Places ready for today.</h2>
              <p className="mt-2 max-w-xl text-muted">Curated from places currently marked as featured in the live catalogue.</p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-bold text-ocean-600 hover:text-ocean-700">
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
                className="rounded-[20px] border border-line bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.07)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-ocean-50 to-sunset-50 text-ocean-600">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{feature.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">MAP PREVIEW</p>
              <h2 className="heading-2 mt-2">See where your day can take you.</h2>
              <p className="mt-2 max-w-xl text-muted">Live markers straight from the same place API used across the whole app.</p>
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