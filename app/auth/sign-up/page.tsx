import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'
import SignUpForm from './SignUpForm'

export const metadata = {
  title: 'Create account — Communes',
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo = '/' } = await searchParams

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader>
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Communes
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create your account
        </h1>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
          Join Communes and find your people in your city.
        </p>

        <SignUpForm redirectTo={redirectTo} />
      </main>
    </div>
  )
}
