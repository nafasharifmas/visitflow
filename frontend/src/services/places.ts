import { apiJson, type ApiEnvelope, type PaginatedResponse } from '@/services/http'
import type { Place } from '@/types/place'

export type PlaceQuery = {
  search?: string
  category?: string
  featured?: boolean
  perPage?: number
  sort?: string
}

function toQuery(params: PlaceQuery) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.featured !== undefined) query.set('featured', String(params.featured))
  if (params.perPage) query.set('per_page', String(params.perPage))
  if (params.sort) query.set('sort', params.sort)
  const text = query.toString()
  return text ? `?${text}` : ''
}

export function getPlaces(params: PlaceQuery = {}) {
  return apiJson<PaginatedResponse<Place>>(`/places${toQuery(params)}`)
}

export function getFeaturedPlaces() {
  return apiJson<ApiEnvelope<Place[]>>('/places/featured')
}

export function getPlaceBySlug(slug: string) {
  return apiJson<ApiEnvelope<Place>>(`/places/${slug}`)
}

