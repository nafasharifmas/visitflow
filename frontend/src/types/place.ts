import type { Category } from './category'
import type { User } from './user'

export interface PlaceImage {
  id: number
  image_url: string
  alt_text?: string | null
  is_primary: boolean
  sort_order: number
}

export interface PlaceFacility {
  id: number
  name: string
  icon?: string | null
}

export interface Place {
  id: number
  name: string
  slug: string
  short_description: string
  full_description?: string | null
  address: string
  latitude: number
  longitude: number
  distance_from_home: number
  opening_time: string
  closing_time: string
  visit_duration_minutes: number
  travel_tips?: string | null
  status: string
  is_featured: boolean
  average_rating?: number | null
  view_count?: number
  category: Category
  images: PlaceImage[]
  facilities: PlaceFacility[]
}

export interface PlaceReview {
  id: number
  rating: number
  comment: string
  status: string
  user?: Pick<User, 'id' | 'name'>
  created_at?: string
  updated_at?: string
}

