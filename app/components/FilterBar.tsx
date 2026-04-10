'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

interface FilterBarProps {
  cities: string[]
  categories: string[]
}

export default function FilterBar({ cities, categories }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`/?${params.toString()}`)
  }

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => update('q', value), 300)
  }

  const inputClass =
    'rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500'

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <input
        type="search"
        placeholder="Search communes…"
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => handleSearch(e.target.value)}
        className={`${inputClass} w-full sm:w-64`}
      />
      <select
        value={searchParams.get('city') ?? ''}
        onChange={(e) => update('city', e.target.value)}
        className={`${inputClass} min-w-36`}
      >
        <option value="">All cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get('category') ?? ''}
        onChange={(e) => update('category', e.target.value)}
        className={`${inputClass} min-w-44`}
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  )
}
