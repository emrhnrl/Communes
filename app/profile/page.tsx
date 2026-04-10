import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppHeader from '@/app/components/AppHeader'
import AuthButton from '@/app/components/AuthButton'
import EditProfileForm from './EditProfileForm'

type CommuneRow = {
  id: string
  name: string
  category: string | null
  city: string | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

async function getJoinedCommunes(userId: string): Promise<CommuneRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('members')
    .select('communes!inner(id, name, category, city)')
    .eq('user_id', userId)
  if (!data) return []
  return data.map((row) => row.communes as unknown as CommuneRow)
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const [profileResult, communes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    getJoinedCommunes(user.id),
  ])

  const profile = profileResult.data
  const displayName = profile?.display_name ?? null
  const avatarUrl = profile?.avatar_url ?? null
  const nameForDisplay = displayName || user.email || 'User'
  const initials = getInitials(nameForDisplay)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader className="justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Communes
        </Link>
        <AuthButton />
      </AppHeader>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Profile header */}
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={nameForDisplay}
                  className="size-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {nameForDisplay}
              </h1>
              {displayName && (
                <p className="mt-0.5 truncate text-sm text-zinc-400 dark:text-zinc-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <hr className="my-6 border-zinc-100 dark:border-zinc-800" />

          {/* Edit profile */}
          <section>
            <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Edit profile
            </h2>
            <EditProfileForm
              initialDisplayName={displayName}
              initialAvatarUrl={avatarUrl}
            />
          </section>
        </div>

        {/* Joined communes */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Your communes
          </h2>

          {communes.length === 0 ? (
            <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
              You haven&apos;t joined any communes yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {communes.map((commune) => (
                <Link
                  key={commune.id}
                  href={`/communes/${commune.id}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {commune.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {commune.city && (
                      <span className="text-sm text-zinc-400 dark:text-zinc-500">
                        {commune.city}
                      </span>
                    )}
                    {commune.category && (
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                        {commune.category}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
