import { create } from 'zustand'
import type { PreviewResult } from '@/types/tripPlan'

type PlannerState = {
  placeIds: number[]
  preview: PreviewResult | null
  addPlace: (placeId: number) => void
  removePlace: (placeId: number) => void
  togglePlace: (placeId: number) => void
  clearPlaces: () => void
  setPreview: (preview: PreviewResult | null) => void
}

export const usePlannerStore = create<PlannerState>((set) => ({
  placeIds: [],
  preview: null,
  addPlace: (placeId) =>
    set((state) =>
      state.placeIds.includes(placeId) ? state : { placeIds: [...state.placeIds, placeId] },
    ),
  removePlace: (placeId) =>
    set((state) => ({ placeIds: state.placeIds.filter((id) => id !== placeId) })),
  togglePlace: (placeId) =>
    set((state) => ({
      placeIds: state.placeIds.includes(placeId)
        ? state.placeIds.filter((id) => id !== placeId)
        : [...state.placeIds, placeId],
    })),
  clearPlaces: () => set({ placeIds: [], preview: null }),
  setPreview: (preview) => set({ preview }),
}))

