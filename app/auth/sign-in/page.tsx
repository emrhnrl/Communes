import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'
import SignInForm from './SignInForm'

export const metadata = {
  title: 'Sign in — Communes',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}) {
  const { redirectTo = '/', error } = await searchParams

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader>
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Communes
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Pick up where you left off.
        </p>

        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <SignInForm redirectTo={redirectTo} />
      </main>
    </div>
  )
}
