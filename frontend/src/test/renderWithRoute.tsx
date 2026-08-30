import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'

export function renderWithRoute(element: ReactElement, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="*" element={element} />
        <Route path="/places/:slug" element={element} />
      </Routes>
    </MemoryRouter>,
  )
}
