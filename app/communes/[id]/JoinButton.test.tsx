import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JoinButton from './JoinButton'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock Supabase client
const mockGetUser = jest.fn()
const mockInsert = jest.fn()
const mockFrom = jest.fn(() => ({ insert: mockInsert }))

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}))

const COMMUNE_ID = 'commune-123'

describe('JoinButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when user is already a member', () => {
    it('shows "You\'re a member" without a join button', () => {
      // Arrange & Act
      render(<JoinButton communeId={COMMUNE_ID} initialIsMember={true} />)

      // Assert
      expect(screen.getByText("You're a member")).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /join commune/i })).not.toBeInTheDocument()
    })
  })

  describe('when user is not a member', () => {
    it('shows the Join commune button', () => {
      // Arrange & Act
      render(<JoinButton communeId={COMMUNE_ID} initialIsMember={false} />)

      // Assert
      expect(screen.getByRole('button', { name: /join commune/i })).toBeInTheDocument()
      expect(screen.queryByText("You're a member")).not.toBeInTheDocument()
    })

    it('redirects to sign-in when user is not authenticated', async () => {
      // Arrange
      mockGetUser.mockResolvedValue({ data: { user: null } })
      render(<JoinButton communeId={COMMUNE_ID} initialIsMember={false} />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: /join commune/i }))

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          `/auth/sign-in?redirectTo=/communes/${COMMUNE_ID}`,
        )
      })
    })

    it('shows "You\'re a member" after successfully joining', async () => {
      // Arrange
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockInsert.mockResolvedValue({ error: null })
      render(<JoinButton communeId={COMMUNE_ID} initialIsMember={false} />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: /join commune/i }))

      // Assert
      await waitFor(() => {
        expect(screen.getByText("You're a member")).toBeInTheDocument()
      })
      expect(mockFrom).toHaveBeenCalledWith('members')
      expect(mockInsert).toHaveBeenCalledWith({
        commune_id: COMMUNE_ID,
        user_id: 'user-1',
      })
    })

    it('shows an error message when the insert fails', async () => {
      // Arrange
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockInsert.mockResolvedValue({ error: { message: 'DB error' } })
      render(<JoinButton communeId={COMMUNE_ID} initialIsMember={false} />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: /join commune/i }))

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: /join commune/i })).toBeInTheDocument()
    })

    it('disables the button while joining', async () => {
      // Arrange — never resolves so loading stays true
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
      mockInsert.mockReturnValue(new Promise(() => {}))
      render(<JoinButton communeId={COMMUNE_ID} initialIsMember={false} />)

      // Act
      await userEvent.click(screen.getByRole('button', { name: /join commune/i }))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /joining/i })).toBeDisabled()
      })
    })
  })
})
