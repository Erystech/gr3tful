import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

// Mock AuthContext so we control the session value
vi.mock('../components/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../components/context/AuthContext'

const Wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/journal']}>{children}</MemoryRouter>
)

describe('ProtectedRoute', () => {
  it('renders a loading indicator while session is undefined', () => {
    useAuth.mockReturnValue({ session: undefined })
    render(
      <Wrapper>
        <ProtectedRoute><p>Protected content</p></ProtectedRoute>
      </Wrapper>
    )
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('redirects to /login when session is null', () => {
    useAuth.mockReturnValue({ session: null })
    render(
      <Wrapper>
        <ProtectedRoute><p>Protected content</p></ProtectedRoute>
      </Wrapper>
    )
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders children when a session exists', () => {
    useAuth.mockReturnValue({ session: { user: { id: 'abc' } } })
    render(
      <Wrapper>
        <ProtectedRoute><p>Protected content</p></ProtectedRoute>
      </Wrapper>
    )
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})