import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import { MarkerPopup } from '@/components/map/MarkerPopup'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/place'

const LeafletMap = MapContainer as never
const LeafletMarker = Marker as never
const LeafletPopup = Popup as never
const LeafletPolyline = Polyline as never

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
    <div className={cn('marker-bounce overflow-hidden rounded-[28px] border border-line', className)}>
      <LeafletMap center={center} zoom={zoom} className="z-0 h-full w-full" scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
        {route.length >= 2 ? <LeafletPolyline positions={route} pathOptions={{ color: '#0284c7', weight: 4, opacity: 0.8 }} /> : null}
      </LeafletMap>
    </div>
  )
}