import { apiJson, type ApiEnvelope } from '@/services/http'
import type { TripPlan } from '@/types/tripPlan'

export type TripPlanPayload = {
  title: string
  travel_date: string
  start_latitude: number
  start_longitude: number
  start_address?: string
  start_time: string
  end_time: string
  total_distance?: number
  total_travel_minutes?: number
  items: Array<{
    place_id: number
    position: number
    planned_arrival_time?: string
    planned_departure_time?: string
    travel_minutes?: number
    visit_minutes?: number
    distance_from_previous?: number
  }>
}

export function getTripPlans(token: string) {
  return apiJson<ApiEnvelope<TripPlan[]>>('/trip-plans', {}, token)
}

export function getTripPlan(id: number, token: string) {
  return apiJson<ApiEnvelope<TripPlan>>(`/trip-plans/${id}`, {}, token)
}

export function createTripPlan(payload: TripPlanPayload, token: string) {
  return apiJson<ApiEnvelope<TripPlan>>('/trip-plans', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token)
}

export function updateTripPlan(id: number, payload: Partial<TripPlanPayload>, token: string) {
  return apiJson<ApiEnvelope<TripPlan>>(`/trip-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token)
}

export function deleteTripPlan(id: number, token: string) {
  return apiJson<void>(`/trip-plans/${id}`, { method: 'DELETE' }, token)
}

