import { createCommune, FormState } from '@/app/communes/new/actions'

// ---------------------------------------------------------------------------
// Module-level mock for @/lib/supabase/server
// ---------------------------------------------------------------------------

const mockInsert = jest.fn()
const mockFrom = jest.fn()
const mockGetUser = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

// next/navigation redirect throws in real Next.js; we just capture the call.
jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

const prev: FormState = { error: null }

function setupSupabase({
  user = { id: 'user-123' } as { id: string } | null,
  insertError = null as { message: string } | null,
} = {}) {
  mockInsert.mockResolvedValue({ error: insertError })
  mockFrom.mockReturnValue({ insert: mockInsert })
  mockGetUser.mockResolvedValue({ data: { user } })

  const fakeClient = {
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }
  ;(createClient as jest.Mock).mockResolvedValue(fakeClient)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createCommune — validation', () => {
  it('returns an error when name is missing', async () => {
    const result = await createCommune(prev, buildFormData({ name: '' }))
    expect(result).toEqual({ error: 'Name is required.' })
  })

  it('returns an error when name is whitespace only', async () => {
    const result = await createCommune(prev, buildFormData({ name: '   ' }))
    expect(result).toEqual({ error: 'Name is required.' })
  })

  it('returns an error when name exceeds 100 characters', async () => {
    const longName = 'a'.repeat(101)
    const result = await createCommune(prev, buildFormData({ name: longName }))
    expect(result).toEqual({ error: 'Name must be 100 characters or fewer.' })
  })

  it('does not call supabase when validation fails', async () => {
    await createCommune(prev, buildFormData({ name: '' }))
    expect(createClient).not.toHaveBeenCalled()
  })
})

describe('createCommune — auth check', () => {
  it('returns an error when no user is authenticated', async () => {
    setupSupabase({ user: null })
    const result = await createCommune(prev, buildFormData({ name: 'Valid Name' }))
    expect(result).toEqual({ error: 'You must be signed in to create a commune.' })
  })

  it('does not call insert when no user is authenticated', async () => {
    setupSupabase({ user: null })
    await createCommune(prev, buildFormData({ name: 'Valid Name' }))
    expect(mockInsert).not.toHaveBeenCalled()
  })
})

describe('createCommune — happy path', () => {
  it('calls insert with the correct payload when input is valid and user is authenticated', async () => {
    setupSupabase()
    const fd = buildFormData({
      name: 'Book Club',
      description: 'We read books.',
      category: 'Education',
      city: 'Berlin',
    })

    await expect(createCommune(prev, fd)).rejects.toThrow('NEXT_REDIRECT')

    expect(mockFrom).toHaveBeenCalledWith('communes')
    expect(mockInsert).toHaveBeenCalledWith({
      name: 'Book Club',
      description: 'We read books.',
      category: 'Education',
      city: 'Berlin',
      created_by: 'user-123',
    })
  })

  it('passes null for optional fields when they are omitted', async () => {
    setupSupabase()
    const fd = buildFormData({ name: 'Minimal Commune' })

    await expect(createCommune(prev, fd)).rejects.toThrow('NEXT_REDIRECT')

    expect(mockInsert).toHaveBeenCalledWith({
      name: 'Minimal Commune',
      description: null,
      category: null,
      city: null,
      created_by: 'user-123',
    })
  })

  it('returns a generic error when the database insert fails', async () => {
    setupSupabase({ insertError: { message: 'db error' } })
    const fd = buildFormData({ name: 'Book Club' })
    const result = await createCommune(prev, fd)
    expect(result).toEqual({ error: 'Something went wrong. Please try again.' })
  })
})
