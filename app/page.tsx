import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AppHeader from './components/AppHeader'
import AuthButton from './components/AuthButton'
import CommuneCard from './components/CommuneCard'
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

export default async function HomePage() {
  const communes = await getCommunes()

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

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {communes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              No communes yet â€” be the first.
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Start one and invite people in your city to join.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              {communes.length} {communes.length === 1 ? 'commune' : 'communes'} in your area
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