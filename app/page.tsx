import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import AppHeader from './components/AppHeader'
import AuthButton from './components/AuthButton'
import CommuneCard from './components/CommuneCard'
import FilterBar from './components/FilterBar'
import { CommuneQueryRow, CommuneWithMemberCount, parseCommuneWithMemberCount } from '@/lib/db'

async function getCommunes(): Promise<CommuneWithMemberCount[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('communes')
    .select('*, members(count)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch communes:', error.message)
    return []
  }

  return (data ?? []).map((row) => parseCommuneWithMemberCount(row as CommuneQueryRow))
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; category?: string }>
}) {
  const { q, city, category } = await searchParams
  const allCommunes = await getCommunes()

  const cities = [...new Set(allCommunes.map((c) => c.city).filter(Boolean))].sort() as string[]
  const categories = [...new Set(allCommunes.map((c) => c.category).filter(Boolean))].sort() as string[]

  const communes = allCommunes.filter((c) => {
    if (q) {
      const needle = q.toLowerCase()
      const inName = c.name.toLowerCase().includes(needle)
      const inDesc = c.description?.toLowerCase().includes(needle) ?? false
      if (!inName && !inDesc) return false
    }
    if (city && c.city !== city) return false
    if (category && c.category !== category) return false
    return true
  })

  const isFiltered = !!(q || city || category)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader className="justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Communes
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Your city. Your people.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/communes/new"
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            + Create commune
          </Link>
          <AuthButton />
        </div>
      </AppHeader>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Suspense>
          <FilterBar cities={cities} categories={categories} />
        </Suspense>

        {communes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {isFiltered ? 'No communes match your filters.' : 'No communes yet \u2014 be the first.'}
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              {isFiltered ? 'Try a different city or category.' : 'Start one and invite people in your city to join.'}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              {communes.length} {communes.length === 1 ? 'commune' : 'communes'}
              {isFiltered ? ' found' : ' in your area'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communes.map((commune) => (
                <CommuneCard key={commune.id} commune={commune} memberCount={commune.member_count} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
