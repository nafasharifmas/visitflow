import { create } from 'zustand'
import { ApiError } from '@/services/http'
import * as authService from '@/services/auth'
import type { User } from '@/types/user'

type AuthState = {
  user: User | null
  token: string | null
  ready: boolean
  busy: boolean
  error: string | null
  bootstrap: () => Promise<void>
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>
  logout: () => Promise<void>
  clearAuth: () => void
}

const STORAGE_KEY = 'daybound-auth'
const DEMO_CREDENTIAL_HINT = 'Use user@example.com / Password123! or admin@example.com / Password123! if you are signing in with the seeded demo accounts.'

function readStoredAuth() {
  if (typeof window === 'undefined') return { token: null as string | null }
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as { token?: string | null } | null
  } catch {
    return { token: null }
  }
}

function persistAuth(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token }))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function formatAuthError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.message === 'Invalid credentials') {
      return `${error.message}. ${DEMO_CREDENTIAL_HINT}`
    }

    return error.message
  }

  return fallback
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  ready: false,
  busy: false,
  error: null,
  async bootstrap() {
    const stored = readStoredAuth()
    const token = stored?.token ?? null
    if (!token) {
      set({ ready: true, user: null, token: null, busy: false, error: null })
      return
    }

    set({ busy: true, error: null })
    try {
      const response = await authService.me(token)
      set({ user: response.data, token, ready: true, busy: false, error: null })
    } catch (error) {
      persistAuth(null)
      set({
        user: null,
        token: null,
        ready: true,
        busy: false,
        error: error instanceof ApiError ? error.message : 'Session expired',
      })
    }
  },
  async login(payload) {
    set({ busy: true, error: null })
    try {
      const response = await authService.login(payload)
      persistAuth(response.data.token)
      set({
        user: response.data.user,
        token: response.data.token,
        ready: true,
        busy: false,
        error: null,
      })
    } catch (error) {
      set({ busy: false, error: formatAuthError(error, 'Unable to sign in') })
      throw error
    }
  },
  async register(payload) {
    set({ busy: true, error: null })
    try {
      const response = await authService.register(payload)
      persistAuth(response.data.token)
      set({
        user: response.data.user,
        token: response.data.token,
        ready: true,
        busy: false,
        error: null,
      })
    } catch (error) {
      set({ busy: false, error: error instanceof ApiError ? error.message : 'Unable to create account' })
      throw error
    }
  },
  async logout() {
    const token = get().token
    if (token) {
      try {
        await authService.logout(token)
      } catch {
        // Clear the local session even if the token is already invalid.
      }
    }
    persistAuth(null)
    set({ user: null, token: null, error: null, busy: false, ready: true })
  },
  clearAuth() {
    persistAuth(null)
    set({ user: null, token: null, error: null, busy: false })
  },
}))