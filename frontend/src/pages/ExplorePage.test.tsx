import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ExplorePage } from '@/pages/ExplorePage'

const { getCategories, getPlaces } = vi.hoisted(() => ({
  getCategories: vi.fn(),
  getPlaces: vi.fn(),
}))

vi.mock('@/services/categories', () => ({
  getCategories,
}))

vi.mock('@/services/places', () => ({
  getPlaces,
}))

vi.mock('@/store/planner', () => ({
  usePlannerStore: (selector: (state: { addPlace: (placeId: number) => void; placeIds: number[] }) => unknown) =>
    selector({ addPlace: vi.fn(), placeIds: [] }),
}))

describe('ExplorePage', () => {
  beforeEach(() => {
    getCategories.mockResolvedValue({
      data: [
        { id: 1, name: 'Beach', slug: 'beach' },
        { id: 2, name: 'Nature', slug: 'nature' },
      ],
    })
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
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads catalogue results from the API using route criteria', async () => {
    render(
      <MemoryRouter initialEntries={['/explore?search=coast&category=beach']}>
        <ExplorePage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(getPlaces).toHaveBeenCalledWith({
        search: 'coast',
        category: 'beach',
        perPage: 24,
      })
    })

    expect(await screen.findByText('Emerald Coast')).toBeInTheDocument()
    expect(screen.getByText('1 places found')).toBeInTheDocument()
  })
})
