import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, Clock, Heart, MapPinned, MapPin, Star } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AsyncState } from '@/components/AsyncState'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field } from '@/components/ui/Field'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
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
    return <main className="shell py-10"><AsyncState message="Loading place details..." /></main>
  }

  if (error || !place) {
    return <main className="shell py-10"><AsyncState message={error || 'Unable to load this place.'} tone="error" /></main>
  }

  const currentPlace = place
  const heroImage = currentPlace.images[0]?.image_url

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
    <main>
      <div
        className="relative h-72 w-full sm:h-96"
        style={
          heroImage
            ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell pb-6">
            <Link to="/explore" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white">
              <ArrowLeft size={16} /> Back to explore
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">{currentPlace.category.name}</Badge>
              <Badge variant="dark" className="inline-flex items-center gap-1"><MapPinned size={12} /> {currentPlace.distance_from_home} km away</Badge>
              {Number(currentPlace.average_rating || 0) > 0 ? (
                <Badge variant="warning" className="inline-flex items-center gap-1"><Star size={12} fill="currentColor" /> {Number(currentPlace.average_rating).toFixed(1)}</Badge>
              ) : null}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{currentPlace.name}</h1>
          </div>
        </div>
      </div>

      <div className="shell py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <section>
              <p className="leading-relaxed text-stone-600 text-lg">
                {currentPlace.full_description || currentPlace.short_description}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Clock size={18} /></span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Opening hours</p>
                    <p className="mt-0.5 text-sm font-medium text-stone-900">{currentPlace.opening_time} - {currentPlace.closing_time}</p>
                    <p className="text-xs text-stone-500">Suggested stay: {currentPlace.visit_duration_minutes} minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><MapPin size={18} /></span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Location</p>
                    <p className="mt-0.5 text-sm font-medium text-stone-900">{currentPlace.address}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="heading-3 mb-3">Facilities</h2>
              {currentPlace.facilities.length === 0 ? (
                <p className="text-sm text-stone-500">No facility information available.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentPlace.facilities.map((facility) => (
                    <span key={facility.id} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600">{facility.name}</span>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="heading-3 mb-1">Visitor tips</h2>
              <p className="text-stone-600">{currentPlace.travel_tips || 'Check local guidance before visiting.'}</p>
            </section>

            <section>
              <h2 className="heading-3 mb-4">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-stone-500">No approved reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <Card key={review.id} padding="md">
                      <div className="flex items-center gap-3">
                        <Avatar name={review.user?.name || 'Visitor'} size={36} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-stone-900">{review.user?.name || 'Visitor'}</p>
                          <p className="inline-flex items-center gap-1 text-xs text-warning-500">
                            {Array.from({ length: review.rating }).map((_, index) => (
                              <Star key={index} size={12} fill="currentColor" />
                            ))}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-stone-600">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              )}

              <form className="mt-6 rounded-2xl border border-stone-200 bg-white p-6" onSubmit={handleReviewSubmit}>
                <h3 className="mb-4 font-semibold text-stone-900">{user ? 'Write a review' : 'Sign in to review'}</h3>
                <div className="space-y-4">
                  <Field htmlFor="rating" label="Rating">
                    <Select id="rating" value={reviewForm.rating} onChange={(event) => setReviewForm((state) => ({ ...state, rating: event.target.value }))}>
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} / 5</option>
                      ))}
                    </Select>
                  </Field>
                  <Field htmlFor="comment" label="Comment">
                    <Textarea id="comment" value={reviewForm.comment} onChange={(event) => setReviewForm((state) => ({ ...state, comment: event.target.value }))} rows={4} placeholder="Share your experience..." />
                  </Field>
                  <Button type="submit" disabled={busy || !reviewForm.comment.trim()}>
                    {user ? 'Submit review' : 'Sign in to review'}
                  </Button>
                </div>
              </form>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card padding="lg" className="lg:shadow-md">
              <h3 className="font-semibold text-stone-900">Plan your visit</h3>
              <p className="mt-1.5 text-sm text-stone-500">Add this place to your one-day itinerary.</p>
              <div className="mt-5 space-y-3">
                <Button className="w-full" size="lg" onClick={() => addPlace(currentPlace.id)}>
                  Add to planner
                </Button>
                <Button variant={isFavourite ? 'secondary' : 'outline'} className="w-full" size="lg" onClick={handleFavourite} disabled={busy}>
                  <Heart size={16} fill={isFavourite ? 'currentColor' : 'none'} />
                  {isFavourite ? 'Saved to favourites' : 'Save favourite'}
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
