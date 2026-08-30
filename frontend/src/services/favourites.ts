import { apiJson, type ApiEnvelope } from '@/services/http'
import type { Place } from '@/types/place'

export function getFavourites(token: string) {
  return apiJson<ApiEnvelope<Place[]>>('/favourites', {}, token)
}

export function addFavourite(placeId: number, token: string) {
  return apiJson<{ message: string }>(`/favourites/${placeId}`, { method: 'POST' }, token)
}

export function removeFavourite(placeId: number, token: string) {
  return apiJson<void>(`/favourites/${placeId}`, { method: 'DELETE' }, token)
}

