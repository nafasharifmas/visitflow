import { useEffect, useMemo, useState } from 'react'
import { Compass, Search } from 'lucide-react'
import { divIcon } from 'leaflet'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import { AsyncState } from '@/components/AsyncState'
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
    <main className="page shell-page">
      <div className="shell section-stack">
        <div className="section-heading section-heading-start">
          <div>
            <p className="kicker">LOCAL MAP</p>
            <h1>See what is nearby.</h1>
            <p>The map uses Leaflet and OpenStreetMap with markers created only from backend place coordinates.</p>
          </div>
        </div>

        <section className="map-shell premium-map-shell">
          <div className="map-panel floating-panel">
            <div className="panel-heading">
              <div>
                <p className="kicker">MAP CONTROLS</p>
                <h2>Search places</h2>
              </div>
            </div>
            <label className="field-group">
              <span>Keyword</span>
              <div className="field-inline">
                <Search size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nearby places" />
              </div>
            </label>
            <div className="map-stats">
              <span>{visiblePlaces.length} places</span>
              <span>{preview?.stops.length || 0} itinerary stops</span>
            </div>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  setUserLocation([position.coords.latitude, position.coords.longitude])
                })
              }}
            >
              <Compass size={14} /> Locate me
            </button>
            {preview ? <p>Suggested route is shown as a backend-ordered polyline.</p> : <p>Generate a planner preview to see a suggested path here.</p>}
            <div className="nearby-list">
              {visiblePlaces.slice(0, 5).map((place) => (
                <Link key={place.id} to={`/places/${place.slug}`} className="nearby-item">
                  <strong>{place.name}</strong>
                  <small>{place.category.name} · {place.distance_from_home} km away</small>
                </Link>
              ))}
            </div>
          </div>

          <div className="map-canvas premium-map-canvas">
            {loading ? (
              <div className="map-frame map-frame-empty"><AsyncState message="Loading places..." /></div>
            ) : error ? (
              <div className="map-frame map-frame-empty"><AsyncState message={error} tone="error" actionLabel="Retry" onAction={() => window.location.reload()} /></div>
            ) : (
              <LeafletMapContainer center={[7.4129, 81.8271]} zoom={12} className="leaflet-map" scrollWheelZoom>
                <LeafletTileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {visiblePlaces.map((place) => (
                  <LeafletMarker key={place.id} position={[place.latitude, place.longitude]} icon={placeIcon}>
                    <Popup>
                      <div className="map-popup">
                        <strong>{place.name}</strong>
                        <p>{place.category.name}</p>
                        <small>{place.distance_from_home} km away</small>
                        <Link to={`/places/${place.slug}`}>View details</Link>
                      </div>
                    </Popup>
                  </LeafletMarker>
                ))}
                {userLocation ? (
                  <LeafletMarker position={userLocation} icon={userIcon}>
                    <Popup>Your current location</Popup>
                  </LeafletMarker>
                ) : null}
                {routePoints.length >= 2 ? <LeafletPolyline positions={routePoints} pathOptions={{ color: '#0284c7', weight: 4 }} /> : null}
              </LeafletMapContainer>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}