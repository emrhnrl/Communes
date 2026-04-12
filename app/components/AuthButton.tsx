import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default async function AuthButton() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Sign in
      </Link>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  const nameForDisplay = profile?.display_name || user.email || 'User'
  const initials = getInitials(nameForDisplay)
  const avatarUrl = profile?.avatar_url ?? null

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:block">
        {user.email}
      </span>
      <Link
        href="/profile"
        aria-label="Your profile"
        className="shrink-0 transition-opacity hover:opacity-80"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nameForDisplay}
            className="size-8 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white ring-2 ring-white dark:ring-zinc-900">
            {initials}
          </div>
        )}
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}