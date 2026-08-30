import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PlaceDetailPage } from '@/pages/PlaceDetailPage'

const { getPlaceBySlug, getReviews, getFavourites, addFavourite, removeFavourite, createReview, addPlace } = vi.hoisted(() => ({
  getPlaceBySlug: vi.fn(),
  getReviews: vi.fn(),
  getFavourites: vi.fn(),
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
  createReview: vi.fn(),
  addPlace: vi.fn(),
}))

vi.mock('@/services/places', () => ({
  getPlaceBySlug,
}))

vi.mock('@/services/reviews', () => ({
  getReviews,
  createReview,
}))

vi.mock('@/services/favourites', () => ({
  getFavourites,
  addFavourite,
  removeFavourite,
}))

vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({ user: { id: 1, name: 'User', role: 'user' }, token: 'token' }),
}))

vi.mock('@/store/planner', () => ({
  usePlannerStore: (selector: (state: { addPlace: typeof addPlace }) => unknown) =>
    selector({ addPlace }),
}))

describe('PlaceDetailPage', () => {
  beforeEach(() => {
    getPlaceBySlug.mockResolvedValue({
      data: {
        id: 10,
        name: 'Emerald Coast',
        slug: 'emerald-coast',
        short_description: 'Calm coastline',
        full_description: 'A calm coastline for a day trip.',
        address: 'Beach road',
        latitude: 6.1,
        longitude: 80.2,
        distance_from_home: 8.4,
        opening_time: '06:00',
        closing_time: '18:00',
        visit_duration_minutes: 90,
        travel_tips: 'Bring water',
        status: 'active',
        is_featured: true,
        average_rating: 4.6,
        category: { id: 1, name: 'Beach', slug: 'beach' },
        images: [],
        facilities: [{ id: 1, name: 'Parking' }],
      },
    })
    getReviews.mockResolvedValue({
      data: [{ id: 1, rating: 5, comment: 'Great visit', status: 'approved', user: { id: 2, name: 'Asha' } }],
    })
    getFavourites.mockResolvedValue({ data: [] })
    createReview.mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads the selected place by slug from the API and allows planner action', async () => {
    render(
      <MemoryRouter initialEntries={['/places/emerald-coast']}>
        <Routes>
          <Route path="/places/:slug" element={<PlaceDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Emerald Coast')).toBeInTheDocument()
    await waitFor(() => expect(getPlaceBySlug).toHaveBeenCalledWith('emerald-coast'))
    expect(screen.getByText('Bring water')).toBeInTheDocument()
    expect(screen.getByText('Parking')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add to planner' }))
    expect(addPlace).toHaveBeenCalledWith(10)
  })
})
