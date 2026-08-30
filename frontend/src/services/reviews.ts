import { apiJson, type ApiEnvelope } from '@/services/http'
import type { PlaceReview } from '@/types/place'

export function getReviews(placeId: number) {
  return apiJson<ApiEnvelope<PlaceReview[]>>(`/places/${placeId}/reviews`)
}

export function createReview(placeId: number, payload: { rating: number; comment: string }, token: string) {
  return apiJson<ApiEnvelope<PlaceReview>>(`/places/${placeId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, token)
}

