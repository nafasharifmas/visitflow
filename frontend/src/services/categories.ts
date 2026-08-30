import { apiJson, type ApiEnvelope } from '@/services/http'
import type { Category } from '@/types/category'

export function getCategories() {
  return apiJson<ApiEnvelope<Category[]>>('/categories')
}

