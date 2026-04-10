import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

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

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:block">
        {user.email}
      </span>
      <Link
        href="/profile"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
      >
        Profile
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