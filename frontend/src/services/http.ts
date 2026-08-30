export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type ApiEnvelope<T> = { data: T }
export type PaginatedResponse<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export async function apiJson<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  const hasBody = options.body !== undefined && options.body !== null
  if (hasBody && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message =
      payload?.message ||
      (payload?.errors ? Object.values(payload.errors).flat().join(' ') : null) ||
      `Request failed with ${response.status}`
    throw new ApiError(response.status, message)
  }

  return payload as T
}

