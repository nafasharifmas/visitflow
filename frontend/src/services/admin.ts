import { apiJson, type ApiEnvelope } from '@/services/http'
import type { Category } from '@/types/category'
import type { Place, PlaceFacility } from '@/types/place'
import type { User } from '@/types/user'

export type AdminOverview = ApiEnvelope<{
  users_total: number
  admins_total: number
  active_places: number
  featured_places: number
  pending_reviews: number
  approved_reviews: number
  categories_total: number
  trip_plans_total: number
  favourites_total: number
  recent_places: Array<{ id: number; name: string; slug: string; status: string }>
  recent_users: Array<{ id: number; name: string; email: string; role: string }>
}>

export type AdminPlacesResponse = {
  data: Place[]
  meta: {
    categories: Category[]
    facilities: PlaceFacility[]
  }
}

export type AdminUsersResponse = ApiEnvelope<User[]>

export type AdminPlacePayload = {
  category_id: number
  name: string
  slug: string
  short_description: string
  full_description?: string
  address: string
  latitude: number
  longitude: number
  distance_from_home: number
  opening_time: string
  closing_time: string
  visit_duration_minutes: number
  travel_tips?: string
  status: 'active' | 'inactive'
  is_featured: boolean
  facilities: number[]
  images: Array<{
    image_url: string
    alt_text?: string
    is_primary?: boolean
    sort_order?: number
  }>
}

export function getAdminOverview(token: string) {
  return apiJson<AdminOverview>('/admin/overview', {}, token)
}

export function getAdminPlaces(token: string) {
  return apiJson<AdminPlacesResponse>('/admin/places', {}, token)
}

export function createAdminPlace(payload: AdminPlacePayload, token: string) {
  return apiJson<ApiEnvelope<Place>>('/admin/places', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token)
}

export function updateAdminPlace(id: number, payload: AdminPlacePayload, token: string) {
  return apiJson<ApiEnvelope<Place>>(`/admin/places/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token)
}

export function deleteAdminPlace(id: number, token: string) {
  return apiJson<void>(`/admin/places/${id}`, { method: 'DELETE' }, token)
}

export function getAdminUsers(token: string) {
  return apiJson<AdminUsersResponse>('/admin/users', {}, token)
}

export function updateAdminUser(
  id: number,
  payload: { name: string; email: string; role: 'admin' | 'user'; status: 'active' | 'inactive'; phone?: string; profile_image?: string },
  token: string,
) {
  return apiJson<ApiEnvelope<User>>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token)
}

