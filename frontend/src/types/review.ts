import type { Place, PlaceReview } from './place'

export interface Review extends PlaceReview {
  place?: Place
}

