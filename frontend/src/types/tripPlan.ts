import type { Place } from './place'

export interface TripPlanItem {
  id: number
  place_id: number
  position: number
  planned_arrival_time?: string | null
  planned_departure_time?: string | null
  travel_minutes: number
  visit_minutes: number
  distance_from_previous: number
  place: Place
}

export interface TripPlan {
  id: number
  title: string
  travel_date: string
  start_latitude: number
  start_longitude: number
  start_address?: string | null
  start_time: string
  end_time: string
  total_distance: number
  total_travel_minutes: number
  items: TripPlanItem[]
  created_at?: string
  updated_at?: string
}

export interface PreviewStop {
  place: Place
  arrival_time: string
  departure_time: string
  distance_km: number
  travel_minutes: number
}

export interface PreviewResult {
  stops: PreviewStop[]
  skipped: Array<{ place: string; reason: string }>
  total_distance: number
  total_travel_minutes: number
}

