import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Heart, MapPinned, Star } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { addFavourite, getFavourites, removeFavourite } from '@/services/favourites'
import { getPlaceBySlug } from '@/services/places'
import { createReview, getReviews } from '@/services/reviews'
import { useAuthStore } from '@/store/auth'
import { usePlannerStore } from '@/store/planner'
import type { Place, PlaceReview } from '@/types/place'

export function PlaceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const addPlace = usePlannerStore((state) => state.addPlace)
  const [place, setPlace] = useState<Place | null>(null)
  const [reviews, setReviews] = useState<PlaceReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' })

  useEffect(() => {
    if (!slug) return

    void (async () => {
      try {
        setLoading(true)
        setError(null)
        const placeResponse = await getPlaceBySlug(slug)
        setPlace(placeResponse.data)
        const reviewResponse = await getReviews(placeResponse.data.id)
        setReviews(reviewResponse.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load this place.')
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  useEffect(() => {
    if (!token || !place) {
      setIsFavourite(false)
      return
    }

    void (async () => {
      try {
        const response = await getFavourites(token)
        setIsFavourite(response.data.some((item) => item.id === place.id))
      } catch {
        setIsFavourite(false)
      }
    })()
  }, [token, place])

  if (loading) {
    return <main className="page"><AsyncState message="Loading place details..." /></main>
  }

  if (error || !place) {
    return <main className="page"><AsyncState message={error || 'Unable to load this place.'} tone="error" /></main>
  }

  const currentPlace = place

  async function handleFavourite() {
    if (!token) {
      navigate('/login')
      return
    }

    setBusy(true)
    try {
      if (isFavourite) {
        await removeFavourite(currentPlace.id, token)
        setIsFavourite(false)
      } else {
        await addFavourite(currentPlace.id, token)
        setIsFavourite(true)
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to update favourite.')
    } finally {
      setBusy(false)
    }
  }

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) {
      navigate('/login')
      return
    }

    setBusy(true)
    try {
      await createReview(currentPlace.id, { rating: Number(reviewForm.rating), comment: reviewForm.comment }, token)
      const response = await getReviews(currentPlace.id)
      setReviews(response.data)
      setReviewForm({ rating: '5', comment: '' })
      toast.success('Review submitted for approval.')
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Unable to submit review.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page">
      <Link to="/explore">Back to explore</Link>
      <section className="detail">
        <div
          className="detail-image"
          style={currentPlace.images[0]?.image_url ? {
            backgroundImage: `linear-gradient(rgba(24,93,76,.18), rgba(24,93,76,.18)), url(${currentPlace.images[0].image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        />
        <div>
          <p className="kicker">{currentPlace.category.name} · {currentPlace.distance_from_home} KM AWAY</p>
          <h1>{currentPlace.name}</h1>
          <p className="lead">{currentPlace.full_description || currentPlace.short_description}</p>
          <p>
            <b>Open:</b> {currentPlace.opening_time} - {currentPlace.closing_time} · <b>Suggested stay:</b>{' '}
            {currentPlace.visit_duration_minutes} minutes
          </p>
          <p>
            <b>Location:</b> {currentPlace.address}
          </p>
          <p>
            <b>Visitor tips:</b> {currentPlace.travel_tips || 'Check local guidance before visiting.'}
          </p>
          <div className="detail-metrics">
            <span><MapPinned size={14} /> {currentPlace.latitude}, {currentPlace.longitude}</span>
            <span><Star size={14} fill="currentColor" /> {Number(currentPlace.average_rating || 0).toFixed(1)}</span>
          </div>
          <p className="actions">
            <button type="button" className="primary" onClick={() => addPlace(currentPlace.id)}>
              Add to planner
            </button>
            <button type="button" className="secondary" onClick={handleFavourite} disabled={busy}>
              <Heart size={14} fill={isFavourite ? 'currentColor' : 'none'} />
              {isFavourite ? 'Saved' : 'Save favourite'}
            </button>
          </p>
        </div>
      </section>

      <section className="detail-section">
        <h2>Facilities</h2>
        {currentPlace.facilities.length === 0 ? (
          <p>No facility information available.</p>
        ) : (
          <div className="chip-row">
            {currentPlace.facilities.map((facility) => (
              <span key={facility.id} className="chip">{facility.name}</span>
            ))}
          </div>
        )}
      </section>

      <section className="detail-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No approved reviews yet.</p>
        ) : (
          <div className="stack-list">
            {reviews.map((review) => (
              <article key={review.id} className="panel">
                <strong>{review.user?.name || 'Visitor'}</strong>
                <p>{review.comment}</p>
                <small>Rating: {review.rating}/5</small>
              </article>
            ))}
          </div>
        )}

        <form className="auth-form" onSubmit={handleReviewSubmit}>
          <label>
            Rating
            <select value={reviewForm.rating} onChange={(event) => setReviewForm((state) => ({ ...state, rating: event.target.value }))}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Comment
            <textarea value={reviewForm.comment} onChange={(event) => setReviewForm((state) => ({ ...state, comment: event.target.value }))} rows={4} />
          </label>
          <button className="primary" type="submit" disabled={busy || !reviewForm.comment.trim()}>
            {user ? 'Submit review' : 'Sign in to review'}
          </button>
        </form>
      </section>
    </main>
  )
}

