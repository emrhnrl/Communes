import { updateCommune, deleteCommune, FormState } from '@/app/communes/[id]/edit/actions'

// ---------------------------------------------------------------------------
// Module-level mock for @/lib/supabase/server
// ---------------------------------------------------------------------------

const mockEqCreatedBy = jest.fn()
const mockEqId = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
const mockFrom = jest.fn()
const mockGetUser = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

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
const COMMUNE_ID = 'commune-abc'
const USER_ID = 'user-xyz'

/**
 * Wire up the chainable Supabase query builder for `.update()` / `.delete()`
 * calls that end with `.eq('id', ...).eq('created_by', ...)`.
 */
function setupSupabase({
  user = { id: USER_ID } as { id: string } | null,
  mutationError = null as { message: string } | null,
} = {}) {
  mockGetUser.mockResolvedValue({ data: { user } })

  // .update(...).eq('id', ...).eq('created_by', ...)
  mockEqCreatedBy.mockResolvedValue({ error: mutationError })
  mockEqId.mockReturnValue({ eq: mockEqCreatedBy })
  mockUpdate.mockReturnValue({ eq: mockEqId })

  // .delete().eq('id', ...).eq('created_by', ...)
  mockDelete.mockReturnValue({ eq: mockEqId })

  mockFrom.mockReturnValue({
    update: mockUpdate,
    delete: mockDelete,
  })

  const fakeClient = {
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }
  ;(createClient as jest.Mock).mockResolvedValue(fakeClient)
}

// ---------------------------------------------------------------------------
// updateCommune tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateCommune — validation', () => {
  it('returns an error when name is missing', async () => {
    const result = await updateCommune(COMMUNE_ID, prev, buildFormData({ name: '' }))
    expect(result).toEqual({ error: 'Name is required.' })
  })

  it('returns an error when name exceeds 100 characters', async () => {
    const result = await updateCommune(
      COMMUNE_ID,
      prev,
      buildFormData({ name: 'x'.repeat(101) }),
    )
    expect(result).toEqual({ error: 'Name must be 100 characters or fewer.' })
  })

  it('does not call supabase when validation fails', async () => {
    await updateCommune(COMMUNE_ID, prev, buildFormData({ name: '' }))
    expect(createClient).not.toHaveBeenCalled()
  })
})

describe('updateCommune — auth check', () => {
  it('returns an error when no user is authenticated', async () => {
    setupSupabase({ user: null })
    const result = await updateCommune(
      COMMUNE_ID,
      prev,
      buildFormData({ name: 'Valid Name' }),
    )
    expect(result).toEqual({ error: 'You must be signed in to edit a commune.' })
  })

  it('does not call update when unauthenticated', async () => {
    setupSupabase({ user: null })
    await updateCommune(COMMUNE_ID, prev, buildFormData({ name: 'Valid Name' }))
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})

describe('updateCommune — happy path', () => {
  it('calls .update() then .eq("id", communeId) then .eq("created_by", user.id)', async () => {
    setupSupabase()
    const fd = buildFormData({ name: 'Updated Name', city: 'London', category: 'Tech' })

    await expect(updateCommune(COMMUNE_ID, prev, fd)).rejects.toThrow('NEXT_REDIRECT')

    expect(mockFrom).toHaveBeenCalledWith('communes')
    expect(mockUpdate).toHaveBeenCalledWith({
      name: 'Updated Name',
      description: null,
      category: 'Tech',
      city: 'London',
    })
    expect(mockEqId).toHaveBeenCalledWith('id', COMMUNE_ID)
    expect(mockEqCreatedBy).toHaveBeenCalledWith('created_by', USER_ID)
  })

  it('returns a generic error when the database update fails', async () => {
    setupSupabase({ mutationError: { message: 'db error' } })
    const result = await updateCommune(
      COMMUNE_ID,
      prev,
      buildFormData({ name: 'Valid Name' }),
    )
    expect(result).toEqual({ error: 'Something went wrong. Please try again.' })
  })
})

// ---------------------------------------------------------------------------
// deleteCommune tests
// ---------------------------------------------------------------------------

describe('deleteCommune — auth check', () => {
  it('returns early without calling delete when unauthenticated', async () => {
    setupSupabase({ user: null })
    await deleteCommune(COMMUNE_ID)
    expect(mockDelete).not.toHaveBeenCalled()
  })
})

describe('deleteCommune — happy path', () => {
  it('calls .delete().eq("id", communeId).eq("created_by", user.id) when authenticated', async () => {
    setupSupabase()

    await expect(deleteCommune(COMMUNE_ID)).rejects.toThrow('NEXT_REDIRECT')

    expect(mockFrom).toHaveBeenCalledWith('communes')
    expect(mockDelete).toHaveBeenCalled()
    expect(mockEqId).toHaveBeenCalledWith('id', COMMUNE_ID)
    expect(mockEqCreatedBy).toHaveBeenCalledWith('created_by', USER_ID)
  })

  it('throws when the database delete fails', async () => {
    setupSupabase({ mutationError: { message: 'db error' } })
    await expect(deleteCommune(COMMUNE_ID)).rejects.toThrow('Failed to delete commune.')
  })
})
