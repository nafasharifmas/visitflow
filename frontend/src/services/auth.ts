import { apiJson, type ApiEnvelope } from '@/services/http'
import type { User } from '@/types/user'

export type AuthResponse = ApiEnvelope<{
  user: User
  token: string
}>

export type MeResponse = ApiEnvelope<User>

export function login(payload: { email: string; password: string }) {
  return apiJson<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function register(payload: {
  name: string
  email: string
  password: string
  password_confirmation: string
}) {
  return apiJson<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function me(token: string) {
  return apiJson<MeResponse>('/auth/me', {}, token)
}

export function logout(token: string) {
  return apiJson<void>('/auth/logout', { method: 'POST' }, token)
}

