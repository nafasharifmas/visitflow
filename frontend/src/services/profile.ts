import { apiJson, type ApiEnvelope } from '@/services/http'
import type { User } from '@/types/user'

export function getProfile(token: string) {
  return apiJson<ApiEnvelope<User>>('/profile', {}, token)
}

export function updateProfile(payload: { name: string; phone?: string | null }, token: string) {
  return apiJson<ApiEnvelope<User>>('/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, token)
}

