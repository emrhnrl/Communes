import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterBar from '@/app/components/FilterBar'

// ---------------------------------------------------------------------------
// Module-level mocks for next/navigation
// ---------------------------------------------------------------------------

const mockReplace = jest.fn()
const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

import { useRouter, useSearchParams } from 'next/navigation'

// ---------------------------------------------------------------------------
// Default props
// ---------------------------------------------------------------------------

const cities = ['Berlin', 'Paris', 'London']
const categories = ['Tech', 'Sports', 'Education']

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
  ;(useSearchParams as jest.Mock).mockReturnValue(mockSearchParams)
})

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('FilterBar — rendering', () => {
  it('renders the search input', () => {
    render(<FilterBar cities={cities} categories={categories} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('renders the city select with all city options and an "All cities" default', () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const citySelect = screen.getByDisplayValue('All cities')
    expect(citySelect).toBeInTheDocument()
    for (const city of cities) {
      expect(screen.getByRole('option', { name: city })).toBeInTheDocument()
    }
  })

  it('renders the category select with all category options and an "All categories" default', () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const categorySelect = screen.getByDisplayValue('All categories')
    expect(categorySelect).toBeInTheDocument()
    for (const cat of categories) {
      expect(screen.getByRole('option', { name: cat })).toBeInTheDocument()
    }
  })
})

// ---------------------------------------------------------------------------
// Search input — debounced behaviour
// ---------------------------------------------------------------------------

describe('FilterBar — search input', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('does not call router.replace immediately after typing', async () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const input = screen.getByRole('searchbox')
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, 'book')
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('calls router.replace with ?q=... after the 300 ms debounce', async () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const input = screen.getByRole('searchbox')

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, 'book')
    jest.advanceTimersByTime(300)

    expect(mockReplace).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('q=book'))
  })

  it('only fires once when the user types rapidly within the debounce window', async () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const input = screen.getByRole('searchbox')

    // Type the whole word as one event to keep things simple.
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, 'hello')
    jest.advanceTimersByTime(300)

    // router.replace is called once — the last value after debounce settles.
    expect(mockReplace).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// City select
// ---------------------------------------------------------------------------

describe('FilterBar — city select', () => {
  it('calls router.replace with ?city=... immediately when a city is selected', async () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const citySelect = screen.getByDisplayValue('All cities')

    await userEvent.selectOptions(citySelect, 'Berlin')

    expect(mockReplace).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('city=Berlin'))
  })

  it('calls router.replace without city param when "All cities" is selected', async () => {
    // Start with city pre-selected in search params.
    const paramsWithCity = new URLSearchParams('city=Berlin')
    ;(useSearchParams as jest.Mock).mockReturnValue(paramsWithCity)

    render(<FilterBar cities={cities} categories={categories} />)
    const citySelect = screen.getByDisplayValue('Berlin')

    await userEvent.selectOptions(citySelect, '')

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const calledUrl: string = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('city=')
  })
})

// ---------------------------------------------------------------------------
// Category select
// ---------------------------------------------------------------------------

describe('FilterBar — category select', () => {
  it('calls router.replace with ?category=... immediately when a category is selected', async () => {
    render(<FilterBar cities={cities} categories={categories} />)
    const categorySelect = screen.getByDisplayValue('All categories')

    await userEvent.selectOptions(categorySelect, 'Tech')

    expect(mockReplace).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('category=Tech'))
  })

  it('calls router.replace without category param when "All categories" is selected', async () => {
    const paramsWithCategory = new URLSearchParams('category=Tech')
    ;(useSearchParams as jest.Mock).mockReturnValue(paramsWithCategory)

    render(<FilterBar cities={cities} categories={categories} />)
    const categorySelect = screen.getByDisplayValue('Tech')

    await userEvent.selectOptions(categorySelect, '')

    expect(mockReplace).toHaveBeenCalledTimes(1)
    const calledUrl: string = mockReplace.mock.calls[0][0] as string
    expect(calledUrl).not.toContain('category=')
  })
})
