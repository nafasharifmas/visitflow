import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import { MarkerPopup } from '@/components/map/MarkerPopup'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

const LeafletMap = MapContainer as any
const LeafletMarker = Marker as any
const LeafletPopup = Popup as any
const LeafletPolyline = Polyline as any
const LeafletTileLayer = TileLayer as any

const placeIcon = divIcon({ className: '', html: '<span class="vf-pin"></span>', iconSize: [26, 26], iconAnchor: [13, 26] })
const userIcon = divIcon({ className: '', html: '<span class="vf-pin vf-pin-user"></span>', iconSize: [26, 26], iconAnchor: [13, 26] })

type RoutePoint = [number, number]

export type TouristMapProps = {
  places?: Place[]
  center?: [number, number]
  zoom?: number
  routePoints?: RoutePoint[]
  userLocation?: RoutePoint | null
  className?: string
}

export function TouristMap({ places = [], center, zoom = 12, routePoints = [], userLocation, className }: TouristMapProps) {
  const route = routePoints.filter((point): point is RoutePoint => Array.isArray(point))

  return (
    <div className={cn('marker-bounce overflow-hidden rounded-2xl border border-stone-200', className)}>
      <LeafletMap center={center} zoom={zoom} className="z-0 h-full w-full" scrollWheelZoom>
        <LeafletTileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {places.map((place) => (
          <LeafletMarker key={place.id} position={[place.latitude, place.longitude]} icon={placeIcon}>
            <LeafletPopup offset={[0, -12]}>
              <MarkerPopup place={place} />
            </LeafletPopup>
          </LeafletMarker>
        ))}
        {userLocation ? (
          <LeafletMarker position={userLocation} icon={userIcon}>
            <LeafletPopup offset={[0, -12]}>Your current location</LeafletPopup>
          </LeafletMarker>
        ) : null}
        {route.length >= 2 ? <LeafletPolyline positions={route} pathOptions={{ color: '#4f46e5', weight: 4, opacity: 0.8 }} /> : null}
      </LeafletMap>
    </div>
  )
}