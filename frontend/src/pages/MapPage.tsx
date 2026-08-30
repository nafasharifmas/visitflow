import { useEffect, useMemo, useState } from 'react'
import { Compass, LocateFixed, Search } from 'lucide-react'
import { divIcon } from 'leaflet'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import { AsyncState } from '@/components/AsyncState'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { getPlaces } from '@/services/places'
import { usePlannerStore } from '@/store/planner'
import type { Place } from '@/types/place'

const LeafletMapContainer = MapContainer as any
const LeafletTileLayer = TileLayer as any
const LeafletMarker = Marker as any
const LeafletPolyline = Polyline as any

const placeIcon = divIcon({ className: 'leaflet-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 24] })
const userIcon = divIcon({ className: 'leaflet-pin leaflet-pin-user', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 24] })

export function MapPage() {
  const preview = usePlannerStore((state) => state.preview)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [query, setQuery] = useState('')

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

  const routePoints = preview?.stops.map((stop) => [stop.place.latitude, stop.place.longitude] as [number, number]) ?? []
  const visiblePlaces = useMemo(
    () => places.filter((place) => place.name.toLowerCase().includes(query.toLowerCase())),
    [places, query],
  )

  return (
    <main className="h-[calc(100vh-4rem)] p-4">
      <div className="relative h-full overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
        <div className="absolute left-4 top-4 z-[500] w-72 overflow-hidden rounded-xl border border-stone-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <Compass size={16} className="text-brand-600" />
            <h2 className="font-semibold text-stone-900">Explore nearby</h2>
          </div>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search nearby places"
              className="h-10 w-full rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-medium text-stone-500">
            <span>{visiblePlaces.length} places</span>
            <span>{preview?.stops.length || 0} itinerary stops</span>
          </div>

          <Button
            variant="outline"
            className="mt-3 w-full"
            size="sm"
            onClick={() => {
              navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude])
              })
            }}
          >
            <LocateFixed size={14} /> Locate me
          </Button>

          <div className="mt-3 border-t border-stone-100 pt-3">
            {preview ? (
              <p className="text-xs text-stone-500">Showing the backend-ordered suggested route.</p>
            ) : (
              <p className="text-xs text-stone-500">Generate a planner preview to see a suggested path here.</p>
            )}
            <div className="mt-2 space-y-1.5">
              {visiblePlaces.slice(0, 5).map((place) => (
                <Link key={place.id} to={`/places/${place.slug}`} className="flex items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-stone-50">
                  <Avatar name={place.name} size={28} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-800">{place.name}</p>
                    <p className="truncate text-xs text-stone-400">{place.category.name} · {place.distance_from_home} km away</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-full"><AsyncState message="Loading places..." className="m-4 h-full" /></div>
        ) : error ? (
          <div className="h-full"><AsyncState message={error} tone="error" actionLabel="Retry" onAction={() => window.location.reload()} className="m-4 h-full" /></div>
        ) : (
          <LeafletMapContainer center={[7.4129, 81.8271]} zoom={12} className="h-full w-full" scrollWheelZoom>
            <LeafletTileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {visiblePlaces.map((place) => (
              <LeafletMarker key={place.id} position={[place.latitude, place.longitude]} icon={placeIcon}>
                <Popup>
                  <div className="w-44">
                    <strong className="block text-sm text-stone-900">{place.name}</strong>
                    <p className="text-xs text-stone-500">{place.category.name}</p>
                    <small className="text-stone-400">{place.distance_from_home} km away</small>
                    <Link to={`/places/${place.slug}`} className="mt-1 block text-xs font-semibold text-brand-600">
                      View details
                    </Link>
                  </div>
                </Popup>
              </LeafletMarker>
            ))}
            {userLocation ? (
              <LeafletMarker position={userLocation} icon={userIcon}>
                <Popup>Your current location</Popup>
              </LeafletMarker>
            ) : null}
            {routePoints.length >= 2 ? <LeafletPolyline positions={routePoints} pathOptions={{ color: '#4f46e5', weight: 4 }} /> : null}
          </LeafletMapContainer>
        )}
      </div>
    </main>
  )
}
