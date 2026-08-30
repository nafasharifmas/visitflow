import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlannerPage } from '@/pages/PlannerPage'

const { getPlaces, previewTrip, createTripPlan, navigate } = vi.hoisted(() => ({
  getPlaces: vi.fn(),
  previewTrip: vi.fn(),
  createTripPlan: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock('@/services/places', () => ({
  getPlaces,
}))

vi.mock('@/services/planner', () => ({
  previewTrip,
}))

vi.mock('@/services/tripPlans', () => ({
  createTripPlan,
}))

vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    user: { id: 1, name: 'User', role: 'user' },
    token: 'token',
  }),
}))

vi.mock('@/store/planner', () => ({
  usePlannerStore: () => ({
    placeIds: [10],
    togglePlace: vi.fn(),
    removePlace: vi.fn(),
    clearPlaces: vi.fn(),
    preview: {
      stops: [
        {
          place: {
            id: 10,
            name: 'Emerald Coast',
            slug: 'emerald-coast',
            short_description: 'Calm coastline',
            address: 'Beach road',
            latitude: 6.1,
            longitude: 80.2,
            distance_from_home: 8.4,
            opening_time: '06:00',
            closing_time: '18:00',
            visit_duration_minutes: 90,
            status: 'active',
            is_featured: true,
            category: { id: 1, name: 'Beach', slug: 'beach' },
            images: [],
            facilities: [],
          },
          arrival_time: '08:30',
          departure_time: '10:00',
          distance_km: 8.4,
          travel_minutes: 30,
        },
      ],
      skipped: [],
      total_distance: 8.4,
      total_travel_minutes: 30,
    },
    setPreview: vi.fn(),
  }),
}))

describe('PlannerPage', () => {
  beforeEach(() => {
    getPlaces.mockResolvedValue({
      data: [
        {
          id: 10,
          name: 'Emerald Coast',
          slug: 'emerald-coast',
          short_description: 'Calm coastline',
          full_description: 'Calm coastline',
          address: 'Beach road',
          latitude: 6.1,
          longitude: 80.2,
          distance_from_home: 8.4,
          opening_time: '06:00',
          closing_time: '18:00',
          visit_duration_minutes: 90,
          status: 'active',
          is_featured: true,
          average_rating: 4.5,
          category: { id: 1, name: 'Beach', slug: 'beach' },
          images: [],
          facilities: [],
        },
      ],
    })
    createTripPlan.mockResolvedValue({ data: { id: 1 } })
    previewTrip.mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('saves the previewed itinerary through the trip plan API', async () => {
    render(
      <MemoryRouter>
        <PlannerPage />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Build a better day out.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save plan/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Save plan' }))

    await waitFor(() => expect(createTripPlan).toHaveBeenCalled())
    expect(navigate).toHaveBeenCalledWith('/saved-trips')
  })
})
