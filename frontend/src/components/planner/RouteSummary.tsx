import { CalendarDays, Clock3, MapPinned, Route } from 'lucide-react'
import { Card } from '@/components/ui/Card'

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card className="p-4">
      <span className="flex items-center gap-1 text-xs font-semibold text-muted">
        {icon}
        {label}
      </span>
      <strong className="mt-1.5 block text-lg font-extrabold">{value}</strong>
    </Card>
  )
}

export function RouteSummary({
  totalDistance,
  totalTravelMinutes,
  stops,
  skipped,
}: {
  totalDistance: number
  totalTravelMinutes: number
  stops: number
  skipped: number
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat icon={<Route size={14} className="text-ocean-600" />} label="Total distance" value={`${totalDistance} km`} />
      <Stat icon={<Clock3 size={14} className="text-ocean-600" />} label="Travel time" value={`${totalTravelMinutes} mins`} />
      <Stat icon={<CalendarDays size={14} className="text-ocean-600" />} label="Confirmed stops" value={stops} />
      <Stat icon={<MapPinned size={14} className="text-ocean-600" />} label="Skipped stops" value={skipped} />
    </div>
  )
}