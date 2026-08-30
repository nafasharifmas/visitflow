import { apiJson, type ApiEnvelope } from '@/services/http'
import type { PreviewResult } from '@/types/tripPlan'

export type PreviewPayload = {
  place_ids: number[]
  start_latitude: number
  start_longitude: number
  start_time: string
  end_time: string
}

export function previewTrip(payload: PreviewPayload) {
  return apiJson<ApiEnvelope<PreviewResult>>('/trip-plans/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

