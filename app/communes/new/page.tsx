import Link from 'next/link'
import AppHeader from '@/app/components/AppHeader'
import CreateCommuneForm from './CreateCommuneForm'

export const metadata = {
  title: 'Create a commune — Communes',
}

export default function NewCommunePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader>
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Communes
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create a commune
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Start a new community and invite people in your city to join.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CreateCommuneForm />
        </div>
      </main>
    </div>
  )
}
