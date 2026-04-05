import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import JoinButton from './JoinButton'

async function getCommune(id: string) {
  const { data, error } = await supabase
    .from('communes')
    .select('*, members(count)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const { members, ...commune } = data as typeof data & { members: [{ count: number }] }
  return { ...commune, memberCount: members[0]?.count ?? 0 }
}

export default async function CommuneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const commune = await getCommune(id)

  if (!commune) notFound()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Communes
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-3.5"
          >
            <path
              fillRule="evenodd"
              d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
              clipRule="evenodd"
            />
          </svg>
          All communes
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {commune.name}
            </h1>
            {commune.category && (
              <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                {commune.category}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
            {commune.city && (
              <span className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6Zm3.5 8.75c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25V14h-5v.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                {commune.city}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              {commune.memberCount} {commune.memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>

          {/* Divider */}
          <hr className="my-6 border-zinc-100 dark:border-zinc-800" />

          {/* Description */}
          {commune.description ? (
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {commune.description}
            </p>
          ) : (
            <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
              No description provided.
            </p>
          )}

          {/* Join */}
          <div className="mt-8">
            <JoinButton communeId={commune.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
